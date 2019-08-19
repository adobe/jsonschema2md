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

/* eslint-disable no-param-reassign, no-use-before-define */

const path = require('path');
const _ = require('lodash');
const readdirp = require('readdirp');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const pointer = require('json-pointer');
const { error, info } = require('@adobe/helix-log');
const markdownWriter = require('./markdownWriter');
const schemaWriter = require('./schemaWriter');
const readmeWriter = require('./readmeWriter');

const deff = '#/definitions/';
const absUrlRegex = new RegExp('^(?:[a-z]+:)?//', 'i');

let smap; // TODO remove global
let sPath;
const wmap = {};
function get$refType(refValue) {
  let startpart = '';
  let endpart = '';
  let refType = '';
  const arr = refValue.split('#');
  if (arr.length > 1) {
    // eslint-disable-next-line prefer-destructuring
    endpart = arr[1];
  }

  // eslint-disable-next-line prefer-destructuring
  startpart = arr[0];

  // if( absUrlRegex.test(refVal) ){
  if (startpart.length > 1) {
    if (startpart in smap) {
      if (endpart.startsWith('/definitions/')) {
        refType = 'yAbsWithDef';
      } else if (endpart.length === 0) {
        refType = 'yAbsFSchema';
      } else {
        refType = 'yAbsWithFragment';
      }
    }
  } else if (endpart.startsWith('/definitions/')) {
    refType = 'yRelWithDef';
  }
  //  }
  return { startpart, endpart, refType };
}

