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
  map, pairs, pipe, filter, list: flist, mapSort,
} = require('ferrum');
const {
  root, paragraph, text, heading, list, listItem, link, inlineCode,
} = require('mdast-builder');
const inspect = require('unist-util-inspect');
const s = require('./symbols');
const { gentitle, gendescription, sortedlist } = require('./formattingTools');


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
        filter(schema => !schema[s.parent]), // remove schemas with a parent
        mapSort(schema => gentitle(schema[s.titles], schema.type)),
        map(schema => listItem(paragraph([
          link(`./${schema[s.slug]}.md`, gendescription(schema), [text(gentitle(schema[s.titles], schema.type))]),
          text(' – '),
          inlineCode(schema.$id),
        ]))),
      ), Array);

      const bytype = type => flist(pipe(
        schemas,
        filter(schema => schema.type === type), // remove schemas without matching type
        filter(schema => !!schema[s.parent]), // keep only schemas with a parent
        mapSort(schema => gentitle(schema[s.titles], schema.type)),
        map(schema => listItem(paragraph([
          link(`./${schema[s.slug]}.md`, gendescription(schema), [text(gentitle(schema[s.titles], schema.type))]),
          text(' – '),
          inlineCode(`${schema[s.id]}#${schema[s.pointer]}`),
        ]))),
      ), Array);


      const readmenode = root([
        heading(1, text('README')),
        heading(2, text('Top-level Schemas')),
        list('unordered', toplevel),

        heading(2, text('Other Schemas')),

        heading(3, text('Objects')),
        list('unordered', bytype('object')),

        heading(3, text('Arrays')),
        list('unordered', bytype('array')),
      ]);

      // console.log(inspect(readmenode));

      return readmenode;
    }
    return null;
  };
}

module.exports = build;
