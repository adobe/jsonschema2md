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
  map, pairs, pipe, filter, list: flist,
} = require('ferrum');
const {
  root, paragraph, text, heading, list, listItem, link, inlineCode,
} = require('mdast-builder');
const inspect = require('unist-util-inspect');


/**
 * Generate the README.md
 * @param {object} opts
 */
function build({ readme = true }) {
  return (schemas) => {
    if (readme) {
      const toplevel = flist(pipe(
        pairs(schemas),
        filter(([_, schema]) => schema.direct),
        map(([name, schema]) => listItem(paragraph([
          link(`./${name}.schema.md`, schema.shortdescription, [text(schema.title)]),
          text(' – '),
          inlineCode(schema.schema.$id),
        ]))),
      ), Array);

      const bytype = type => flist(pipe(
        pairs(schemas),
        filter(([_, schema]) => !schema.direct),
        filter(([_, schema]) => schema.schema.type === type),
        map(([name, schema]) => listItem(paragraph([
          link(`./${name}.schema.md`, schema.shortdescription, [text(schema.title)]),
          text(' – '),
          inlineCode(`${schema.id}#${schema.pointer}`),
        ]))),
      ), Array);

      const arrays = schemas.README = {
        markdown: root([
          heading(1, text('README')),
          heading(2, text('Top-level Schemas')),
          list('unordered', toplevel),
          heading(2, text('Other Schemas')),

          heading(3, text('Objects')),
          list('unordered', bytype('object')),

          heading(3, text('Arrays')),
          list('unordered', bytype('array')),
        ]),
      };
      return schemas;
    }
    return schemas;
  };
}

module.exports = build;
