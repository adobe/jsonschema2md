---
template: reference
foo: bar
---

# Enumerated  Schema

```
https://example.com/schemas/enums
```

This is an example schema with examples for properties with enum values

| Abstract | Extensible | Custom Properties | Additional Properties | Defined In |
|----------|------------|-------------------|-----------------------|------------|
| Can be instantiated | No | Forbidden | Permitted | [enums.schema.json](enums.schema.json) |

# Enumerated  Properties

| Property | Type | Required | Defined by |
|----------|------|----------|------------|
| [hello](#hello) | `enum` | **Required** | Enumerated  (this schema) |
| `*` | any | Optional | this schema *allows* additional properties |

## hello

A simple string. Pick a value.

`hello`
* is **required**
* type: `enum`
* defined in this schema

The value of this property **must** be equal to one of the [known values below](#hello-known-values).

### hello Known Values
| Value | Description |
|-------|-------------|
| `World` |  |
| `Welt` |  |



