export default function build({ header, links, includeProperties, rewritelinks, exampleFormat, skipProperties, }?: {
    header: any;
    links?: {};
    includeProperties?: any[];
    rewritelinks?: (x: any) => any;
    exampleFormat?: string;
    skipProperties?: any[];
}): (schemas: any) => any;
