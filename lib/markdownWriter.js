/**
 * Copyright 2017 Adobe Systems Incorporated. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
const i18n = require('i18n');
const writeFile = require('./writeFiles');
const prettyMarkdown = require('./prettyMarkdown');
var Promise=require('bluebird');
var path = require('path');
var _ = require('lodash');
var ejs = require('ejs');
const pejs = Promise.promisifyAll(ejs);
// var validUrl = require('valid-url');
const { headers } = require('./header');
var GithubSlugger = require('github-slugger');

function createGithubSlugs(names){
  var slugger = new GithubSlugger();
  slugger.reset();
  names = names.sort();
  return names.reduce(function(result, item) {
    result[item] = slugger.slug(item);
    return result;
  }, {});
}

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

/**
 * Finds a simple, one-line description of the property's type
 * @param {object} prop - a JSON Schema property definition
 */
function simpletype(prop) {
  const type = prop.type;
  if (prop.$ref!==undefined) {
    if (prop.$linkVal!==undefined) {
      prop.simpletype = prop.$linkVal;
    } else {
      console.log('unresolved reference: ' + prop.$ref);
      prop.simpletype = 'reference';
    }
  } else if (prop.enum!==undefined) {
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
  } else if (type==='null') {
    prop.simpletype = '`null`';
  } else if (type==='array') {
    if (prop.items!==undefined) {
      const innertype = simpletype(prop.items);
      if (innertype.simpletype==='complex') {
        prop.simpletype = '`array`';
      } else {
        //console.log(prop.title);
        prop.simpletype = innertype.simpletype.replace(/(`)$/, '[]$1');
      }
    } else {
      prop.simpletype = '`array`';
    }
  } else if (Array.isArray(type)) {
    function nullfilter(str) {
      return str!=='null';
    }
    var filtered = type.filter(nullfilter);
    if (type.length - 1 === filtered.length) {
      prop.nullable = true;
    }
    if (filtered.length===1) {
      prop.type = filtered[0];
      prop.simpletype = '`' + filtered[0] + '`';
    } else {
      prop.type = filtered;
      prop.simpletype = 'multiple';
    }
  } else {
    prop.simpletype = 'complex';
  }
  return prop;
}
/**
 * Combines the `required` array data structure with the `properties` map data
 * structure, so that each property in `properties` that is required, i.e. listed
 * as a value in the `required` array will have an additional property `isrequired`
 * @param {*} properties
 * @param {*} required
 */
function requiredProperties(properties, required) {
  if (required) {
    for (let i=0;i<required.length;i++) {
      if (properties[required[i]]) {
        properties[required[i]].isrequired = true;
      }
    }
  }
  return _.mapValues(properties, simpletype);
}

function ejsRender(template, ctx) {
  let p = pejs.renderFileAsync(path.join(__dirname, '../templates/md/' + template + '.ejs'), ctx, { debug: false });
  return p.value();
  //return JSON.stringify(obj, null, 2);
}

const generateMarkdown = function(filename, schema, schemaPath, outDir, dependencyMap, docs, consoleArgs) {
  //var ctx = {
  //  schema: schema,
  //  _: _,
  //  validUrl: validUrl,
  //  dependencyMap:dependencyMap
  //};

  outDir = outDir ? outDir : path.resolve(path.join('.', 'out'));
  console.log(filename);
  //console.log(dependencyMap);
  // this structure allows us to have separate templates for each element. Instead of having
  // one huge template, each block can be built individually
  let multi = [
    [ 'frontmatter.ejs', { meta: schema.metaElements } ],
    [ 'header.ejs', {
      i18n: i18n,
      schema: schema,
      dependencies: flatten(dependencyMap),
      table: headers(schema, schemaPath, filename, docs).render() } ],
    //[ 'divider.ejs', null ],
    //[ 'topSchema.ejs', ctx ],
    [ 'examples.ejs', { i18n: i18n, examples: stringifyExamples(schema.examples), title: schema.title } ]
  ];
  const required = []; //to store required of whole schema, even those in definitions

  // Processing schema.definitions before schema.properties to get any required properties present in definitions
  if (_.keys(schema.definitions).length > 0) {
    const abstract = {};
    for (let i=0; i<_.keys(schema.definitions).length;i++) {
      if (schema.definitions[_.keys(schema.definitions)[i]].properties!==undefined) {
        const definition = schema.definitions[_.keys(schema.definitions)[i]].properties;
        let tempRequired = schema.definitions[_.keys(schema.definitions)[i]].required;
        let hasRequiredProperties = (tempRequired !== undefined) ? true : false;
        for (let j=0; j<_.keys(definition).length;j++) {
          const name = _.keys(definition)[j];
          const property = definition[_.keys(definition)[j]];
          if (hasRequiredProperties && tempRequired.includes(name)){
            required.push(name);
          }
          //console.log('Checking ' + name + ' against ' + _.keys(schema.properties));
          if (_.keys(schema.properties).indexOf(name)=== -1) {
            property.definitiongroup = _.keys(schema.definitions)[i];
            abstract[name] = property;
          }
        }
      }
    }
    let propertiesSlugs = createGithubSlugs(_.keys(abstract));
    if (_.keys(abstract).length>0) {
      //console.log('I got definitions!', abstract);
      multi.push([ 'definitions.ejs', {
        props: requiredProperties(abstract, required),
        title: schema.title,
        id: schema.$id,
        propertiesSlugs:propertiesSlugs,
        i18n: i18n
      } ]);
      for (let i=0; i<_.keys(abstract).length;i++) {
        const name = _.keys(abstract).sort()[i];
        multi.push( [ 'property.ejs', {
          name: name,
          required: required.includes(name),
          ejs: ejsRender,
          examples: stringifyExamples(abstract[name]['examples']),
          schema: simpletype(abstract[name]),
          nameSlug: propertiesSlugs[name],
          i18n: i18n
        } ]);
      }
    }
  }
  let propertiesSlugs = createGithubSlugs(_.keys(schema.properties));
  if (_.keys(schema.properties).length > 0) {
    if (schema.required === undefined){schema.required = [];}
    schema.required = _.union(schema.required, required);
    //table of contents
    multi.push([ 'properties.ejs', {
      props: requiredProperties(schema.properties, schema.required),
      pprops: _.mapValues(schema.patternProperties, simpletype),
      title: schema.title,
      additional: schema.additionalProperties,
      propertiesSlugs: propertiesSlugs,
      i18n: i18n
    } ]);
    //regular properties
    for (let i=0; i<_.keys(schema.properties).length;i++) {
      const name = _.keys(schema.properties).sort()[i];
      multi.push( [ 'property.ejs', {
        name: name,
        required: schema.required ? schema.required.includes(name) : false,
        examples: stringifyExamples(schema.properties[name]['examples']),
        ejs: ejsRender,
        schema: simpletype(schema.properties[name]),
        nameSlug: propertiesSlugs[name],
        i18n: i18n
      } ]);
    }
  }

  if (_.keys(schema.patternProperties).length > 0) {
    //patterns properties
    for (let i=0; i<_.keys(schema.patternProperties).length;i++) {
      const name = _.keys(schema.patternProperties)[i];
      multi.push( [ 'pattern-property.ejs', {
        name: name,
        examples: stringifyExamples(schema.patternProperties[name]['examples']),
        ejs: ejsRender,
        schema: simpletype(schema.patternProperties[name]),
        i18n: i18n } ]);
    }
  }

  // Handles join-type properties
  // If the schema contains a 'oneOf', 'allOf' or 'anyOf'.
  const joinTypeKey = Object.keys(schema).find(key => [ 'oneOf', 'allOf', 'anyOf' ].indexOf(key) > -1);
  if (!_.isUndefined(joinTypeKey)) {
    const joinType = schema[joinTypeKey];
    if (joinType.length > 0) {
      multi.push( [ 'join-type.ejs', {
        ejs: ejsRender,
        schemas: simpletype(joinType),
        schema: simpletype(schema),
        i18n: i18n } ]);
    }
  }
  //find definitions that contain properties that are not part of the main schema
  multi = multi.map(([ template, context ]) => {
    return [
      path.join(__dirname, '../templates/md/' + template),
      assoc(assoc(context, '_', _), 'simpletype', simpletype)
    ];
  });

  return Promise.reduce(Promise.map(multi, render), build, '').then(str => {
    const mdfile = path.basename(filename).slice(0, -5)+ '.md';
    return writeFile(path.join(path.join(outDir), path.dirname(filename.substr(schemaPath.length))), mdfile, prettyMarkdown(str));
  }).then(out => {
    //console.log('markdown written (promise)', out);
    return out;
  });
};

module.exports = generateMarkdown;
