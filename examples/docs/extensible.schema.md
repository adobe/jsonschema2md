---
template: reference
foo: bar
---

# Extensible Schema

```
https://example.com/schemas/extensible
```

This is an extensible schema. It has `definitions`, that can be used in other schemas

| Abstract | Extensible | Custom Properties | Defined In |
|----------|------------|-------------------|------------|
| Cannot be instantiated | Yes | Forbidden | [extensible.schema.json](extensible.schema.json) |

# Extensible Definitions

| Property | Type | Group |
|----------|------|-------|
| [foo](#foo) | `string` | `#/definitions/first` |
| [bar](#bar) | `string` | `#/definitions/second` |

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


