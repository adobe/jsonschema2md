export default function formatmeta(schema: any): {
    longcomment: import("remark-stringify/node_modules/@types/mdast").Root;
    shortcomment: any;
    comment: string;
    longdescription: import("remark-stringify/node_modules/@types/mdast").Root;
    shortdescription: any;
    description: any;
    abstract: boolean;
    extensible: boolean;
    status: any;
    identifiable: string;
    custom: boolean;
    additional: boolean;
    definedin: {
        text: any;
        link: any;
    };
    restrictions: string;
};
