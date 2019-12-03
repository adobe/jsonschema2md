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
const path = require('path');
const inspect = require('unist-util-inspect');
const fs = require('fs-extra');
const yaml = require('js-yaml');

function writeMarkdown({
  out, debug, error, info, meta
}) {
  const dbg = (message) => {
    if (debug && typeof message === 'object') {
      debug(inspect(message));
    } else if (debug) {
      debug(message);
    }
  };

  const processor = unified()
    .use(stringify);

  fs.mkdirpSync(out);

  return (schemas) => {
    each(pairs(schemas), ([name, schema]) => {
      dbg(schema.markdown);
      const fileName = path.resolve(out, `${name}.schema.md`);

      const output = 
        // add YAML frontmatter
        (!meta ? '' : '---\n') + 
        (!meta ? '' : yaml.safeDump(meta)) + 
        (!meta ? '' : '---\n\n') + 

        processor.stringify(schema.markdown);


      fs.writeFile(fileName, output, (err) => {
        if (err) {
          error(err);
        }
        // info(`${fileName} created`);
        schema.outFile = fileName;
      });
    });

    return schemas;
  };
}

module.exports = writeMarkdown;
