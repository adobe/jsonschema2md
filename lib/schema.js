/*************************************************************************
*
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2016 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by trade secret or copyright law.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

'use strict';
var validUrl = require("valid-url");
var util = require('util');
var path = require('path');
var _ = require('lodash');
var logger = require('winston');
var readdirp = require('readdirp');
var url = require("url");
var Promise=require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var Writer=require('./writeFiles');
var jsonSchemaRefParser = require("json-schema-ref-parser");
var deff='#/definitions/';
var absUrlRegex = new RegExp('^(?:[a-z]+:)?//', 'i');
var refParser = require('json-schema-ref-parser');

var Schema=function(ajv,schemaMap){
  this._ajv = ajv;
  this._schemaPathMap=schemaMap;
}

Schema.resolveRef=function(key,obj,currpath){
  if(key === "$ref"){
    var refVal = obj[key];
    if( absUrlRegex.test(refVal) ){
      let parsedUrl = refVal.split("#");
      let basepath = parsedUrl[0] ;
      if(basepath in this._schemaPathMap){
        let newpath = path.relative(path.dirname(currpath),this._schemaPathMap[basepath].filePath);
        obj["$ref"] = newpath;
        var temp = newpath.slice(0, -5).split("/");
        obj.$linkVal = temp[temp.length - 1];
        obj.$linkPath = temp.join("/")+".md";
        //TODO display with title or file path name title
      }

       else {
        obj.$linkPath = refVal;
        var temp = refVal.split("/")
        obj.$linkVal = temp.pop() || temp.pop();
      }

    }
    else if(refVal.startsWith(deff)) {
      obj.$linkVal = refVal.slice(deff.length);
      obj.$linkPath = "#"+obj.$linkVal.replace(/ /g,'-');
    }
    else if(refVal.endsWith("json")){
      var temp = refVal.slice(0, -5).split("/");
      obj.$linkVal = temp[temp.length - 1];
      obj.$linkPath = temp.join("/")+".md";
    }
  }
  if(key === "anyOf" || key === "oneOf" || key === "allOf")
  obj.$type=key;

  return;
}

var traverseSchema = function(object,schemaFilePath){
  return new Promise((resolve,reject) => {
    var recurse=function(curr,key,prev){
      if(key){
        if(key === "anyOf" || key === "oneOf" || key === "allOf")
        prev.$type=key;
      }
      var result;
      if(Array.isArray(curr))
      curr.map((item,index) => recurse(item,index,curr));
      else {
        (typeof curr === 'object') ? Object.keys(curr).map(key => recurse(curr[key],key,curr)):Schema.resolveRef(key,prev,schemaFilePath);
      }
      return object;
    }
    resolve(recurse(object));
  });

}

Schema.getExamples = function(filePath,schema){
  var exampleFileNames=[];
  var examples=[];
  var dirname=path.dirname(filePath);
  var filename=path.basename(filePath,path.extname(filePath));
  filename=filename.split(".")[0]+".example.*.json";
  return new Promise((resolve,reject) => {
    readdirp({ root: dirname, fileFilter: filename })
    .on('data',(entry)=>exampleFileNames.push(entry.fullPath))
    .on('end',() => resolve(exampleFileNames))
    .on('error',() => reject(err))
  }).then((exampleFileNames)=>{
    if(exampleFileNames.length > 0){
      var validate=this._ajv.compile(schema);
      return Promise.map(exampleFileNames,(entry)=>{
        return fs.readFileAsync(entry).then((example)=>{
          var data = JSON.parse(example.toString());
          var valid = validate(data);
          if(valid)
            examples.push(data);
          else
            logger.error(entry+" is an invalid Example");
        })
      }).then(() => {schema.examples=examples; return schema; } )
    }
    else
      return schema;
  })
}

Schema.getDescription = function(filePath,schema){

  var temp=path.basename(filePath,path.extname(filePath));
  //TODO should err be thrown here?
  temp=temp.split(".")[0]+".description.md";
  return fs.readFileAsync(path.resolve(path.dirname(filePath),temp),'utf8')
  .then((description) => {
    schema.description=description;
    return schema;
  })
  .catch((err) => {
    return schema;
  });

}

Schema.setAjv=function(ajv){
  this._ajv=ajv;
}

Schema.setSchemaPathMap=function(schemaMap){
  this._schemaPathMap=schemaMap;
}

Schema.load = function(schemaMap,schemaPath,outDir){

  let keys = Object.keys(schemaMap);
  return Promise.mapSeries(keys,(schemaKey) => {
    let schema = schemaMap[schemaKey].jsonSchema;
    return Schema.getExamples(schemaMap[schemaKey].filePath,schema)
    .then((egs_schema) => Schema.getDescription(schemaMap[schemaKey].filePath,egs_schema))
    .then((all_schema) => {
      var schemaClone = _.cloneDeep(all_schema);
      return Promise.props({
        wSchema:schemaClone,
        mSchema:traverseSchema(all_schema,schemaMap[schemaKey].filePath)
      })
    }).then((object)=>{
     return Promise.all([Writer.generateMarkdown(schemaMap[schemaKey].filePath,object.mSchema,schemaPath,outDir),
                  Writer.generateNewSchemaFiles(schemaMap[schemaKey].filePath,object.wSchema,schemaPath,outDir)]);
    })
  })
  .catch((err) => console.error(err));
}


module.exports = Schema;
