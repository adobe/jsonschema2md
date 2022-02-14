/**
 * Generate the README.md
 * @param {object} opts
 */
export default function build({ readme }: object): (schemas: any) => import("unist").Parent<import("unist").Node<import("unist").Data>, import("unist").Data>;
