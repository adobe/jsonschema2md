/**
 * Generate the README.md
 * @param {object} opts
 * @returns {function(Array): import('unist').Parent|null}
 */
export default function build({ readme }: object): (arg0: any[]) => import("unist").Parent | null;
