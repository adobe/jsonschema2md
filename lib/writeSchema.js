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
import fs from 'fs-extra';
import path from 'path';
import s from './symbols.js';

/**
 * @typedef {import("../types/api").ExtendedJsonSchema} ExtendedJsonSchema
 */
/**
 * @typedef {import("../types/api").SchemaContent} SchemaContent
 */

/**
 * Write the JSON Schemas to filesystem or an object
 * @param {Object} options
 * @param {string} [options.schemadir] - (optional) Directory where the files will be saved
 * @param {string} [options.origindir] - (optional) Directory where the files were loaded from
 * @returns {(schemas: ExtendedJsonSchema[]) => SchemaContent[]}
 */
export default function writeSchema({ schemadir, origindir }) {
  return (schemas) => {
    // eslint-disable-next-line no-console
    console.log('preparing schemas');

    const realschemas = Object.values(schemas).filter((schema) => !schema[s.parent]);
    return realschemas.map((schema) => {
      const fileName = schema[s.filename];
      const inputPath = schema[s.fullpath] || (origindir && path.join(origindir, fileName));
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
      if (schemadir) {
        // eslint-disable-next-line no-console
        console.log('writing schemas to', schemadir);
        fullPath = path.resolve(schemadir, fileName);
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
