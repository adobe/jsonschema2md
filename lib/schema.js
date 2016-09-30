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

var _ = require('lodash');
var async = require('async');
var rdf = require('node-rdf');
var jsonld = require('jsonld');
var logger = require('winston');

var consts = require('./constants');

/**
 * @typedef {Object} Model
 * @property {Object} meta schema meta properties
 * @property {Object} classes class definitions
 * @property {Object} properties property definitions
 * @property {Object} datatypes data type definitions
 */

/**
 * Data Model Schema
 *
 * @constructor
 * @private
 *
 * @param {Model} model data model schema object
 * @param {Object} rdfDoc RDF/Turtle document
 * @param {Graph} rdfDoc.graph RDF graph
 * @param {Object} rdfDoc.prefixes RDF/Turtle prefixes
 *
 * @this {Schema}
 */
var Schema = function (model, rdfDoc) {
  this._model = model;
  this._rdfDoc = rdfDoc;
};

/**
 * Async factory method
 *
 * @param {String} schemaFile path to schema definition file in Turtle syntax
 * @param {Function} cb callback called with the result
 * @param {String|Error} cb.error error (non-null if an error occurred)
 * @param {Schema} cb.schema Schema instance
 */
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
    var prefixes = {};
    _.forOwn(turtleParser.environment.prefixes, function (value, key) {
      prefixes[key] = value;
    });

    var doc = { graph: graph, prefixes: prefixes };
    callback(null, doc);
  }

  function parseRDF(doc, callback) {
    // TODO use RDF Graph API instead of inefficient and redundant iterating over triples

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
    var meta;
    _.forEach(subjects, function (subj, id) {
      if (subj[consts.RDF_TYPE] === consts.OWL_ONTOLOGY) {
        meta = subj;
      }
    });

    // extract our 'classes'

    var classes = {};
    _.forEach(subjects, function (subj, id) {
      if (subj[consts.RDF_TYPE] === consts.RDFS_CLASS && subj[consts.RDFS_SUBCLASSOF] === consts.CORE_BASECLASS) {
        classes[id] = subj;
      }
    });
    var derivedClasses;
    do {
      derivedClasses = {};
      _.forEach(subjects, function (subj, id) {
        if (!classes[id] && subj[consts.RDF_TYPE] === consts.RDFS_CLASS && subj[consts.RDFS_SUBCLASSOF] && classes[subj[consts.RDFS_SUBCLASSOF]]) {
          derivedClasses[id] = subj;
        }
      });
    } while (Object.keys(derivedClasses).length && _.assign(classes, derivedClasses));

    // TODO resolve inheritance and add superclasses property to every class (to allow resolving inherited properties vs declared properties)

    // extract properties and attach to classes

    var properties = {};
    _.forEach(subjects, function (subj, id) {
      if (isInstanceOf(subjects, id, consts.RDF_PROPERTY)) {
        if (subj[consts.RDFS_DOMAIN] && classes[subj[consts.RDFS_DOMAIN]]) {
          properties[id] = subj;
          // attach to class
          var classProps = classes[subj[consts.RDFS_DOMAIN]].properties;
          if (!classProps) {
            classProps = classes[subj[consts.RDFS_DOMAIN]].properties = {};
          }
          classProps[id] = subj;
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

/**
 * Returns the data model object.
 *
 * @return {Model} data model object
 */
Schema.prototype.getModel = function () {
  return this._model;
};

/**
 * Serializes the model to JSON-LD
 *
 * @param {Function} cb callback called with the result
 * @param {String|Error} cb.error error (non-null if an error occurred)
 * @param {Object} cb.doc JSON-LD object
 */
Schema.prototype.toJsonLD = function (cb) {
  // convert node-rdf graph representation to jsonld-expected dataset representation
  var triples = _.map(this._rdfDoc.graph.toArray(), function (triple) {
    function mapNode(node) {
      switch (node.nodeType()) {
        case 'IRI':
          return { type: 'IRI', value: node.toString() };
        case 'BlankNode':
          return { type: 'blank node', value: node.toString() };
        case 'PlainLiteral':
          if (node.language) {
            return { type: 'literal', value: node.toString(), language: node.language };
          } else {
            return { type: 'literal', value: node.toString() };
          }
        case 'TypedLiteral':
          return { type: 'literal', value: node.toString(), datatype: node.datatype };
      }
    }
    return {
      subject: mapNode(triple.subject),
      predicate: mapNode(triple.predicate),
      object: mapNode(triple.object)
    };
  });

  var self = this;
  jsonld.fromRDF({ '@default': triples }, { useNativeTypes: true }, function (err, doc) {
    if (err) {
      cb(err);
    } else {
      jsonld.compact(doc, self._rdfDoc.prefixes, cb);
    }
  });
};

module.exports = Schema;
