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
const symbols = {
  pointer: Symbol('pointer'),
  filename: Symbol('filename'),
  id: Symbol('id'),
  titles: Symbol('titles'),
};

const handler = ({ root = '', filename = '.', schemas, parent}) => {
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
  }
  meta[symbols.titles] = (target) => {
    if (parent) {
      // if we can determine the parent titles
      // then we append our own
      return [...parent[symbols.titles], target.title];
    }
    // otherwise, it's just our own
    return [target.title];
  }

  return {
    ownKeys: target => Reflect.ownKeys(target),

    get: (target, prop, receiver) => {
      if (typeof meta[prop] === 'function') {
        return meta[prop](target, prop, receiver);
      }

      const retval = Reflect.get(target, prop, receiver);
      if (typeof retval === 'object') {
        //console.log('making new proxy from', target, prop, 'receiver', receiver[symbols.id]);
        const subschema = new Proxy(retval, handler({ 
          root: `${root}/${prop}`, 
          parent: receiver,
          filename, 
          schemas }));
        return subschema;
      }
      return retval;
    },
  };
};

module.exports = {
  ...symbols
}

module.exports.loader = () => {
  const schemas = {
    loaded: [],
    known: {}
  };

  return (schema, filename) => {
    const proxied = new Proxy(schema, handler({filename, schemas}));
    schemas.loaded.push(proxied);
    return proxied;
  };
}