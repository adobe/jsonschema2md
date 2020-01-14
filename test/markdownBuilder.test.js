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
const { assertMarkdown, loadschemas } = require('./testUtils');

const build = require('../lib/markdownBuilder');

describe('Testing Markdown Builder: content', () => {
  let results;

  before(async () => {
    const schemas = await loadschemas('content');
    const builder = build({ header: false });
    results = builder(schemas);
  });

  it('PNG Schema looks OK', () => {
    assertMarkdown(results.png)
      .contains('**encoding**: the string content must be using the base64 content encoding.');
  });

  it('HTML Schema looks OK', () => {
    assertMarkdown(results.html)
      .contains('**media type**: the media type of the contents of this string is: `text/html`');
  });

  it('JWT Schema looks OK', () => {
    assertMarkdown(results.jwt)
      .contains('**schema**: the contents of this string should follow this schema: [JSON Web Token](jwt-json-web-token.md "check type definition")')
      .contains('**media type**: the media type of the contents of this string is: `application/jwt`');
  });
});

describe('Testing Markdown Builder: not', () => {
  let results;

  before(async () => {
    const schemas = await loadschemas('not');
    const builder = build({ header: false });
    results = builder(schemas);
  });

  it('Not Schema looks OK', () => {
    assertMarkdown(results.not)
      .fuzzy`## Not true Type

merged type ([Not true](not.md))

not

-   [True](not-true.md "check type definition")`;
  });
});

describe('Testing Markdown Builder: title', () => {
  let results;

  before(async () => {
    const schemas = await loadschemas('title');
    const builder = build({ header: false });
    results = builder(schemas);
  });

  it('Meta Schema looks OK', () => {
    assertMarkdown(results.meta)
      .fuzzy`defined in: [Meta](meta-definitions-meta-properties-title.md "https&#x3A;//ns.adobe.com/helix/pipeline/meta#/definitions/meta/properties/title")`;
  });

  it('Title Schema looks OK', () => {
    assertMarkdown(results['meta-definitions-meta-properties'])
      .fuzzy`properties Type`;
  });
});

describe('Testing Markdown Builder: format', () => {
  let results;

  before(async () => {
    const schemas = await loadschemas('format');
    const builder = build({ header: false });
    results = builder(schemas);
  });

  it('Format Schema looks OK', () => {
    assertMarkdown(results.format)
      .fuzzy`Formatting used to display the date.`;
  });
});

describe('Testing Markdown Builder: enums', () => {
  let results;

  before(async () => {
    const schemas = await loadschemas('enums');
    const builder = build({ header: true, includeproperties: ['foo', 'bar'] });
    results = builder(schemas);
  });

  it('Enums Schema looks OK', () => {
    assertMarkdown(results.enums)
      .contains('| `"bas"` | from ancient Egyptian religion, an aspect of the soul |')
      .contains('| `"baa"` |             |')
      .contains('foo: bar')
      .contains('bar: foo')
      .contains('**enum**: the value of this property must be equal to one of the following values:');
  });
});

describe('Testing Markdown Builder: null', () => {
  let results;

  before(async () => {
    const schemas = await loadschemas('null');
    const builder = build({ header: true });
    results = builder(schemas);
  });

  it('Null Schema looks OK', () => {
    assertMarkdown(results.null)
      .contains('the value must be null')
      .contains('can be null')
      .contains('the value of this property must be equal to:');
  });
});

describe('Testing Markdown Builder: additionalprops', () => {
  let results;

  before(async () => {
    const schemas = await loadschemas('additionalprops');
    const builder = build({ header: true });
    results = builder(schemas);
  });

  it('Additional Properties Schema looks OK', () => {
    assertMarkdown(results.additionalprops)
      .contains('**maximum number of properties**: the maximum number of properties for this object is: `99`')
      .contains('**minimum number of properties**: the minimum number of properties for this object is: `10`')
      .has('heading > text[value="Additional Properties"]');
  });

  it('Arrays Schema looks OK', () => {
    assertMarkdown(results.arrays)
      .contains('**minimum number of contained items**: this array may not contain fewer than 1 items that validate against the schema: [Untitled boolean in undefined](arrays-contains.md "check type definition")')
      .contains('**maximum number of contained items**: this array may not contain more than 9 items that validate against the schema: [Untitled boolean in undefined](arrays-contains.md "check type definition")')
      .contains('**unique items**: all items in this array must be unique. Duplicates are not allowed.');
  });
});

