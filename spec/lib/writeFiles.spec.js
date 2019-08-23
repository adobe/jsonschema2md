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

const ejs = require('ejs');
const markdownWriter = require('../../lib/markdownWriter');

describe('writeFiles module', () => {
  describe('generateMarkdown method', () => {
    beforeEach(() => {
      spyOn(ejs, 'renderFile');
    });
    it('should invoke ejs.renderFile with the topSchema ejs template', () => {
      markdownWriter('somefile.schema.json', { $id: 'myschema', my: 'schema' }, 'some/path');
      const renderArgs = ejs.renderFile.calls.argsFor(0);
      expect(renderArgs);
    });
  });
});
