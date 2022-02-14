/**
 * @typedef {import("../types/api").JsonSchema} JsonSchema
 */
/**
 * @typedef {import("../types/api").SchemaList} SchemaList
 */
/**
 * @typedef {import("../types/api").SchemaContent} SchemaContent
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
export function jsonschema2md(schema: JsonSchema | import("../types/api").SchemaFiles, options: {
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
/**
 * Main function used in the CLI.
 * @param {{ [key:string]: unknown }} args CLI arguments from user input
 * @returns The generated Markdown files to the specified output directory
 */
export function main(args: {
    [key: string]: unknown;
}): Promise<number>;
export type JsonSchema = import("../types/api").JsonSchema;
export type SchemaList = import("../types/api").SchemaList;
export type SchemaContent = import("../types/api").SchemaContent;
export type SchemaFiles = import("../types/api").SchemaFiles;
export type GeneratedOutput = import("../types/api").GeneratedOutput;
