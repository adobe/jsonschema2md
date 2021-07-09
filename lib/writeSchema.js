/*
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
 * @typedef {import("../types/api").JsonSchema} JsonSchema
 */
/**
 * @typedef {import("../types/api").ExtendedJsonSchema} ExtendedJsonSchema
 */

/**
 * Write the JSON Schemas to filesystem or an object
 * @param {Object} options
 * @param {string} [options.schemaDir] - (optional) Directory where the files will be saved
 * @returns {(schemas: JsonSchema[]) => ExtendedJsonSchema[]}
 */
function writeSchema({ schemaDir }) {
  return (schemas) => {
    console.log('preparing schemas');

    const realSchemas = Object.values(schemas).filter((schema) => !schema[s.parent]);
    return realSchemas.map((schema) => {
      let content = { ...schema };
      const filename = content[s.filename];
      const inputPath = content[s.inputpath];

      if (inputPath && inputPath !== '.') {
        content = fs.readJsonSync(inputPath);
        if (content[s.meta] && schema[s.meta].description) {
          // copy description from external file
          content.description = schema[s.meta].description;
        }
        if (schema.examples && Array.isArray(schema.examples) && schema.examples.length > 0) {
          // copy examples from external files
          content.examples = [...schema.examples];
        }
      }

      let outputPath;
      if (schemaDir) {
        console.log('writing schemas to', schemaDir);
        outputPath = path.resolve(schemaDir, filename);
        fs.outputJsonSync(outputPath, content);
      }
      return {
        ...content,
        [s.filename]: filename,
        [s.inputpath]: inputPath,
        [s.outputpath]: outputPath,
      };
    });
  };
}

module.exports = { writeSchema };
