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

import path from 'path';
import fs from 'fs-extra';
import assert from 'assert';
import { fileURLToPath } from 'url';
import loader from '../lib/schemaProxy.js';
import { assertMarkdown } from './testUtils.js';
import readme from '../lib/readmeBuilder.js';
import markdown from '../lib/markdownBuilder.js';
import traverse from '../lib/traverseSchema.js';
import writeSchema from '../lib/writeSchema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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
    proxiedone = myloader(path.resolve(__dirname, 'fixtures', 'cyclic', 'one.schema.json'), one);
    proxiedtwo = myloader(path.resolve(__dirname, 'fixtures', 'cyclic', 'two.schema.json'), two);
    proxiedthree = myloader(path.resolve(__dirname, 'fixtures', 'cyclic', 'three.schema.json'), three);

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

  it('Schemas with cyclic references get written to disk', () => {
    const writer = writeSchema({ origindir: path.resolve(__dirname, 'fixtures', 'cyclic'), schemadir: path.resolve(__dirname, 'fixtures', 'cyclic-out') });
    writer(allschemas);
    const schemaone = fs.readJsonSync(path.resolve(__dirname, 'fixtures', 'cyclic-out', 'one.schema.json'));
    assert.deepStrictEqual(schemaone, {
      $schema: 'http://json-schema.org/draft-04/schema#',
      $id: 'http://example.com/schemas/one',
      type: 'object',
      description: 'The first schema in the cycle (or is it the last?)',
      examples: [{}],
      properties: { children: { type: 'array', items: { anyOf: [{ $ref: 'http://example.com/schemas/three' }, { $ref: 'http://example.com/schemas/two' }] } } },
    });
  });
});
