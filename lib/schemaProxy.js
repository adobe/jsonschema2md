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
const ghslugger = require('github-slugger');
const path = require('path');
const { URL } = require('url');
const { formatmeta } = require('./formatInfo');
const symbols = require('./symbols');
const { keyword } = require('./keywords');

const myslug = Symbol('myslug');

function loadExamples(file, num = 1) {
  const examplefile = path.resolve(path.dirname(file), path.basename(file).replace(/\..*$/, `.example.${num}.json`));
  try {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const example = require(examplefile);
    return [example, ...loadExamples(file, num + 1)];
  } catch {
    return [];
  }
}

const handler = ({
  root = '', filename = '.', schemas, parent, slugger,
}) => {
  const meta = {};

  meta[symbols.parent] = () => parent;
  meta[symbols.pointer] = () => root;
  meta[symbols.filename] = () => filename;
  meta[symbols.id] = (target) => {
    // if the schema has it's own ID, use it
    if (target[keyword`$id`]) {
      return target[keyword`$id`];
    }
    if (parent) {
      // if we can determine the parent ID (by walking up the tree, use it)
      return parent[symbols.id];
    }
    return undefined;
  };
  meta[symbols.titles] = (target) => {
    if (parent) {
      // if we can determine the parent titles
      // then we append our own
      return [...parent[symbols.titles], target.title];
    }
    // otherwise, it's just our own
    if (typeof target.title === 'string') {
      return [target[keyword`title`]];
    }
    return [];
  };

  meta[symbols.resolve] = (target, prop, receiver) => (proppath) => {
    // console.log('trying to resolve', proppath, 'in', receiver[symbols.filename]);
    if (proppath === undefined) {
      return receiver;
    }
    const [head, ...tail] = typeof proppath === 'string' ? proppath.split('/') : proppath;
    if ((head === '' || head === undefined) && tail.length === 0) {
      return receiver;
    } else if (head === '' || head === undefined) {
      return receiver[symbols.resolve](tail);
    }
    return receiver[head] ? receiver[head][symbols.resolve](tail) : undefined;
  };

  meta[symbols.slug] = (target, prop, receiver) => {
    if (!receiver[myslug] && !parent && receiver[symbols.filename]) {
      // eslint-disable-next-line no-param-reassign
      receiver[myslug] = slugger.slug(path.basename(receiver[symbols.filename]).replace(/\..*$/, ''));
    }
    if (!receiver[myslug]) {
      const parentslug = parent[symbols.slug];
      const { title } = receiver;
      const name = receiver[symbols.pointer].split('/').pop();
      if (typeof title === 'string') {
        // eslint-disable-next-line no-param-reassign
        receiver[myslug] = slugger.slug(`${parentslug}-${title || name}`);
      } else {
        // eslint-disable-next-line no-param-reassign
        receiver[myslug] = slugger.slug(`${parentslug}-${name}`);
      }
    }
    return receiver[myslug];
  };

  meta[symbols.meta] = (target, prop, receiver) => formatmeta(receiver);

  return {
    ownKeys: (target) => Reflect.ownKeys(target),

    get: (target, prop, receiver) => {
      if (typeof meta[prop] === 'function') {
        return meta[prop](target, prop, receiver);
      }

      const retval = Reflect.get(target, prop, receiver);
      if (retval === undefined && prop === keyword`examples` && !receiver[symbols.parent]) {
        return loadExamples(receiver[symbols.filename], 1);
      }
      if (typeof retval === 'object' && retval !== null) {
        if (retval[keyword`$ref`]) {
          const [uri, pointer] = retval.$ref.split('#');
          // console.log('resolving ref', uri, pointer, 'from', receiver[symbols.filename]);
          const basedoc = uri || receiver[symbols.id];
          let referenced = null;

          // $ref is a URI-reference so basedoc might be an id URI or it might be a path

          if (schemas.known[basedoc]) {
            referenced = schemas.known[basedoc][symbols.resolve](pointer);
          } else if (path.parse(basedoc)) {
            const basepath = path.dirname(meta[symbols.filename]());
            let reldoc = uri;

            // if uri is a URI then only try to resolve it locally if the scheme is 'file:'
            try {
              const urlinfo = new URL(uri);
              if (urlinfo.protocol === 'file:') {
                reldoc = uri.replace(/^file:\/\//, '');
              } else {
                reldoc = null;
              }
            } catch (err) {
              // console.log('Error parsing URL - ' + uri);
            }

            if (reldoc) {
              const refpath = path.resolve(basepath, reldoc);

              if (schemas.files[refpath]) {
                referenced = schemas.files[refpath][symbols.resolve](pointer);
              }
            }
          }

          if (referenced !== null) {
            // inject the referenced schema into the current schema
            Object.assign(retval, referenced);
          } else {
            console.error('cannot resolve', basedoc);
          }
        } else if (retval[symbols.filename]) {
          // console.log('I am in a loop!');
          return retval;
        }

        // console.log('making new proxy from', target, prop, 'receiver', receiver[symbols.id]);
        const subschema = new Proxy(retval, handler({
          root: `${root}/${prop}`,
          parent: receiver,
          filename,
          schemas,
          slugger,
        }));

        if (subschema[keyword`$id`]) {
          // stow away the schema for lookup
          // eslint-disable-next-line no-param-reassign
          schemas.known[subschema[keyword`$id`]] = subschema;
        }
        return subschema;
      }
      return retval;
    },
  };
};

module.exports = {
  ...symbols,
};

module.exports.loader = () => {
  const schemas = {
    loaded: [],
    known: {},
    files: {},
  };

  const slugger = ghslugger();

  return (schema, filename) => {
    // console.log('loading', filename);
    const proxied = new Proxy(schema, handler({ filename, schemas, slugger }));
    schemas.loaded.push(proxied);
    if (proxied[keyword`$id`]) {
      // stow away the schema for lookup
      schemas.known[proxied[keyword`$id`]] = proxied;
    }

    schemas.files[filename] = proxied;

    return proxied;
  };
};
