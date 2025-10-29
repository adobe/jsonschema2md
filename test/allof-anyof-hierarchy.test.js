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
/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
import { assertMarkdown, traverseSchemas } from './testUtils.js';
import build from '../lib/markdownBuilder.js';

describe('Testing Markdown Builder: allOf/anyOf header hierarchy', () => {
  let results;

  before(async () => {
    const schemas = await traverseSchemas('allof-anyof-hierarchy');
    const builder = build({ header: true });
    results = builder(schemas);
  });

  it('allOf item schemas should use higher base level for proper hierarchy', () => {
    // The allOf[1] item is a composition schema within the docker property
    // It should use baseLevel = 2 (property depth) instead of 1
    const allof1Slug = 'schema-properties-tests-configuration-properties-docker-tests-allof-1';
    assertMarkdown(results[allof1Slug])
      .matches(/^## 1 Properties$/m) // Properties heading at level 2 (baseLevel)
      .matches(/^### preTestSteps/m) // Property detail at level 3 (baseLevel + 1)
      .matches(/^#### preTestSteps Type$/m); // Type section at level 4 (baseLevel + 1 + 1)
  });

  it('anyOf item schemas should use higher base level for proper hierarchy', () => {
    // The anyOf[1] item within allOf[0] is a composition schema
    // It should also use baseLevel = 2 (property depth) instead of 1
    const anyof1Slug = 'schema-properties-tests-configuration-properties-docker-tests-allof-test-options-anyof-steplist';
    assertMarkdown(results[anyof1Slug])
      .matches(/^## 1 Properties$/m) // Properties heading at level 2 (baseLevel)
      .matches(/^### testSteps/m) // Property detail at level 3 (baseLevel + 1)
      .matches(/^#### testSteps Type$/m); // Type section at level 4 (baseLevel + 1 + 1)
  });

  it('oneOf item schemas should use higher base level for proper hierarchy', () => {
    // The oneOf[0] item within kubernetes property is a composition schema
    // It should use baseLevel = 2 (property depth) instead of 1
    const oneof0Slug = 'schema-properties-tests-configuration-properties-kubernetes-tests-oneof-helm';
    assertMarkdown(results[oneof0Slug])
      .matches(/^## 0 Properties$/m) // Properties heading at level 2 (baseLevel)
      .matches(/^### helmChart/m) // Property detail at level 3 (baseLevel + 1)
      .matches(/^#### helmChart Type$/m); // Type section at level 4 (baseLevel + 1 + 1)
  });

  it('regular property schemas should still use baseLevel 1', () => {
    // Regular property schemas (not in composition constructs) should still use level 1
    const dockerSlug = 'schema-properties-tests-configuration-properties-docker-tests';
    assertMarkdown(results[dockerSlug])
      .matches(/^# Docker Tests Schema$/m) // Schema header at level 1
      .matches(/^## docker Type$/m); // Type section at level 2 (baseLevel 1 + 1)
  });
});
