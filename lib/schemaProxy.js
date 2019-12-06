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

const symbols = {
  pointer: Symbol('pointer'),
  filename: Symbol('filename'),
  id: Symbol('id'),
  titles: Symbol('titles'),
  resolve: Symbol('resolve'),
  slug: Symbol('slug'),
};

const myslug = Symbol('myslug');

const handler = ({
  root = '', filename = '.', schemas, parent, slugger,
}) => {
  const meta = {};

  meta[symbols.pointer] = () => root;
  meta[symbols.filename] = () => filename;
  meta[symbols.id] = (target) => {
    // if the schema has it's own ID, use it
    if (target.$id) {
      return target.$id;
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
    return [target.title];
  };

  meta[symbols.resolve] = (target, prop, receiver) => (path) => {
    const [head, ...tail] = typeof path === 'string' ? path.split('/') : path;
    if ((head === '' || head === undefined) && tail.length === 0) {
      return receiver;
    } else if (head === '' || head === undefined) {
      return receiver[symbols.resolve](tail);
    } else {
      return receiver[head][symbols.resolve](tail);
    }
  };

  meta[symbols.slug] = (target, prop, receiver) => {
    if (!receiver[myslug] && !parent && receiver[symbols.filename]) {
      receiver[myslug] = slugger.slug(receiver[symbols.filename].replace(/\..*$/, ''));
    }
    if (!receiver[myslug]) {
      const parentslug = parent[symbols.slug];
      const title = receiver.title;
      const name = receiver[symbols.pointer].split('/').pop();
      receiver[myslug] = slugger.slug(parentslug + '-' + (title ? title : name));
    }
    return receiver[myslug];
  };

  return {
    ownKeys: target => Reflect.ownKeys(target),

    get: (target, prop, receiver) => {
      if (typeof meta[prop] === 'function') {
        return meta[prop](target, prop, receiver);
      }

      const retval = Reflect.get(target, prop, receiver);
      if (typeof retval === 'object') {
        if (retval.$ref) {
          const [uri, pointer] = retval.$ref.split('#');
          const basedoc = uri || receiver[symbols.id];
          if (schemas.known[basedoc]) {
            const referenced = schemas.known[basedoc][symbols.resolve](pointer);
            // inject the referenced schema into the current schema
            Object.assign(retval, referenced);
          } else {
            console.error('cannot resolve', basedoc);
          }
        }

        // console.log('making new proxy from', target, prop, 'receiver', receiver[symbols.id]);
        const subschema = new Proxy(retval, handler({
          root: `${root}/${prop}`,
          parent: receiver,
          filename,
          schemas,
          slugger,
        }));

        if (subschema.$id) {
          // stow away the schema for lookup
          // eslint-disable-next-line no-param-reassign
          schemas.known[subschema.$id] = subschema;
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
  };

  const slugger = ghslugger();

  return (schema, filename) => {
    const proxied = new Proxy(schema, handler({ filename, schemas, slugger }));
    schemas.loaded.push(proxied);
    if (proxied.$id) {
      // stow away the schema for lookup
      schemas.known[proxied.$id] = proxied;
    }
    return proxied;
  };
};
