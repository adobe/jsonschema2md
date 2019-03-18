---
template: reference
foo: bar
---

# Arrays Schema

```
https://example.com/schemas/arrays
```

This is an example schema with examples for multiple array types and their constraints.

| [Abstract](../abstract.md) | Extensible | [Status](../status.md) | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------------------------|------------|------------------------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | No | Experimental | No | Forbidden | Permitted | [arrays.schema.json](arrays.schema.json) |

# Arrays Properties

| Property | Type | Required | Nullable | Defined by |
|----------|------|----------|----------|------------|
| [JoinTypelist](#jointypelist) | `array` | Optional  | No | Arrays (this schema) |
| [boollist](#boollist) | `boolean[]` | Optional  | No | Arrays (this schema) |
| [coordinatelist](#coordinatelist) | `number[][]` | Optional  | No | Arrays (this schema) |
| [intlist](#intlist) | `integer[]` | Optional  | No | Arrays (this schema) |
| [list](#list) | `string[]` | Optional  | No | Arrays (this schema) |
| [listlist](#listlist) | `array[]` | Optional  | No | Arrays (this schema) |
| [numlist](#numlist) | `number[]` | Optional  | No | Arrays (this schema) |
| [objectlist](#objectlist) | `object[]` | Optional  | No | Arrays (this schema) |
| [stringlistlist](#stringlistlist) | `string[][]` | Optional  | No | Arrays (this schema) |
| `*` | any | Additional | Yes | this schema *allows* additional properties |

## JoinTypelist

An array of simple objects

`JoinTypelist`

* is optional
* type: `array`
* defined in this schema

### JoinTypelist Type


Array type: `array`

All items must be of the type:

**One** of the following *conditions* need to be fulfilled.


#### Condition 1


`object` with following properties:


| Property | Type | Required |
|----------|------|----------|
| `foo`| string | Optional |



#### foo

A simple string.

`foo`

* is optional
* type: `string`

##### foo Type


`string`






##### foo Example

```json
hello
```




#### Condition 2


`object` with following properties:


| Property | Type | Required |
|----------|------|----------|
| `bar`| string | Optional |



#### bar

A simple string.

`bar`

* is optional
* type: `string`

##### bar Type


`string`






##### bar Example

```json
world
```




  







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








## objectlist

An array of simple objects

`objectlist`

* is optional
* type: `object[]`
* defined in this schema

### objectlist Type


Array type: `object[]`

All items must be of the type:
`object` with following properties:


| Property | Type | Required |
|----------|------|----------|
| `a`| string | **Required** |
| `b`| integer | Optional |



#### a

The a property

`a`

* is **required**
* type: `string`

##### a Type


`string`









#### b

The b property

`b`

* is optional
* type: `integer`

##### b Type


`integer`















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











