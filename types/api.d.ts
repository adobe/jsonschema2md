/*
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
import { JSONSchema4, JSONSchema6, JSONSchema7 } from "json-schema";
import { Root } from "mdast";
import { filename, inputpath, outputcontent, outputpath } from "../lib/symbols";

export type UniqueSymbols = {
    readonly pointer: unique symbol;
    readonly filename: unique symbol;
    readonly inputpath: unique symbol;
    readonly outputcontent: unique symbol;
    readonly outputpath: unique symbol;
    readonly id: unique symbol;
    readonly titles: unique symbol;
    readonly resolve: unique symbol;
    readonly slug: unique symbol;
    readonly meta: unique symbol;
    readonly parent: unique symbol;
};

export type JsonSchema = JSONSchema4 | JSONSchema6 | JSONSchema7;
export type SchemaFiles = {
    [name: string]: string | JsonSchema;
};
export type ExtendedJsonSchema = JsonSchema & {
    [filename]: string;
    [inputpath]?: string;
    [outputpath]?: string;
};

export type MarkdownAst = Root;
export type ExtendedMarkdownAst = MarkdownAst & {
    [filename]: string;
    [outputcontent]: string;
    [outputpath]?: string;
};
export type ReadmeMarkdownAst = ExtendedMarkdownAst & {
    [filename]: "README.md";
};

/**
 * GeneratedOutput
 */
export type GeneratedOutput = {
    /**
     * Input JSON schemas
     */
    schema: ExtendedJsonSchema[];
    /**
     * Ouput Readme file
     */
    readme: ReadmeMarkdownAst;
    /**
     * Output markdown data
     */
    markdown: ExtendedMarkdownAst[];
};
