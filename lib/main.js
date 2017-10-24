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
var ejs = require('ejs');
var logger = require('winston');
var mkdirp = Promise.promisify(require('mkdirp'));
var readdirp = require('readdirp');
var validUrl = require("valid-url");
var Schema = require('./schema');
var Ajv = require('ajv');
var ajv = new Ajv({ allErrors: true , messages:true});
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'));

function writeFile(outputDir, fileName, data) {
  if(!fs.existsSync(outputDir)){
    return mkdirp(outputDir).then((err)=>{
      return fs.writeFileAsync(path.join(outputDir, fileName), data);
    })
  }
  else {
    return fs.writeFileAsync(path.join(outputDir, fileName), data);
  }

}

function generateMarkdown(filename, schema) {
  schema.metaElements = metaElements;
  var ctx = {
    schema: schema,
    _: _,
    validUrl: validUrl,
  };

  ejs.renderFile(path.join(__dirname,'../templates/md/topSchema.ejs'), ctx , { debug: false },function(err,str){
    if(err)
    console.error(err);
    return writeFile(path.join(path.join(outDir), path.dirname(filename.substr(schemaPath.length))), path.basename(filename).slice(0, -5)+ '.md', str);
  })

}

function generateNewSchemaFiles(filename, schema) {
    return writeFile(path.join(path.join(outDir,"_newSchema"), path.dirname(filename.substr(schemaPath.length))), path.basename(filename), JSON.stringify(schema, null, 4));

}

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
.describe('m','add metadata elements to .md files Eg -m template=reference. Multiple values can be added by repeating the flag Eg: -m template=reference -m hide-nav=true')
.alias('s','metaSchema')
.describe('s', 'Custom meta schema path to validate schemas')
.alias('x', 'schema-out')
.describe('x', 'pass to output JSON Schema files including description and validated examples in the _new folder at output directory')
.argv;

if (!argv.d) {
  process.exit(1);
}

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
    var meta=(argv.m).split("=");
    if(meta.length == 2)
      metaElements[meta[0]]=meta[1];
  }

}
if(argv.s){
  ajv.addMetaSchema(require(path.resolve(argv.s)));
}

var baseURL = path.resolve(fileDir);
logger.info('output directory: %s', outDir);
logger.info('processing %s...', schemaPath);

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
    return Promise.map(schemaFiles,function(file){
      return Schema.load( file , baseURL)
      .then((processedSchemas) => {
        if(argv.s)
          return Promise.all([generateMarkdown(file,processedSchemas.mSchema),
            generateNewSchemaFiles(file,processedSchemas.wSchema)
          ]);
        else
          return generateMarkdown(file,processedSchemas.mSchema);
      })
    })
  })
}


if(argv.f){
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
