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
const assert = require('assert');
const unified = require('unified');
const stringify = require('remark-stringify');
const inspect = require('unist-util-inspect');
const select = require('unist-util-select');
const path = require('path');
const gfm = require('remark-gfm');
const readdirp = require('readdirp');
const { loader } = require('../lib/schemaProxy');
const traverse = require('../lib/traverseSchema');

function assertMarkdown(node) {
  const processor = unified()
    .use(gfm)
    .use(stringify);
  try {
    const result = processor.stringify(node);
    const tester = {};
    tester.contains = (str) => {
      assert.ok(result.indexOf(str) >= 0, `Markdown output does not contain search string "${str}"
${result}`);
      return tester;
    };
    tester.doesNotContain = (str) => {
      assert.ok(result.indexOf(str) < 0, `Markdown output contains search string "${str}"
${result}`);
      return tester;
    };
    tester.matches = (re) => {
      assert.ok(result.match(re), `Markdown output does not match regex "${String(re)}"
${result}`);
      return tester;
    };
    tester.inspect = () => {
      console.log(inspect(node));
      return tester;
    };
    tester.print = () => {
      console.log(result);
      return tester;
    };
    tester.has = (selector) => {
      assert.ok(select.select(selector, node), `Markdown AST does not include node matching selector "${selector}"
${inspect(node)}`);
      return tester;
    };
    tester.equals = (selector, value) => {
      assert.deepStrictEqual(select.select(selector, node), value);
      return tester;
    };
    tester.fuzzy = (expr) => {
      const matches = expr.filter((line) => result.indexOf(line) >= 0);
      if (matches.length < expr.length) {
        assert.equal(result, expr.join(''));
      }
      return tester;
    };
    return tester;
  } catch (e) {
    assert.fail(`Invalid Markdown:\n${inspect(node)}\n${e}\n${JSON.stringify(node, undefined, 2)}`);
  }
  return null;
}

async function loadschemas(dir) {
  const schemaloader = loader();
  const schemadir = path.resolve(__dirname, 'fixtures', dir);
  const schemas = await readdirp.promise(schemadir, { fileFilter: '*.schema.json' });

  return traverse(schemas
    .map(({ fullPath }) => schemaloader(
      // eslint-disable-next-line global-require, import/no-dynamic-require
      require(fullPath), fullPath,
    )));
}

module.exports = { assertMarkdown, loadschemas };
