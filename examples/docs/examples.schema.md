---
template: reference
foo: bar
---

# Examples Schema

```
https://example.com/schemas/examples
```

This is an example schema with *multiple* examples. Too many examples? There can never be too many examples!

| Abstract | Extensible | Custom Properties | Defined In |
|----------|------------|-------------------|------------|
| Can be instantiated | No | Forbidden | [examples.schema.json](examples.schema.json) |

## Examples Examples

```json
{
  "foo": "bi",
  "bar": "bu"
}
```

```json
{
  "foo": "zip",
  "bar": "zap"
}
```


# Examples Properties

| Property | Type | Required | Defined by |
|----------|------|----------|------------|
| [foo](#foo) | `string` | Optional | Examples (this schema) |
| [bar](#bar) | `string` | Optional | Examples (this schema) |

## foo

A simple string.

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

A simple string.

`bar`
* is **required**
* type: `string`
* defined in this schema

### bar Type


`string`





### bar Examples

```json
"bar"
```

```json
"baz"
```


