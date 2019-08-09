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

const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');
const mkdirp = Promise.promisify(require('mkdirp'));

const writeFile = (outputDir, fileName, data) => Promise.resolve().then(() => {
  if (!fs.existsSync(outputDir)) {
    return mkdirp(outputDir);
  } else {
    return Promise.resolve();
  }
}).then(() => fs.writeFileAsync(path.join(outputDir, fileName), data))
  .then(() => path.join(outputDir, fileName));

module.exports = writeFile;
