/* eslint-env mocha */

const assert = require("assert");
const { loader, pointer, filename, id, titles } = require("../lib/schemaProxy");

const example = {
  "meta:license": [
    "Copyright 2017 Adobe Systems Incorporated. All rights reserved.",
    "This file is licensed to you under the Apache License, Version 2.0 (the 'License');",
    "you may not use this file except in compliance with the License. You may obtain a copy",
    "of the License at http://www.apache.org/licenses/LICENSE-2.0"
  ],
  $schema: "http://json-schema.org/draft-06/schema#",
  $id: "https://example.com/schemas/example",
  title: "Example",
  type: "object",
  description:
    "This is an example schema with examples. Too many examples? There can never be too many examples!",
  properties: {
    foo: {
      type: "string",
      description: "A simple string.",
      examples: ["bar"],
      version: "1.0.0",
      testProperty: "test"
    },
    bar: {
      type: "string",
      description: "A simple string.",
      examples: ["bar", "baz"],
      version: "1.0.0",
      testProperty: "test"
    },
    zip: {
      type: "object",
      title: 'An object'
    },
    baz: {
      "anyOf": [
        { "$ref": "#/properties/foo"},
        { "$ref": "#/properties/bar"}
      ]
    }
  }
};

const referencing = {
  $schema: "http://json-schema.org/draft-06/schema#",
  $id: "https://example.com/schemas/referencing",
  properties: {
    $ref: 'https://example.com/schemas/referencing#/properties'
  }
}

describe("Testing Schema Proxy", () => {

  it("Schema Proxy creates a JSON schema", () => {
    const proxied = loader()(example, 'example.schema.json');

    assert.equal(proxied.title, "Example");
    assert.equal(proxied.properties.foo.type, "string");
  });

  it("Schema Proxy loads multiple JSON schemas", () => {
    const myloader = loader();
    const proxied1 = myloader(example, 'example.schema.json');
    const proxied2 = myloader(referencing, 'referencing.schema.json');

    assert.equal(proxied1.title, "Example");
    assert.equal(proxied2.$id, "https://example.com/schemas/referencing");

  });

  it("Schema Proxy creates a JSON schema with Pointers", () => {
    const proxied = loader()(example, 'example.schema.json');

    assert.equal(proxied[pointer], "");
    assert.equal(proxied.properties[pointer], "/properties");
    assert.equal(proxied.properties.foo[pointer], "/properties/foo");
    assert.equal(proxied['meta:license'][pointer], "/meta:license");
    assert.equal(proxied.properties.baz.anyOf[0][pointer], "/properties/baz/anyOf/0");
  });

  it("Schema Proxy creates a JSON schema with ID References", () => {
    const proxied = loader()(example, 'example.schema.json');

    assert.equal(proxied[id], "https://example.com/schemas/example");
    assert.equal(proxied.properties[pointer], "/properties");

    assert.equal(proxied.properties[id], "https://example.com/schemas/example");
    assert.equal(proxied.properties[pointer], "/properties");

    assert.equal(proxied.properties.foo[id], "https://example.com/schemas/example");
    assert.equal(proxied['meta:license'][id], "https://example.com/schemas/example");
    assert.equal(proxied.properties.baz.anyOf[0][id], "https://example.com/schemas/example");
  });

  it("Schema Proxy creates a JSON schema with Filename References", () => {
    const proxied = loader()(example, 'example.schema.json');

    assert.equal(proxied[filename], "example.schema.json");
    assert.equal(proxied.properties[filename], "example.schema.json");
    assert.equal(proxied.properties.foo[filename], "example.schema.json");
    assert.equal(proxied['meta:license'][filename], "example.schema.json");
    assert.equal(proxied.properties.baz.anyOf[0][filename], "example.schema.json");
  });

  it("Schema Proxy creates a JSON schema with title References", () => {
    const proxied = loader()(example, 'example.schema.json');

    assert.deepStrictEqual(proxied[titles], ['Example']);
    assert.deepStrictEqual(proxied.properties.zip[titles], ['Example', undefined, 'An object']);
  });

  
});
