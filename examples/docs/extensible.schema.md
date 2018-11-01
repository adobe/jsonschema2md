---
template: reference
foo: bar
---

# Extensible Schema

```
https://example.com/schemas/extensible
```

This is an extensible schema. It has `definitions`, that can be used in other schemas

| [Abstract](../abstract.md) | Extensible | [Status](../status.md) | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------------------------|------------|------------------------|--------------|-------------------|-----------------------|------------|
| Cannot be instantiated | Yes | Experimental | No | Forbidden | Permitted | [extensible.schema.json](extensible.schema.json) |

# Extensible Definitions

| Property | Type | Group |
|----------|------|-------|
| [bar](#bar) | `string` | `https://example.com/schemas/extensible#/definitions/second` |
| [foo](#foo) | `string` | `https://example.com/schemas/extensible#/definitions/first` |

## bar

A horse walks into it.

`bar`

* is optional
* type: `string`
* defined in this schema

### bar Type


`string`






### bar Examples

```json
"whoo"
```

```json
"hoo"
```



## foo

A unique identifier given to every addressable thing.

`foo`

* is optional
* type: `string`
* defined in this schema

### foo Type


`string`






### foo Example

```json
"bar"
```

