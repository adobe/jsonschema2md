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
const { parent } = require('./symbols');

function reducer({ seen, ids }, schema) {
  if (schema
    && schema[parent]
    && (seen.has(schema) || (schema.$id && ids.indexOf(schema.$id) >= 0))) {
    return { seen, ids };
  } else if (Array.isArray(schema)) {
    return schema.reduce(reducer, { seen, ids });
  } else if (schema && typeof schema === 'object') {
    seen.add(schema);
    if (schema.$id) {
      ids.push(schema.$id);
    }
    return [...Object.values(schema)].reduce(reducer, { seen, ids });
  }

  return { seen, ids };
}

/**
 * Traverses a Schema node (containing a JSON Schema) to find sub-schemas,
 * which are then emitted as asequence.
 * @param {Schema} node
 */
function traverse(schemas) {
  return Array.from(list(schemas).reduce(reducer, { seen: new Set(), ids: [] }).seen);
}

module.exports = traverse;
