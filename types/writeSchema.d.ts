export type ExtendedJsonSchema = import("../types/api").ExtendedJsonSchema;
export type SchemaContent = import("../types/api").SchemaContent;
/**
 * @typedef {import("../types/api").ExtendedJsonSchema} ExtendedJsonSchema
 */
/**
 * @typedef {import("../types/api").SchemaContent} SchemaContent
 */
/**
 * Write the JSON Schemas to filesystem or an object
 * @param {Object} options
 * @param {string} [options.schemaDir] - (optional) Directory where the files will be saved
 * @param {string} [options.originDir] - (optional) Directory where the files were loaded from
 * @returns {(schemas: ExtendedJsonSchema[]) => SchemaContent[]}
 */
export function writeSchema({ schemaDir, originDir }: {
    schemaDir?: string;
    originDir?: string;
}): (schemas: ExtendedJsonSchema[]) => SchemaContent[];
