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
/* eslint-disable no-unused-expressions */
import assert from 'assert';
import s from '../lib/symbols.js';
import { gentitle, gendescription } from '../lib/formattingTools.js';

describe('Testing formatting tools: gettitle', () => {
  it('robust for undefined', () => {
    assert.strictEqual(gentitle('foo'), 'Untitled schema');
  });
  it('robust for non array', () => {
    assert.strictEqual(gentitle('foo'), 'Untitled schema');
  });
  it('robust for undefined array', () => {
    assert.strictEqual(gentitle([undefined]), 'Untitled schema');
  });
  it('robust for larger undefined array', () => {
    assert.strictEqual(gentitle([undefined, undefined]), 'Untitled schema');
  });
  it('returns single first title', () => {
    assert.strictEqual(gentitle(['Hello world schema']), 'Hello world schema');
  });
  it('returns last title', () => {
    assert.strictEqual(gentitle([1, 2, 3, 'Hello world schema']), 'Hello world schema');
  });
  it('returns title with type', () => {
    assert.strictEqual(
      gentitle(['Hello world schema', undefined], 'string'),
      'Untitled string in Hello world schema',
    );
  });
  it('returns title with for undefined type', () => {
    assert.strictEqual(
      gentitle(['Hello world schema', undefined]),
      'Untitled undefined type in Hello world schema',
    );
  });
});

describe('Testing formatting tools: gendescription', () => {
  it('robust for undefined', () => {
    assert.strictEqual(gendescription(), '');
  });

  it('works with meta', () => {
    assert.strictEqual(gendescription({
      [s.meta]: {
        shortdescription: 'Hello, world',
      },
    }), 'Hello, world');
  });
});
