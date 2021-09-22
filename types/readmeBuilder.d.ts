export = build;
/**
 * Generate the README.md
 * @param {object} opts
 */
declare function build({ readme }: object): (schemas: any) => import("unist").Parent;
