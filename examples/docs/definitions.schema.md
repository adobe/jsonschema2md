---
template: reference
foo: bar
---

# Definitions Schema

```
https://example.com/schemas/definitions
```

This is an example of using a `definitions` object within a schema.
It is imported using `allOf` and `$ref`.

| Abstract | Extensible | Custom Properties | Defined In |
|----------|------------|-------------------|------------|
| Can be instantiated | Yes | Forbidden | [definitions.schema.json](definitions.schema.json) |

# Definitions Properties

| Property | Type | Required | Defined by |
|----------|------|----------|------------|
| [id](#id) | `string` | Optional | Definitions (this schema) |

## id

A unique identifier given to every addressable thing.

`id`
* is **required**
* type: `string`
* defined in this schema

### id Type


`string`
* format: `uri` Uniformous Resource Identifier (according to [RFC3986](http://tools.ietf.org/html/rfc3986))





