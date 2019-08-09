/**
 * Copyright 2017 Adobe Systems Incorporated. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

var path = require('path');
var _ = require('lodash');
var logger = require('winston');
var readdirp = require('readdirp');
var Promise=require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
const markdownWriter=require('./markdownWriter');
const schemaWriter=require('./schemaWriter');
const readmeWriter=require('./readmeWriter');
var deff='#/definitions/';
var absUrlRegex = new RegExp('^(?:[a-z]+:)?//', 'i');
var pointer = require('json-pointer');
var smap; //TODO remove global
var sPath;
var wmap={};
function get$refType(refValue){
  var startpart = '', endpart = '', refType = '';
  var arr = refValue.split('#');
  if (arr.length > 1) {endpart=arr[1];}

  startpart=arr[0];
  //TODO yRelNoDef
  //relative-- yRelWithDef, yRelNoDef,
  //absolute-- yAbsWithDef, yAbsFSchema, yAbsWithFragment
  var refType='';
  var deff='/definitions/';

  //if( absUrlRegex.test(refVal) ){
  if (startpart.length > 1){
    if (startpart in smap){
      if (endpart.startsWith(deff)){
        refType = 'yAbsWithDef';
      } else {
        if (endpart.length === 0) {
          refType = 'yAbsFSchema';
        } else {
          refType = 'yAbsWithFragment';
        }
      }
    }
  } else {
    if (endpart.startsWith(deff)){
      refType = 'yRelWithDef';
    }
  }
  //  }
  return { startpart, endpart, refType };
}

function normaliseLinks(obj, refArr){
  let basepath = refArr.startpart ;
  let $linkVal = '', $linkPath = '';
  if (basepath in smap){
    let newpath = path.relative(path.dirname(sPath), smap[basepath].filePath).replace(/\\/g, '/'); //to cater windows paths
    let temp = newpath.slice(0, -5).split('/');
    $linkVal = obj['title'] ? obj['title'] : path.basename(newpath).slice(0, -5);
    $linkPath = temp.join('/')+'.md';
    return { $linkVal, $linkPath };
  }
}
var resolve$ref = Promise.method(function(val, base$id){
  let obj, link;
  if (!(base$id in wmap) ) {wmap[base$id] = {};}
  let refArr = get$refType(val['$ref']);
  if (refArr.refType === 'yRelWithDef'){
    refArr.startpart = base$id;
  }
  if (smap[refArr.startpart]){
    obj=smap[refArr.startpart].jsonSchema;
    if (refArr.refType !== 'yRelWithDef'){
      link = normaliseLinks(obj, refArr);
      if (!wmap[base$id][refArr.startpart]){
        wmap[base$id][refArr.startpart]=link;
      }

    }
    if (refArr.refType === 'yAbsFSchema'){
      val.type = link.$linkVal;
      val.$linkVal = link.$linkVal;
      val.$linkPath = link.$linkPath;
      return val;
    }

    if (pointer.has(obj, refArr.endpart)){
      var ischema = _.cloneDeep(pointer.get(obj, refArr.endpart));
      _.forOwn(val, (v, k) => {
        if (k !== '$ref'){
          ischema[k]=v;
        }
      });
      return processISchema(ischema, refArr.startpart);
    }
  }
});
var processFurther = Promise.method(function(val, key, $id){
  let base$id =$id;
  if (val['$ref']){
    return resolve$ref(val, base$id);
  } else {
    if (val['items'] && val['type'] === 'array'){
      if (val['items']['$ref']){
        resolve$ref(val['items']).then(s => {
          _.forOwn(s, (v, k) => {
            if (k !== '$ref'){
              val['items'][k]=v;
            }
          });
        });
      }
    } else if (val['properties'] && val['type'] === 'object') {
      _.each(_.entries(val['properties']), function(property) {
        const [ propertyKey, propertyValue ] = property;
        if (propertyValue['$ref']) {
          resolve$ref(propertyValue).then(s => {
            _.forOwn(s, (v, k) => {
              if (k !== '$ref'){
                val['properties'][propertyKey][k] = v;
              }
            });
          });
        } else {
          //type is object but property does not contain a $ref
          // go recursively down to check for a $ref
          return processFurther(propertyValue, propertyKey, base$id);
        }
      });

      return val;
    }
    //TODO if any other keyword
    return val;
  }
});
function processISchema() {}; // define w/ function so it gets hoisted and we avoid eslint errors about what is defined first: processISchema or resolve$ref. Both rely on each other!
processISchema = Promise.method(function(schema, base$id){
  if (!(base$id in wmap) ) {wmap[base$id] = {};}
  if (schema['anyOf'] || schema['oneOf']){
    // var $definitions=[]
    schema['type'] = schema['anyOf'] ? 'anyOf' : 'oneOf';
    let arr = schema['anyOf']? schema['anyOf'] : schema['oneOf'];
    _.each(arr, function(value, index) {
      if (value['$ref']){
        resolve$ref(value, base$id).then(piSchema => {
          delete arr[index];
          arr[index]=piSchema;
        });
      } else {
        processISchema(value, base$id).then(piSchema => {
          delete arr[index];
          arr[index]=piSchema;
        });
      }
    });
    //  schema["$definitions"] = $definitions;
    return schema;
  }

  if (schema['items'] ){

    let val=schema['items'];
    if (!schema['type']) {schema['type'] = 'array';}
    if (_.isArray(val)){
      //TODO

    } else {
      if (val['$ref']){
        resolve$ref(val, base$id).then(piSchema => {//check // not sending correct id
          schema['items']=piSchema;
        });
      } else {
        //TODO if such a scenario
      }
    }
  }
  // schema.$definitions = $definitions
  return schema;
});
function processSchema(schema){
  return new Promise((resolve, reject) => {
    if (!schema.properties) {schema.properties={};}
    var $id = schema['$id'] || schema['id'];
    var base$id = $id;
    if (!(base$id in wmap)) {wmap[base$id] = {};}
    if (schema['allOf']){
      _.each(schema['allOf'], function(value) {
        if (value['$ref']){
          let obj, link;
          var refArr = get$refType(value['$ref']);
          if (refArr.refType === 'yRelWithDef'){
            refArr.startpart = base$id;
          }
          if (smap[refArr.startpart]){
            obj=smap[refArr.startpart].jsonSchema;
            if (refArr.refType !== 'yRelWithDef'){
              link=normaliseLinks(obj, refArr);
              if (!wmap[base$id][refArr.startpart]){
                wmap[base$id][refArr.startpart]=link;
              }
            }

            if (pointer.has(obj, refArr.endpart)){
              var ischema = _.cloneDeep(pointer.get(obj, refArr.endpart));
              if (refArr.refType === 'yAbsFSchema'){
                processSchema(ischema).then(psSchema => {
                  if ( psSchema['properties'] ){
                    _.forOwn(psSchema['properties'], (val, key) => {
                      processFurther(val, key, refArr.startpart).then(pfSchema => {
                        if (pfSchema){
                          schema.properties[key] = pfSchema;
                          schema.properties[key].$oSchema={};
                          schema.properties[key].$oSchema.$linkVal=link.$linkVal;
                          schema.properties[key].$oSchema.$linkPath=link.$linkPath;

                          if (pfSchema['required']){
                            if (key in pfSchema['required']){
                              schema.required.push(key);
                            }
                          }
                        }

                      });

                    });
                  }
                });

              } else {
                if ( ischema['properties'] ){
                  _.forOwn(ischema['properties'], (val, key) => {
                    processFurther(val, key, refArr.startpart).then(pfSchema => {
                      if (pfSchema){
                        schema.properties[key] = pfSchema;
                        if (refArr.refType === 'yAbsWithDef'){
                          schema.properties[key].$oSchema={};
                          schema.properties[key].$oSchema.$linkVal=link.$linkVal;
                          schema.properties[key].$oSchema.$linkPath=link.$linkPath;

                        }
                        if (ischema['required']){
                          if (key in ischema['required']) {schema.required.push(key);}
                        }
                      } else {
                        reject('No further schema found');
                      }
                    });

                  });
                }

              }
            }

          }

        } else {

          _.forOwn(value, function(val, key){
            schema[key]=val;
            //
          });
          // TODO add properties if there // behaviour to be decided
        }

      });

      resolve(schema);
    } else if (schema['properties']){
      _.forOwn(schema['properties'], (val, key) => {
        processFurther(val, key, base$id).then(pfSchema => {
          if (pfSchema){
            schema.properties[key] = pfSchema;

            if (pfSchema['required']){
              if (key in pfSchema['required']){
                schema.required.push(key);
              }
            }
          }
        });
      });

      //TODO check if something missing left here
      resolve(schema);
    }

  });



  //generic $ref resolve present in top properties
}


var Schema=function(ajv, schemaMap){
  this._ajv = ajv;
  this._schemaPathMap=schemaMap;
};

Schema.resolveRef=function(key, obj, currpath){
  if (key === '$ref'){
    var refVal = obj[key];
    var temp;
    if ( absUrlRegex.test(refVal) ){
      let parsedUrl = refVal.split('#');
      let basepath = parsedUrl[0] ;
      if (basepath in this._schemaPathMap){
        let newpath = path.relative(path.dirname(currpath), this._schemaPathMap[basepath].filePath).replace(/\\/g, '/'); //to cater windows paths
        obj['$ref'] = newpath;
        temp = newpath.slice(0, -5).split('/');
        obj.$linkVal = path.basename(newpath).slice(0, -5);
        obj.$linkPath = temp.join('/')+'.md';
        //TODO display with title or file path name title
      } else {
        obj.$linkPath = refVal;
        temp = refVal.split('/');
        obj.$linkVal = temp.pop() || temp.pop();
      }

    } else if (refVal.startsWith(deff)) {
      obj.$linkVal = refVal.slice(deff.length);
      obj.$linkPath = '#'+obj.$linkVal.replace(/ /g, '-');
    } else if (refVal.endsWith('json')){
      temp = refVal.slice(0, -5).split('/');
      obj.$linkVal = temp[temp.length - 1];
      obj.$linkPath = temp.join('/')+'.md';
    }
  }
  if (key === 'anyOf' || key === 'oneOf' || key === 'allOf') {obj.$type=key;}

  return;
};

/* The following function does not seem to be used anymore!
var traverseSchema = function(object,schemaFilePath){
  return new Promise((resolve,reject) => {
    var recurse=function(curr,key,prev){
      if (key){
        if (key === 'anyOf' || key === 'oneOf' || key === 'allOf') {prev.$type=key;}
      }
      var result;
      if (Array.isArray(curr)) {curr.map((item,index) => recurse(item,index,curr));} else {
        (typeof curr === 'object') ? Object.keys(curr).map(key => recurse(curr[key],key,curr)):Schema.resolveRef(key,prev,schemaFilePath);
      }
      return object;
    };
    resolve(recurse(object));
  });
};
*/

