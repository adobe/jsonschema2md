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

const { spawn } = require('child_process');
const path = require('path');
const { readFileSync, readdirSync, statSync } = require('fs');
const diff = require('jasmine-diff');

beforeEach(() => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
  jasmine.addMatchers(
    diff(jasmine, {
      colors: true,
      inline: true,
    }),
  );
});

describe('Compare results', () => {
  it('Run jsonschema2md for custom file extension', (done) => {
    const ls = spawn('node', [
      'cli.js',
      '-d',
      'examples/schemas',
      '-o',
      'examples/tmp-docs',
      '-x',
      'examples/generated-schemas',
      '-e',
      'js',
    ]);

    ls.on('close', (code) => {
      expect(code).toEqual(0);
      done();
    });
  });


  it('Run jsonschema2md on example schemas', (done) => {
    const ls = spawn('node', [
      'cli.js',
      '-d',
      'examples/schemas',
      '-o',
      'examples/docs',
      '-x',
      'examples/generated-schemas',
      '-m',
      'template=reference',
      '-m',
      'foo=bar',
      '--link-abstract',
      'abstract.md',
      '--link-status',
      'status.md',
      '-v', '06',
      '-p', 'version,testProperty',
    ]);
    ls.on('close', (code) => {
      expect(code).toEqual(0);
      const files = readdirSync('./spec/examples').filter(item => !(/(^|\/)\.[^/.]/g).test(item));
      expect(files.length).toEqual(23);

      files.forEach((file) => {
        if (statSync(`./spec/examples/${file}`).isFile()) {
          const expectedstr = readFileSync(path.resolve('./spec/examples/', file)).toString();
          let actualstr = readFileSync(path.resolve('./examples/docs/', file)).toString();
          actualstr = actualstr.replace(/\r\n/g, '\n');
          expect(actualstr).toEqual(expectedstr, `${file} does not match`);
        }
      });

      done();
    });
  });
  it('Run jsonschema2md for a file and do not generate a header', (done) => {
    const ls = spawn('node', [
      'cli.js',
      '-d',
      'examples/schemas/arrays.schema.json',
      '-o',
      'examples/docsWithoutHeader',
      '-x',
      'examples/generated-schemas',
      '--no-header',
      '-v',
      '06',
    ]);

    ls.on('close', (code) => {
      expect(code).toEqual(0);
      const files = readdirSync('./spec/examples/withoutHeader').filter(item => !(/(^|\/)\.[^/.]/g).test(item));
      files.forEach((file) => {
        if (statSync(`./spec/examples/withoutHeader/${file}`).isFile()) {
          const expectedstr = readFileSync(path.resolve('./spec/examples/withoutHeader/', file)).toString();
          const actualstr = readFileSync(path.resolve('./examples/docsWithoutHeader/', file)).toString();
          expect(actualstr).toEqual(expectedstr, `${file} does not match`);
        }
      });
      done();
    });
  });
});
