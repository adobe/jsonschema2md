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
const i18n = require('es2015-i18n-tag').default;
const s = require('./symbols');

function gentitle(titles, type) {
  if (!Array.isArray(titles)) {
    return i18n`Untitled schema`;
  }
  const [firsttitle] = titles;
  const lasttitle = [...titles].pop();

  if (titles.length === 1 && firsttitle !== undefined) {
    return firsttitle;
  }
  if (lasttitle) {
    return lasttitle;
  }
  if (typeof type === 'string') {
    return i18n`Untitled ${type} in ${String(firsttitle)}`;
  }
  if (firsttitle === undefined) {
    return i18n`Untitled schema`;
  }
  return i18n`Untitled undefined type in ${firsttitle}`;
}

function gendescription(schema) {
  return (schema && schema[s.meta]) ? schema[s.meta].shortdescription : '';
}

module.exports = {
  gentitle, gendescription,
};
