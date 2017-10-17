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
var Promise=require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');
var _ = require('lodash');
var async = require('async');
var logger = require('winston');
var readdirp = require('readdirp');
var Schema = require('./schema');
var Ajv = require('ajv');
var ajv = new Ajv({ allErrors: true , messages:true});
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'));


// parse/process command line arguments

var argv = require('optimist')
.usage('Generate Markdown documentation from JSON Schema.\n\nUsage: $0')
.demand('d')
.alias('d', 'input')
.describe('d', 'path to directory containing all JSON Schemas or a single JSON Schema file. This will be considered as the baseURL')
.alias('f','isFile')
.describe('f','pass if input is a file path')
.alias('o', 'out')
.describe('o', 'path to output directory (default: ./out)')
.alias('m', 'meta')
.describe('m', 'add metadata elements to .md files Eg -m template=reference. Multiple values can be added by repeating the flag Eg: -m template=reference -m hide-nav=true')
.alias('s', 'schema-out')
.describe('s', 'pass to output JSON Schema files including description and validated examples in the _new folder at output directory')
.argv;

if (!argv.d) {
  process.exit(1);
}
var schemaPathMap={};
var schemaPath = path.resolve(argv.d);
var fileDir=schemaPath;
var baseName = path.basename(schemaPath).replace(/\.[^/.]+$/, '');
var outDir = path.resolve(argv.o || './out');
var metaElements={};
if(argv.f){
  fileDir=path.dirname(schemaPath);
}
if (argv.m) {
  if(_.isArray(argv.m)){
    _.each(argv.m,function(item){
      var meta=item.split("=");
      if(meta.length == 2)
        metaElements[meta[0]]=meta[1];
    });
  }
  else {
    var meta=argv.m.split("=");
    if(meta.length == 2)
      metaElements[meta[0]]=meta[1];
  }

}

var baseURL = path.resolve(fileDir);
logger.info('output directory: %s', outDir);
logger.info('processing %s...', schemaPath);

var readSchemaFiles=function(fullpath){
  return fs.readFileAsync(fullpath).then((data)=>{
    let schema = JSON.parse(data);
    let obj = {};
    obj.filePath = fullpath;
    obj.jsonSchema = schema;
    if(schema["$id"] && schema["$id"].length > 0){
      if(! schemaPathMap[schema["$id"]])
        schemaPathMap[schema["$id"]] = obj;
      // TODO err
      //TODO check Missing Specific properties to throw warning // function for warning
    }
    else {
      schemaPathMap[fullpath] = obj;
    }
  })
}

//Function to generate Markdown for all files in a folder
var GenerateForAllFiles = function (dirname) {
  var files=[];
  return new Promise((resolve,reject) => {
    readdirp({ root: dirname, fileFilter: '*.schema.json' })
    .on('data',(entry) => {
      files.push(  entry.fullPath  );
      ajv.addSchema(require(entry.fullPath),entry.fullPath);
    })
    .on('end',()=>resolve(files))
    .on('error',(err)=>{
      reject(err);
    })
  }).then((schemaFiles) => {
    Schema.setAjv(ajv);
    Schema.setSchemaPathMap(schemaPathMap);
    return Promise.map(schemaFiles,readSchemaFiles)
    .then(() => {
      logger.info("Read Schema files!!!")
      return Schema.load(schemaPathMap,schemaPath,outDir)
      // .then(()=>{
      //   console.log(data);
      // })
    })

  })
}


if(argv.f){
  //generating markdown for a single file
  Schema.load( schemaPath , baseURL)
  .then((processedSchemas) => {
    if(argv.s)
      return Promise.all([generateMarkdown(schemaPath,processedSchemas.mSchema),
        generateNewSchemaFiles(schemaPath,processedSchemas.wSchema)]);
    else
      return generateMarkdown(schemaPath,processedSchemas.mSchema);
  })
  .then(() => logger.info("Done!!!"))
  .catch((err) => {logger.error(err)})
}
else {
  GenerateForAllFiles(schemaPath)
  .then(()=>{logger.info("Done!!!")})
  .catch((err) => {logger.error(err)})
}
