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

const path = require('path');
const fs = require('fs-extra');
const { loader } = require('../lib/schemaProxy');
const { assertMarkdown } = require('./testUtils');
const readme = require('../lib/readmeBuilder');
const markdown = require('../lib/markdownBuilder');
const traverse = require('../lib/traverseSchema');

describe('Integration Test: Cyclic References', () => {
  let one;
  let two;
  let three;

  let proxiedone;
  let proxiedtwo;
  let proxiedthree;

  let allschemas;

  beforeEach('Read Schemas from disk', async () => {
    console.log('Reading Schemas');
    one = await fs.readJson(path.resolve(__dirname, 'fixtures', 'cyclic', 'one.schema.json'));
    two = await fs.readJson(path.resolve(__dirname, 'fixtures', 'cyclic', 'two.schema.json'));
    three = await fs.readJson(path.resolve(__dirname, 'fixtures', 'cyclic', 'three.schema.json'));

    const myloader = loader();

    console.log('Loading Schemas');
    proxiedone = myloader(one, path.resolve(__dirname, 'fixtures', 'cyclic', 'one.schema.json'));
    proxiedtwo = myloader(two, path.resolve(__dirname, 'fixtures', 'cyclic', 'two.schema.json'));
    proxiedthree = myloader(three, path.resolve(__dirname, 'fixtures', 'cyclic', 'three.schema.json'));

    console.log('Traversing Schemas');

    allschemas = traverse([proxiedone, proxiedtwo, proxiedthree]);
  });

  it('Schemas with cyclic references generate README', () => {
    const builder = readme({ readme: true });
    const result = builder([proxiedone, proxiedtwo, proxiedthree]);

    assertMarkdown(result)
      .contains('http://example.com/schemas/one')
      .contains('http://example.com/schemas/two')
      .contains('http://example.com/schemas/three')
      .contains('http://json-schema.org/draft-04/schema#');
  });

  it('Schemas with cyclic references generate Markdown', () => {
    const builder = markdown();
    const documents = builder(allschemas);
    assertMarkdown(documents['one-properties-children-items'])
      .contains('any of');

    assertMarkdown(documents.one)
      .contains('one-properties-children-items');
  });
});
