/*
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
// @ts-check
const { each, pairs } = require('ferrum');
const stringify = require('remark-stringify');
const unified = require('unified');
const gfm = require('remark-gfm');
const path = require('path');
const fs = require('fs-extra');
const yaml = require('js-yaml');
const s = require('./symbols');

/**
 * @typedef {import("../types/api").JsonSchema} JsonSchema
 */
/**
 * @typedef {import("../types/api").MarkdownAst} MarkdownAst
 */
/**
 * @typedef {import("../types/api").ExtendedMarkdownAst} ExtendedMarkdownAst
 */
/**
 * @typedef {import("../types/api").ReadmeMarkdownAst} ReadmeMarkdownAst
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
 * @returns {(astFiles: MarkdownAstFiles) => ExtendedMarkdownAst[]}
 */
function writeMarkdown({
  out, error, meta,
}) {
  const processor = unified()
    .use(gfm)
    .use(stringify);

  return (astFiles) => {
    /** @type {ExtendedMarkdownAst[]} */
    const output = [];
    each(pairs(astFiles), (tuple) => {
      /** @type {[ string, MarkdownAst ]} */
      const [name, markdownAst] = tuple;

      // add YAML frontmatter
      const content = (!meta ? '' : '---\n')
        + (!meta ? '' : yaml.dump(meta))
        + (!meta ? '' : '---\n\n')

        + processor.stringify(markdownAst);

      const filename = `${name}.md`;
      let outputPath;
      if (out) {
        outputPath = path.resolve(out, filename);
        try {
          fs.outputFileSync(outputPath, content);
        } catch (err) {
          error(err);
        }
        // info(`${filename} created`);
      }
      output.push({
        ...markdownAst,
        [s.filename]: filename,
        [s.outputcontent]: content,
        [s.outputpath]: outputPath,
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
 * @returns {(markdownAst: MarkdownAst) => ReadmeMarkdownAst}
 */
function writeReadme({
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

    const filename = 'README.md';
    let outputPath;
    if (out) {
      outputPath = path.resolve(out, filename);
      try {
        fs.outputFileSync(outputPath, content);
      } catch (err) {
        error(err);
      }
      info(`${filename} created`);
    }

    return {
      ...markdownAst,
      [s.outputcontent]: content,
      [s.filename]: filename,
      [s.outputpath]: outputPath,
    };
  };
}

module.exports = { writeMarkdown, writeReadme };
