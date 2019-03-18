---
template: reference
foo: bar
---

# Constant Types Schema

```
https://example.com/schemas/constants
```

This is an example schema with examples for properties with constant values

| [Abstract](../abstract.md) | Extensible | [Status](../status.md) | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------------------------|------------|------------------------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | No | Experimental | No | Forbidden | Permitted | [constants.schema.json](constants.schema.json) |

# Constant Types Properties

| Property | Type | Required | Nullable | Defined by |
|----------|------|----------|----------|------------|
| [hello](#hello) | `const` | **Required**  | No | Constant Types (this schema) |
| `*` | any | Additional | Yes | this schema *allows* additional properties |

## hello

A simple string, without strong constraints.

`hello`

* is **required**
* type: `const`
* defined in this schema

The value of this property **must** be equal to:

```json
"World"
```




