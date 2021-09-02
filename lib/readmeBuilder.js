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
const {
  map, pipe, filter, list: flist, mapSort, uniq,
} = require('ferrum');
const {
  root, paragraph, text, heading, list, listItem, link, inlineCode,
} = require('mdast-builder');
const i18n = require('es2015-i18n-tag').default;
const s = require('./symbols');
const { gentitle, gendescription } = require('./formattingTools');
const { keyword } = require('./keywords');

function makeversionnote(schemas) {
  const versions = flist(uniq(schemas
    .map((schema) => schema[keyword`$schema`])
    .filter((e) => !!e)));

  if (versions.length === 1) {
    return [
      heading(2, text(i18n`Version Note`)),
      paragraph([
        text('The schemas linked above follow the JSON Schema Spec version: '),
        inlineCode(versions[0]),
      ]),
    ];
  }
  return [];
}

/**
 * Generate the README.md
 * @param {object} opts
 */
function build({ readme = true }) {
  return (schemas) => {
    if (readme) {
      console.log('building readme');
      const toplevel = flist(pipe(
        schemas,
        filter((schema) => !schema[s.parent]), // remove schemas with a parent
        mapSort((schema) => gentitle(schema[s.titles], schema[keyword`type`])),
        map((schema) => listItem(paragraph([
          link(`./${schema[s.slug]}.md`, gendescription(schema), [text(gentitle(schema[s.titles], schema[keyword`type`]))]),
          text(' – '),
          inlineCode(schema[keyword`$id`] || '-'),
        ]))),
      ), Array);

      const bytype = (type) => flist(pipe(
        schemas,
         filter((schema) => schema[keyword`type`] === type), // remove schemas without matching type
         filter((schema) => !!schema[s.parent]), // keep only schemas with a parent
         filter((schema) => !schema.$ref), // it is not a reference
        mapSort((schema) => gentitle(schema[s.titles], schema[keyword`type`])),
        map((schema) => listItem(paragraph([
          link(`./${schema[s.slug]}.md`, gendescription(schema), [text(gentitle(schema[s.titles], schema[keyword`type`]))]),
          text(' – '),
          inlineCode(`${schema[s.id]}#${schema[s.pointer]}`),
        ]))),
      ), Array);

      const readmenode = root([
        heading(1, text(i18n`README`)),
        heading(2, text(i18n`Top-level Schemas`)),
        list('unordered', toplevel),

        heading(2, text(i18n`Other Schemas`)),

        heading(3, text(i18n`Objects`)),
        list('unordered', bytype('object')),

        heading(3, text(i18n`Arrays`)),
        list('unordered', bytype('array')),

        ...makeversionnote(schemas),
      ]);

      // console.log(inspect(readmenode));

      return readmenode;
    }
    return null;
  };
}

module.exports = build;
