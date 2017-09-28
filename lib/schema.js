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

var util = require('util');
var path = require('path');
var _ = require('lodash');
var logger = require('winston');
var readdirp = require('readdirp');
var consts = require('./constants');
var Promise=require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

var jsonSchemaRefParser = require("json-schema-ref-parser");
var deff='#/definitions/';
var resolveRef=function(key,obj){

  if(key === "$ref"){
    var refVal=obj[key];
    if(refVal.startsWith(deff)) {
      obj.type=refVal.slice(deff.length);
      obj.$linkPath="#"+obj.type.replace(/ /g,'-');
    }
    else {
      var temp=refVal.slice(0, -5).split("/");
      obj.type=temp[temp.length - 1];
      obj.$linkPath=temp.join("/")+".md";
    }
  }
  if(key === "anyOf" || key === "oneOf" || key === "allOf")
  obj.type=key;

  return;


}
var traverseSchema = function(object){
  return new Promise((resolve,reject) => {
    var recurse=function(curr,key,prev){
      if(key){
        if(key === "anyOf" || key === "oneOf" || key === "allOf")
        prev.type=key;
      }
      var result;
      if(Array.isArray(curr))
      curr.map((item,index) => recurse(item,index,curr));
      else {
        (typeof curr === 'object') ? Object.keys(curr).map(key => recurse(curr[key],key,curr)):resolveRef(key,prev);
      }
      return object;
    }
    resolve(recurse(object));
  });

}


var getExamples=function(filePath,schema){
  //var examples=[];
  var dirname=path.dirname(filePath);
  var filename=path.basename(filePath,path.extname(filePath));
  filename=filename.split(".")[0]+".example.*.json";
  readdirp({ root: dirname, fileFilter: filename })
  .on('data',function(entry){
    fs.readFileAsync(entry.fullPath)
    .then((example)=>{
      //Ajv validate
    })
    .then((examples) => console.log(examples.length))
    .catch((err)=>console.error(err));
  })
  .on('end',()=>{
    return examples;
  })

}


var validate=function(example,schema,callback){
  /*var validates = ajv.compile(schema);
  var valid =  validates(example);
  if (!valid) console.log(validates.errors);
  callback();*/
  return true;
}

var writeFile=function(){

}

function getDescription(filePath,schema){

  schema=JSON.parse(schema);
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

var Schema={}
Schema.load = function(schemaFilePath, baseURL){

  return fs.readFileAsync(schemaFilePath)
  .then((data) => getDescription(schemaFilePath,data))
  .then((schema)=>{
    return traverseSchema(schema);
  })
  .catch((err) => console.error(err));

}


module.exports = Schema;
