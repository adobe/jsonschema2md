/*************************************************************************
 *
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 *  Copyright 2016 Adobe Systems Incorporated
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 **************************************************************************/

'use strict';

var fs = require('fs');
var util = require('util');
var path = require('path');

var _ = require('lodash');
var async = require('async');
var rdf = require('node-rdf');
var jsonld = require('jsonld');
var logger = require('winston');

var consts = require('./constants');

// /**
//  * @typedef {Object} Model
//  * @property {Object} meta schema meta properties
//  * @property {Object} classes class definitions
//  * @property {Object} properties property definitions
//  * @property {Object} datatypes data type definitions
//  */
//
// /**
//  * Data Model Schema
//  *
//  * @constructor
//  * @private
//  *
//  * @param {Model} model data model schema object
//  * @param {Object} rdfDoc RDF/Turtle document
//  * @param {Graph} rdfDoc.graph RDF graph
//  * @param {Object} rdfDoc.prefixes RDF/Turtle prefixes
//  *
//  * @this {Schema}
//  */
// var Schema = function (model, rdfDoc) {
//   this._model = model;
//   this._rdfDoc = rdfDoc;
// };

/**
 * Async factory method
 *
 * @param {String} schemaFile path to schema definition file in Turtle syntax
 * @param {Function} cb callback called with the result
 * @param {String|Error} cb.error error (non-null if an error occurred)
 * @param {Schema} cb.schema Schema instance
 */
