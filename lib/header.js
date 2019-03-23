/**
 * Copyright 2018 Adobe Systems Incorporated. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

const _ = require('lodash');
const path = require('path');

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
  constructor(name, docs, value, links, base) {
    this.name = name;
    this.docs = docs;
    this.value = value;
    this.links = links;
    this.base = base || '';

    this.renderHeader = this.render(this.name, this.docs, this.base);
    this.renderValue = this.render(this.value, this.links, this.base);
  }

  render(text, link, base) {
    return function() {
      if (link) {
        return `[${text}](${base}${link})`;
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

function link(indir, filename, inlink) {
  if (inlink) {
    return path.relative(path.relative(indir, filename), inlink);
  } else {
    return inlink;
  }
}

function isIdentifiable(schema) {
  if (!schema.properties) {
    return 'Unknown';
  }
  if (schema.properties['@id']&&schema.properties['@id'].type==='string'&&schema.properties['@id'].format==='uri') {
    return 'Yes';
  } else {
    return 'No';
  }
}

function headers(schema, indir, filename, docs, outdir) {
  const props = schemaProps(schema, indir, filename);
  this.doclinks = docs ? docs : {};
  this.myheaders = [];

  this.myheaders.push(new Header('Abstract', link(indir, filename, this.doclinks['abstract']), props.abstract));
  this.myheaders.push(new Header('Extensible', link(indir, filename, this.doclinks['extensible']), props.extensible));
  this.myheaders.push(new Header('Status', link(indir, filename, this.doclinks['status']), props.status));
  this.myheaders.push(new Header('Identifiable', link(indir, filename, this.doclinks['id']), isIdentifiable(schema)));
  this.myheaders.push(new Header('Custom Properties', link(indir, filename, this.doclinks['custom']), props.custom));
  this.myheaders.push(new Header('Additional Properties', link(indir, filename, this.doclinks['additional']), schema.additionalProperties===false ? 'Forbidden' : 'Permitted'));
  this.myheaders.push(new Header('Defined In', undefined, props.original, path.basename(props.original)));

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
