/**
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* @ts-check */
const yargs = require('yargs');
const path = require('path');
const fs = require('fs');
const readdirp = require('readdirp');
const logger = require('@adobe/helix-log');
const {
  iter, pipe, filter, map, obj,
} = require('ferrum');
const { i18nConfig } = require('es2015-i18n-tag');
const traverse = require('./traverseSchema');
const build = require('./markdownBuilder');
const { writeReadme, writeMarkdown } = require('./writeMarkdown');
const readme = require('./readmeBuilder');
const { loader } = require('./schemaProxy');
const { writeSchema } = require('./writeSchema');

const { info, error, debug } = logger;

/**
 * @typedef {import("../types/api").JsonSchema} JsonSchema
 */
/**
 * @typedef {import("../types/api").SchemaList} SchemaList
 */
/**
 * @typedef {import("../types/api").SchemaContent} SchemaContent
 */
/**
 * @typedef {import("../types/api").SchemaFiles} SchemaFiles
 */
/**
 * @typedef {import("../types/api").GeneratedOutput} GeneratedOutput
 */

/**
 * Public API for jsonschema2md that can be used to turn JSON Schema files
 * into readable Markdown documentation.
 * @param {JsonSchema | SchemaFiles} schema JSON Schema input to get data from
 * @param {Object} options Additional options for generation
 * @param {string} [options.schemaPath] - (optional) Path to directory containing all JSON Schemas
 * or a single JSON Schema file. This will be considered as the baseURL.
 * @param {string} [options.outDir] - (optional) Path to output directory. Generating files will
 * be skipped if directory is not specified.
 * @param {{ [key:string]: string }} [options.metadata] - (optional) Add metadata elements to
 * .md files.
 * @param {string} [options.schemaOut] - (optional) Output JSON Schema files including
 * description and validated examples in the specified folder.
 * @param {boolean} [options.includeReadme=true] - (optional) Generate a README.md file in the
 * output directory.
 * @param {{ [key:string]: string }[]} [options.links] - (optional) Add this file as a link
 * explaining the specified attribute.
 * @param {string} [options.i18n="locales/"] - (optional) Path to a locales folder with
 * JSON files used for internationalization.
 * @param {"en_US" | "de"} [options.language="en_US"] - (optional) Selected language.
 * @param {"json" | "yaml"} [options.exampleFormat="json"] - (optional) How to format examples.
 * @param {string[]} [options.includeProperties=[]] - (optional) Name of custom properties
 * which should be also in the description of an element.
 * @param {boolean} [options.header=true] - (optional) Whether or not to include the header
 * in markdown.
 * @param {string[]} [options.skipProperties=[]] - (optional) Name of a default property to
 * skip in markdown.
 * @returns {GeneratedOutput} List of raw markdown that were generated from input schema.
 */
function jsonschema2md(schema, {
  schemaPath,
  outDir,
  metadata,
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
  if (!schema || typeof schema !== 'object') {
    throw Error('Input is not valid. Provide JSON schema either as Object or Array.');
  }
  const locales = i18n || path.resolve(__dirname, 'locales');
  // eslint-disable-next-line import/no-dynamic-require, global-require
  i18nConfig(require(path.resolve(locales, `${language || 'en_US'}.json`)));

  /** @type {SchemaFiles} */
  let normalized;
  if (Array.isArray(schema)) {
    normalized = schema;
  } else {
    normalized = [{
      fileName: 'definition.schema.json',
      content: schema,
    }];
  }

  const schemaLoader = loader();

  // collect data about the schemas and turn everything into a big object
  const schemas = pipe(
    normalized,
    // Checking if data contains the file path or its contents (JSON schema)
    map(({ fileName, fullPath, content }) => {
      if (!content && fullPath) {
        // eslint-disable-next-line import/no-dynamic-require, global-require
        return schemaLoader(fullPath, require(fullPath));
      }
      return schemaLoader(fileName, content);
    }),
    traverse,
  );

  /**
   * @type {GeneratedOutput}
   */
  const output = {};

  console.log('preparing schemas...');
  output.schema = writeSchema({
    schemaDir: schemaOut,
    originDir: schemaPath,
  })(schemas);

  if (includeReadme) {
    console.log('preparing README...');
    output.readme = pipe(
      schemas,
      // build readme
      readme({
        readme: true,
      }),

      writeReadme({
        out: outDir,
        info,
        error,
        debug,
        meta: metadata,
      }),
    );
  }

  console.log('preparing documentation...');
  output.markdown = pipe(
    schemas,
    // generate Markdown ASTs
    build({
      header,
      links,
      includeProperties,
      exampleFormat,
      skipProperties,
      rewriteLinks: (origin) => {
        const mdDir = outDir;
        if (!mdDir) {
          return origin;
        }
        const srcDir = schemaPath;
        const schemaDir = schemaOut || schemaPath;

        const target = path.relative(
          mdDir,
          path.resolve(schemaDir, path.relative(srcDir, origin)),
        ).split(path.sep).join(path.posix.sep);
        return target;
      },
    }),

    // write to files
    writeMarkdown({
      out: outDir,
      info,
      error,
      debug,
      meta: metadata,
    }),
  );

  return output;
}

/**
 * Main function used in the CLI.
 * @param {{ [key:string]: unknown }} args CLI arguments from user input
 * @returns The generated Markdown files to the specified output directory
 */
async function main(args) {
  // parse/process command line arguments
  const { argv } = yargs(args)
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
    .coerce('o', (o) => path.resolve(o))

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
    .default('x', path.resolve(path.join('.', 'out')))
    .coerce('x', (x) => (x === '-' ? '-' : path.resolve(x)))

    .alias('e', 'schema-extension')
    .describe('e', 'JSON Schema file extension eg. schema.json or json')
    .default('e', 'schema.json')

    .alias('n', 'no-readme')
    .describe('n', 'Do not generate a README.md file in the output directory')

    .describe('link-*', 'Add this file as a link the explain the * attribute, e.g. --link-abstract=abstract.md')

    .alias('i', 'i18n')
    .describe('i', 'path to a locales folder with JSON files')
    .default('i', path.resolve(__dirname, 'locales'))
    .coerce('i', (i) => path.resolve(i))

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

  const resolved = await argv;

  const schemaPath = resolved.d;
  const outDir = resolved.o;
  const metadata = resolved.m;
  const schemaOut = resolved.x !== '-' ? resolved.x : null;
  const includeReadme = !resolved.n;
  const i18n = resolved.i;
  const language = resolved.l;
  const exampleFormat = resolved.f;
  const includeProperties = resolved.p;
  const header = resolved.h;
  const skipProperties = resolved.s;

  const schemaExtension = resolved.e;

  // list all schema files in the specified directory
  const schemaFiles = await readdirp.promise(schemaPath, { root: schemaPath, fileFilter: `*.${schemaExtension}` });

  console.log(`loading ${schemaFiles.length} schemas`);

  /**
   * @type {SchemaList[]}
   * */
  const schemas = schemaFiles.map((schema) => ({
    fileName: schema.basename,
    fullPath: schema.fullPath,
  }));

  jsonschema2md(schemas, {
    schemaPath,
    outDir,
    metadata,
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
