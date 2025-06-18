/*
 * Copyright 2025 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
import { defineConfig, globalIgnores } from '@eslint/config-helpers'
import { recommended, source, test } from '@adobe/eslint-config-helix';

export default defineConfig([
  globalIgnores([
    '.vscode/*',
    'coverage/*',
  ]),
  {
    rules: {
      strict: 0,

      // Forbid multiple statements in one line
      'max-statements-per-line': ['error', { max: 1 }],

      // Allow for-of loops
      'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'],

      // Allow return before else & redundant else statements
      'no-else-return': 'off',

      // allow dangling underscores for 'fields'
      'no-underscore-dangle': 'off',

      // Allow marking variables unused using a underscore at the start
      'no-unused-vars': ['error', {
        varsIgnorePattern: '^_.*$',
        argsIgnorePattern: '^_.*$',
        caughtErrorsIgnorePattern: '^_.*$',
        caughtErrors: 'none',
      }],

      'import/no-named-as-default-member': 0,
      'default-param-last': 0,
    },
    plugins: {
      import: recommended.plugins.import,
    },
    extends: [recommended],
  },
  source,
  test,
]);
