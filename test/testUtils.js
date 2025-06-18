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
import assert from 'assert';
import fs from 'fs-extra';
import { unified } from 'unified';
import stringify from 'remark-stringify';
import { inspect } from 'unist-util-inspect';
import { select } from 'unist-util-select';
import path from 'path';
import gfm from 'remark-gfm';
import { readdirpPromise } from 'readdirp';
import { fileURLToPath } from 'url';
import loader from '../lib/schemaProxy.js';
import traverse from '../lib/traverseSchema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export function assertMarkdown(node) {
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
      assert.ok(select(selector, node), `Markdown AST does not include node matching selector "${selector}"
${inspect(node)}`);
      return tester;
    };
    tester.equals = (selector, value) => {
      assert.deepStrictEqual(select(selector, node), value);
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

export async function loadSchemas(dir) {
  const schemaDir = path.resolve(__dirname, 'fixtures', dir);
  const schemas = await readdirpPromise(schemaDir, { fileFilter: (f) => f.path.endsWith('.schema.json') });

  return schemas.map((schema) => ({
    fileName: schema.basename,
    fullPath: schema.fullPath,
  }));
}

export async function traverseSchemas(dir) {
  const schemas = await loadSchemas(dir);
  const schemaloader = loader();

  return traverse(schemas.map(({ fullPath }) => schemaloader(fullPath, fs.readJSONSync(fullPath))));
}
