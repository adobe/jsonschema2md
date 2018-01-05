---
template: reference
foo: bar
---

# Abstract Schema

```
https://example.com/schemas/abstract
```

This is an abstract schema. It has `definitions`, but does not declare any properties

| Abstract | Extensible | Custom Properties | Defined In |
|----------|------------|-------------------|------------|
| Cannot be instantiated | Yes | Forbidden | [abstract.schema.json](abstract.schema.json) |

# Abstract Definitions

| Property | Type | Group |
|----------|------|-------|
| [foo](#foo) | `string` | `#/definitions/first` |
| [bar](#bar) | `string` | `#/definitions/second` |

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





