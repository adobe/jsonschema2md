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

const yargs = require('yargs');
const nodepath = require('path');

const fs = require('fs');
const readdirp = require('readdirp');
const Ajv = require('ajv');
const logger = require('@adobe/helix-log');
const {
  iter, pipe, filter, map, obj, flat, list,
} = require('ferrum');
const traverse = require('./lib/traverseSchema');
const extract = require('./lib/extractID');
const generate = require('./lib/generateName');
const filterRefs = require('./lib/filterRefs');
const validate = require('./lib/validateSchemas');
const build = require('./lib/markdownBuilder');
const write = require('./lib/writeMarkdown');
const readme = require('./lib/readmeBuilder');
const formatInfo = require('./lib/formatInfo');

const { info, error, debug } = logger;

// const Schema = require('./lib/schema');
// const readSchemaFile = require('./lib/readSchemaFile');

// init JSON Schema validator
const ajv = new Ajv({
  allErrors: true, messages: true, schemaId: 'auto', logger,
});

// parse/process command line arguments
const { argv } = yargs
  .usage('Generate Markdown documentation from JSON Schema.\n\nUsage: $0')

  .demand('d')
  .alias('d', 'input')
  .describe('d', 'path to directory containing all JSON Schemas or a single JSON Schema file. This will be considered as the baseURL. By default only files ending in .schema.json will be processed, unless the schema-extension is set with the -e flag.')
  .coerce('d', (d) => {
    const resolved = nodepath.resolve(d);
    if (fs.existsSync(resolved) && fs.lstatSync(d).isDirectory()) {
      return resolved;
    }
    throw new Error(`Input file "${d}" is not a directory!`);
  })

  .alias('o', 'out')
  .describe('o', 'path to output directory')
  .default('o', nodepath.resolve(nodepath.join('.', 'out')))
  .coerce('o', o => nodepath.resolve(o))

  .option('m', {
    type: 'array',
  })
  .alias('m', 'meta')
  .describe('m', 'add metadata elements to .md files Eg -m template=reference. Multiple values can be added by repeating the flag Eg: -m template=reference -m hide-nav=true')
  .coerce('m', m => pipe(
    // turn this into an object of key value pairs
    iter(m),
    map(i => i.split('=')),
    obj,
  ))

  .alias('s', 'metaSchema')
  .describe('s', 'Custom meta schema path to validate schemas')
  .coerce('s', (s) => {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    ajv.addMetaSchema(require(nodepath.resolve(s)));
  })

  .alias('x', 'schema-out')
  .describe('x', 'output JSON Schema files including description and validated examples in the specified folder, or suppress with -')
  .default('x', nodepath.resolve(nodepath.join('.', 'out')))
  .coerce('x', x => (x === '-' ? '' : nodepath.resolve(x)))

  .alias('e', 'schema-extension')
  .describe('e', 'JSON Schema file extension eg. schema.json or json')
  .default('e', 'schema.json')

  .alias('n', 'no-readme')
  .describe('n', 'Do not generate a README.md file in the output directory')
  .default('n', false)

  .describe('v', 'JSON Schema Draft version to use. Supported: 04, 06, 07 (default)')
  .alias('v', 'draft')
  .default('v', '07')
  .coerce('v', (v) => {
    if (v === '06' || v === 6) {
      info('enabling draft-06 support');
      // eslint-disable-next-line global-require
      ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
    } else if (v === '04' || v === 4) {
      // eslint-disable-next-line global-require
      ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'));
    }
  })

  .describe('link-*', 'Add this file as a link the explain the * attribute, e.g. --link-abstract=abstract.md')

  .alias('i', 'i18n')
  .describe('i', 'path to a locales folder with an en.json file in it. This file will be used for all text parts in all templates')
  .default('i', nodepath.resolve(__dirname, 'lib', 'locales'))
  .coerce('i', i => nodepath.resolve(i))

  .alias('p', 'properties')
  .describe('p', 'A comma separated list with custom properties which should be also in the description of an element.')
  .alias('h', 'header')
  .describe('h', 'if the value is false the header will be skipped')
  .default('h', true);

const docs = pipe(
  iter(argv),
  filter(([key, _value]) => key.startsWith('link-')),
  map(([key, value]) => [key.substr(5), value]),
  obj,
);

const schemaPathMap = {};
const schemaPath = argv.d;
const schemaDir = argv.x;
const target = fs.statSync(schemaPath);
const schemaExtension = argv.e;

// list all schema files in the specified directory
readdirp.promise(schemaPath, { root: schemaPath, fileFilter: `*.${schemaExtension}` })
  // then collect data about the schemas and turn everything into a big object
  .then(schemas => pipe(
    schemas,
    map(schema => schema.fullPath),
    map(path => ({
      path,
      // eslint-disable-next-line global-require, import/no-dynamic-require
      schema: require(path),
      direct: true,
    })),
    validate(ajv, logger),
    // read the ID
    map(extract),
    // find contained schemas
    map(traverse),
    flat,

    // remove pure ref schemas
    filterRefs,

    (x) => {
      const y = list(x);
      console.log(JSON.stringify(y, undefined, ' '));
      return y;
    },

    // format titles and descriptions
    formatInfo({ extension: schemaExtension }),

    // make a nice object
    generate,

    // generate Markdown ASTs
    build({
      header: argv.h,
      links: docs,
    }),

    // build readme
    readme({
      readme: !argv.n,
    }),

    // write to files

    write({
      out: argv.o,
      info,
      error,
      debug,
      meta: argv.m,
    }),
  ))

  .then((schemas) => {
    // console.log('allschemas', schemas);
  });
