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
var path = require('path');

var _ = require('lodash');
var async = require('async');
var ejs = require('ejs');
var logger = require('winston');
var mkdirp = require('mkdirp');
var readdirp = require('readdirp');
var validUrl = require("valid-url");

var consts = require('./constants');
var Schema = require('./schema');
var json_schema = require('./json-schema')

function writeFile(outputDir, fileName, data, cb) {
  async.series([
      function (next) {
        // make sure output dir exists
        fs.stat(outputDir, function (err, stat) {
          if (err) {
            mkdirp(outputDir, next);
          } else {
            next();
          }
        });
      },
      function (next) {
        // write output file
        fs.writeFile(path.join(outputDir, fileName), data, next);
      }
    ],
    cb
  );
}

/**
 *
 * @param {Schema} schema instance
 * @param {Function} cb callback called on completion
 * @param {String|Error} cb.error error (non-null if an error occurred)
 */
function generateHtml(schema, cb) {
  var ctx = {
    schema: schema,
    _: _
  };

  ejs.renderFile(path.join(__dirname,'../templates/html/schema.ejs'), ctx, { debug: false }, function (err, str) {
    if (err) {
      cb(err);
    } else {
      writeFile(path.join(outDir, 'html'), schema['title'].toLowerCase().replace(/\s/g,'_') + '.html', str, function(err){
          cb();
      });
    }
  });
}

/**
 *
 * @param {Schema} schema instance
 * @param {Function} cb callback called on completion
 * @param {String|Error} cb.error error (non-null if an error occurred)
 */
function generateMarkdown(filename, schema, cb) {
      schema.metaElements = metaElements;
      var ctx = {
        schema: schema,
        _: _,
        validUrl: validUrl,
      };
      //console.log(JSON.stringify(schema));
      ejs.renderFile(path.join(__dirname,'../templates/md/class.ejs'), ctx, { debug: false }, function (err, str) {
        if (err) {
          cb(err);
        } else {
          writeFile( path.join(outDir, path.dirname(filename)),path.basename(filename).slice(0, -5)+ '.md', str, function(err){
          cb(err);
      });
    }
  });
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
    .describe('m', 'add metadata elements to .md files Eg -m template=refrence. Multiple values can be added by repeating the flag Eg: -m template=refrence -m hide-nav=true')
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
  _.each(argv.m,function(item){
    var meta=item.split("=");
    if(meta.length == 2)
      metaElements[meta[0]]=meta[1];
  });
}
var baseURL = path.resolve(fileDir);
logger.info('output directory: %s', outDir);
logger.info('processing %s...', schemaPath);

var generate = function (filename, schema,cb) {
  function toHtml(next) {
    // generate Html
    generateHtml(schema, next);
  }

  function toMarkdown(next) {
    // generate Markdown
    generateMarkdown(schema, next);
  }

  //removed generateHtml for Now
  async.series([async.apply(generateMarkdown,filename, schema)],cb);
};


var files=[];
var GenerateForAllFiles = function (dirname,onError) {
	readdirp({ root: dirname, fileFilter: '*.json' },
    function(fileInfo) {
        files.push(  fileInfo.path  );
    },
    function (err, res) {
        if(err){
         //   throw err;
        }
		async.forEach(files,function(filename,next) {
    async.waterfall([ async.apply(Schema.load,path.join( dirname, filename),baseURL),async.apply(generate,filename)],next);
   },onError);
}
);
}


if(argv.f){
  async.waterfall([ async.apply(Schema.load, schemaPath,baseURL),async.apply(generate,path.basename(schemaPath))],function (err) {
    if(err)
      logger.error(err);
    else
      logger.info("Done!!!")
    process.exit(err ? 1 : 0);
   });
}
else {
  GenerateForAllFiles(schemaPath,function(err){
    if(err)
      logger.error(err);
    else
      logger.info("Done!!!")
    process.exit(err ? 1 : 0);
   });

}
