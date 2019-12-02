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
const path = require('path');

const fs = require('fs');
const readdirp = require('readdirp');
const Ajv = require('ajv');
const logger = require('@adobe/helix-log');
const {
  iter, pipe, filter, map, obj, flat, list, flattenTree,
} = require('ferrum');
const traverse = require('./lib/traverseSchema');

const { error, info } = logger;

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
    const resolved = path.resolve(d);
    if (fs.existsSync(resolved) && fs.lstatSync(d).isDirectory()) {
      return resolved;
    }
    throw new Error(`Input file "${d}" is not a directory!`);
  })

  .alias('o', 'out')
  .describe('o', 'path to output directory')
  .default('o', path.resolve(path.join('.', 'out')))
  .coerce('o', o => path.resolve(o))

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
    ajv.addMetaSchema(require(path.resolve(s)));
  })

  .alias('x', 'schema-out')
  .describe('x', 'output JSON Schema files including description and validated examples in the specified folder, or suppress with -')
  .default('x', path.resolve(path.join('.', 'out')))
  .coerce('x', x => (x === '-' ? '' : path.resolve(x)))

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
  .default('i', path.resolve(__dirname, 'lib', 'locales'))
  .coerce('i', i => path.resolve(i))

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
const metaElements = argv.m;
const schemaPath = argv.d;
const outDir = argv.o;
const schemaDir = argv.x;
const target = fs.statSync(schemaPath);
const readme = !!argv.n;
const schemaExtension = argv.e;

readdirp.promise(schemaPath, { root: schemaPath, fileFilter: `*.${schemaExtension}` })
  .then((schemas) => {
    const rootschemas = pipe(
      schemas,
      map(schema => schema.fullPath),
      map(schemaPath => ({
        path: schemaPath,
        schema: require(schemaPath),
        direct: true,
      })),
      map((schema) => {
        try {
          ajv.addSchema(schema.schema, schema.path);
          return schema;
        } catch (e) {
          error('Ajv processing error for schema at path', schema.path);
          error(e);
          process.exit(1);
        }
      }),
      // read the ID
      map(schema => ({
        ...schema,
        id: schema.schema.$id,
      })),
      map((schema) => {
        const flat = flattenTree(schema, traverse);
        console.log(list(flat, Array));
        return schema.path;
      }),
    );

    return rootschemas;
  }).then((schemas) => {
    info('Schemas have been validated');
    console.log(list(schemas, Array));
  });

/*
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
*/
