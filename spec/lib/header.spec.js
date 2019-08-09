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

/* eslint-env jasmine */

const i18n = require('i18n');
const path = require('path');
const diff = require('jasmine-diff');
const { Header, headers } = require('../../lib/header');

beforeEach(() => {
  jasmine.addMatchers(diff(jasmine, {
    colors: true,
    inline: true,
  }));
  const i18nPath = path.resolve(path.join(__dirname, '../../lib/locales'));
  i18n.configure({
    // setup some locales - other locales default to en silently
    locales: ['en'],
    // where to store json files - defaults to './locales' relative to modules directory
    directory: i18nPath,
    defaultLocale: 'en',
  });
});

describe('Header Integration Test', () => {
  it('Renders a header without link if link is unknown', () => {
    const h = new Header('Foo');
    expect(h.renderHeader()).toEqual('Foo');
  });

  it('Renders a header with link if link is known', () => {
    const h = new Header('Foo', '../bar.md');
    expect(h.renderHeader()).toEqual('[Foo](../bar.md)');
  });

  it('Renders a header body without link if link is unknown', () => {
    const h = new Header('Foo', null, 'Bar');
    expect(h.renderValue()).toEqual('Bar');
  });

  it('Renders a header body with link if link is known', () => {
    const h = new Header('Foo', '../bar.md', 'Bar', '#bar-md');
    expect(h.renderValue()).toEqual('[Bar](#bar-md)');
  });
});

describe('Headers Integration Test', () => {
  it('Abstract', () => {
    const schema = {
      additionalProperties: true,
      'meta:extensible': false,
      properties: { foo: 'bar', bar: 'baz' },
    };

    const h = headers(schema, '/home/lars', '/home/lars/complex.schema.json');

    const result = `| Abstract | Extensible | Status | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------|------------|--------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | No | Experimental | No | Forbidden | Permitted | [complex.schema.json](complex.schema.json) |`;
    expect(h.render()).toEqual(result);
  });

  it('Markdown links should be correct when schema is in a subdir.', () => {
    const schema = {
      additionalProperties: true,
      'meta:extensible': false,
      properties: { foo: 'bar', bar: 'baz' },
    };

    const h = headers(schema, '/home/lars', '/home/lars/some/deep/path/complex.schema.json');

    const result = `| Abstract | Extensible | Status | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------|------------|--------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | No | Experimental | No | Forbidden | Permitted | [some/deep/path/complex.schema.json](complex.schema.json) |`;
    expect(h.render()).toEqual(result);
  });
});