Schema.getExamples = function(filePath, schema){
  var exampleFileNames=[];
  var examples=[];
  var dirname=path.dirname(filePath);
  var filename=path.basename(filePath, path.extname(filePath));
  filename=filename.split('.')[0]+'.example.*.json';
  return new Promise((resolve, reject) => {
    readdirp(dirname, { root: dirname, fileFilter: filename })
      .on('data', entry => exampleFileNames.push(entry.fullPath))
      .on('end', () => resolve(exampleFileNames))
      .on('error', err => reject(err));
  }).then(exampleFileNames => {
    if (exampleFileNames.length > 0){
      var validate=this._ajv.compile(schema);
      return Promise.map(exampleFileNames, entry => {
        return fs.readFileAsync(entry).then(example => {
          var data = JSON.parse(example.toString());
          var valid = validate(data);
          if (valid) {examples.push({ filename: entry, data: data });} else {logger.error(entry+' is an invalid Example');}
        });
      }).then(() => {
        // Sort according to filenames in order not to have random prints
        examples.sort(function(a, b) {
          return a.filename > b.filename ? 1 : -1;
        });
        logger.error(examples);
        examples = examples.map(function(element) {return element.data; });
        schema.examples=examples;
        return schema;
      });
    } else {return schema;}
  });
};

