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
import assert from 'assert';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { main } from '../lib/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { AssertionError } = assert;

describe('Integration Test', () => {
  let oldargs = [];
  let oldexit;

  beforeEach(async () => {
    oldargs = process.argv;
    oldexit = process.exit;
    try {
      await fs.rm(path.resolve(__dirname, '..', 'tmp'), { recursive: true });
    } catch {
      console.log('leaving tmp dir dirty');
    }
  });

  afterEach(async () => {
    process.argv = oldargs;
    process.exit = oldexit;
    try {
      await fs.rm(path.resolve(__dirname, '..', 'tmp'), { recursive: true });
    } catch {
      console.log('leaving tmp dir dirty');
    }
  });

  it.skip('CLI needs arguments to run', async (done) => {
    process.exit = () => {
      done();
      throw new Error('Intercepted Exit');
    };

    try {
      console.log('running main');
      await main();
      assert.fail('CLI called without args should exit');
    } catch (e) {
      console.log('caught', e);
      if (e instanceof AssertionError) {
        throw e;
      }
      assert.equal(e.message, 'Intercepted Exit');
    }
  });

  ['arrays', 'cyclic'].forEach((dir) => it(`CLI processes ${dir} directory`, async () => {
    const res = await main((`jsonschema2md -d test/fixtures/${dir} -o tmp -x tmp -m input1=test1 -m input2=test2`).split(' '));
    console.log('done!', res);
    const readme = await fs.stat(path.resolve(__dirname, '..', 'tmp', 'README.md'));
    assert.ok(readme.isFile());
    assert.notStrictEqual(readme.size, 0);
  }));

  ['json-logic-js/schemas'].forEach((dir) => it(`CLI processes ${dir} directory`, async () => {
    const res = await main((`jsonschema2md -d node_modules/${dir} -o tmp -x tmp -e json`).split(' '));
    console.log('done!', res);
    const readme = await fs.stat(path.resolve(__dirname, '..', 'tmp', 'README.md'));
    assert.ok(readme.isFile());
    assert.notStrictEqual(readme.size, 0);
  }));
});
