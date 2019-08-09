/*
 * Copyright 2018 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

module.exports = {
  'env': {
    'node': true,
    'es6': true
  },
  // this is the root project for all sub modules. stop searching for any
  // eslintrc files in parent directories.
  'root': true,
  'parserOptions': {
    'sourceType': 'script',
    'ecmaVersion': 10,
  },
  'plugins': [
    'header',
  ],
  'extends': 'airbnb',
  'rules': {
    'strict': 0,

    // Forbid multiple statements in one line
    'max-statements-per-line': ["error", { "max": 1 }],

    // Allow for-of loops
    'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'],

    // Allow return before else & redundant else statements
    'no-else-return': 'off',

    // allow dangling underscores for 'fields'
    'no-underscore-dangle': ['error', {'allowAfterThis': true}],

    // enforce license header (todo: improve plugin to support patterns for multi-lines)
    'header/header': [2, 'block', ['',
      ' * Copyright 2019 Adobe. All rights reserved.',
      ' * This file is licensed to you under the Apache License, Version 2.0 (the "License");',
      ' * you may not use this file except in compliance with the License. You may obtain a copy',
      ' * of the License at http://www.apache.org/licenses/LICENSE-2.0',
      ' *',
      ' * Unless required by applicable law or agreed to in writing, software distributed under',
      ' * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS',
      ' * OF ANY KIND, either express or implied. See the License for the specific language',
      ' * governing permissions and limitations under the License.',
      ' ',
    ]]
  }
};
