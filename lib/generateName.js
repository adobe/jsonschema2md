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
const { foldl } = require('ferrum');
const GithubSlugger = require('github-slugger');
const { formatname } = require('./formatname');

/**
 * Turns a sequence of schemas into an object, using a human and
 * machine readable name as the key
 * @param {Schema[]} schemas
 */
function generatenames(schemas) {
  const slugger = new GithubSlugger();

  return foldl(schemas, {}, (container, schema) => {
    const name = {};
    name[slugger.slug(formatname(schema))] = schema;
    return Object.assign(container, name);
  });
}

module.exports = generatenames;
