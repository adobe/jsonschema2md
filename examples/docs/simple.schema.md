---
template: reference
foo: bar
---

# Simple Schema

```
https://example.com/schemas/simple
```

This is a *very* simple example of a JSON schema. There is only one property.

| [Abstract](../abstract.md) | Extensible | [Status](../status.md) | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------------------------|------------|------------------------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | No | Experimental | No | Forbidden | Permitted | [simple.schema.json](simple.schema.json) |

# Simple Properties

| Property | Type | Required | Defined by |
|----------|------|----------|------------|
| [id](#id) | `string` | Optional | Simple (this schema) |
| `*` | any | Additional | this schema *allows* additional properties |

## id

A unique identifier given to every addressable thing.

`id`
* is optional
* type: `string`
* defined in this schema

### id Type


`string`
* format: `uri` – Uniformous Resource Identifier (according to [RFC3986](http://tools.ietf.org/html/rfc3986))





