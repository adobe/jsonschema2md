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
// eslint-disable-next-line import/no-extraneous-dependencies
import { exportTranslationKeys } from 'i18n-tag-schema';
import fs from 'fs-extra';

exportTranslationKeys({ rootPath: './lib' })
  .then((result) => {
    const translations = fs.readJsonSync('./lib/locales/en_US.json');

    translations.translations = result.reduce((transl, key) => {
      if (!transl[key]) {
        // eslint-disable-next-line no-param-reassign
        transl[key] = key;
      }
      return transl;
    }, translations.translations);

    fs.writeJsonSync('./lib/locales/en_US.json', translations, { spaces: 2 });
  })
  .catch((err) => {
    console.error(err.message);
  });
