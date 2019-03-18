---
template: reference
foo: bar
---

# Type Arrays Schema

```
https://example.com/schemas/typearrays
```

This schema test type arrays and nullable types

| [Abstract](../abstract.md) | Extensible | [Status](../status.md) | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------------------------|------------|------------------------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | No | Experimental | No | Forbidden | Permitted | [typearrays.schema.json](typearrays.schema.json) |

# Type Arrays Properties

| Property | Type | Required | Nullable | Defined by |
|----------|------|----------|----------|------------|
| [null](#null) | `null` | Optional  | No | Type Arrays (this schema) |
| [string-or-null](#string-or-null) | `string` | Optional  | Yes | Type Arrays (this schema) |
| [string-or-number](#string-or-number) | multiple | Optional  | No | Type Arrays (this schema) |
| [string-or-number-null](#string-or-number-null) | multiple | Optional  | Yes | Type Arrays (this schema) |
| `*` | any | Additional | Yes | this schema *allows* additional properties |

## null

This is just nothing

`null`

* is optional
* type: `null`
* defined in this schema

### null Type


`null`
This property can only have the value `null`.




## string-or-null

Nullable string

`string-or-null`

* is optional
* type: `string`
* defined in this schema

### string-or-null Type


`string`, nullable







## string-or-number

Types can be many things

`string-or-number`

* is optional
* type: multiple
* defined in this schema

### string-or-number Type


Either one of:
 * `string`
 * `number`





## string-or-number-null

Types can be many things, even nothing at all.

`string-or-number-null`

* is optional
* type: multiple
* defined in this schema

### string-or-number-null Type


Either one of:
 * `string`
 * `number`
 * or `null`






**All** of the following *requirements* need to be fulfilled.


#### Requirement 1


* []() – `#/definitions/id`

