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

var consts = require('./constants');
var Schema = require('./schema');

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
    model: schema.getModel(),
    consts: consts,
    prefixes: schema.getPrefixMap(),
    _: _
  };

  ejs.renderFile('./templates/html/schema.ejs', ctx, { debug: false }, function (err, str) {
    if (err) {
      cb(err);
    } else {
      writeFile(path.join(outDir, 'html'), baseName + '.html', str, cb);
    }
  });
}

/**
 *
 * @param {Schema} schema instance
 * @param {Function} cb callback called on completion
 * @param {String|Error} cb.error error (non-null if an error occurred)
 */
function generateMarkdown(schema, cb) {
  // render each class in separate .md file
  async.each(schema.getModel().classes,
    function (cls, done) {
      var ctx = {
        clazz: cls,
        model: schema.getModel(),
        consts: consts,
        prefixes: schema.getPrefixMap(),
        _: _
      };
      ejs.renderFile('./templates/md/class.ejs', ctx, { debug: false }, function (err, str) {
        if (err) {
          done(err);
        } else {
          writeFile(path.join(outDir, 'md'), cls[consts.RDFS_LABEL].toLowerCase() + '.md', str, done);
        }
      });
    },
    function (err) {
      cb(err);
    }
  );
}

// parse/process command line arguments

var argv = require('optimist')
    .usage('Generate Html Documentation and JSON-LD from an RDF/S Schema file in Turtle Syntax.\n\nUsage: $0')
    .demand('f')
    .alias('f', 'file')
    .describe('f', 'path to <schema>.ttl file')
    .alias('o', 'out')
    .describe('o', 'path to output directory (default: ./out)')
    .argv;

if (!argv.f) {
  process.exit(1);
}

var schemaFile = path.resolve(argv.f);
var baseName = path.basename(schemaFile).replace(/\.[^/.]+$/, '');
var outDir = path.resolve(argv.o || './out');

logger.info('output directory: %s', outDir);
logger.info('processing %s...', schemaFile);

Schema.load(schemaFile, function (err, schema) {
  if (err) {
    logger.error(err);
    process.exit(1);
  }

  logger.info('parsed definitions of %d classes, %d properties and %d data types', _.keys(schema.getModel().classes).length, _.keys(schema.getModel().properties).length, _.keys(schema.getModel().datatypes).length);

  function toHtml(next) {
    // generate Html
    generateHtml(schema, next);
  }

  function toMarkdown(next) {
    // generate Markdown
    generateMarkdown(schema, next);
  }

  function toJsonLd(next) {
    // serialize RDF to JSON-LD
    schema.toJsonLD(function (err, doc) {
      writeFile(path.join(outDir, 'json'), baseName + '.json', JSON.stringify(doc, null, 2), next);
    });
  }

  async.series([ toHtml, toMarkdown, toJsonLd ], function (err) {
      if (err) {
        logger.error(err);
      } else {
        logger.info('done!');
      }
      process.exit(err ? 1 : 0);
    }
  );
});
