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
| [baz](#baz) | `string` | Optional | Extending (this schema) |
| [id](#id) | `string` | Optional | [Definitions](definitions.schema.md#id) |

## bar

A horse walks into it.

`bar`
* is optional
* type: `string`
* defined in [Extensible](extensible.schema.md#bar)

### bar Type


`string`





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

### id Type


`string`
* format: `uri` Uniformous Resource Identifier (according to [RFC3986](http://tools.ietf.org/html/rfc3986))






## baz
### BAAAZ!

This property has a unique name to demonstrate it&#39;s uniqueness.

`baz`
* is optional
* type: `string`
* defined in this schema

### baz Type


`string`





### baz Example

```json
"I'm just a humble example"
```

