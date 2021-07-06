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
const logger = require('@adobe/helix-log');
const {
  iter, pipe, filter, map, obj,
} = require('ferrum');
const npath = require('path');
const { i18nConfig } = require('es2015-i18n-tag');
const traverse = require('./traverseSchema');
const build = require('./markdownBuilder');
const { writereadme, writemarkdown } = require('./writeMarkdown');
const readme = require('./readmeBuilder');
const { loader } = require('./schemaProxy');
const { writeSchema } = require('./writeSchema');

const { info, error, debug } = logger;

function jsonschema2md(schema, {
  schemaPath,
  out,
  meta,
  schemaOut,
  includeReadme,
  links,
  i18n,
  language,
  exampleFormat,
  includeProperties,
  header,
  skipProperties,
}) {
  const outOrDefault = out || nodepath.resolve(nodepath.join('.', 'out'));
  const locales = i18n || nodepath.resolve(__dirname, 'locales');
  // eslint-disable-next-line import/no-dynamic-require, global-require
  i18nConfig(require(nodepath.resolve(locales, `${language || 'en_US'}.json`)));

  const schemas = [].concat(schema);
  if (schemaOut) {
    console.log('writing schemas');
    writeSchema({
      schemadir: schemaOut,
      origindir: schemaPath,
    })(schemas);
  }

  if (includeReadme) {
    console.log('writing README');
    pipe(
      schemas,
      // build readme
      readme({
        readme: includeReadme,
      }),

      writereadme({
        readme: includeReadme,
        out: outOrDefault,
        info,
        error,
        debug,
        meta,
      }),
    );
  }

  console.log('writing documentation');
  const markdown = pipe(
    schemas,
    // generate Markdown ASTs
    build({
      header,
      links,
      includeProperties,
      exampleFormat,
      skipProperties,
      rewritelinks: (origin) => {
        const mddir = outOrDefault;
        const srcdir = schemaPath;
        const schemadir = schemaOut || schemaPath;

        const target = npath.relative(
          mddir,
          npath.resolve(schemadir, npath.relative(srcdir, origin)),
        ).split(npath.sep).join(npath.posix.sep);
        return target;
      },
    }),

    // write to files
    writemarkdown({
      out: outOrDefault,
      info,
      error,
      debug,
      meta,
    }),
  );

  return markdown;
}

async function main(args) {
  // parse/process command line arguments
  const { argv } = yargs(args)
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
    .coerce('o', (o) => nodepath.resolve(o))

    .option('m', {
      type: 'array',
    })
    .alias('m', 'meta')
    .describe('m', 'add metadata elements to .md files Eg -m template=reference. Multiple values can be added by repeating the flag Eg: -m template=reference -m hide-nav=true')
    .coerce('m', (m) => m && pipe(
      // turn this into an object of key value pairs
      iter(m),
      map((i) => i.split('=')),
      obj,
    ))

    .alias('x', 'schema-out')
    .describe('x', 'output JSON Schema files including description and validated examples in the specified folder, or suppress with -')
    .default('x', nodepath.resolve(nodepath.join('.', 'out')))
    .coerce('x', (x) => (x === '-' ? '-' : nodepath.resolve(x)))

    .alias('e', 'schema-extension')
    .describe('e', 'JSON Schema file extension eg. schema.json or json')
    .default('e', 'schema.json')

    .alias('n', 'no-readme')
    .describe('n', 'Do not generate a README.md file in the output directory')

    .describe('link-*', 'Add this file as a link the explain the * attribute, e.g. --link-abstract=abstract.md')

    .alias('i', 'i18n')
    .describe('i', 'path to a locales folder with JSON files')
    .default('i', nodepath.resolve(__dirname, 'locales'))
    .coerce('i', (i) => nodepath.resolve(i))

    .alias('l', 'language')
    .describe('l', 'the selected language')
    .choices('l', ['en_US', 'de'])
    .default('l', 'en_US')

    .alias('f', 'example-format')
    .describe('f', 'how to format examples')
    .choices('f', ['json', 'yaml'])
    .default('f', 'json')

    .alias('p', 'properties')
    .array('p')
    .describe('p', 'name of a custom property which should be also in the description of an element (may be used multiple times)')
    .default('p', [])
    .alias('h', 'header')
    .boolean('h')
    .describe('h', 'if the value is false the header will be skipped')
    .default('h', true)

    .alias('s', 'skip')
    .array('s')
    .describe('s', 'name of a default property to skip in markdown (may be used multiple times), e.g. -s typefact -s proptable')
    .default('s', []);

  const links = pipe(
    iter(argv),
    filter(([key, _value]) => key.startsWith('link-')),
    map(([key, value]) => [key.substr(5), value]),
    obj,
  );

  const schemaPath = argv.d;
  const out = argv.o;
  const meta = argv.m;
  const schemaOut = argv.x !== '-' ? argv.x : null;
  const includeReadme = !argv.n;
  const i18n = argv.i;
  const language = argv.l;
  const exampleFormat = argv.f;
  const includeProperties = argv.p;
  const header = argv.h;
  const skipProperties = argv.s;

  const schemaExtension = argv.e;

  const schemaloader = loader();

  // list all schema files in the specified directory
  const schemafiles = await readdirp.promise(schemaPath, { root: schemaPath, fileFilter: `*.${schemaExtension}` });

  console.log(`loading ${schemafiles.length} schemas`);

  // then collect data about the schemas and turn everything into a big object
  const loadedschemas = pipe(
    schemafiles,
    map((schema) => schema.fullPath),
    // eslint-disable-next-line import/no-dynamic-require, global-require
    map((path) => schemaloader(require(path), path)),
    // find contained schemas
    traverse,
  );

  jsonschema2md(loadedschemas, {
    schemaPath,
    out,
    meta,
    schemaOut,
    includeReadme,
    links,
    i18n,
    language,
    exampleFormat,
    includeProperties,
    header,
    skipProperties,
  });

  return 1;
}

module.exports = { jsonschema2md, main };