/*
Schema.load = function (schemaFile, cb) {

  function isInstanceOf(subjects, a, b) {
    if (a === b) {
      return true;
    }

    var subj = subjects[a];
    if (!subj) {
      return false;
    }

    if (isEqualOrIncludes(subj[consts.RDF_TYPE], b)) {
      return true;
    }
    if (isEqualOrIncludes(subj[consts.RDFS_SUBCLASSOF], b)) {
      return true;
    }

    // recursively resolve inheritance
    var types = subj[consts.RDF_TYPE];
    if (!util.isArray(types)) {
      types = [ types ];
    }
    var result = types.some(function (type) {
      return isInstanceOf(subjects, type, b);
    });
    if (result) {
      return true;
    }
    var superClasses = subj[consts.RDFS_SUBCLASSOF];
    if (!util.isArray(superClasses)) {
      superClasses = [ superClasses ];
    }
    return superClasses.some(function (type) {
      return isInstanceOf(subjects, type, b);
    });
  }

  function isEqualOrIncludes(a, b) {
    if (util.isArray(a)) {
      return a.indexOf(b) > -1;
    } else {
      return a === b;
    }
  }

  function readFile(callback) {
    fs.readFile(schemaFile, callback);
  }

  function parseTurtle(fileContent, callback) {
    var graph = rdf.environment.createGraph();
    var turtleParser = new rdf.TurtleParser();

    var parsed = false;
    try {
      parsed = turtleParser.parse(fileContent, undefined, null, null, graph);
    } catch (err) {
      callback(err);
      return;
    }
    if (!parsed) {
      callback(new Error('Parsing ' + schemaFile + ' failed'));
      return;
    }

    var doc = { graph: graph, prefixes: turtleParser.environment.prefixes };
    callback(null, doc);
  }

  function parseRDF(doc, callback) {
    // TODO use RDF Graph API instead of inefficient and redundant iterating over triples?

    // normalize to string values
    var triples = _.map(doc.graph.toArray(), function (triple) {
      return {
        subject: triple.subject.toString(),
        predicate: triple.predicate.toString(),
        object: triple.object.toString()
      };
    });

    // transform triples into objects ('subject') with attributes ('predicate') and attribute values ('object')

    var subjects = {};
    _.forEach(triples, function (triple) {
      var obj = subjects[triple.subject];
      if (!obj) {
        // inject '@id' attribute with object's IRI
        obj = subjects[triple.subject] = {};
        obj[consts.ID] = triple.subject;
      }
      if (!obj[triple.predicate]) {
        obj[triple.predicate] = triple.object;
      } else {
        if (Array.isArray(obj[triple.predicate])) {
          obj[triple.predicate].push(triple.object);
        } else {
          obj[triple.predicate] = [ obj[triple.predicate], triple.predicate ];
        }
      }
    });

    // extract schema meta information
    var meta = {};
    _.forEach(subjects, function (subj, id) {
      if (subj[consts.RDF_TYPE] === consts.OWL_ONTOLOGY) {
        meta = subj;
        return false; // exit iteration
      }
    });

    // extract our 'classes'

    var classes = {};
    _.forEach(subjects, function (subj, id) {
      if (isInstanceOf(subjects, id, consts.CORE_BASECLASS) && id !== consts.CORE_BASECLASS) {
        classes[id] = subj;
      }
    });

    // resolve inheritance and add superclasses property to every class (to allow resolving inherited properties vs declared properties)
    _.forEach(classes, function (cls) {
      cls.superclasses = {};

      function collectSuperclasses(c, superclasses) {
        var sc = c[consts.RDFS_SUBCLASSOF];
        if (sc) {
          sc = util.isArray(sc) ? sc : [ sc ];
          sc.forEach(function (id) {
            if (id !== consts.CORE_BASECLASS && classes[id]) {
              superclasses[id] = classes[id];
              collectSuperclasses(classes[id], superclasses);
            }
          });
        }
      }

      collectSuperclasses(cls, cls.superclasses);
    });

    // extract properties and attach to classes

    var properties = {};
    _.forEach(subjects, function (subj, id) {
      if (isInstanceOf(subjects, id, consts.CORE_BASEPROPERTY) && id !== consts.CORE_BASEPROPERTY) {
        var cls = classes[subj[consts.RDFS_DOMAIN]];
        if (cls) {
          properties[id] = subj;
          // attach to class
          cls.properties = cls.properties || {};
          cls.properties[id] = subj;
        }
      }
    });

    // extract data types used by properties

    var datatypes = {};
    _.forEach(properties, function (subj, id) {
      var typeId = subj[consts.RDFS_RANGE];
      if (typeId && subjects[typeId]) {
        datatypes[typeId] = subjects[typeId];
      }
    });

    //resolve all restrictions on datatypes:
    var restrictions = doc.graph.match(null, null, consts.OWL_RESTRICTION);
    _.forEach(restrictions, function(v) {
      // Find the target for the restriction.
      var restrictedTypeList = doc.graph.match(null, consts.RDFS_SUBCLASSOF, v.subject);
      if (restrictedTypeList.length != 1) {
        logger.error('Could not find restricted type for rule: ' + v);
        return;
      }
      var restrictedType = datatypes[restrictedTypeList[0].subject.valueOf()];
      if (restrictedType === undefined) {
        logger.debug("Could not add restrictions to type as the value wasn't found: " + restrictedTypeList[0].subject.valueOf());
        return;
      }
      // Get all the tuples for this blank node.
      var relatedToBlank = doc.graph.match(v.subject);
      relatedToBlank.forEach(function(restriction) {
        if (restriction.object.valueOf() === consts.OWL_RESTRICTION) {
          // we already know it's a restriction.
          return;
        }
        if (restrictedType.restrictions === undefined) {
          restrictedType.restrictions = [];
        }
        // If the restriction type has an all values, we need to that datatype too as it's being indirectly referenced.
        if (restriction.predicate.valueOf() === consts.OWL_ALLVALUES) {
          datatypes[restriction.object.valueOf()] = subjects[restriction.object.valueOf()];
        }
        restrictedType.restrictions.push(restriction);
      });
    });

    doc.graph.match(null, consts.RDF_TYPE, consts.RDF_PROPERTY).forEach(function(item, index, list) {
      var details = doc.graph.match(item.subject);
      var subgraph = rdf.environment.createGraph();
      subgraph.addAll(details);
      var types = subgraph.match(null, consts.RDFS_DOMAIN);
      if (types.length != 1) {
        logger.warn("Could not extract target type for rdf property: ",item);
        return;
      }
      var target = types[0].object.valueOf();
      if (!datatypes[target]) {
        // Add the type if it doesn't exist.
        datatypes[target]  = subjects[target];
      }
      if (!datatypes[target].properties) {
          datatypes[target].properties = [];
      }
      datatypes[target].properties.push(subjects[item.subject.valueOf()]);
    });

    var model = {
      meta: meta,
      classes: classes,
      properties: properties,
      datatypes: datatypes
    };

    callback(null, new Schema(model, doc));
  }

  async.waterfall([ readFile, parseTurtle, parseRDF ], cb);
};
*/


var resolveRef = function(baseURL,valueObj,fetchFile,callback){

  if(valueObj.hasOwnProperty("$ref")){
    var refVal=valueObj["$ref"];
    if (!(typeof refVal === 'string' || refVal instanceof String))
      callback(null,false);
    else{
      //check if it is external refrence
      if( path.isAbsolute(refVal) || refVal.startsWith('#') || !refVal.endsWith('.json'))
          return callback(null,false);
      else{
        var type=(refVal.split(".")[0]).replace("/",".");
        valueObj.type=type;
        valueObj.$linkPath="../"+refVal.split(".")[0]+".md"; //specific use case for models
        if(fetchFile){
          fs.readFile(path.resolve(baseURL,refVal), function(err,data){
            if(err)
              callback(err,false);
            else {
              var subschema=JSON.parse(data);
              //For now only catering description property as required.
              //TODO for other properties if Required
              if(!valueObj.description && subschema.description)
                valueObj.description = subschema.description;
              if(!valueObj.title && subschema.title)
                valueObj.title=subschema.title;
              callback(null,true);
            }
            });
        }
        else
          callback(null,true);
      }
    }
}
else
  callback(false,null,valueObj);
}

