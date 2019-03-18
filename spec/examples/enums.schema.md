---
template: reference
foo: bar
---

# Enumerated  Schema

```
https://example.com/schemas/enums
```

This is an example schema with examples for properties with enum values

| [Abstract](../abstract.md) | Extensible | [Status](../status.md) | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------------------------|------------|------------------------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | No | Experimental | No | Forbidden | Permitted | [enums.schema.json](enums.schema.json) |

# Enumerated  Properties

| Property | Type | Required | Nullable | Defined by |
|----------|------|----------|----------|------------|
| [hello](#hello) | `enum` | **Required**  | No | Enumerated  (this schema) |
| [nested](#nested) | `object` | Optional  | No | Enumerated  (this schema) |
| `*` | any | Additional | Yes | this schema *allows* additional properties |

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




## nested
### Enumerated (Nested)

This is an example schema with examples for properties of nested objects with enum values

`nested`

* is optional
* type: `object`
* defined in this schema

### nested Type


`object` with following properties:


| Property | Type | Required |
|----------|------|----------|
| `test`| string | Optional |



#### test

A simple string. Pick a value.

`test`

* is optional
* type: `enum`

The value of this property **must** be equal to one of the [known values below](#nested-known-values).

##### test Known Values
| Value | Description |
|-------|-------------|
| `nested` |  |
| `object` |  |
| `works` |  |








