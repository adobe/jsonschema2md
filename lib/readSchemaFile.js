/**
 * Copyright 2017 Adobe Systems Incorporated. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

var Promise=require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

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
    .then(data => {
      let schema = JSON.parse(data);
      let obj = {};
      obj.filePath = fullPath;
      obj.jsonSchema = schema;
      if (schema['$id'] && schema['$id'].length > 0) {
        if (!schemaPathMap[schema['$id']]) {
          schemaPathMap[schema['$id']] = obj;
        }
      // TODO err
      //TODO check Missing Specific properties to throw warning // function for warning
      } else {
        console.warn('schema ' + fullPath + ' has no $id');
        schemaPathMap[fullPath] = obj;
      }
      return schemaPathMap;
    });
};