var processSchema=function(baseURL,obj,fetchFile,callback){
  async.eachOf(obj,function(item,key,next){
    if(key === "anyOf" || key === "oneOf" || key === "allOf")
        obj.type=key;
    resolveRef(baseURL,item,fetchFile,function(err,flag){
      if(err)
        next(err);
      else if(flag)
        next();
      else if(_.isObject(item) && !_.isFunction(item)){
                  processSchema(baseURL,item,(key === "properties"),function(err){
                      next(err);
                  });
                }
              else
                next();

    });

  },function(err,obj1){
    callback(err,obj);
  });
}

var Schema={}
Schema.load = function(schemaFile, baseURL, cb){

  function readFile(callback1) {
    fs.readFile(schemaFile, callback1);
    }
  function resolveReferences(schemaFile,callback){

    processSchema(baseURL,JSON.parse(schemaFile),false, function(err, schema) {
        callback(err,schema);

    });
  }
  async.waterfall([ readFile, resolveReferences], cb);
}

// /**
//  * Returns the data model object.
//  *
//  * @return {Model} data model object
//  */
// Schema.prototype.getModel = function () {
//   return this._model;
// };
//
// /**
//  * Returns the prefix map, in instance of the <code>PrefixMap</code> RDF Interface.
//  *
//  * @see https://www.w3.org/TR/2012/NOTE-rdf-interfaces-20120705/#prefix-maps
//  *
//  * @return {Object} prefix map object
//  */
// Schema.prototype.getPrefixMap = function () {
//   return this._rdfDoc.prefixes;
// };
//
// /**
//  * Serializes the model to JSON-LD
//  *
//  * @param {Function} cb callback called with the result
//  * @param {String|Error} cb.error error (non-null if an error occurred)
//  * @param {Object} cb.doc JSON-LD serialization of model
//  * @param {Object} cb.context JSON-LD context
//  */
// Schema.prototype.toJsonLD = function (cb) {
//   // convert node-rdf graph representation to jsonld-expected dataset representation
//   var triples = _.map(this._rdfDoc.graph.toArray(), function (triple) {
//     function mapNode(node) {
//       switch (node.nodeType()) {
//         case 'IRI':
//           return { type: 'IRI', value: node.toString() };
//         case 'BlankNode':
//           return { type: 'blank node', value: node.toString() };
//         case 'PlainLiteral':
//           if (node.language) {
//             return { type: 'literal', value: node.toString(), language: node.language };
//           } else {
//             return { type: 'literal', value: node.toString() };
//           }
//         case 'TypedLiteral':
//           return { type: 'literal', value: node.toString(), datatype: node.datatype };
//       }
//     }
//     return {
//       subject: mapNode(triple.subject),
//       predicate: mapNode(triple.predicate),
//       object: mapNode(triple.object)
//     };
//   });
//
//   var self = this;
//   var prefixMap = this._rdfDoc.prefixes;
//   var prefixes = _.assign({}, prefixMap);
//   jsonld.fromRDF({ '@default': triples }, { useNativeTypes: true }, function (err, doc) {
//     if (err) {
//       cb(err);
//     } else {
//       jsonld.compact(doc, prefixes, function (err, doc) {
//         if (err) {
//           cb(err);
//         } else {
//           var context = _.assign({}, prefixes);
//           _.forEach(self._model.properties, function (prop, id) {
//             if (prop[consts.RDFS_RANGE] === consts.XSD_STRING) {
//               context[prop[consts.META_JSONNAME]] = prefixMap.shrink(id);
//             } else {
//               context[prop[consts.META_JSONNAME]] = {
//                 '@id': prefixMap.shrink(id),
//                 '@type': prefixMap.shrink(prop[consts.RDFS_RANGE])
//               };
//             }
//           });
//           cb(null, doc, { '@context': context });
//         }
//       });
//     }
//   });
// };
//
// /**
//  * Serializes the model to JSON-LD
//  *
//  * @param {Function} cb callback called with the result
//  * @param {String|Error} cb.error error (non-null if an error occurred)
//  * @param {Object} cb.doc JSON-LD context object
//  */
// Schema.prototype.generateJsonLDContext = function (cb) {
//
// };


module.exports = Schema;
