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
import { each, pairs } from 'ferrum';
import stringify from 'remark-stringify';
import { unified } from 'unified';
import gfm from 'remark-gfm';
import path from 'path';
import fs from 'fs-extra';
import yaml from 'js-yaml';

/**
 * @typedef {import("../types/api").MarkdownAst} MarkdownAst
 */
/**
 * @typedef {import("../types/api").MarkdownContent} MarkdownContent
 */
/**
 * @typedef {import("../types/api").ReadmeContent} ReadmeContent
 */
/**
 * @typedef {{ [name: string]: MarkdownAst }} MarkdownAstFiles
 */

/**
 * Write the Markdown to filesystem or an object
 * @param {Object} options
 * @param {string} [options.out] - (optional) Directory where the files will be saved
 * @param {Function} [options.error] - (optional) Error logger
 * @param {Function} [options.info] - (optional) Info logger
 * @param {Function} [options.debug] - (optional) Debug logger
 * @param {{ [key: string]: string }} [options.meta] - (optional) Metadata to be added to Markdown
 * @returns {(astFiles: MarkdownAstFiles) => MarkdownContent[]}
 */
export function writemarkdown({
  out, error, meta,
}) {
  const processor = unified()
    .use(gfm)
    .use(stringify);

  return (schemas) => {
    /** @type {MarkdownContent[]} */
    const output = [];
    each(pairs(schemas), (tuple) => {
      /** @type {[ string, MarkdownAst ]} */
      const [name, markdownAst] = tuple;

      // add YAML frontmatter
      const content = (!meta ? '' : '---\n')
        + (!meta ? '' : yaml.dump(meta))
        + (!meta ? '' : '---\n\n')

        + processor.stringify(markdownAst);

      const fileName = `${name}.md`;
      let fullPath;
      if (out) {
        fullPath = path.resolve(out, fileName);
        try {
          fs.outputFileSync(fullPath, content);
        } catch (err) {
          error(err);
        }
        // info(`${fileName} created`);
      }
      output.push({
        fileName,
        fullPath,
        markdownAst,
        content,
      });
    });

    return output;
  };
}

/**
 * Write the Readme Markdown to filesystem or an object
 * @param {Object} options
 * @param {string} [options.out] - (optional) Directory where the files will be saved
 * @param {Function} [options.error] - (optional) Error logger
 * @param {Function} [options.info] - (optional) Info logger
 * @param {Function} [options.debug] - (optional) Debug logger
 * @param {{ [key: string]: string }} [options.meta] - (optional) Metadata to be added to Markdown
 * @returns {(markdownAst: MarkdownAst) => ReadmeContent}
 */
export function writereadme({
  out, error, info, meta,
}) {
  const processor = unified()
    .use(gfm)
    .use(stringify);

  return (markdownAst) => {
    // add YAML frontmatter
    const content = (!meta ? '' : '---\n')
      + (!meta ? '' : yaml.dump(meta))
      + (!meta ? '' : '---\n\n')

      + processor.stringify(markdownAst);

    const fileName = 'README.md';
    let fullPath;
    if (out) {
      fullPath = path.resolve(out, fileName);
      try {
        fs.outputFileSync(fullPath, content);
      } catch (err) {
        error(err);
      }
      info(`${fileName} created`);
    }

    return {
      fileName,
      fullPath,
      markdownAst,
      content,
    };
  };
}
