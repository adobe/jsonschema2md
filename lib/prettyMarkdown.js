/**
 * Copyright 2017 Adobe Systems Incorporated. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

var prettier = require('prettier');

const prettyMarkdown = function(str) {
  return prettier.format(str, { parser: 'markdown', proseWrap: 'always', printWidth: 119 });
};

module.exports = prettyMarkdown;
