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
const fs = require('fs-extra');
const path = require('path');
const s = require('./symbols');

function writeSchema({ schemadir, origindir }) {
  const targetpath = (filename) => path.resolve(schemadir, path.relative(origindir, filename));

  return (schemas) => {
    console.log('writing schemas to', schemadir);

    const realschemas = Object.values(schemas).filter((schema) => !schema[s.parent]);
    realschemas.forEach((schema) => {
      // console.log('writing', schema[s.filename], 'to ', targetpath(schema[s.filename]));
      const filename = targetpath(schema[s.filename]);
      const dirname = path.dirname(filename);

      const out = fs.readJSONSync(schema[s.filename]);
      if (schema[s.meta] && schema[s.meta].description) {
        // copy description from external file
        out.description = schema[s.meta].description;
      }
      if (schema.examples && Array.isArray(schema.examples) && schema.examples.length > 0) {
        // copy examples from external files
        out.examples = [...schema.examples];
      }
      fs.mkdirpSync(dirname);
      fs.writeJsonSync(filename, out);
    });
  };
}

module.exports = { writeSchema };
