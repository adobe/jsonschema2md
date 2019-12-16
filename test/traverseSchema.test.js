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
/* eslint-env mocha */

const assert = require('assert');
const {
  loader, filename,
} = require('../lib/schemaProxy');

const { traverseSchema } = require('../lib/traverseSchema');

const example = {
  'meta:license': [
    'Copyright 2017 Adobe Systems Incorporated. All rights reserved.',
    "This file is licensed to you under the Apache License, Version 2.0 (the 'License');",
    'you may not use this file except in compliance with the License. You may obtain a copy',
    'of the License at http://www.apache.org/licenses/LICENSE-2.0',
  ],
  $schema: 'http://json-schema.org/draft-06/schema#',
  $id: 'https://example.com/schemas/example',
  title: 'Example',
  type: 'object',
  description:
    'This is an example schema with examples. Too many examples? There can never be too many examples!',
  properties: {
    foo: {
      type: 'string',
      description: 'A simple string.',
      examples: ['bar'],
      version: '1.0.0',
      testProperty: 'test',
    },
    bar: {
      type: 'string',
      description: 'A simple string.',
      examples: ['bar', 'baz'],
      version: '1.0.0',
      testProperty: 'test',
    },
    zip: {
      type: 'object',
      title: 'An object',
    },
    zup: {
      type: 'object',
      title: 'An object',
    },
    baz: {
      anyOf: [
        { $ref: '#/properties/foo' },
        { $ref: '#/properties/bar' },
      ],
    },
  },
};

describe('Testing Schema Traversal', () => {
  it('Schema Traversal generates a list', () => {
    const proxied = loader()(example, 'example.schema.json');
    const schemas = traverseSchema(proxied);

    assert.equal(schemas.length, 9);
    assert.equal(schemas[8][filename], 'example.schema.json');
  });
});