Schema.getDescription = function(filePath, schema){

  var temp=path.basename(filePath, path.extname(filePath));
  //TODO should err be thrown here?
  temp=temp.split('.')[0]+'.description.md';
  return fs.readFileAsync(path.resolve(path.dirname(filePath), temp), 'utf8')
    .then(description => {
      schema.description=description;
      return schema;
    })
    .catch(() => {
      return schema;
    });

};

Schema.setAjv=function(ajv){
  this._ajv=ajv;
};

Schema.setSchemaPathMap=function(schemaMap){
  this._schemaPathMap=schemaMap;
};
/**
 * Loads a schema file for processing into a given target directory
 * @param {*} schemaMap
 * @param {*} schemaPath
 * @param {string} docDir - where documentation will be generated
 * @param {string} schemaDir - where schemas will be generated, if not set, no schema's will be output
 * @param {map} metaElements - a map of additional YAML frontmatter to be added to the generated Markdown
 * @param {boolean} readme - generate a README.md directory listing
 * @param {map} docs - a map of documentation links for headers
 */
Schema.process = function(schemaMap, schemaPath, docDir, schemaDir, metaElements, readme, docs, consoleArgs) {
  smap=schemaMap;
  let keys = Object.keys(schemaMap);
  return Promise.mapSeries(keys, schemaKey => {

    var props = Object.keys(wmap);
    for (var i = 0; i < props.length; i++) {
      delete wmap[props[i]];
    }


    let schema = schemaMap[schemaKey].jsonSchema;
    sPath = schemaMap[schemaKey].filePath;
    return Schema.getExamples(schemaMap[schemaKey].filePath, schema)
      .then(egsSchema => Schema.getDescription(schemaMap[schemaKey].filePath, egsSchema))
      .then(allSchema => {
        var schemaClone = _.cloneDeep(allSchema);
        //   return Promise.props({
        //     wSchema:schemaClone,
        //     mSchema:traverseSchema(allSchema,schemaMap[schemaKey].filePath)
        //   })
        return  processSchema(schemaClone).then(mSchema => {
          mSchema.metaElements=metaElements;
          return { mSchema:mSchema, wSchema:allSchema, dep:wmap };
        });
      }).then(object => {
        const outputTasks = [ markdownWriter(schemaMap[schemaKey].filePath, object.mSchema, schemaPath, docDir, object.dep, docs, consoleArgs) ];
        if (schemaDir !== '') {
          outputTasks.push(schemaWriter(schemaMap[schemaKey].filePath, object.wSchema, schemaPath, schemaDir));
        }
        return Promise.all(outputTasks);
      }).catch(err => {
        logger.error('Error occured in processing schema at path %s', sPath);
        logger.error(err); // should we exit here or allow processing of other schemas?
        process.exit(1);
      });
  }).then(result => {
    if (readme) {
      console.log('Output processed. Trying to make a README.md now');
      const markdowns = result.map(r => { return r[0];});
      return readmeWriter(markdowns, schemaMap, docDir, schemaPath);
    } else {
      console.log('Output processed.');
    }
  });

};


module.exports = Schema;