function normaliseLinks(obj, refArr) {
  const basepath = refArr.startpart;
  let $linkVal = '';
  let $linkPath = '';
  if (basepath in smap) {
    const newpath = path.relative(path.dirname(sPath), smap[basepath].filePath).replace(/\\/g, '/'); // to cater windows paths
    const temp = newpath.slice(0, -5).split('/');
    $linkVal = obj.title ? obj.title : path.basename(newpath).slice(0, -5);
    $linkPath = `${temp.join('/')}.md`;
    return { $linkVal, $linkPath };
  } else {
    return undefined;
  }
}
const resolve$ref = Promise.method((val, base$id) => {
  let obj;
  let link;
  if (!(base$id in wmap)) {
    wmap[base$id] = {};
  }
  const refArr = get$refType(val.$ref);
  if (refArr.refType === 'yRelWithDef') {
    refArr.startpart = base$id;
  }
  if (smap[refArr.startpart]) {
    obj = smap[refArr.startpart].jsonSchema;
    if (refArr.refType !== 'yRelWithDef') {
      link = normaliseLinks(obj, refArr);
      if (!wmap[base$id][refArr.startpart]) {
        wmap[base$id][refArr.startpart] = link;
      }
    }
    if (refArr.refType === 'yAbsFSchema') {
      val.type = link.$linkVal;
      val.$linkVal = link.$linkVal;
      val.$linkPath = link.$linkPath;
      return val;
    }

    if (pointer.has(obj, refArr.endpart)) {
      const ischema = _.cloneDeep(pointer.get(obj, refArr.endpart));
      _.forOwn(val, (v, k) => {
        if (k !== '$ref') {
          ischema[k] = v;
        }
      });
      return processISchema(ischema, refArr.startpart);
    }
  }
  return undefined;
});
const processFurther = Promise.method((val, key, $id) => {
  const base$id = $id;
  if (val.$ref) {
    return resolve$ref(val, base$id);
  } else {
    if (val.items && val.type === 'array') {
      if (val.items.$ref) {
        resolve$ref(val.items).then((s) => {
          _.forOwn(s, (v, k) => {
            if (k !== '$ref') {
              val.items[k] = v;
            }
          });
        });
      }
    } else if (val.properties && val.type === 'object') {
      _.each(_.entries(val.properties), (property) => {
        const [propertyKey, propertyValue] = property;
        if (propertyValue.$ref) {
          resolve$ref(propertyValue).then((s) => {
            _.forOwn(s, (v, k) => {
              if (k !== '$ref') {
                val.properties[propertyKey][k] = v;
              }
            });
          });
        } else {
          // type is object but property does not contain a $ref
          // go recursively down to check for a $ref
          return processFurther(propertyValue, propertyKey, base$id);
        }
        return undefined;
      });

      return val;
    }
    // TODO if any other keyword
    return val;
  }
});
const processISchema = Promise.method((schema, base$id) => {
  if (!(base$id in wmap)) {
    wmap[base$id] = {};
  }
  if (schema.anyOf || schema.oneOf) {
    // var $definitions=[]
    schema.type = schema.anyOf ? 'anyOf' : 'oneOf';
    const arr = schema.anyOf ? schema.anyOf : schema.oneOf;
    _.each(arr, (value, index) => {
      if (value.$ref) {
        resolve$ref(value, base$id).then((piSchema) => {
          delete arr[index];
          arr[index] = piSchema;
        });
      } else {
        processISchema(value, base$id).then((piSchema) => {
          delete arr[index];
          arr[index] = piSchema;
        });
      }
    });
    //  schema["$definitions"] = $definitions;
    return schema;
  }

  if (schema.items) {
    const val = schema.items;
    if (!schema.type) {
      schema.type = 'array';
    }
    if (val.$ref && !_.isArray(val)) {
      resolve$ref(val, base$id).then((piSchema) => { // check // not sending correct id
        schema.items = piSchema;
      });
    }
  }
  // schema.$definitions = $definitions
  return schema;
});
function processSchema(schema) {
  return new Promise((resolve, reject) => {
    if (!schema.properties) {
      schema.properties = {};
    }
    const $id = schema.$id || schema.id;
    const base$id = $id;
    if (!(base$id in wmap)) {
      wmap[base$id] = {};
    }
    if (schema.allOf) {
      _.each(schema.allOf, (value) => {
        if (value.$ref) {
          let obj;
          let link;
          const refArr = get$refType(value.$ref);
          if (refArr.refType === 'yRelWithDef') {
            refArr.startpart = base$id;
          }
          if (smap[refArr.startpart]) {
            obj = smap[refArr.startpart].jsonSchema;
            if (refArr.refType !== 'yRelWithDef') {
              link = normaliseLinks(obj, refArr);
              if (!wmap[base$id][refArr.startpart]) {
                wmap[base$id][refArr.startpart] = link;
              }
            }

            if (pointer.has(obj, refArr.endpart)) {
              const ischema = _.cloneDeep(pointer.get(obj, refArr.endpart));
              if (refArr.refType === 'yAbsFSchema') {
                processSchema(ischema).then((psSchema) => {
                  if (psSchema.properties) {
                    _.forOwn(psSchema.properties, (val, key) => {
                      processFurther(val, key, refArr.startpart).then((pfSchema) => {
                        if (pfSchema) {
                          schema.properties[key] = pfSchema;
                          schema.properties[key].$oSchema = {};
                          schema.properties[key].$oSchema.$linkVal = link.$linkVal;
                          schema.properties[key].$oSchema.$linkPath = link.$linkPath;

                          if (pfSchema.required) {
                            if (key in pfSchema.required) {
                              schema.required.push(key);
                            }
                          }
                        }
                      });
                    });
                  }
                });
              } else if (ischema.properties) {
                _.forOwn(ischema.properties, (val, key) => {
                  processFurther(val, key, refArr.startpart).then((pfSchema) => {
                    if (pfSchema) {
                      schema.properties[key] = pfSchema;
                      if (refArr.refType === 'yAbsWithDef') {
                        schema.properties[key].$oSchema = {};
                        schema.properties[key].$oSchema.$linkVal = link.$linkVal;
                        schema.properties[key].$oSchema.$linkPath = link.$linkPath;
                      }
                      if (ischema.required) {
                        if (key in ischema.required) {
                          schema.required.push(key);
                        }
                      }
                    } else {
                      reject(new Error('No further schema found'));
                    }
                  });
                });
              }
            }
          }
        } else {
          _.forOwn(value, (val, key) => {
            schema[key] = val;
            //
          });
          // TODO add properties if there // behaviour to be decided
        }
      });

      resolve(schema);
    } else if (schema.properties) {
      _.forOwn(schema.properties, (val, key) => {
        processFurther(val, key, base$id).then((pfSchema) => {
          if (pfSchema) {
            schema.properties[key] = pfSchema;

            if (pfSchema.required) {
              if (key in pfSchema.required) {
                schema.required.push(key);
              }
            }
          }
        });
      });

      // TODO check if something missing left here
      resolve(schema);
    }
  });


  // generic $ref resolve present in top properties
}


const Schema = (ajv, schemaMap) => {
  this._ajv = ajv;
  this._schemaPathMap = schemaMap;
};

Schema.resolveRef = (key, obj, currpath) => {
  if (key === '$ref') {
    const refVal = obj[key];
    let temp;
    if (absUrlRegex.test(refVal)) {
      const parsedUrl = refVal.split('#');
      const basepath = parsedUrl[0];
      if (basepath in this._schemaPathMap) {
        const newpath = path.relative(path.dirname(currpath), this._schemaPathMap[basepath].filePath).replace(/\\/g, '/'); // to cater windows paths
        obj.$ref = newpath;
        temp = newpath.slice(0, -5).split('/');
        obj.$linkVal = path.basename(newpath).slice(0, -5);
        obj.$linkPath = `${temp.join('/')}.md`;
        // TODO display with title or file path name title
      } else {
        obj.$linkPath = refVal;
        temp = refVal.split('/');
        obj.$linkVal = temp.pop() || temp.pop();
      }
    } else if (refVal.startsWith(deff)) {
      obj.$linkVal = refVal.slice(deff.length);
      obj.$linkPath = `#${obj.$linkVal.replace(/ /g, '-')}`;
    } else if (refVal.endsWith('json')) {
      temp = refVal.slice(0, -5).split('/');
      obj.$linkVal = temp[temp.length - 1];
      obj.$linkPath = `${temp.join('/')}.md`;
    }
  }
  if (key === 'anyOf' || key === 'oneOf' || key === 'allOf') {
    obj.$type = key;
  }
};

