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

// Reads a schema file and modifies a schema path map object based on the schema file.
// Returns the schema path map object.
/**
 * Reads the schema file specified at `fullPath` and accumulates a
 * `map` of schema file paths and schema contents in `schemaPathMap`.
 * Typically, this function is used in a `reduce` pattern.
 * @param {map} schemaPathMap - the map of schema paths and JSON schemas
 * @param {*} fullPath - the full path to the schema
 */
module.exports = function readSchemaFile(schemaPathMap, fullPath) {
  if (!schemaPathMap) {
    schemaPathMap = {};
  }
  return fs.readFileAsync(fullPath)
    .then((data) => {
      const schema = JSON.parse(data);
      const obj = {};
      obj.filePath = fullPath;
      obj.jsonSchema = schema;
      if (schema.$id && schema.$id.length > 0) {
        if (!schemaPathMap[schema.$id]) {
          schemaPathMap[schema.$id] = obj;
        }
      // TODO err
      // TODO check Missing Specific properties to throw warning // function for warning
      } else {
        console.warn(`schema ${fullPath} has no $id`);
        schemaPathMap[fullPath] = obj;
      }
      return schemaPathMap;
    });
};
