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

"use strict";

var jsonSchema = {};
var _ = require("lodash");
var logger = require("winston");
var consts = require("./constants");

var baseSchema = function () {
    return {"$schema": "http://json-schema.org/schema#"};
};

var rdfRangeToJsonType = {
    "http://www.w3.org/2001/XMLSchema#string": {
        "type": "string"
    },
    "http://www.w3.org/2001/XMLSchema#dateTime": {
        "type": "string",
        "format": "date-time"
    },
    "http://www.w3.org/2001/XMLSchema#boolean": {
        "type": "boolean"
    },
    "http://www.w3.org/2001/XMLSchema#integer": {
        "type": "integer"
    }
};

const ttlKeyNames = {
    "range": "http://www.w3.org/2000/01/rdf-schema#range",
    "description": "http://www.w3.org/2000/01/rdf-schema#comment",
    "title": "http://www.w3.org/2000/01/rdf-schema#label",
    "required": "http://ns.adobe.com/adobecloud/meta/1.0/mandatory",
    "name": "http://ns.adobe.com/adobecloud/meta/1.0/jsonName"
};

function renderProperties(klass, types) {
    var jschema = new baseSchema();
    jschema.properties = {};
    jschema.required = [];
    _.forEach(klass.properties, function (v) {
        var mappedPropertyType = rdfRangeToJsonType[v[consts.RDFS_RANGE]];
        var rdfsLabel = v[consts.RDFS_LABEL];
        if (rdfsLabel === undefined) {
            rdfsLabel = v["@id"];
        }
        if (mappedPropertyType !== undefined) {
            jschema.properties[rdfsLabel] = mappedPropertyType;
        } else {
            jschema.properties[rdfsLabel] = {
                "type": "string"
            };
        }
        jschema.properties[rdfsLabel].description = v[consts.RDFS_RANGE];
    });
    if (jschema.required.length === 0) {
        delete jschema.required;
    }
    return jschema;
}

jsonSchema.renderClass = function (klass, schemaTypes, callback) {
    var jschema = new baseSchema();
    jschema.description = klass[ttlKeyNames.description];
    jschema.title = klass[ttlKeyNames.title];
    jschema.properties = {};
    jschema.required = [];
    _.forIn(klass.properties, function (propertyDetail, key) {
        var propertyName = propertyDetail[ttlKeyNames.name];
        var rdfRangeType = propertyDetail[ttlKeyNames.range];
        var mappedTypeDetail = rdfRangeToJsonType[rdfRangeType];
        if (mappedTypeDetail === undefined) {
            var schemaType = schemaTypes[rdfRangeType];
            if (!schemaType) {
                logger.warn("Could not get dataype for property.");
                return;
            }
            if (schemaType[consts.OWL_DATATYPE] && rdfRangeToJsonType[schemaType[consts.OWL_DATATYPE]]) {
                // Type has a owl data type defined and the owl type maps to a simple xsd type.
                jschema.properties[propertyName] = rdfRangeToJsonType[schemaType[consts.OWL_DATATYPE]];
            } else if (schemaType[consts.RDFS_SUBCLASSOF] && _.isArray(schemaType[consts.RDFS_SUBCLASSOF]) &&
                schemaType[consts.RDFS_SUBCLASSOF].indexOf(consts.RDF_LIST) > -1) {
                // Arrays can have special handling in json schema.
                var typeInfo = {
                    "type": "array"
                };
                _.forEach(schemaType.restrictions, function (v) {
                    if (v.predicate.valueOf() === consts.OWL_ALLVALUES) {
                        var restrictedType = schemaTypes[v.object.valueOf()];
                        if (_.size(restrictedType.properties) > 0) {
                            typeInfo.items = renderProperties(restrictedType, schemaTypes);
                        }
                    }
                });
                jschema.properties[propertyName] = typeInfo;
            } else {
                // This should probably recursively call this outer method :-/
                var dataType = schemaTypes[schemaType[consts.OWL_DATATYPE]];
                if (dataType === undefined) {
                    jschema.properties[propertyName] = renderProperties(schemaType, schemaTypes);
                } else {
                    jschema.properties[propertyName] = rdfRangeToJsonType[dataType[consts.OWL_DATATYPE]];
                }
            }
        } else {
            jschema.properties[propertyName] = mappedTypeDetail;
            jschema.properties[propertyName].description = rdfRangeType;
            if (propertyDetail[ttlKeyNames.required] === "true") {
                jschema.required.push(propertyName);
            }
        }
        if (jschema.properties[propertyName] === undefined) {
            log.warn("Could not add schema for JSON property: " + propertyName);
        }
    });
    if (jschema.required.length === 0) {
        delete jschema.required;
    }
    callback(null, jschema);
};
module.exports = jsonSchema;