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

| Property | Type | Required | Nullable | Defined by |
|----------|------|----------|----------|------------|
| [id](#id) | `string` | Optional  | No | Simple (this schema) |
| `*` | any | Additional | Yes | this schema *allows* additional properties |

## id

A unique identifier given to every addressable thing.

`id`

* is optional
* type: `string`
* defined in this schema

### id Type


`string`

* format: `uri` – Uniformous Resource Identifier (according to [RFC3986](http://tools.ietf.org/html/rfc3986))







**All** of the following *requirements* need to be fulfilled.


#### Requirement 1


* []() – `#/definitions/id`

