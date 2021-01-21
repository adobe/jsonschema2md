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
const { each, pairs } = require('ferrum');
const stringify = require('remark-stringify');
const unified = require('unified');
const gfm = require('remark-gfm');
const path = require('path');
const fs = require('fs-extra');
const yaml = require('js-yaml');

function writemarkdown({
  out, error, meta,
}) {
  const processor = unified()
    .use(gfm)
    .use(stringify);

  fs.mkdirpSync(out);

  return (schemas) => {
    each(pairs(schemas), ([name, markdown]) => {
      const fileName = path.resolve(out, `${name}.md`);

      // add YAML frontmatter
      const output = (!meta ? '' : '---\n')
        + (!meta ? '' : yaml.dump(meta))
        + (!meta ? '' : '---\n\n')

        + processor.stringify(markdown);

      fs.writeFile(fileName, output, (err) => {
        if (err) {
          error(err);
        }
        // info(`${fileName} created`);
      });
    });

    return schemas;
  };
}

function writereadme({
  out, error, info, meta, readme,
}) {
  const processor = unified()
    .use(gfm)
    .use(stringify);

  if (readme) {
    fs.mkdirpSync(out);

    return (readmeast) => {
      const fileName = path.resolve(out, 'README.md');
      // add YAML frontmatter
      const output = (!meta ? '' : '---\n')
        + (!meta ? '' : yaml.dump(meta))
        + (!meta ? '' : '---\n\n')

        + processor.stringify(readmeast);

      fs.writeFile(fileName, output, (err) => {
        if (err) {
          error(err);
        }
        info(`${fileName} created`);
      });

      return fileName;
    };
  } else {
    return (args) => args;
  }
}

module.exports = { writemarkdown, writereadme };