describe('Testing Markdown Builder: types', () => {
  let results;

  before(async () => {
    const schemas = await loadschemas('types');
    const builder = build({ header: true });
    results = builder(schemas);
  });

  it('Object Schema looks OK', () => {
    assertMarkdown(results.object)
      .has('paragraph > inlineCode[value="object"]');
  });

  it('Merged Schema looks OK', () => {
    assertMarkdown(results.merged)
      .has('paragraph > text[value^="merged type"]');
  });

  it('Multiple Typed Schema looks OK', () => {
    assertMarkdown(results.objectorarray)
      .has('paragraph > text[value="any of the folllowing: "]');
  });

  it('Undefined Schema looks OKish', () => {
    assertMarkdown(results.undefined)
      .has('paragraph > text[value="unknown ("]');
  });

  it('Wrong Schema looks OKish', () => {
    assertMarkdown(results.wrong)
      .has('paragraph > text[value="unknown"]');
  });
});

describe('Testing Markdown Builder: identifiable', () => {
  let results;

  before(async () => {
    const schemas = await loadschemas('identifiable');
    const builder = build({ header: true });
    results = builder(schemas);
  });

  it('Identifiable Schema looks OK', () => {
    assertMarkdown(results.identifiable)
      .has('table > tableRow > tableCell > text[value="Identifiable"]')
      .has('table > tableRow > tableCell > text[value="Yes"]');
  });
});

describe('Testing Markdown Builder: arrays', () => {
  let results;

  before(async () => {
    const schemas = await loadschemas('arrays');
    const builder = build({ header: true });
    results = builder(schemas);
  });

  it('Arrays Schema looks OK', () => {
    assertMarkdown(results.arrays)
      .contains('and all following items may follow any schema');
  });

  it('Tuple Schema looks OK', () => {
    assertMarkdown(results.tuple)
      .fuzzy`
-   is optional
-   Type: an array where each item follows the corresponding schema in the following list:

    1.  [Positive Integer](tuple-properties-tuple-items-positive-integer.md "check type definition")
    2.  [Negative Integer](tuple-properties-tuple-items-negative-integer.md "check type definition")
    3.  and all following items must follow the schema: [Zero](tuple-properties-tuple-zero.md "check type definition")
-   cannot be null
-   defined in: [Arrays](tuple-properties-tuple.md "https&#x3A;//example.com/schemas/arrays#/properties/tuple")

### tuple Type

an array where each item follows the corresponding schema in the following list:

1.  [Positive Integer](tuple-properties-tuple-items-positive-integer.md "check type definition")
2.  [Negative Integer](tuple-properties-tuple-items-negative-integer.md "check type definition")
3.  and all following items must follow the schema: [Zero](tuple-properties-tuple-zero.md "check type definition")`;
  });
});

describe('Testing Markdown Builder: stringformats', () => {
  let results;

  before(async () => {
    const schemas = await loadschemas('stringformats');
    const builder = build({ header: true });
    results = builder(schemas);
  });

  it('Simple Types Schema looks OK', () => {
    assertMarkdown(results.simpletypes)
      .contains('maximum (exclusive)')
      .contains('minimum (exclusive)')
      .fuzzy`### string_pattern Constraints

**pattern**: the string must match the following regular expression: ${null}
\`\`\`regexp
^ba.$
`
      .fuzzy`### string_date Constraints

**date time**: the string must be a date time string, according to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339 "check the specification")
`;
  });
});


describe('Testing Markdown Builder: readme-1', () => {
  let results;

  before(async () => {
    const schemas = await loadschemas('readme-1');
    const builder = build({ header: true, links: { abstract: 'fooabstract.html' } });
    results = builder(schemas);
  });

  it('Abstract Schema looks OK', () => {
    assertMarkdown(results.abstract)
      .equals('heading > text', { type: 'text', value: 'Abstract Schema' })
      .contains('cannot be read or written')
      .contains('nonfoo Access Restrictions')
      .contains('bar Access Restrictions')
      .contains('### foo Access Restrictions')
      .fuzzy`
## Definitions group second

Reference this group by using

\`\`\`json
{"$ref":"https://example.com/schemas/abstract#/$defs/second"}
\`\`\``
      .fuzzy`
\`bar\`

-   is optional
-   Type: \`string\`
-   cannot be null
-   defined in: [Abstract](abstract-defs-second-properties-bar.md "https&#x3A;//example.com/schemas/abstract#/$defs/second/properties/bar")

#### bar Type

\`string\``
      .contains('fooabstract.html');
    //      .inspect()
    //      .print();
  });

  it('Complex Schema looks OK', () => {
    assertMarkdown(results.complex)
      .contains('Read only')
      .contains('# Complex References Schema');
  });

  it('Simple Schema looks OK', () => {
    assertMarkdown(results.simple)
      .contains('Deprecated')
      .contains('"Simply Untitled"')
      .contains('Write only')
      .contains('> This should be here')
      .contains('living a simple life')
      .contains('# Simple Schema');
  });
});
