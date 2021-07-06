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
const path = require('path');
const {
  loader, pointer, filename, id, titles, resolve, slug, meta,
} = require('../lib/schemaProxy');

const example = require('./fixtures/example/example.schema.json');

const referencing = {
  $schema: 'http://json-schema.org/draft-06/schema#',
  $id: 'https://example.com/schemas/referencing',
  title: 'Referencing',
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
      'foo', 'bar', 'zip', 'zup', 'baz', // plus all the referenced properties
    ]));
  });

  it('Schema proxy generates unique names', () => {
    const myloader = loader();
    const proxied1 = myloader(example, 'example.schema.json');
    const proxied2 = myloader(referencing, 'referencing.schema.json');
    const proxied3 = myloader({
      title: 'Referencing',
    }, 'anotherreference.schema.json');

    assert.equal(proxied1[slug], 'example');

    assert.equal(proxied1.properties.zip[slug], 'example-properties-an-object');
    assert.equal(proxied1.properties.zup[slug], 'example-properties-an-object-1'); // avoid duplicates

    assert.equal(proxied2[slug], 'referencing');
    assert.equal(proxied2[slug], 'referencing'); // make sure the slug stays stable
    assert.equal(proxied3[slug], 'anotherreference');
  });

  it('Schema proxy loads actual schemas with meta information', () => {
    const myloader = loader();

    const examplefile = path.resolve(__dirname, '..', 'examples', 'schemas', 'definitions.schema.json');
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const exampleschema = myloader(require(examplefile), examplefile);

    assert.equal(exampleschema[meta].shortdescription, 'This is an example of using a definitions object within a schema');
  });

  it('Schema proxy loads complex schemas with meta information', () => {
    const myloader = loader();

    const files = [
      'abstract.schema.json',
      'simple.schema.json',
      'complex.schema.json',
      'custom.schema.json',
      'examples.schema.json',
      'extending.schema.json',
    ];

    const schemas = files.map((file) => {
      const fname = path.resolve(__dirname, '..', 'examples', 'schemas', file);
      // eslint-disable-next-line import/no-dynamic-require, global-require
      return myloader(require(fname), fname);
    });

    assert.equal(schemas[0][slug], 'abstract');

    assert.deepEqual(schemas[2].title, 'Complex References');
    assert.equal(schemas[2].properties.refnamed.title, 'Simple');
    assert.equal(schemas[2].properties.refrefed.title, 'Simple');
    assert.equal(schemas[2].properties.reflocalfile.title, 'Simple');
    assert.equal(schemas[2].properties.reflocalfiledef.properties.third.properties.baz.title, 'BAAAZ!');

    assert.equal(schemas[3].allOf[2].properties.bar.type, 'string');

    assert.equal(schemas[4].examples.length, 2);
  });

  it('Schema proxy loads complex schemas with meta information', () => {
    const myloader = loader();

    const files = [
      'deadref.schema.json',
    ];

    const schemas = files.map((file) => {
      const fname = path.resolve(__dirname, 'fixtures', 'deadref', file);
      // eslint-disable-next-line import/no-dynamic-require, global-require
      return myloader(require(fname), fname);
    });

    assert.equal(schemas[0][slug], 'deadref');
    assert.deepEqual(schemas[0].properties.foo, { $ref: 'http://unknown-ref' });
  });
});
