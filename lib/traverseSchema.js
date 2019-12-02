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
const {
  iter, pipe, map,
} = require('ferrum');

const arrayKeywords = [
  'allOf',
  'anyOf',
  'items',
  'oneOf',
];

const propertyKeywords = [
  'definitions',
  'dependencies',
  'patternProperties',
  'properties',
];

const ignoreKeywords = [
  'const',
  'default',
  'enum',
  'exclusiveMaximum',
  'exclusiveMinimum',
  'format',
  'maximum',
  'maxItems',
  'maxLength',
  'maxProperties',
  'minimum',
  'minItems',
  'minLength',
  'minProperties',
  'multipleOf',
  'pattern',
  'required',
  'uniqueItems',
];

module.exports = (node, recurse) => {
  const { schema } = node;
  console.log('flattening', schema.title);
  return pipe(
    // turn the schema object into a sequence of key value pairs
    iter(schema),
    map(([key, subschema]) => {
      console.log('inspecting', key, typeof subschema);
      if (Array.isArray(subschema) && arrayKeywords.includes(key)) {
        // descend into the array
        return pipe(
          iter(subschema),
          map(subsubschema => ({
            schema: subsubschema,
            // TODO add additional properties for tracking
          }),
          recurse),
        );
      }
      if (subschema && typeof subschema === 'object' && propertyKeywords.includes(key)) {
        // descend into the object
        return pipe(
          iter(subschema),
          map(([_, subsubschema]) => ({
            schema: subsubschema,
            // TODO add additional properties for tracking
          }),
          recurse),
        );
      }
      if (subschema && typeof subschema === 'object' && !ignoreKeywords.includes(key)) {
        // this could be a schema, too
        return recurse([{
          schema: subschema,
          // TODO add additional properties for tracking
        }]);
      }
      return [];
    }),
  );
};
