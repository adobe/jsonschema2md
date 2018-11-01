---
template: reference
foo: bar
---

# Abstract Schema

```
https://example.com/schemas/abstract
```

This is an abstract schema. It has `definitions`, but does not declare any properties

| [Abstract](../abstract.md) | Extensible | [Status](../status.md) | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------------------------|------------|------------------------|--------------|-------------------|-----------------------|------------|
| Cannot be instantiated | Yes | Experimental | No | Forbidden | Permitted | [abstract.schema.json](abstract.schema.json) |

# Abstract Definitions

| Property | Type | Group |
|----------|------|-------|
| [bar](#bar) | `string` | `https://example.com/schemas/abstract#/definitions/second` |
| [foo](#foo) | `string` | `https://example.com/schemas/abstract#/definitions/first` |
| [nonfoo](#nonfoo) | `const` | `https://example.com/schemas/abstract#/definitions/first` |

## bar

A unique identifier given to every addressable thing.

`bar`

* is optional
* type: `string`
* defined in this schema

### bar Type


`string`







## foo

A unique identifier given to every addressable thing.

`foo`

* is optional
* type: `string`
* defined in this schema

### foo Type


`string`







## nonfoo

This is not foo.

`nonfoo`

* is optional
* type: `const`
* defined in this schema

The value of this property **must** be equal to:

```json
false
```




