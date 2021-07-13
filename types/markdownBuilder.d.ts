export = build;
declare function build({ header, links, includeProperties, rewriteLinks, exampleFormat, skipProperties, }?: {
    header: any;
    links?: {};
    includeProperties?: any[];
    rewriteLinks?: (x: any) => any;
    exampleFormat?: string;
    skipProperties?: any[];
}): (schemas: any) => any;
