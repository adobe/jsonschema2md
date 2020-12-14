# Arrays Schema

```txt
https://example.com/schemas/arrays
```

This is an example schema with examples for multiple array types and their constraints.


| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                           |
| :------------------ | ---------- | -------------- | ------------ | :---------------- | --------------------- | ------------------- | ------------------------------------------------------------------------------------ |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Allowed               | none                | [arrays.schema.json](../generated-schemas/arrays.schema.json "open original schema") |

## Arrays Type

`object` ([Arrays](arrays.md))

# Arrays Properties

| Property                          | Type    | Required | Nullable       | Defined by                                                                                                         |
| :-------------------------------- | ------- | -------- | -------------- | :----------------------------------------------------------------------------------------------------------------- |
| [tuple](#tuple)                   | `array` | Optional | cannot be null | [Arrays](arrays-properties-tuple.md "https&#x3A;//example.com/schemas/arrays#/properties/tuple")                   |
| [list](#list)                     | `array` | Optional | cannot be null | [Arrays](arrays-properties-list.md "https&#x3A;//example.com/schemas/arrays#/properties/list")                     |
| [listlist](#listlist)             | `array` | Optional | cannot be null | [Arrays](arrays-properties-listlist.md "https&#x3A;//example.com/schemas/arrays#/properties/listlist")             |
| [stringlistlist](#stringlistlist) | `array` | Optional | cannot be null | [Arrays](arrays-properties-stringlistlist.md "https&#x3A;//example.com/schemas/arrays#/properties/stringlistlist") |
| [intlist](#intlist)               | `array` | Optional | cannot be null | [Arrays](arrays-properties-intlist.md "https&#x3A;//example.com/schemas/arrays#/properties/intlist")               |
| [boollist](#boollist)             | `array` | Optional | cannot be null | [Arrays](arrays-properties-boollist.md "https&#x3A;//example.com/schemas/arrays#/properties/boollist")             |
| [numlist](#numlist)               | `array` | Optional | cannot be null | [Arrays](arrays-properties-numlist.md "https&#x3A;//example.com/schemas/arrays#/properties/numlist")               |
| [coordinatelist](#coordinatelist) | `array` | Optional | cannot be null | [Arrays](arrays-properties-coordinatelist.md "https&#x3A;//example.com/schemas/arrays#/properties/coordinatelist") |
| [objectlist](#objectlist)         | `array` | Optional | cannot be null | [Arrays](arrays-properties-objectlist.md "https&#x3A;//example.com/schemas/arrays#/properties/objectlist")         |
| [JoinTypelist](#jointypelist)     | `array` | Optional | cannot be null | [Arrays](arrays-properties-jointypelist.md "https&#x3A;//example.com/schemas/arrays#/properties/JoinTypelist")     |

## tuple

This is an array of two values, one positive, one negative. All additional values must be 0.


`tuple`

-   is optional
-   Type: an array where each item follows the corresponding schema in the following list:

    1.  [Positive Integer](arrays-properties-tuple-items-positive-integer.md "check type definition")
    2.  [Negative Integer](arrays-properties-tuple-items-negative-integer.md "check type definition")
    3.  and all following items must follow the schema: [Zero](arrays-properties-tuple-zero.md "check type definition")
-   cannot be null
-   defined in: [Arrays](arrays-properties-tuple.md "https&#x3A;//example.com/schemas/arrays#/properties/tuple")

### tuple Type

an array where each item follows the corresponding schema in the following list:

1.  [Positive Integer](arrays-properties-tuple-items-positive-integer.md "check type definition")
2.  [Negative Integer](arrays-properties-tuple-items-negative-integer.md "check type definition")
3.  and all following items must follow the schema: [Zero](arrays-properties-tuple-zero.md "check type definition")

## list

This is an array


`list`

-   is optional
-   Type: `string[]`
-   cannot be null
-   defined in: [Arrays](arrays-properties-list.md "https&#x3A;//example.com/schemas/arrays#/properties/list")

### list Type

`string[]`

## listlist

This is an array of arrays


`listlist`

-   is optional
-   Type: `array[]`
-   cannot be null
-   defined in: [Arrays](arrays-properties-listlist.md "https&#x3A;//example.com/schemas/arrays#/properties/listlist")

### listlist Type

`array[]`

## stringlistlist

This is an array of arrays of strings


`stringlistlist`

-   is optional
-   Type: `string[][]`
-   cannot be null
-   defined in: [Arrays](arrays-properties-stringlistlist.md "https&#x3A;//example.com/schemas/arrays#/properties/stringlistlist")

### stringlistlist Type

`string[][]`

## intlist

This is an array


`intlist`

-   is optional
-   Type: `integer[]`
-   cannot be null
-   defined in: [Arrays](arrays-properties-intlist.md "https&#x3A;//example.com/schemas/arrays#/properties/intlist")

### intlist Type

`integer[]`

### intlist Constraints

**maximum number of items**: the maximum number of items for this array is: `10`

**minimum number of items**: the minimum number of items for this array is: `1`

## boollist

This is an array


`boollist`

-   is optional
-   Type: `boolean[]`
-   cannot be null
-   defined in: [Arrays](arrays-properties-boollist.md "https&#x3A;//example.com/schemas/arrays#/properties/boollist")

### boollist Type

`boolean[]`

### boollist Constraints

**minimum number of items**: the minimum number of items for this array is: `1`

## numlist

This is an array


`numlist`

-   is optional
-   Type: `number[]`
-   cannot be null
-   defined in: [Arrays](arrays-properties-numlist.md "https&#x3A;//example.com/schemas/arrays#/properties/numlist")

### numlist Type

`number[]`

### numlist Constraints

**maximum number of items**: the maximum number of items for this array is: `10`

## coordinatelist

This is an array of coordinates in three-dimensional space.


`coordinatelist`

-   is optional
-   Type: `number[][]`
-   cannot be null
-   defined in: [Arrays](arrays-properties-coordinatelist.md "https&#x3A;//example.com/schemas/arrays#/properties/coordinatelist")

### coordinatelist Type

`number[][]`

### coordinatelist Constraints

**maximum number of items**: the maximum number of items for this array is: `10`

## objectlist

An array of simple objects


`objectlist`

-   is optional
-   Type: `object[]` ([Details](arrays-properties-objectlist-items.md))
-   cannot be null
-   defined in: [Arrays](arrays-properties-objectlist.md "https&#x3A;//example.com/schemas/arrays#/properties/objectlist")

### objectlist Type

`object[]` ([Details](arrays-properties-objectlist-items.md))

## JoinTypelist

An array of simple objects


`JoinTypelist`

-   is optional
-   Type: an array of merged types ([Details](arrays-properties-jointypelist-items.md))
-   cannot be null
-   defined in: [Arrays](arrays-properties-jointypelist.md "https&#x3A;//example.com/schemas/arrays#/properties/JoinTypelist")

### JoinTypelist Type

an array of merged types ([Details](arrays-properties-jointypelist-items.md))
