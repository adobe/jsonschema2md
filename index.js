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

var _ = require('lodash');
var N3 = require('n3');

var parser = N3.Parser();
var N3Util = N3.Util;

// todo make configurable?

var MODEL_NS_URI = 'http://ns.adobe.com/adobecloud/core/1.0/';

// schema vocabulary

var RDF_TYPE = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';
var RDFS_CLASS = 'http://www.w3.org/2000/01/rdf-schema#Class';
var RDF_PROPERTY = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#Property';
var RDFS_COMMENT = 'http://www.w3.org/2000/01/rdf-schema#comment';
var RDFS_SUBCLASSOF = 'http://www.w3.org/2000/01/rdf-schema#subClassOf';
var RDFS_ISDEFINEDBY = 'http://www.w3.org/2000/01/rdf-schema#isDefinedBy';
var RDFS_DOMAIN = 'http://www.w3.org/2000/01/rdf-schema#domain';
var RDFS_RANGE = 'http://www.w3.org/2000/01/rdf-schema#range';
var RDFS_LABEL = 'http://www.w3.org/2000/01/rdf-schema#label';
var RDFS_DATATYPE = 'http://www.w3.org/2000/01/rdf-schema#Datatype';
var RDFS_RESOURCE = 'http://www.w3.org/2000/01/rdf-schema#Resource';

var SKOS_EXAMPLE = 'http://www.w3.org/2004/02/skos/core#example';
var SKOS_NOTE = 'http://www.w3.org/2004/02/skos/core#note';

var META_JSONNAME = 'http://ns.adobe.com/adobecloud/meta/1.0/jsonName';

var XSD_STRING = 'http://www.w3.org/2001/XMLSchema#string';
var XSD_DATETINE = 'http://www.w3.org/2001/XMLSchema#dateTime';
var XSD_FLOAT = 'http://www.w3.org/2001/XMLSchema#float';

var ID = '@id'; // IRI of 'this' js object

var triples = [];
var model = { classes: {}, properties: {}, dataTypes: {} };

var rdfStream = fs.createReadStream('./schemas/core.n3');

function buildModel(triples) {

  // TODO fix very inefficient and redundant processing of triples

  // transform triples into objects ('subject') with attributes ('predicate') and attribute values ('object')
  var subjects = {};
  _.forEach(triples, function (triple) {
    var obj = subjects[triple.subject];
    if (!obj) {
      // inject '@id' attribute with object's IRI
      obj = subjects[triple.subject] = {};
      obj[ID] = triple.subject;
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
  console.log(subjects);

  // extract our 'classes'

  var classes = {};
  _.forEach(subjects, function (subj, id) {
    if (subj[RDF_TYPE] === RDFS_CLASS) {
      if (N3Util.isIRI(id) && _.startsWith(id, MODEL_NS_URI)) {
        // only consider classes defined in the specified NS
        classes[id] = subj;
      }
    }
  });
  _.forEach(subjects, function (subj, id) {
    if (subj[RDFS_SUBCLASSOF] && subjects[subj[RDFS_SUBCLASSOF]]) {
      if (N3Util.isIRI(id) && _.startsWith(id, MODEL_NS_URI)) {
        // only consider classes defined in the specified NS
        classes[id] = subj;
      }
    }
  });

  // extract properties and attach to classes

  var properties = {};
  _.forEach(subjects, function (subj, id) {
    if (subj[RDF_TYPE] === RDF_PROPERTY || (subjects[subj[RDF_TYPE]] && subjects[subj[RDF_TYPE]][RDFS_SUBCLASSOF] === RDF_PROPERTY)) {
      if (subj[RDFS_DOMAIN] && classes[subj[RDFS_DOMAIN]]) {
        properties[id] = subj;
        // attach to class
        var classProps = classes[subj[RDFS_DOMAIN]].properties;
        if (!classProps) {
          classProps = classes[subj[RDFS_DOMAIN]].properties = {};
        }
        classProps[id] = subj;
      }
    }
  });

  model.classes = classes;
  model.properties = properties;

  console.log(model);
}

parser.parse(rdfStream,
  function (err, triple) {
    if (err) {
      console.log(err);
    } else if (triple) {
      triples.push(triple);
      console.log(triple);
    } else {
      // EOF
      buildModel(triples);
    }
  },
  function (prefix, uri) {
    console.log(prefix, uri);
  }
);
