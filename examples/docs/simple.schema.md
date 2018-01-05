---
template: reference
foo: bar
---

# Simple Schema

```
https://example.com/schemas/simple
```

This is a *very* simple example of a JSON schema. There is only one property.

| Abstract | Extensible | Custom Properties | Defined In |
|----------|------------|-------------------|------------|
| Can be instantiated | No | Forbidden | [simple.schema.json](simple.schema.json) |

# Simple Properties

| Property | Type | Required | Defined by |
|----------|------|----------|------------|
| [id](#id) | `string` | Optional | Simple (this schema) |

## id

A unique identifier given to every addressable thing.

`id`
* is optional
* type: `string`
* defined in this schema

### id Type


`string`
* format: `uri` – Uniformous Resource Identifier (according to [RFC3986](http://tools.ietf.org/html/rfc3986))





