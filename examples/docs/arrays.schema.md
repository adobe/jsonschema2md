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
| [boollist](#boollist) | `boolean[]` | Optional | Arrays (this schema) |
| [coordinatelist](#coordinatelist) | `number[][]` | Optional | Arrays (this schema) |
| [intlist](#intlist) | `integer[]` | Optional | Arrays (this schema) |
| [list](#list) | `string[]` | Optional | Arrays (this schema) |
| [listlist](#listlist) | `array[]` | Optional | Arrays (this schema) |
| [numlist](#numlist) | `number[]` | Optional | Arrays (this schema) |
| [stringlistlist](#stringlistlist) | `string[][]` | Optional | Arrays (this schema) |

## list

This is an array

`list`
* is optional
* type: `string[]`

* defined in this schema

### list Type


Array type: `string[]`

All items must be of the type:
`string`









## listlist

This is an array of arrays

`listlist`
* is optional
* type: `array[]` (nested array)

* defined in this schema

### listlist Type


Nested array type: `array`










## stringlistlist

This is an array of arrays of strings

`stringlistlist`
* is optional
* type: `string[][]` (nested array)

* defined in this schema

### stringlistlist Type


Nested array type: `string[]`



All items must be of the type:
`string`











## intlist

This is an array

`intlist`
* is optional
* type: `integer[]`
* between `1` and `10` items in the array
* defined in this schema

### intlist Type


Array type: `integer[]`

All items must be of the type:
`integer`









## boollist

This is an array

`boollist`
* is optional
* type: `boolean[]`
* at least `1` items in the array
* defined in this schema

### boollist Type


Array type: `boolean[]`

All items must be of the type:
`boolean`







## numlist

This is an array

`numlist`
* is optional
* type: `number[]`
* no more than `10` items in the array
* defined in this schema

### numlist Type


Array type: `number[]`

All items must be of the type:
`number`
* minimum value: `10`








## coordinatelist

This is an array of coordinates in three-dimensional space.

`coordinatelist`
* is optional
* type: `number[][]` (nested array)
* no more than `10` items in the array
* defined in this schema

### coordinatelist Type


Nested array type: `number[]`



All items must be of the type:
`number`
* minimum value: `0`
* maximum value: `10`




  
A coordinate, specified by `x`, `y`, and `z` values






