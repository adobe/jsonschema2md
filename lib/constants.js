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

var consts = {};

// schema vocabulary

consts.OWL_ONTOLOGY = 'http://www.w3.org/2002/07/owl#Ontology';
consts.DC_TITLE = 'http://purl.org/dc/elements/1.1/title';
consts.RDF_TYPE = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';
consts.RDF_PROPERTY = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#Property';
consts.RDFS_CLASS = 'http://www.w3.org/2000/01/rdf-schema#Class';
consts.RDFS_COMMENT = 'http://www.w3.org/2000/01/rdf-schema#comment';
consts.RDFS_SUBCLASSOF = 'http://www.w3.org/2000/01/rdf-schema#subClassOf';
consts.RDFS_ISDEFINEDBY = 'http://www.w3.org/2000/01/rdf-schema#isDefinedBy';
consts.RDFS_DOMAIN = 'http://www.w3.org/2000/01/rdf-schema#domain';
consts.RDFS_RANGE = 'http://www.w3.org/2000/01/rdf-schema#range';
consts.RDFS_LABEL = 'http://www.w3.org/2000/01/rdf-schema#label';

consts.SKOS_EXAMPLE = 'http://www.w3.org/2004/02/skos/core#example';
consts.SKOS_NOTE = 'http://www.w3.org/2004/02/skos/core#note';

consts.CORE_BASECLASS = 'http://ns.adobe.com/adobecloud/core/1.0/BaseClass';
consts.CORE_BASEPROPERTY = 'http://ns.adobe.com/adobecloud/core/1.0/BaseProperty';
consts.META_JSONNAME = 'http://ns.adobe.com/adobecloud/meta/1.0/jsonName';

consts.PROP_MANDATORY = 'http://ns.adobe.com/adobecloud/meta/1.0/mandatory';
consts.PROP_USEREDITABLE = 'http://ns.adobe.com/adobecloud/meta/1.0/userEditable';
consts.PROP_IMMUTABLE =  'http://ns.adobe.com/adobecloud/meta/1.0/immutable';

// misc.

consts.ID = '@id'; // IRI of 'this' js object
consts.XSD_STRING = 'http://www.w3.org/2001/XMLSchema#string';  // xsd:string

module.exports = consts;