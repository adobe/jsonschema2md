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

const nodepath = require('path');

const logger = require('@adobe/helix-log');
const { pipe } = require('ferrum');
const npath = require('path');
const { i18nConfig } = require('es2015-i18n-tag');
const build = require('./markdownBuilder');
const { writereadme, writemarkdown } = require('./writeMarkdown');
const { writeSchema } = require('./writeSchema');
const readme = require('./readmeBuilder');

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
  // eslint-disable-next-line import/no-dynamic-require, global-require
  i18nConfig(require(nodepath.resolve(i18n || nodepath.resolve(__dirname, 'locales'), `${language || 'en_US'}.json`)));

  if (schemaOut) {
    console.log('writing schemas');
    writeSchema({
      schemadir: schemaOut,
      origindir: schemaPath,
    })(schema);
  }

  if (includeReadme) {
    console.log('writing README');
    pipe(
      schema,
      // build readme
      readme({
        readme: includeReadme,
      }),

      writereadme({
        readme: includeReadme,
        out: out || outOrDefault,
        info,
        error,
        debug,
        meta,
      }),
    );
  }

  console.log('writing documentation');
  pipe(
    schema,
    // generate Markdown ASTs
    build({
      header,
      links,
      includeProperties,
      exampleFormat,
      skipProperties,
      rewritelinks: (origin) => {
        const mddir = out;
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
      out: out || outOrDefault,
      info,
      error,
      debug,
      meta,
    }),
  );

  return outOrDefault;
}

module.exports = { jsonschema2md };
