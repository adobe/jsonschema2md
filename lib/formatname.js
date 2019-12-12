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
const { keyword } = require('./keywords');

function formatname({ schema, root }) {
  if (schema[keyword`title`]) {
    return schema[keyword`title`];
  } else if (schema[keyword`type`] && typeof schema[keyword`type`] === 'string') {
    if (root) {
      return `Untitled ${schema[keyword`type`]} from ${formatname({ schema: root })}`;
    }
    return `Untitled ${schema[keyword`type`]}`;
  } else if (root) {
    return `Untitled Schema from ${formatname({ schema: root })}`;
  }
  return 'Untitled Schema';
}
exports.formatname = formatname;
