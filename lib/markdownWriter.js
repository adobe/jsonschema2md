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
  console.log('rendering ' + template);
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

const generateMarkdown = function(filename, schema, schemaPath, outDir, dependencyMap) {
  var ctx = {
    schema: schema,
    _: _,
    validUrl: validUrl,
    dependencyMap:dependencyMap
  };

  console.log(schema);

  // this structure allows us to have separate templates for each element. Instead of having
  // one huge template, each block can be built individually
  const multi = [
    [ 'frontmatter.ejs', { meta: schema.metaElements } ],
    [ 'header.ejs', { title: schema.title } ],
    //[ 'divider.ejs', null ],
    //[ 'topSchema.ejs', ctx ],
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
