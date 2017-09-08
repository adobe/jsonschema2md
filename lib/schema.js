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

var fs = require('fs');
var util = require('util');
var path = require('path');

var _ = require('lodash');
var async = require('async');
var rdf = require('node-rdf');
var jsonld = require('jsonld');
var logger = require('winston');

var consts = require('./constants');
var jsonSchemaRefParser = require("json-schema-ref-parser");



var resolveRef = function(baseURL,valueObj,fetchFile,callback){

  if(valueObj.hasOwnProperty("$ref")){
    var refVal=valueObj["$ref"];
    if (!(typeof refVal === 'string' || refVal instanceof String))
      callback(null,false);
    else{
      //check if it is external refrence
      if( path.isAbsolute(refVal)  || !(refVal.endsWith('.json') || refVal.startsWith('#') ) )
          return callback(null,false);
      else{
        if(refVal.startsWith('#/definitions')){
            var type=refVal.split("/")[2];
            valueObj.type=type;
            valueObj.$linkPath="#"+refVal.split("/")[2];
            callback(null,true);
        }
        else {
          var type=(refVal.slice(0, -5)).replace("/",".");
          valueObj.type=type;
          valueObj.$linkPath="../"+refVal.slice(0, -5)+".md"; //specific use case for models
          if(fetchFile){
            fs.readFile(path.resolve(baseURL,refVal), function(err,data){
              if(err)
                callback(err,false);
              else {
                var subschema=JSON.parse(data);
                //For now only catering description property as required.
                //TODO for other properties if Required
                if(!valueObj.description && subschema.description)
                  valueObj.description = subschema.description;
                if(!valueObj.title && subschema.title)
                  valueObj.title=subschema.title;
                callback(null,true);
              }
              });
          }
          else
            callback(null,true);
        }
      }
    }
}
else
  callback(false,null,valueObj);
}

var processSchema=function(baseURL,obj,fetchFile,callback){
  async.eachOf(obj,function(item,key,next){
    if(key === "anyOf" || key === "oneOf" || key === "allOf")
        obj.type=key;
    resolveRef(baseURL,item,fetchFile,function(err,flag){
      if(err)
        next(err);
      else if(flag)
        next();
      else if(_.isObject(item) && !_.isFunction(item)){
                  processSchema(baseURL,item,(key === "properties"),function(err){
                      next(err);
                  });
                }
              else
                next();

    });

  },function(err,obj1){
    callback(err,obj);
  });
}

var Schema={}
Schema.load = function(schemaFile, baseURL, cb){

  function readFile(callback1) {
    fs.readFile(schemaFile, callback1);
    }
  function resolveReferences(schemaFile,callback){
    jsonSchemaRefParser.dereference(JSON.parse(schemaFile),{ resolve: {external:false} , dereference: { circular: "ignore"   }},function(rerr, rschema){
      if(rerr)
        callback(rerr,null);
      else{
        processSchema(baseURL,JSON.parse(schemaFile),false, function(err, schema) {
            callback(err,schema);
        });
      }
    });

  }
  async.waterfall([ readFile, resolveReferences], cb);
}


module.exports = Schema;
