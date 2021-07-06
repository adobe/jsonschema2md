/*
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
/* eslint-disable no-unused-expressions */
const assert = require('assert');
const fs = require('fs-extra');
const path = require('path');
const { loadschemas } = require('./testUtils');

const example = require('./fixtures/example/example.schema.json');
const { jsonschema2md } = require('../lib/index');

describe('Testing Main API', () => {
  beforeEach(async () => {
    await fs.remove(path.resolve(__dirname, '..', 'tmp'));
  });

  afterEach(async () => {
    await fs.remove(path.resolve(__dirname, '..', 'tmp'));
  });

  it('Main API processes readme-1 directory', async () => {
    const schemas = await loadschemas('readme-1');
    const res = jsonschema2md(schemas, {
      schemaPath: path.resolve(__dirname, 'fixtures/readme-1'),
      out: 'tmp',
      schemaOut: 'tmp',
      includeReadme: true,
    });
    // console.log('done!', res);
    assert(res === Object(res));
    const readme = await fs.stat(path.resolve(__dirname, '..', 'tmp', 'README.md'));
    assert.ok(readme.isFile());
  });

  it('Main API processes example schema', async () => {
    const res = jsonschema2md(example, {
      out: 'tmp',
      includeReadme: true,
    });
    // console.log('done!', res);
    assert(res === Object(res));
    const readme = await fs.stat(path.resolve(__dirname, '..', 'tmp', 'README.md'));
    assert.ok(readme.isFile());
  });
});
