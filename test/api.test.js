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
import assert from 'assert';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { assertMarkdown, loadSchemas } from './testUtils.js';
import { jsonschema2md } from '../lib/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const example = fs.readJSONSync(path.resolve(__dirname, './fixtures/example/api.schema.json'));

describe('Testing Public API', () => {
  beforeEach(async () => {
    try {
      await fs.rm(path.resolve(__dirname, '..', 'tmp'), { recursive: true });
    } catch {
      console.log('leaving tmp dir dirty');
    }
  });

  afterEach(async () => {
    try {
      await fs.rm(path.resolve(__dirname, '..', 'tmp'), { recursive: true });
    } catch {
      console.log('leaving tmp dir dirty');
    }
  });

  it('Public API processes multiple schemas with full path', async () => {
    const schemasFiles = await loadSchemas('readme-1');
    const result = jsonschema2md(schemasFiles, {
      links: { abstract: 'fooabstract.html' },
      header: true,
      includeReadme: true,
    });
    // console.log('done!', res);
    assert(result === Object(result));
    assert.ok(result.readme.content);
    assertMarkdown(result.readme.markdownAst)
      .contains('# README')
      .contains('The schemas linked above')
      .fuzzy`# README

## Top-level Schemas

* [Abstract](./abstract.md "This is an abstract schema") – \`https://example.com/schemas/abstract\`

* [Complex References](./complex.md "This is an example schema that uses types defined in other schemas") – \`https://example.com/schemas/complex\`

* [Simple](./simple.md "This is a very simple example of a JSON schema") – \`https://example.com/schemas/simple\`

## Other Schemas

### Objects

* [Untitled object in Abstract](./abstract-defs-first.md) – \`https://example.com/schemas/abstract#/$defs/first\`

* [Untitled object in Abstract](./abstract-defs-second.md) – \`https://example.com/schemas/abstract#/$defs/second\`

* [Untitled object in Complex References](./complex-properties-refobj.md) – \`https://example.com/schemas/complex#/properties/refobj\`

* [Untitled object in Complex References](./complex-properties-refnestedobj.md) – \`https://example.com/schemas/complex#/properties/refnestedobj\`

* [Untitled object in Complex References](./complex-properties-refnestedobj-properties-refobj.md) – \`https://example.com/schemas/complex#/properties/refnestedobj/properties/refobj\`

* [definitionnamed](./complex-definitions-definitionnamed.md) – \`https://example.com/schemas/complex#/definitions/definitionnamed\`

### Arrays



## Version Note

The schemas linked above follow the JSON Schema Spec version: \`http://json-schema.org/draft-06/schema#\`
`;
    assert.strictEqual(result.markdown.length, 31);
  });

  it('Public API processes multiple schemas with content', async () => {
    const schemasFiles = await loadSchemas('readme-1');
    const schemas = schemasFiles.map(({ fileName, fullPath }) => ({
      fileName,
      // eslint-disable-next-line global-require, import/no-dynamic-require
      content: fs.readJSONSync(fullPath),
    }));

    const result = jsonschema2md(schemas, {
      schemaPath: path.resolve(__dirname, 'fixtures/readme-1'),
      outDir: 'tmp',
      schemaOut: 'tmp',
      includeReadme: true,
    });
    const readme = await fs.stat(path.resolve(__dirname, '..', 'tmp', 'README.md'));
    assert.ok(readme.isFile());
    assert.notStrictEqual(readme.size, 0);
    assert.ok(result.readme.content);
    assertMarkdown(result.readme.markdownAst)
      .contains('# README')
      .contains('The schemas linked above');
    assert.strictEqual(result.schema.length, 3);
    assert.strictEqual(result.markdown.length, 31);
  });

  it('Public API processes from single schema', async () => {
    const result = jsonschema2md(example, {
      includeReadme: true,
      outDir: 'tmp',
      metadata: {
        key: 'value',
      },
    });
    // console.log('done!', result);
    assert(result === Object(result));
    assert.ok(result.readme.content);
    assertMarkdown(result.readme.markdownAst)
      .contains('# README')
      .matches(/Top-level Schemas/)
      .contains('https://example.com/schemas/example-api');
    assert.strictEqual(result.markdown.length, 7);
    assertMarkdown(result.markdown[0].markdownAst)
      .contains('# Example API Properties')
      .contains('## foo')
      .contains('## bar')
      .contains('## baz')
      .contains('properties within properties')
      .contains('## examples');
  });

  it('Public API with invalid schema', async () => {
    try {
      jsonschema2md('test', {
        outDir: 'tmp',
        includeReadme: true,
      });
    } catch (e) {
      assert.strictEqual(e.message, 'Input is not valid. Provide JSON schema either as Object or Array.');
    }
  });

  it('Public API with unsupported output directory', async () => {
    if (process.platform === 'win32') {
      // give up
      return;
    }
    const outDir = path.resolve(__dirname, '..', 'tmp');
    await fs.ensureDir(outDir);

    await fs.chmod(outDir, 0o400);
    await jsonschema2md(example, {
      outDir,
      includeReadme: true,
    });
    const files = await fs.readdir(outDir);
    assert.strictEqual(files.length, 0);
  });
});
