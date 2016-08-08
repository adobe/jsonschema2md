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
var rdf = require('node-rdf');
var jsonld = require('jsonld');
var ejs = require('ejs');
var logger = require('winston');

var consts = require('./constants');

function buildModel(graph) {

  // TODO use rdf Graph API instead of inefficient and redundant iterating over triples

  // normalize to string values
  var triples = _.map(graph.toArray(), function (triple) {
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

  // extract properties and attach to classes

  var properties = {};
  _.forEach(subjects, function (subj, id) {
    if (subj[consts.RDF_TYPE] === consts.RDF_PROPERTY || (subjects[subj[consts.RDF_TYPE]] && subjects[subj[consts.RDF_TYPE]][consts.RDFS_SUBCLASSOF] === consts.RDF_PROPERTY)) {
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

  var dataTypes = {};
  _.forEach(properties, function (subj, id) {
    var typeId = subj[consts.RDFS_RANGE];
    if (typeId && subjects[typeId]) {
      dataTypes[typeId] = subjects[typeId];
    }
  });

  return {
    _graph: graph,
    meta: meta,
    classes: classes,
    properties: properties,
    dataTypes: dataTypes
  };
}

function parseN3(path, cb) {
  var env = rdf.environment;
  var graph = env.createGraph();
  //var turtleParser = new rdf.TurtleParser(env);
  var turtleParser = new rdf.TurtleParser();

  if (!turtleParser.parse(fs.readFileSync(path), undefined, null, null, graph)) {
    cb(new Error('Parsing failed'));
  } else {
    var prefixes = {};
    _.forOwn(turtleParser.environment.prefixes, function(value, key) {
      prefixes[key] = value;
    });
    cb(null, graph, prefixes);
  }
}

function prepareModel(model) {
/*
   var env = rdf.environment;

   // map vocab uris to CURIE format

   var result = {};

   function renameToCURIE(value, key) {
     return env.prefixes.shrink(key);
   }

   result.meta = _.mapKeys(model.meta, renameToCURIE);
   result.classes = {};
   _.forEach(model.classes, function (value, key) {
     result.classes[env.prefixes.shrink(key)] = _.mapKeys(value, renameToCURIE);
   });
   result.dataTypes = {};
   _.forEach(model.dataTypes, function (value, key) {
     result.dataTypes[env.prefixes.shrink(key)] = _.mapKeys(value, renameToCURIE);
   });

   return result;
*/
  return model;
}

function renderModel(model) {
  var ctx = {
    model: model,
    consts: consts,
    _: _
  };

  ejs.renderFile('./templates/main.ejs', ctx, function (err, str) {
    if (err) {
      logger.error(err);
    } else {
      if (!fs.existsSync('./out')) {
        fs.mkdirSync('./out');
      }
      fs.writeFileSync('./out/main.html', str);

      logger.info('done');
    }
  });
}

/**
 * convert node-rdf graph representation to jsonld-expected dataset representation
 *
 * @param graph
 */
function graphToDataset(graph) {
  var triples = _.map(graph.toArray(), function (triple) {

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

  return {
    '@default': triples
  };
}

parseN3('./schemas/core.n3', function (err, graph, prefixes) {
  if (err) {
    logger.error(err);
  } else {
    renderModel(prepareModel(buildModel(graph)));

    // todo FIXME refactor
    var dataset = graphToDataset(graph);
    jsonld.fromRDF(dataset, function (err, doc) {
      if (err) {
        logger.error(err);
      } else {
        jsonld.compact(doc, prefixes, function (err, compacted) {
          fs.writeFileSync('./out/core.json', JSON.stringify(compacted, null, 2));
        });
      }
    });

  }
});
