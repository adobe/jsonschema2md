declare const _exports: {
    pointer: unique symbol;
    filename: unique symbol;
    fullpath: unique symbol;
    id: unique symbol;
    titles: unique symbol;
    resolve: unique symbol;
    slug: unique symbol;
    meta: unique symbol;
    parent: unique symbol;
    loader: () => (name: string, schema: any) => any;
};
export = _exports;
export function loader(): (name: string, schema: any) => any;
