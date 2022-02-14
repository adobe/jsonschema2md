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
import assert from 'assert';
import {
  root, heading, paragraph, text, link, table, tableRow, tableCell, inlineCode,
} from 'mdast-builder';
import { unified } from 'unified';
import remarkStringify from 'remark-stringify';
import gfm from 'remark-gfm';
import fs from 'fs-extra';
import { report } from '../lib/keywords.js';

const stringify = remarkStringify;

/* eslint-env mocha */
const expected = [
  'examples',
  'allOf',
  'json-pointer',
  'relative-json-pointer',
  'regex',
  'uri-template',
  'default',
];

const allkeywords = {
  'The JSON Schema Core Vocabulary, https://json-schema.org/draft/2019-09/json-schema-core.html#rfc.section.8.1': [
    '$schema',
    '$vocabulary',
    '$id',
    '$anchor',
    '$ref',
    '$recursiveRef',
    '$recursiveAnchor',
    '$defs',
    '$comment',
  ],
  'A Vocabulary for Applying Subschemas, https://json-schema.org/draft/2019-09/json-schema-core.html#rfc.section.9': [
    'additionalProperties',
    'properties',
    'patternProperties',
    'unevaluatedProperties',
    'additionalItems',
    'items',
    'unevaluatedItems',
    'allOf',
    'anyOf',
    'oneOf',
    'not',
    'if',
    'then',
    'else',
    'dependentSchemas',
    'contains',
    'propertyNames',
  ],
  'Validation Keywords for Any Instance Type, https://json-schema.org/draft/2019-09/json-schema-validation.html#rfc.section.6.1': [
    'type',
    'enum',
    'const',
  ],
  'Validation Keywords for Numeric Instances, https://json-schema.org/draft/2019-09/json-schema-validation.html#rfc.section.6.2': [
    'multipleOf',
    'maximum',
    'exclusiveMaximum',
    'minimum',
    'exclusiveMinimum',
  ],
  'Validation Keywords for Strings, https://json-schema.org/draft/2019-09/json-schema-validation.html#rfc.section.6.3': [
    'maxLength',
    'minLength',
    'pattern',
  ],
  'Validation Keywords for Arrays, https://json-schema.org/draft/2019-09/json-schema-validation.html#rfc.section.6.4': [
    'maxItems',
    'minItems',
    'uniqueItems',
    'maxContains',
    'minContains',
  ],
  'Validation Keywords for Objects, https://json-schema.org/draft/2019-09/json-schema-validation.html#rfc.section.6.5': [
    'maxProperties',
    'minProperties',
    'required',
    'dependentRequired',
  ],
  'Defined Formats, https://json-schema.org/draft/2019-09/json-schema-validation.html#rfc.section.7.3': [
    'date-time',
    'date',
    'time',
    'duration',
    'email',
    'idn-email',
    'hostname',
    'idn-hostname',
    'ipv4',
    'ipv6',
    'uri',
    'uri-reference',
    'iri',
    'iri-reference',
    'uuid',
    'uri-template',
    'json-pointer',
    'relative-json-pointer',
    'regex',
  ],
  'A Vocabulary for the Contents of String-Encoded Data, https://json-schema.org/draft/2019-09/json-schema-validation.html#rfc.section.8': [
    'contentEncoding',
    'contentMediaType',
    'contentSchema',
  ],
  'A Vocabulary for Basic Meta-Data Annotations, https://json-schema.org/draft/2019-09/json-schema-validation.html#rfc.section.9': [
    'title',
    'description',
    'default',
    'deprecated',
    'readOnly',
    'writeOnly',
    'examples',
  ],
};

after('Generating Schema Coverage Report', () => {
  const allkeywordsplain = Array.from(new Set(Object
    .values(allkeywords)
    .reduce((p, v) => [...p, ...v], [])));
  const allkeywordssupported = allkeywordsplain
    .filter((keyword) => report().has(keyword));

  const overall = Math.floor((100 * allkeywordssupported.length) / allkeywordsplain.length);

  const sections = Object.entries(allkeywords).map(([name, keywords]) => {
    const [label, url] = name.split(', ');
    const coverage = Math.floor(
      (100
      * keywords.filter((keyword) => report().has(keyword)).length)
      / keywords.length,
    );
    return [
      heading(2, text(label)),
      paragraph([text('Coverage for '), link(url, '', text(label)), text(` is ${coverage}%.`)]),
      table('left', [
        tableRow([
          tableCell(text('Keyword')),
          tableCell(text('Supported')),
        ]),
        ...keywords.sort().map((keyword) => tableRow([
          tableCell(inlineCode(keyword)),
          tableCell(text(report().has(keyword) ? 'Yes' : 'No')),
        ])),
      ]),
    ];
  }).reduce((p, v) => [...p, ...v], []);

  const mdast = root([
    heading(1, text('JSON Schema Spec Coverage Report')),
    paragraph(text(`This report lists the keywords of the JSON Schema spec that are covered in the tests. The overall coverage is ${overall}%`)),
    ...sections,
  ]);

  const processor = unified()
    .use(gfm)
    .use(stringify);

  const output = processor.stringify(mdast);

  fs.writeFileSync('schemasupport.md', output);

  const lowerlimit = 50;
  assert.ok(overall > lowerlimit, `Expected minumum spec coverage of ${lowerlimit}%, got only ${overall}%`);
});

describe('Checking JSON Schema Spec coverage', () => {
  expected.forEach((keyword) => {
    it(`keyword ${keyword}`, () => {
      assert.ok(report().has(keyword), `keyword ${keyword} not used in tests`);
    });
  });
});
