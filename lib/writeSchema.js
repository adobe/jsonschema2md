/**
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
// @ts-check
const fs = require('fs-extra');
const path = require('path');
const s = require('./symbols');

/**
 * @typedef {import("../types/api").ExtendedJsonSchema} ExtendedJsonSchema
 */
/**
 * @typedef {import("../types/api").SchemaContent} SchemaContent
 */

/**
 * Write the JSON Schemas to filesystem or an object
 * @param {Object} options
 * @param {string} [options.schemaDir] - (optional) Directory where the files will be saved
 * @param {string} [options.originDir] - (optional) Directory where the files were loaded from
 * @returns {(schemas: ExtendedJsonSchema[]) => SchemaContent[]}
 */
function writeSchema({ schemaDir, originDir }) {
  return (schemas) => {
    // eslint-disable-next-line no-console
    console.log('preparing schemas');

    const realSchemas = Object.values(schemas).filter((schema) => !schema[s.parent]);
    return realSchemas.map((schema) => {
      const fileName = schema[s.filename];
      const inputPath = schema[s.fullpath] || (originDir && path.join(originDir, fileName));
      let content = schema;

      if (inputPath) {
        content = fs.readJsonSync(inputPath);
        if (schema[s.meta] && schema[s.meta].description) {
          // copy description from external file
          content.description = schema[s.meta].description;
        }
        if (schema.examples && Array.isArray(schema.examples) && schema.examples.length > 0) {
          // copy examples from external files
          content.examples = [...schema.examples];
        }
      }

      let fullPath;
      if (schemaDir) {
        // eslint-disable-next-line no-console
        console.log('writing schemas to', schemaDir);
        fullPath = path.resolve(schemaDir, fileName);
        fs.outputJsonSync(fullPath, content);
      }

      return {
        fileName,
        fullPath,
        content,
      };
    });
  };
}

module.exports = { writeSchema };
