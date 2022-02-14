/**
 * @typedef {import("../types/api").ExtendedJsonSchema} ExtendedJsonSchema
 */
/**
 * @typedef {import("../types/api").SchemaContent} SchemaContent
 */
/**
 * Write the JSON Schemas to filesystem or an object
 * @param {Object} options
 * @param {string} [options.schemadir] - (optional) Directory where the files will be saved
 * @param {string} [options.origindir] - (optional) Directory where the files were loaded from
 * @returns {(schemas: ExtendedJsonSchema[]) => SchemaContent[]}
 */
export default function writeSchema({ schemadir, origindir }: {
    schemadir?: string;
    origindir?: string;
}): (schemas: ExtendedJsonSchema[]) => SchemaContent[];
export type ExtendedJsonSchema = import("../types/api").ExtendedJsonSchema;
export type SchemaContent = import("../types/api").SchemaContent;
