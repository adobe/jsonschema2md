declare module "symbols" {
    export = symbols;
    /**
     * @typedef {import("../types/api").UniqueSymbols} UniqueSymbols
     */
    /**
     * @type {UniqueSymbols}
     * */
    const symbols: UniqueSymbols;
    namespace symbols {
        export { UniqueSymbols };
    }
    type UniqueSymbols = import("../types/api").UniqueSymbols;
}
declare module "traverseSchema" {
    export = traverse;
    /**
     * Traverses a Schema node (containing a JSON Schema) to find sub-schemas,
     * which are then emitted as asequence.
     * @param {Schema} node
     */
    function traverse(schemas: any): any[];
}
declare module "formattingTools" {
    export function gentitle(titles: any, type: any): any;
    export function gendescription(schema: any): any;
}
declare module "keywords" {
    export function keyword(str: any): any;
    export function report(): Set<any>;
}
declare module "markdownBuilder" {
    export = build;
    function build({ header, links, includeProperties, rewriteLinks, exampleFormat, skipProperties, }?: {
        header: any;
        links?: {};
        includeProperties?: any[];
        rewriteLinks?: (x: any) => any;
        exampleFormat?: string;
        skipProperties?: any[];
    }): (schemas: any) => any;
}
declare module "writeMarkdown" {
    export type JsonSchema = import("../types/api").JsonSchema;
    export type MarkdownAst = import("../types/api").MarkdownAst;
    export type ExtendedMarkdownAst = import("../types/api").ExtendedMarkdownAst;
    export type ReadmeMarkdownAst = import("../types/api").ReadmeMarkdownAst;
    export type MarkdownAstFiles = {
        [name: string]: import("mdast").Root;
    };
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
    export function writeMarkdown({ out, error, meta, }: {
        out?: string;
        error?: Function;
        info?: Function;
        debug?: Function;
        meta?: {
            [key: string]: string;
        };
    }): (astFiles: MarkdownAstFiles) => ExtendedMarkdownAst[];
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
    export function writeReadme({ out, error, info, meta, }: {
        out?: string;
        error?: Function;
        info?: Function;
        debug?: Function;
        meta?: {
            [key: string]: string;
        };
    }): (markdownAst: MarkdownAst) => ReadmeMarkdownAst;
}
declare module "readmeBuilder" {
    export = build;
    /**
     * Generate the README.md
     * @param {object} opts
     */
    function build({ readme }: object): (schemas: any) => import("unist").Parent;
}
declare module "formatInfo" {
    export function formatmeta(schema: any): {
        longcomment: import("unist").Node;
        shortcomment: any;
        comment: string;
        longdescription: import("unist").Node;
        shortdescription: any;
        description: any;
        abstract: boolean;
        extensible: boolean;
        status: any;
        identifiable: string;
        custom: boolean;
        additional: boolean;
        definedin: {
            text: any;
            link: any;
        };
        restrictions: string;
    };
}
declare module "schemaProxy" {
    const _exports: {
        pointer: unique symbol;
        filename: unique symbol;
        inputpath: unique symbol;
        outputcontent: unique symbol;
        outputpath: unique symbol;
        id: unique symbol;
        titles: unique symbol;
        resolve: unique symbol;
        slug: unique symbol;
        meta: unique symbol;
        parent: unique symbol;
        loader: () => (name: any, schema: any) => any;
    };
    export = _exports;
    export function loader(): (name: any, schema: any) => any;
}
declare module "writeSchema" {
    export type JsonSchema = import("../types/api").JsonSchema;
    export type ExtendedJsonSchema = import("../types/api").ExtendedJsonSchema;
    /**
     * @typedef {import("../types/api").JsonSchema} JsonSchema
     */
    /**
     * @typedef {import("../types/api").ExtendedJsonSchema} ExtendedJsonSchema
     */
    /**
     * Write the JSON Schemas to filesystem or an object
     * @param {Object} options
     * @param {string} [options.schemaDir] - (optional) Directory where the files will be saved
     * @returns {(schemas: JsonSchema[]) => ExtendedJsonSchema[]}
     */
    export function writeSchema({ schemaDir }: {
        schemaDir?: string;
    }): (schemas: JsonSchema[]) => ExtendedJsonSchema[];
}
declare module "index" {
    export type JsonSchema = import("../types/api").JsonSchema;
    export type SchemaFiles = import("../types/api").SchemaFiles;
    export type GeneratedOutput = import("../types/api").GeneratedOutput;
    /**
     * @typedef {import("../types/api").JsonSchema} JsonSchema
     */
    /**
     * @typedef {import("../types/api").SchemaFiles} SchemaFiles
     */
    /**
     * @typedef {import("../types/api").GeneratedOutput} GeneratedOutput
     */
    /**
     * Public API for jsonschema2md that can be used to turn JSON Schema files
     * into readable Markdown documentation.
     * @param {JsonSchema | SchemaFiles} schema JSON Schema input to get data from
     * @param {Object} options Additional options for generation
     * @param {string} [options.schemaPath] - (optional) Path to directory containing all JSON Schemas
     * or a single JSON Schema file. This will be considered as the baseURL.
     * @param {string} [options.outDir] - (optional) Path to output directory. Generating files will
     * be skipped if directory is not specified.
     * @param {{ [key:string]: string }} [options.metadata] - (optional) Add metadata elements to
     * .md files.
     * @param {string} [options.schemaOut] - (optional) Output JSON Schema files including
     * description and validated examples in the specified folder.
     * @param {boolean} [options.includeReadme=true] - (optional) Generate a README.md file in the
     * output directory.
     * @param {{ [key:string]: string }[]} [options.links] - (optional) Add this file as a link
     * explaining the specified attribute.
     * @param {string} [options.i18n="locales/"] - (optional) Path to a locales folder with
     * JSON files used for internationalization.
     * @param {"en_US" | "de"} [options.language="en_US"] - (optional) Selected language.
     * @param {"json" | "yaml"} [options.exampleFormat="json"] - (optional) How to format examples.
     * @param {string[]} [options.includeProperties=[]] - (optional) Name of custom properties
     * which should be also in the description of an element.
     * @param {boolean} [options.header=true] - (optional) Whether or not to include the header
     * in markdown.
     * @param {string[]} [options.skipProperties=[]] - (optional) Name of a default property to
     * skip in markdown.
     * @returns {GeneratedOutput} List of raw markdown that were generated from input schema.
     */
    export function jsonschema2md(schema: JsonSchema | SchemaFiles, { schemaPath, outDir, metadata, schemaOut, includeReadme, links, i18n, language, exampleFormat, includeProperties, header, skipProperties, }: {
        schemaPath?: string;
        outDir?: string;
        metadata?: {
            [key: string]: string;
        };
        schemaOut?: string;
        includeReadme?: boolean;
        links?: {
            [key: string]: string;
        }[];
        i18n?: string;
        language?: "en_US" | "de";
        exampleFormat?: "json" | "yaml";
        includeProperties?: string[];
        header?: boolean;
        skipProperties?: string[];
    }): GeneratedOutput;
    export function main(args: any): Promise<number>;
}
