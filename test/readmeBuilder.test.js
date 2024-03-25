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
import { assertMarkdown, traverseSchemas } from './testUtils.js';

import build from '../lib/readmeBuilder.js';
import loader from '../lib/schemaProxy.js';

describe('Testing Readme Builder', () => {
  it('Readme Builder is a function', () => {
    assert.equal(typeof build, 'function');
  });

  it('Readme Builder does nothing when not required', () => {
    const builder = build({ readme: false });
    assert.equal(builder(), null);
  });

  it('Readme Builder builds a README for type', async () => {
    const schemas = await traverseSchemas('type');
    const builder = build({ readme: true });
    const result = builder(schemas);

    assertMarkdown(result)
      .contains('# README')
      .print();
  });

  it('Readme Builder builds a medium README for multiple Schemas', async () => {
    const schemas = await traverseSchemas('readme-1');
    const builder = build({ readme: true });
    const result = builder(schemas);

    assertMarkdown(result)
      .contains('# README')
      .contains('The schemas linked above')
      .doesNotContain('complex-properties-definitionnamed.md')
      .fuzzy`
## Top-level Schemas

* [Abstract](./abstract.md "This is an abstract schema") – ${null}
* [Complex References](./complex.md "This is an example schema that uses types defined in other schemas") – ${null}
* [Simple](./simple.md "This is a very simple example of a JSON schema") – ${null}
`;
  });

  it('Readme Builder builds a small README for a single Schema', () => {
    const builder = build({ readme: true });
    const schemaloader = loader();
    const schemas = [
      schemaloader('example.schema.json', {
        type: 'object',
        title: 'Test Schema',
        description: 'Not much',
        properties: {
          foo: {
            const: 1,
          },
          obj: {
            type: 'object',
            title: 'An Object',
          },
          arr: {
            type: 'array',
            title: 'An Array',
          },
        },
      }),
    ];

    const result = builder(schemas);
    // eslint-disable-next-line no-unused-expressions
    assertMarkdown(result)
      .contains('# README')
      .matches(/Top-level Schemas/)
      .has('heading > text')
      .equals('heading > text', {
        type: 'text',
        value: 'README',
      })
      .fuzzy`# README

## Top-level Schemas

* [Test Schema](./example.md "Not much") – ${undefined}

## Other Schemas

### Objects



### Arrays`;
  });
});
