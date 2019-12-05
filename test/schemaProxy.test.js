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
  loader, pointer, filename, id, titles, resolve,
} = require('../lib/schemaProxy');

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
    baz: {
      anyOf: [
        { $ref: '#/properties/foo' },
        { $ref: '#/properties/bar' },
      ],
    },
  },
};

const referencing = {
  $schema: 'http://json-schema.org/draft-06/schema#',
  $id: 'https://example.com/schemas/referencing',
  properties: {
    $ref: 'https://example.com/schemas/example#/properties',
    zap: {
      type: 'boolean',
    },
  },
};

describe('Testing Schema Proxy', () => {
  it('Schema Proxy creates a JSON schema', () => {
    const proxied = loader()(example, 'example.schema.json');

    assert.equal(proxied.title, 'Example');
    assert.equal(proxied.properties.foo.type, 'string');
  });

  it('Schema Proxy loads multiple JSON schemas', () => {
    const myloader = loader();
    const proxied1 = myloader(example, 'example.schema.json');
    const proxied2 = myloader(referencing, 'referencing.schema.json');

    assert.equal(proxied1.title, 'Example');
    assert.equal(proxied2.$id, 'https://example.com/schemas/referencing');
  });

  it('Schema Proxy creates a JSON schema with Pointers', () => {
    const proxied = loader()(example, 'example.schema.json');

    assert.equal(proxied[pointer], '');
    assert.equal(proxied.properties[pointer], '/properties');
    assert.equal(proxied.properties.foo[pointer], '/properties/foo');
    assert.equal(proxied['meta:license'][pointer], '/meta:license');
    assert.equal(proxied.properties.baz.anyOf[0][pointer], '/properties/baz/anyOf/0');
  });

  it('Schema Proxy creates a JSON schema with ID References', () => {
    const proxied = loader()(example, 'example.schema.json');

    assert.equal(proxied[id], 'https://example.com/schemas/example');
    assert.equal(proxied.properties[pointer], '/properties');

    assert.equal(proxied.properties[id], 'https://example.com/schemas/example');
    assert.equal(proxied.properties[pointer], '/properties');

    assert.equal(proxied.properties.foo[id], 'https://example.com/schemas/example');
    assert.equal(proxied['meta:license'][id], 'https://example.com/schemas/example');
    assert.equal(proxied.properties.baz.anyOf[0][id], 'https://example.com/schemas/example');
  });

  it('Schema Proxy creates a JSON schema with Filename References', () => {
    const proxied = loader()(example, 'example.schema.json');

    assert.equal(proxied[filename], 'example.schema.json');
    assert.equal(proxied.properties[filename], 'example.schema.json');
    assert.equal(proxied.properties.foo[filename], 'example.schema.json');
    assert.equal(proxied['meta:license'][filename], 'example.schema.json');
    assert.equal(proxied.properties.baz.anyOf[0][filename], 'example.schema.json');
  });

  it('Schema Proxy creates a JSON schema with title References', () => {
    const proxied = loader()(example, 'example.schema.json');

    assert.deepStrictEqual(proxied[titles], ['Example']);
    assert.deepStrictEqual(proxied.properties.zip[titles], ['Example', undefined, 'An object']);
  });

  it('Schema proxy resolves JSON Pointers', () => {
    const myloader = loader();
    const proxied1 = myloader(example, 'example.schema.json');

    assert.deepStrictEqual(proxied1.properties, proxied1[resolve]('/properties'));
    assert.deepStrictEqual(proxied1.properties.foo, proxied1[resolve]('/properties/foo'));
    assert.deepStrictEqual(proxied1.properties.foo, proxied1.properties[resolve]('/foo'));
  });

  it('Schema proxy resolves Reference Pointers', () => {
    const myloader = loader();
    myloader(example, 'example.schema.json');
    const proxied2 = myloader(referencing, 'referencing.schema.json');

    assert.deepStrictEqual(new Set(Object.keys(proxied2.properties)), new Set([
      '$ref', 'zap', // the two properties from the original declaration
      'foo', 'bar', 'zip', 'baz', // plus all the referenced properties
    ]));
  });
});
