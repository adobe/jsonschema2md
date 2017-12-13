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
    console.log(examples);
    return examples.map(example => {
      return JSON.stringify(example, 2);
    });
  } else {
    return false;
  }
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
  const multi = [
    [ 'frontmatter.ejs', { meta: schema.metaElements } ],
    [ 'header.ejs', {
      schema: schema,
      dependencies: flatten(dependencyMap),
      props: schemaProps(schema, schemaPath, filename) } ],
    //[ 'divider.ejs', null ],
    //[ 'topSchema.ejs', ctx ],
    [ 'examples.ejs', { examples: stringifyExamples(schema.examples), title: schema.title } ],
    [ 'divider.ejs', null ]
  ].map(([ template, context ]) => {
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
