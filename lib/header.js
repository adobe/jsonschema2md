/**
 * Copyright 2018 Adobe Systems Incorporated. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

var _ = require('lodash');

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

function headers(schema) {
  this.headers = [];
}

module.exports.headers = headers;
module.exports.header = header;
