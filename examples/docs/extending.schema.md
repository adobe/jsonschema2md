---
template: reference
foo: bar
---

# Extending Schema

```
https://example.com/schemas/extending
```

This is an extending schema. It pulls `definitions` from other schemas.

| Abstract | Extensible | Custom Properties | Defined In |
|----------|------------|-------------------|------------|
| Can be instantiated | Yes | Forbidden | [extending.schema.json](extending.schema.json) |

## Schema Hierarchy

* Extending `https://example.com/schemas/extending`
  * [Extensible](extensible.schema.md) `https://example.com/schemas/extensible`
  * [Definitions](definitions.schema.md) `https://example.com/schemas/definitions`

# Extending Properties

| Property | Type | Required | Defined by |
|----------|------|----------|------------|
| [bar](#bar) | `string` | Optional | [Extensible](extensible.schema.md#bar) |
| [id](#id) | `string` | Optional | [Definitions](definitions.schema.md#id) |
| [baz](#baz) | `string` | Optional | Extending (this schema) |

## bar

A horse walks into it.

`bar`
* is optional
* type: `string`
* defined in [Extensible](extensible.schema.md#bar)

### Type

### Known Values

| Value | Description |
|-------|-------------|
| `hi`  | Welcome     |
| `bye` | Farewell    |

### bar Examples

```json
"whoo"
```

```json
"hoo"
```



## id

A unique identifier given to every addressable thing.

`id`
* is optional
* type: `string`
* defined in [Definitions](definitions.schema.md#id)

### Type

### Known Values

| Value | Description |
|-------|-------------|
| `hi`  | Welcome     |
| `bye` | Farewell    |



## baz
### BAAAZ!

This property has a unique name to demonstrate it&#39;s uniqueness.

`baz`
* is optional
* type: `string`
* defined in this schema

### Type

### Known Values

| Value | Description |
|-------|-------------|
| `hi`  | Welcome     |
| `bye` | Farewell    |

### baz Example

```json
"I'm just a humble example"
```

