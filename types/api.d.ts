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
import { filename, fullpath } from "../lib/symbols.js";

export type UniqueSymbols = {
    readonly pointer: unique symbol;
    readonly filename: unique symbol;
    readonly fullpath: unique symbol;
    readonly id: unique symbol;
    readonly titles: unique symbol;
    readonly resolve: unique symbol;
    readonly slug: unique symbol;
    readonly meta: unique symbol;
    readonly parent: unique symbol;
};

export type JsonSchema = JSONSchema4 | JSONSchema6 | JSONSchema7;
export type SchemaList = {
    fileName: string;
    fullPath: string;
};
export type SchemaContent = {
    fileName: string;
    fullPath?: string;
    content: JsonSchema;
};
export type SchemaFiles = (SchemaList | SchemaContent)[];
export type ExtendedJsonSchema = JsonSchema & {
    [filename]: string;
    [fullpath]?: string;
};

export type MarkdownAst = Root;
export type MarkdownContent = {
    fileName: string;
    fullPath: string;
    markdownAst?: MarkdownAst;
    content?: string;
};
export type ReadmeContent = MarkdownContent & {
    fileName: "README.md";
};

/**
 * GeneratedOutput
 */
export type GeneratedOutput = {
    /**
     * Input JSON schemas
     */
    schema: SchemaContent[];
    /**
     * Ouput Readme file
     */
    readme?: ReadmeContent;
    /**
     * Output markdown data
     */
    markdown: MarkdownContent[];
};
