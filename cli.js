#! /usr/bin/env node
/*
 * Copyright 2019 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

const Optimist = require('optimist');
const Promise = require('bluebird');
const path = require('path');
const _ = require('lodash');
const fs = Promise.promisifyAll(require('fs'));
const readdirp = require('readdirp');
const Ajv = require('ajv');
const i18n = require('i18n');
const logger = require('@adobe/helix-log');

const { error, info } = logger;

const Schema = require('./lib/schema');
const readSchemaFile = require('./lib/readSchemaFile');

// parse/process command line arguments
const { argv } = Optimist
  .usage('Generate Markdown documentation from JSON Schema.\n\nUsage: $0')
  .demand('d')
  .alias('d', 'input')
  // TODO: is baseURL still a valid parameter?
  .describe('d', 'path to directory containing all JSON Schemas or a single JSON Schema file. This will be considered as the baseURL. By default only files ending in .schema.json will be processed, unless the schema-extension is set with the -e flag.')
  .alias('o', 'out')
  .describe('o', 'path to output directory')
  .default('o', path.resolve(path.join('.', 'out')))
  .alias('m', 'meta')
  .describe('m', 'add metadata elements to .md files Eg -m template=reference. Multiple values can be added by repeating the flag Eg: -m template=reference -m hide-nav=true')
  .alias('s', 'metaSchema')
  .describe('s', 'Custom meta schema path to validate schemas')
  .alias('x', 'schema-out')
  .describe('x', 'output JSON Schema files including description and validated examples in the _new folder at output directory, or suppress with -')
  .alias('e', 'schema-extension')
  .describe('e', 'JSON Schema file extension eg. schema.json or json')
  .alias('n', 'no-readme')
  .describe('v', 'JSON Schema Draft version to use. Supported: 04, 06, 07 (default)')
  .alias('v', 'draft')
  .default('v', '07')
  .describe('n', 'Do not generate a README.md file in the output directory')
  .describe('link-*', 'Add this file as a link the explain the * attribute, e.g. --link-abstract=abstract.md')
  .check((args) => {
    if (!fs.existsSync(args.input)) {
      throw new Error(`Input file "${args.input}" does not exist!`);
    }
    if (args.s && !fs.existsSync(args.s)) {
      throw new Error(`Meta schema file "${args.s}" does not exist!`);
    }
  })
  .alias('i', 'i18n')
  .describe('i', 'path to a locales folder with an en.json file in it. This file will be used for all text parts in all templates')
  .alias('h', 'header')
  .describe('h', 'if the value is false the header will be skipped')
  .default('h', true);

const docs = _.fromPairs(
  _.toPairs(argv)
    .filter(([key, _value]) => key.startsWith('link-'))
    .map(([key, value]) => [key.substr(5), value]),
);

const ajv = new Ajv({
  allErrors: true, messages: true, schemaId: 'auto', logger,
});
info(argv.v);
if (argv.v === '06' || argv.v === 6) {
  info('enabling draft-06 support');
  // eslint-disable-next-line global-require
  ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
} else if (argv.v === '04' || argv.v === 4) {
  // eslint-disable-next-line global-require
  ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'));
}
const schemaPathMap = {};
const metaElements = {};
const schemaPath = path.resolve(argv.d);
const outDir = path.resolve(argv.o);
// eslint-disable-next-line no-nested-ternary
const schemaDir = argv.x === '-' ? '' : (argv.x ? path.resolve(argv.x) : outDir);
const target = fs.statSync(schemaPath);
const readme = argv.n !== true;
const schemaExtension = argv.e || 'schema.json';
if (argv.s) {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  ajv.addMetaSchema(require(path.resolve(argv.s)));
}

if (argv.m) {
  if (_.isArray(argv.m)) {
    _.each(argv.m, (item) => {
      const [key, val] = item.split('=');
      if (val !== undefined) {
        metaElements[key] = val;
      }
    });
  } else {
    const [key, val] = (argv.m).split('=');
    if (val !== undefined) {
      metaElements[key] = val;
    }
  }
}
let i18nPath;
if (argv !== undefined && argv.i !== undefined) {
  i18nPath = path.resolve(argv.i);
} else {
  i18nPath = path.resolve(path.join(__dirname, 'lib/locales'));
}
i18n.configure({
  // setup some locales - other locales default to en silently
  locales: ['en'],
  // where to store json files - defaults to './locales' relative to modules directory
  directory: i18nPath,
  defaultLocale: 'en',
});

info('output directory', outDir);
if (target.isDirectory()) {
  // the ajv json validator will be passed into the main module to help with processing
  const files = [];
  readdirp(schemaPath, { root: schemaPath, fileFilter: `*.${schemaExtension}` })
    .on('data', (entry) => {
      files.push(entry.fullPath);
      try {
        // eslint-disable-next-line import/no-dynamic-require, global-require
        ajv.addSchema(require(entry.fullPath), entry.fullPath);
      } catch (e) {
        error('Ajv processing error for schema at path', entry.fullPath);
        error(e);
        process.exit(1);
      }
    })
    .on('end', () => {
      Schema.setAjv(ajv);
      Schema.setSchemaPathMap(schemaPathMap);
      return Promise.reduce(files, readSchemaFile, schemaPathMap)
        .then((schemaMap) => {
          info(`finished reading all *.${schemaExtension} files in ${schemaPath}, beginning processing….`);
          return Schema.process(
            schemaMap, schemaPath, outDir, schemaDir, metaElements,
            readme, docs, argv,
          );
        })
        .then(() => {
          info('Processing complete.');
        })
        .catch((err) => {
          error(err);
          process.exit(1);
        });
    })
    .on('error', (err) => {
      error(err);
      process.exit(1);
    });
} else {
  readSchemaFile(schemaPathMap, schemaPath)
    .then((schemaMap) => {
      // eslint-disable-next-line import/no-dynamic-require, global-require
      ajv.addSchema(require(schemaPath), schemaPath);
      Schema.setAjv(ajv);
      Schema.setSchemaPathMap(schemaPathMap);
      info(`finished reading ${schemaPath}, beginning processing...`);
      return Schema.process(schemaMap, schemaPath, outDir, schemaDir,
        metaElements, false, docs, argv);
    })
    .then(() => {
      info('Processing complete.');
    })
    .catch((err) => {
      error(err);
      process.exit(1);
    });
}
