---
template: reference
foo: bar
---

# Arrays Schema

```
https://example.com/schemas/arrays
```

This is an example schema with examples for multiple array types and their constraints.

| Abstract | Extensible | Custom Properties | Defined In |
|----------|------------|-------------------|------------|
| Can be instantiated | No | Forbidden | [arrays.schema.json](arrays.schema.json) |

# Arrays Properties

| Property | Type | Required | Defined by |
|----------|------|----------|------------|
| [list](#list) | `string[]` | Optional | Arrays (this schema) |
| [intlist](#intlist) | `integer[]` | Optional | Arrays (this schema) |

## list

This is an array

`list`
* is optional
* type: `string[]`
* defined in this schema

### list Type

Unknown type `array`.

```json
{
  "type": "array",
  "description": "This is an array",
  "items": {
    "type": "string",
    "simpletype": "`string`"
  },
  "simpletype": "`string[]`"
}
```





## intlist

This is an array

`intlist`
* is optional
* type: `integer[]`
* defined in this schema

### intlist Type

Unknown type `array`.

```json
{
  "type": "array",
  "description": "This is an array",
  "items": {
    "type": "integer",
    "simpletype": "`integer`"
  },
  "simpletype": "`integer[]`"
}
```




