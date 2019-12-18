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
const fs = require('fs-extra');
const { loader } = require('../lib/schemaProxy');
const { assertMarkdown } = require('./testUtils');
const build = require('../lib/readmeBuilder');

describe('Integration Test: Cyclic References', () => {
  let one;
  let two;
  let three;

  let proxiedone;
  let proxiedtwo;
  let proxiedthree;

  before('Read Schemas from disk', async () => {
    one = await fs.readJson(path.resolve(__dirname, 'fixtures', 'cyclic', 'one.schema.json'));
    two = await fs.readJson(path.resolve(__dirname, 'fixtures', 'cyclic', 'two.schema.json'));
    three = await fs.readJson(path.resolve(__dirname, 'fixtures', 'cyclic', 'three.schema.json'));

    const myloader = loader();
    proxiedone = myloader(one, 'one.schema.json');
    proxiedtwo = myloader(two, 'two.schema.json');
    proxiedthree = myloader(three, 'three.schema.json');
  });

  it('Schemas with cyclic references can be loaded', () => {
    assert.equal(proxiedone.$id, 'http://example.com/schemas/one');

    assert.equal(proxiedone.properties.children.items.anyOf[0].$id,
      'http://example.com/schemas/three');
    assert.equal(proxiedone.properties.children.items.anyOf[1].$id,
      'http://example.com/schemas/two');

    assert.equal(proxiedtwo.$id, 'http://example.com/schemas/two');
    assert.equal(proxiedtwo.properties.children.items.anyOf[0].$id,
      'http://example.com/schemas/one');
    assert.equal(proxiedtwo.properties.children.items.anyOf[1].$id,
      'http://example.com/schemas/three');

    assert.equal(proxiedthree.$id, 'http://example.com/schemas/three');
    assert.equal(proxiedthree.properties.children.items.anyOf[0].$id,
      'http://example.com/schemas/one');
    assert.equal(proxiedthree.properties.children.items.anyOf[1].$id,
      'http://example.com/schemas/two');

    // complete the cycle
    assert.equal(proxiedone
      .properties.children.items.anyOf[0]
      .properties.children.items.anyOf[1]
      .properties.children.items.anyOf[0].$id,
    'http://example.com/schemas/one');
  });

  it('Schemas with cyclic references generate README', () => {
    const builder = build({ readme: true });
    const result = builder([proxiedone, proxiedtwo, proxiedthree]);

    assertMarkdown(result)
      .contains('http://example.com/schemas/one')
      .contains('http://example.com/schemas/two')
      .contains('http://example.com/schemas/three')
      .contains('http://json-schema.org/draft-04/schema#')
      .print();
  });

  it('Schemas with cyclic references generate Markdown', () => {

  });
});
