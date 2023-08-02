/**
 * @typedef {import("../types/api.js").MarkdownAst} MarkdownAst
 */
/**
 * @typedef {import("../types/api.js").MarkdownContent} MarkdownContent
 */
/**
 * @typedef {import("../types/api.js").ReadmeContent} ReadmeContent
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
export function writemarkdown({ out, error, meta, }: {
    out?: string;
    error?: Function;
    info?: Function;
    debug?: Function;
    meta?: {
        [key: string]: string;
    };
}): (astFiles: MarkdownAstFiles) => MarkdownContent[];
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
export function writereadme({ out, error, info, meta, }: {
    out?: string;
    error?: Function;
    info?: Function;
    debug?: Function;
    meta?: {
        [key: string]: string;
    };
}): (markdownAst: MarkdownAst) => ReadmeContent;
export type MarkdownAst = import("../types/api.js").MarkdownAst;
export type MarkdownContent = import("../types/api.js").MarkdownContent;
export type ReadmeContent = import("../types/api.js").ReadmeContent;
export type MarkdownAstFiles = {
    [name: string]: import("mdast").Root;
};
