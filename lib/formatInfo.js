/*
 * Copyright 2019 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
import fs from 'fs';
import path from 'path';
import { unified } from 'unified';
import parse from 'remark-parse';
import gfm from 'remark-gfm';
import { toString as stringify } from 'mdast-util-to-string';
import s from './symbols.js';
import { keyword } from './keywords.js';

function isabstract(schema) {
  return schema.definitions !== undefined
    && (!schema[keyword`properties`] || Object.keys(schema[keyword`properties`]).length === 0);
}

function isextensible(schema) {
  return schema.definitions !== undefined || schema[keyword`meta:extensible`] === true;
}

function isidentifiable(schema) {
  if (!schema[keyword`properties`]) {
    return 'undefined';
  }
  if (schema[keyword`properties`][keyword`@id`] && schema[keyword`properties`][keyword`@id`][keyword`type`] === 'string' && schema[keyword`properties`][keyword`@id`].format === 'uri') {
    return 'true';
  } else {
    return 'false';
  }
}

function iscustom(schema) {
  return [...(schema[keyword`allOf`] || [])]
    .filter((e) => typeof e === 'object')
    .filter((e) => typeof e.$ref === 'string')
    .filter(({ $ref }) => $ref === 'https://ns.adobe.com/xdm/common/extensible.schema.json#/definitions/@context')
    .length > 0;
}

function getdefined(schema) {
  if (schema[s.parent]) {
    return {
      text: `${schema[s.filename]}*`,
      link: schema[s.fullpath],
    };
  }
  return {
    text: schema[s.filename],
    link: schema[s.fullpath],
  };
}

function plaindescription(schema) {
  try {
    if (schema[s.fullpath] && !schema[s.parent]) {
      const fullPath = path.resolve(
        path.dirname(schema[s.fullpath]),
        schema[s.filename].replace(/\..*$/, '.description.md'),
      );
      const longdesc = fs.readFileSync(fullPath);
      return longdesc.toString();
    }
  } catch {
    return schema[keyword`description`] || '';
  }
  return schema[keyword`description`] || '';
}

function shorten(str) {
  return str.split('\n')[0].split('.')[0];
}

const parser = unified()
  .use(gfm)
  .use(parse);

function parsedescription(str) {
  const markdown = parser.parse(str);
  return {
    longdescription: markdown,
    shortdescription: shorten(stringify(markdown)),
    description: str,
  };
}

function parsecomment(str = '') {
  const markdown = parser.parse(str);
  return {
    longcomment: markdown,
    shortcomment: shorten(stringify(markdown)),
    comment: str,
  };
}

function getstatus(schema) {
  if (schema[keyword`deprecated`] === true) {
    return 'deprecated';
  }
  return schema[keyword`meta:status`] || undefined;
}

function getrestrictions(schema) {
  if (schema[keyword`readOnly`] === true && schema[keyword`writeOnly`] === true) {
    return 'secret';
  } else if (schema[keyword`readOnly`] === true) {
    return 'readOnly';
  } else if (schema[keyword`writeOnly`] === true) {
    return 'writeOnly';
  }
  return undefined;
}

export default function formatmeta(schema) {
  return {
    abstract: isabstract(schema),
    extensible: isextensible(schema),
    status: getstatus(schema),
    identifiable: isidentifiable(schema),
    custom: iscustom(schema),
    additional: schema[keyword`additionalProperties`] !== false,
    definedin: getdefined(schema),
    restrictions: getrestrictions(schema),
    ...parsedescription(plaindescription(schema)),
    ...parsecomment(schema[keyword`$comment`]),
  };
}
