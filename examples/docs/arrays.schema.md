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
| [listlist](#listlist) | `array[]` | Optional | Arrays (this schema) |
| [stringlistlist](#stringlistlist) | `string[][]` | Optional | Arrays (this schema) |
| [intlist](#intlist) | `integer[]` | Optional | Arrays (this schema) |
| [boollist](#boollist) | `boolean[]` | Optional | Arrays (this schema) |
| [numlist](#numlist) | `number[]` | Optional | Arrays (this schema) |

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





## listlist

This is an array of arrays

`listlist`
* is optional
* type: `array[]` (nested array)

* defined in this schema

### listlist Type

Unknown type `array`.

```json
{
  "type": "array",
  "description": "This is an array of arrays",
  "items": {
    "type": "array",
    "simpletype": "`array`"
  },
  "simpletype": "`array[]`"
}
```





## stringlistlist

This is an array of arrays of strings

`stringlistlist`
* is optional
* type: `string[][]` (nested array)

* defined in this schema

### stringlistlist Type

Unknown type `array`.

```json
{
  "type": "array",
  "description": "This is an array of arrays of strings",
  "items": {
    "type": "array",
    "items": {
      "type": "string",
      "simpletype": "`string`"
    },
    "simpletype": "`string[]`"
  },
  "simpletype": "`string[][]`"
}
```





## intlist

This is an array

`intlist`
* is optional
* type: `integer[]`
* between `1` and `10` items in the array
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
  "maxItems": 10,
  "minItems": 1,
  "simpletype": "`integer[]`"
}
```





## boollist

This is an array

`boollist`
* is optional
* type: `boolean[]`
* at least `1` items in the array
* defined in this schema

### boollist Type

Unknown type `array`.

```json
{
  "type": "array",
  "description": "This is an array",
  "items": {
    "type": "boolean",
    "simpletype": "`boolean`"
  },
  "minItems": 1,
  "simpletype": "`boolean[]`"
}
```





## numlist

This is an array

`numlist`
* is optional
* type: `number[]`
* no more than `10` items in the array
* defined in this schema

### numlist Type

Unknown type `array`.

```json
{
  "type": "array",
  "description": "This is an array",
  "items": {
    "type": "number",
    "simpletype": "`number`"
  },
  "maxItems": 10,
  "simpletype": "`number[]`"
}
```