// TODO: For some exceedingly strange reason this generates test failures
// when an arrow function is used…
// eslint-disable-next-line func-names
Schema.getExamples = function (filePath, schema) {
  const exampleFileNames = [];
  let examples = [];
  const dirname = path.dirname(filePath);
  let filename = path.basename(filePath, path.extname(filePath));
  filename = `${filename.split('.')[0]}.example.*.json`;
  return new Promise((resolve, reject) => {
    readdirp(dirname, { root: dirname, fileFilter: filename })
      .on('data', entry => exampleFileNames.push(entry.fullPath))
      .on('end', () => resolve(exampleFileNames))
      .on('error', err => reject(err));
  }).then(() => {
    if (exampleFileNames.length > 0) {
      const validate = this._ajv.compile(schema);
      return Promise.map(exampleFileNames, entry => fs.readFileAsync(entry).then((example) => {
        const data = JSON.parse(example.toString());
        const valid = validate(data);
        if (valid) {
          examples.push({ filename: entry, data });
        } else {
          error(`${entry} is an invalid Example`);
        }
      })).then(() => {
        // Sort according to filenames in order not to have random prints
        examples.sort((a, b) => (a.filename > b.filename ? 1 : -1));
        error(examples);
        examples = examples.map(element => element.data);
        schema.examples = examples;
        return schema;
      });
    } else {
      return schema;
    }
  });
};

Schema.getDescription = (filePath, schema) => {
  let temp = path.basename(filePath, path.extname(filePath));
  // TODO should err be thrown here?
  temp = `${temp.split('.')[0]}.description.md`;
  return fs.readFileAsync(path.resolve(path.dirname(filePath), temp), 'utf8')
    .then((description) => {
      schema.description = description;
      return schema;
    })
    .catch(() => schema);
};

// TODO: For some exceedingly strange reason this generates test failures
// when an arrow function is used…
// eslint-disable-next-line func-names
Schema.setAjv = function (ajv) {
  this._ajv = ajv;
};

// TODO: For some exceedingly strange reason this generates test failures
// when an arrow function is used…
// eslint-disable-next-line func-names
Schema.setSchemaPathMap = function (schemaMap) {
  this._schemaPathMap = schemaMap;
};
/**
 * Loads a schema file for processing into a given target directory
 * @param {*} schemaMap
 * @param {*} schemaPath
 * @param {string} docDir - where documentation will be generated
 * @param {string} schemaDir - where schemas will be generated, if not set, no schema's
 *   will be output
 * @param {map} metaElements - a map of additional YAML frontmatter to be added to
 *   the generated Markdown
 * @param {boolean} readme - generate a README.md directory listing
 * @param {map} docs - a map of documentation links for headers
 */
Schema.process = (schemaMap, schemaPath, docDir, schemaDir,
  metaElements, readme, docs, consoleArgs) => {
  smap = schemaMap;
  const keys = Object.keys(schemaMap);
  return Promise.mapSeries(keys, (schemaKey) => {
    const props = Object.keys(wmap);
    for (let i = 0; i < props.length; i += 1) {
      delete wmap[props[i]];
    }


    const schema = schemaMap[schemaKey].jsonSchema;
    sPath = schemaMap[schemaKey].filePath;
    return Schema.getExamples(schemaMap[schemaKey].filePath, schema)
      .then(egsSchema => Schema.getDescription(schemaMap[schemaKey].filePath, egsSchema))
      .then((allSchema) => {
        const schemaClone = _.cloneDeep(allSchema);
        //   return Promise.props({
        //     wSchema:schemaClone,
        //     mSchema:traverseSchema(allSchema,schemaMap[schemaKey].filePath)
        //   })
        return processSchema(schemaClone).then((mSchema) => {
          mSchema.metaElements = metaElements;
          return { mSchema, wSchema: allSchema, dep: wmap };
        });
      }).then((object) => {
        const outputTasks = [
          markdownWriter(
            schemaMap[schemaKey].filePath,
            object.mSchema,
            schemaPath,
            docDir,
            object.dep,
            docs,
            consoleArgs,
          ),
        ];
        if (schemaDir !== '') {
          outputTasks.push(
            schemaWriter(
              schemaMap[schemaKey].filePath,
              object.wSchema,
              schemaPath,
              schemaDir,
            ),
          );
        }
        return Promise.all(outputTasks);
      })
      .catch((err) => {
        error('Error occured in processing schema at path %s', sPath);
        error(err); // should we exit here or allow processing of other schemas?
        process.exit(1);
      });
  }).then((result) => {
    if (readme) {
      info('Output processed. Trying to make a README.md now');
      const markdowns = result.map(r => r[0]);
      return readmeWriter(markdowns, schemaMap, docDir, schemaPath);
    } else {
      return undefined;
    }
  });
};


module.exports = Schema;
