---
template: reference
foo: bar
---

# Example Schema

```
https://example.com/schemas/example
```

This is an example schema with examples. Too many examples? There can never be too many examples!

| Abstract | Extensible | Custom Properties | Defined In |
|----------|------------|-------------------|------------|
| Can be instantiated | No | Forbidden | [example.schema.json](example.schema.json) |

## Example Example
```json
{
  "foo": "bar",
  "bar": "baz"
}
```

# Example Properties

| Property | Type | Required | Defined by |
|----------|------|----------|------------|
| [foo](#foo) | `string` | Optional | Example (this schema) |
| [bar](#bar) | `string` | Optional | Example (this schema) |

## foo

A simple string.

`foo`
* is optional
* type: `string`
* defined in this schema

### foo Type

This is a string. 

### Known Values

| Value | Description |
|-------|-------------|
| `hi`  | Welcome     |
| `bye` | Farewell    |

### foo Example

```json
"bar"
```


## bar

A simple string.

`bar`
* is optional
* type: `string`
* defined in this schema

### bar Type

This is a string. 

### Known Values

| Value | Description |
|-------|-------------|
| `hi`  | Welcome     |
| `bye` | Farewell    |

### bar Examples

```json
"bar"
```

```json
"baz"
```


