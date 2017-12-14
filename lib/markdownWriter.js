/**
 * Copyright 2017 Adobe Systems Incorporated. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

const writeFile = require('./writeFiles');
var Promise=require('bluebird');
var path = require('path');
var _ = require('lodash');
var ejs = require('ejs');
const pejs = Promise.promisifyAll(ejs);
var validUrl = require('valid-url');

function render([ template, context ]) {
  return pejs.renderFileAsync(template, context, { debug: false });
}

function build(total, fragment) {
  return total + fragment.replace(/\n\n/g, '\n');
}

function assoc(obj, key, value) {
  if (obj==null) {
    return assoc({}, key, value);
  }
  obj[key] = value;
  return obj;
}

function custom(schema) {
  if (schema.allOf) {
    for (let i=0; i<schema.allOf.length; i++) {
      if (schema.allOf[i].$ref && schema.allOf[i].$ref === 'https://ns.adobe.com/xdm/common/extensible.schema.json#/definitions/@context') {
        return true;
      }
    }
  }
  return false;
}

function schemaProps(schema, schemaPath, filename) {
  return {
    // if there are definitions, but no properties
    abstract: (schema.definitions !== undefined && _.keys(schema.properties).length === 0) ? 'Cannot be instantiated' : 'Can be instantiated',
    extensible: (schema.definitions !== undefined || schema['meta:extensible'] === true) ? 'Yes' : 'No',
    custom: custom(schema) ? 'Allowed' : 'Forbidden',
    original: filename.substr(schemaPath.length).substr(1),
  };
}

function flatten(dependencies) {
  let deps = [];
  if (dependencies) {
    const key = _.keys(dependencies)[0];
    deps = _.toPairs(dependencies[key]).map(([ first, second ]) => {
      second.$id = first;
      return second;
    });
  }
  return deps;
}

function stringifyExamples(examples) {
  if (examples) {
    if (typeof examples === 'string') {
      examples = [ examples ];
    }
    //console.log(examples);
    return examples.map(example => {
      return JSON.stringify(example, null, 2);
    });
  } else {
    return false;
  }
}

function simpletype(prop) {
  const type = prop.type;
  if (prop.enum!==undefined) {
    prop.simpletype = '`enum`';
    if (prop['meta:enum']===undefined) {
      prop['meta:enum'] = {};
    }
    for (let i=0;i<prop.enum.length;i++) {
      if (prop['meta:enum'][prop.enum[i]]===undefined) {
        //setting an empty description for each unknown enum
        prop['meta:enum'][prop.enum[i]] = '';
      }
    }
  } else if (prop.const!==undefined) {
    prop.simpletype = '`const`';
  } else if (type==='string') {
    prop.simpletype = '`string`';
  } else if (type==='number') {
    prop.simpletype = '`number`';
  } else if (type==='boolean') {
    prop.simpletype = '`boolean`';
  } else if (type==='integer') {
    prop.simpletype = '`integer`';
  } else if (type==='object') {
    prop.simpletype = '`object`';
  } else if (type==='array') {
    if (prop.items!==undefined) {
      const innertype = simpletype(prop.items);
      if (innertype.simpletype==='complex') {
        prop.simpletype = '`array`';
      } else {
        prop.simpletype = innertype.simpletype.replace(/`$/, '[]`');
      }
      console.log();
    } else {
      prop.simpletype = '`array`';
    }
  } else {
    prop.simpletype = 'complex';
  }
  return prop;
}

function requiredProperties(properties, required) {
  if (required) {
    for (let i=0;i<required.length;i++) {
      if (properties[required[i]]) {
        properties[required[i]].required = true;
      }
    }
  }
  return _.mapValues(properties, simpletype);
}

const generateMarkdown = function(filename, schema, schemaPath, outDir, dependencyMap) {
  var ctx = {
    schema: schema,
    _: _,
    validUrl: validUrl,
    dependencyMap:dependencyMap
  };

  console.log(filename);
  //console.log(dependencyMap);

  // this structure allows us to have separate templates for each element. Instead of having
  // one huge template, each block can be built individually
  let multi = [
    [ 'frontmatter.ejs', { meta: schema.metaElements } ],
    [ 'header.ejs', {
      schema: schema,
      dependencies: flatten(dependencyMap),
      props: schemaProps(schema, schemaPath, filename) } ],
    //[ 'divider.ejs', null ],
    //[ 'topSchema.ejs', ctx ],
    [ 'examples.ejs', { examples: stringifyExamples(schema.examples), title: schema.title } ]
  ];

  if (_.keys(schema.properties).length > 0) {
    multi.push([ 'properties.ejs', { props: requiredProperties(schema.properties, schema.required), title: schema.title } ]);
    for (let i=0; i<_.keys(schema.properties).length;i++) {
      multi.push( [ 'property.ejs', {
        name: _.keys(schema.properties)[i],
        required: schema.required ? schema.required.includes(_.keys(schema.properties)[i]) : false,
        examples: stringifyExamples(schema.properties[_.keys(schema.properties)[i]]['examples']),
        schema: simpletype(schema.properties[_.keys(schema.properties)[i]]) } ]);
    }
  }
  //find definitions that contain properties that are not part of the main schema
  if (_.keys(schema.definitions).length > 0) {
    const abstract = {};
    for (let i=0; i<_.keys(schema.definitions).length;i++) {
      if (schema.definitions[_.keys(schema.definitions)[i]].properties!==undefined) {
        const definition = schema.definitions[_.keys(schema.definitions)[i]].properties;
        for (let j=0; j<_.keys(definition).length;j++) {
          const name = _.keys(definition)[j];
          const property = definition[_.keys(definition)[j]];
          //console.log('Checking ' + name + ' against ' + _.keys(schema.properties));
          if (_.keys(schema.properties).indexOf(name)===-1) {
            abstract[name] = property;
          }
        }
      }
    }
    if (_.keys(abstract).length>0) {
      //console.log('I got definitions!', abstract);
      multi.push([ 'definitions.ejs', { props: requiredProperties(abstract), title: schema.title } ]);
      for (let i=0; i<_.keys(abstract).length;i++) {
        multi.push( [ 'property.ejs', {
          name: _.keys(abstract)[i],
          required: false,
          examples: stringifyExamples(abstract[_.keys(abstract)[i]]['examples']),
          schema: simpletype(abstract[_.keys(abstract)[i]]) } ]);
      }
    }
  }

  multi = multi.map(([ template, context ]) => {
    return [
      path.join(__dirname, '../templates/md/' + template),
      assoc(context, '_', _)
    ];
  });

  return Promise.reduce(Promise.map(multi, render), build, '').then(str => {
    //console.log('Writing markdown (promise)');
    const mdfile = path.basename(filename).slice(0, -5)+ '.md';
    return writeFile(path.join(path.join(outDir), path.dirname(filename.substr(schemaPath.length))), mdfile, str);
  }).then(out => {
    //console.log('markdown written (promise)', out);
    return out;
  });
};

module.exports = generateMarkdown;
