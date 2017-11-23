/**
 * Copyright 2017 Adobe Systems Incorporated. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

var writeFiles = require('../../lib/writeFiles');
var ejs = require('ejs');

describe('writeFiles module', () => {
  describe('generateMarkdown method', () => {
    beforeEach(() => {
      spyOn(ejs, 'renderFile');
    });
    it('should invoke ejs.renderFile with the topSchema ejs template', () => {
      writeFiles.generateMarkdown('somefile', { 'my':'schema' });
      var renderArgs = ejs.renderFile.calls.argsFor(0);
      expect(renderArgs[0]).toContain('topSchema.ejs');
      expect(renderArgs[1].schema.my).toEqual('schema');
    });
  });
});
