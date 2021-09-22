export = traverse;
/**
 * Traverses a Schema node (containing a JSON Schema) to find sub-schemas,
 * which are then emitted as asequence.
 * @param {Schema} node
 */
declare function traverse(schemas: any): any[];
