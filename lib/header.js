/**
 * Copyright 2018 Adobe Systems Incorporated. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

var _ = require('lodash');

function custom(schema) {
  if (schema.allOf) {
    for (let i=0; i<schema.allOf.length; i++) {
      if (schema.allOf[i].$ref && schema.allOf[i].$ref === 'https://ns.adobe.com/xdm/common/extensible.schema.json#/definitions/@context') {
        return true;
      }
    }
  }
  return false;
}

function schemaProps(schema, schemaPath, filename) {
  return {
    // if there are definitions, but no properties
    abstract: (schema.definitions !== undefined && _.keys(schema.properties).length === 0) ? 'Cannot be instantiated' : 'Can be instantiated',
    extensible: (schema.definitions !== undefined || schema['meta:extensible'] === true) ? 'Yes' : 'No',
    status: schema['meta:status'] !== undefined ? (schema['meta:status'].charAt(0).toUpperCase() + schema['meta:status'].slice(1)) : 'Experimental',
    custom: custom(schema) ? 'Allowed' : 'Forbidden',
    original: filename.substr(schemaPath.length).substr(1),
  };
}

class Header {
  constructor(name, docs, value, links) {
    this.name = name;
    this.docs = docs;
    this.value = value;
    this.links = links;

    this.renderHeader = this.render(this.name, this.docs);
    this.renderValue = this.render(this.value, this.links);
  }

  render(text, link) {
    return function() {
      if (link) {
        return `[${text}](${link})`;
      } else {
        return text;
      }
    };
  }
}

function header(name, docs, value, links) {
  this.name = name;
  this.docs = docs;
  this.value = value;
  this.links = links;


  this.render = function(text, link) {
    return function() {
      if (link) {
        return `[${text}](${link})`;
      } else {
        return text;
      }
    };
  };
  this.renderHeader = this.render(this.name, this.docs);
  this.renderValue = this.render(this.value, this.links);

  return this;
}

function headers(schema, path, filename, docs) {
  const props = schemaProps(schema, path, filename);
  this.doclinks = docs ? docs : {};
  this.myheaders = [];

  this.myheaders.push(new Header('Abstract', this.doclinks['abstract'], props.abstract));
  this.myheaders.push(new Header('Extensible', this.doclinks['extensible'], props.extensible));
  this.myheaders.push(new Header('Status', this.doclinks['status'], props.status));
  this.myheaders.push(new Header('Custom Properties', this.doclinks['custom'], props.custom));
  this.myheaders.push(new Header('Additional Properties', this.doclinks['additional'], schema.additionalProperties===false ? 'Forbidden' : 'Permitted'));
  this.myheaders.push(new Header('Defined In', undefined, props.original, props.original));

  this.render = function() {
    var buf = '';

    //header
    buf += '|';
    _.forEach(this.myheaders, myheader => {
      buf += ' ' + myheader.renderHeader() + ' |';
    });
    buf += '\n';


    //divider
    buf += '|';
    _.forEach(this.myheaders, myheader => {
      buf += '-' + myheader.renderHeader().replace(/./g, '-') + '-|';
    });
    buf += '\n';

    //body
    buf += '|';
    _.forEach(this.myheaders, myheader => {
      buf += ' ' + myheader.renderValue() + ' |';
    });


    return buf;
  };

  return this;
}

module.exports.headers = headers;
module.exports.header = header;
module.exports.Header = Header;
