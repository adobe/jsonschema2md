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
const { AssertionError } = require('assert');
const fs = require('fs-extra');
const path = require('path');
const cli = require('../lib/index');

describe('Integration Test', () => {
  let oldargs = [];
  let oldexit;

  beforeEach(async () => {
    oldargs = process.argv;
    oldexit = process.exit;
    await fs.remove(path.resolve(__dirname, '..', 'tmp'));
  });

  afterEach(async () => {
    process.argv = oldargs;
    process.exit = oldexit;
    await fs.remove(path.resolve(__dirname, '..', 'tmp'));
  });

  it('CLI needs arguments to run', async (done) => {
    process.exit = () => {
      done();
      throw new Error('Intercepted Exit');
    };

    try {
      await cli();
      assert.fail('CLI called without args should exit');
    } catch (e) {
      if (e instanceof AssertionError) {
        throw e;
      }
      assert.equal(e.message, 'Intercepted Exit');
    }
  });

  ['arrays', 'cyclic'].forEach(dir => it(`CLI processes ${dir} directory`, async () => {
    const res = await cli((`jsonschema2md -d test/fixtures/${dir} -o tmp -x tmp`).split(' '));
    console.log('done!', res);
    const readme = await fs.stat(path.resolve(__dirname, '..', 'tmp', 'README.md'));
    assert.ok(readme.isFile());
  }));

  ['json-logic-js/schemas'].forEach(dir => it(`CLI processes ${dir} directory`, async () => {
    const res = await cli((`jsonschema2md -d node_modules/${dir} -o tmp -x tmp -e json`).split(' '));
    console.log('done!', res);
    const readme = await fs.stat(path.resolve(__dirname, '..', 'tmp', 'README.md'));
    assert.ok(readme.isFile());
  }));
});
