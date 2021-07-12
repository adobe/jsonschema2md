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
/* eslint-env mocha */

const assert = require('assert');
const fs = require('fs-extra');
const path = require('path');
const {
  loader, filename,
} = require('../lib/schemaProxy');

const example = require('./fixtures/example/traverse.schema.json');
const traverse = require('../lib/traverseSchema');

describe('Testing Schema Traversal', () => {
  it('Schema Traversal generates a list', () => {
    const proxied = loader()('traverse.schema.json', example);
    const schemas = traverse([proxied]);

    assert.equal(schemas.length, 11);
    assert.equal(schemas[7][filename], 'traverse.schema.json');
  });

  it('Cyclic Schema Traversal generates a list', async () => {
    const one = await fs.readJson(path.resolve(__dirname, 'fixtures', 'cyclic', 'one.schema.json'));
    const two = await fs.readJson(path.resolve(__dirname, 'fixtures', 'cyclic', 'two.schema.json'));
    const three = await fs.readJson(path.resolve(__dirname, 'fixtures', 'cyclic', 'three.schema.json'));

    const myloader = loader();
    const proxiedone = myloader(path.resolve(__dirname, 'fixtures', 'cyclic', 'one.schema.json'), one);
    const proxiedtwo = myloader(path.resolve(__dirname, 'fixtures', 'cyclic', 'two.schema.json'), two);
    const proxiedthree = myloader(path.resolve(__dirname, 'fixtures', 'cyclic', 'three.schema.json'), three);

    const schemas = traverse([proxiedone, proxiedtwo, proxiedthree]);

    assert.equal(schemas[0].$id, 'http://example.com/schemas/one');
    assert.equal(schemas[3].$id, 'http://example.com/schemas/three');
    assert.equal(schemas[6].$id, 'http://example.com/schemas/two');
  });
});
