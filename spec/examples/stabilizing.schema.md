---
template: reference
foo: bar
---

# Stabilizing Schema

```
https://example.com/schemas/stabilizing
```

This is a schema which is currently in the `stabilizing` status.

| [Abstract](../abstract.md) | Extensible | [Status](../status.md) | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------------------------|------------|------------------------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | No | Stabilizing | No | Forbidden | Permitted | [stabilizing.schema.json](stabilizing.schema.json) |

# Stabilizing Properties

| Property | Type | Required | Nullable | Defined by |
|----------|------|----------|----------|------------|
| [id](#id) | `string` | Optional  | No | Stabilizing (this schema) |
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

