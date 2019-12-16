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
const { list } = require('ferrum');

function sflat(arr) {
  return arr.reduce((p, v) => {
    if (Array.isArray(v)) {
      return [...p, ...v];
    }
    return [...p, v];
  }, []);
}

/**
 * Traverses a (proxied) JSON schema. This is a less opinionated
 * and tighter traversal.
 * @param {*} schema
 */
function traverseSchema(schema) {
  if (Array.isArray(schema)) {
    return sflat(schema.map(traverseSchema));
  } else if (schema && typeof schema === 'object') {
    return sflat([schema, ...Object.values(schema).map(traverseSchema)]);
  }
  return [];
}

/**
 * Traverses a Schema node (containing a JSON Schema) to find sub-schemas,
 * which are then emitted as asequence.
 * @param {Schema} node
 */
function traverse(schemas) {
  return sflat(list(schemas).map(traverseSchema));
}

module.exports = traverse;
module.exports.traverseSchema = traverseSchema;
