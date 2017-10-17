var Promise=require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');
var _ = require('lodash');
var async = require('async');
var ejs = require('ejs');
var logger = require('winston');
var mkdirp = Promise.promisify(require('mkdirp'));
var readdirp = require('readdirp');
var validUrl = require("valid-url");
var url = require("url");

// var Writer = function(schemaPath,outDir){
//   this._outDir = outDir;
//   this._schemaPath = schemaPath;
// };
var Writer = {}
var writeFile = function(outputDir, fileName, data) {
  if(!fs.existsSync(outputDir)){
    return mkdirp(outputDir).then((err)=>{
      return fs.writeFileAsync(path.join(outputDir, fileName), data);
    })
  }
  else {
    return fs.writeFileAsync(path.join(outputDir, fileName), data);
  }

}
Writer.generateMarkdown = function(filename, schema,schemaPath,outDir) {
  schema.metaElements = {};
  var ctx = {
    schema: schema,
    _: _,
    validUrl: validUrl,
  };

  ejs.renderFile(path.join(__dirname,'../templates/md/topSchema.ejs'), ctx , { debug: false },function(err,str){
    if(err)
    console.error(err);
    return writeFile(path.join(path.join(outDir), path.dirname(filename.substr(schemaPath.length))), path.basename(filename).slice(0, -5)+ '.md', str);
  })

}

Writer.generateNewSchemaFiles = function(filename, schema,schemaPath,outDir) {
    return writeFile(path.join(path.join(outDir,"_newSchema"), path.dirname(filename.substr(schemaPath.length))), path.basename(filename), JSON.stringify(schema, null, 4));

}
module.exports = Writer;
