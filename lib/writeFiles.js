/**
 * Copyright 2017 Adobe Systems Incorporated. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

var Promise=require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');
var _ = require('lodash');
var ejs = require('ejs');
var mkdirp = Promise.promisify(require('mkdirp'));
var validUrl = require('valid-url');

// var Writer = function(schemaPath,outDir){
//   this._outDir = outDir;
//   this._schemaPath = schemaPath;
// };
var Writer = {};
var writeFile = function(outputDir, fileName, data) {
  if (!fs.existsSync(outputDir)){
    return mkdirp(outputDir).then(()=>{
      return fs.writeFileAsync(path.join(outputDir, fileName), data);
    });
  } else {
    return fs.writeFileAsync(path.join(outputDir, fileName), data);
  }

};
Writer.generateMarkdown = function(filename, schema, schemaPath, outDir, dependencyMap) {

  var ctx = {
    schema: schema,
    _: _,
    validUrl: validUrl,
    dependencyMap:dependencyMap
  };

  ejs.renderFile(path.join(__dirname, '../templates/md/topSchema.ejs'), ctx, { debug: false }, function(err, str){
    if (err) {console.error(err);}
    return writeFile(path.join(path.join(outDir), path.dirname(filename.substr(schemaPath.length))), path.basename(filename).slice(0, -5)+ '.md', str);
  });

};

Writer.generateNewSchemaFiles = function(filename, schema, schemaPath, outDir) {
  return writeFile(path.join(path.join(outDir), path.dirname(filename.substr(schemaPath.length))), path.basename(filename), JSON.stringify(schema, null, 4));

};
module.exports = Writer;
