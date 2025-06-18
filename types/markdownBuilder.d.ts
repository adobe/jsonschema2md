export default function build({ header, links, includeProperties, rewritelinks, exampleFormat, skipProperties, }?: {
    links?: {};
    includeProperties?: any[];
    rewritelinks?: (x: any) => any;
    exampleFormat?: string;
    skipProperties?: any[];
}): (schemas: any) => any;
