# Type Arrays Schema

```txt
https://example.com/schemas/typearrays
```

This schema test type arrays and nullable types

| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                   |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Allowed               | none                | [typearrays.schema.json](../generated-schemas/typearrays.schema.json "open original schema") |

## Type Arrays Type

`object` ([Type Arrays](typearrays.md))

# Type Arrays Properties

| Property                                        | Type          | Required | Nullable       | Defined by                                                                                                                               |
| :---------------------------------------------- | :------------ | :------- | :------------- | :--------------------------------------------------------------------------------------------------------------------------------------- |
| [null](#null)                                   | Not specified | Optional | can be null    | [Type Arrays](typearrays-properties-null.md "https://example.com/schemas/typearrays#/properties/null")                                   |
| [string-or-null](#string-or-null)               | `string`      | Optional | can be null    | [Type Arrays](typearrays-properties-string-or-null.md "https://example.com/schemas/typearrays#/properties/string-or-null")               |
| [string-or-number](#string-or-number)           | Multiple      | Optional | cannot be null | [Type Arrays](typearrays-properties-string-or-number.md "https://example.com/schemas/typearrays#/properties/string-or-number")           |
| [string-or-number-null](#string-or-number-null) | Multiple      | Optional | can be null    | [Type Arrays](typearrays-properties-string-or-number-null.md "https://example.com/schemas/typearrays#/properties/string-or-number-null") |

## null

This is just nothing

`null`

*   is optional

*   Type: `null`, the value must be null

*   can be null

*   defined in: [Type Arrays](typearrays-properties-null.md "https://example.com/schemas/typearrays#/properties/null")

### null Type

`null`, the value must be null

## string-or-null

Nullable string

`string-or-null`

*   is optional

*   Type: `string`

*   can be null

*   defined in: [Type Arrays](typearrays-properties-string-or-null.md "https://example.com/schemas/typearrays#/properties/string-or-null")

### string-or-null Type

`string`

## string-or-number

Types can be many things

`string-or-number`

*   is optional

*   Type: any of the following: `string` or `number` ([Details](typearrays-properties-string-or-number.md))

*   cannot be null

*   defined in: [Type Arrays](typearrays-properties-string-or-number.md "https://example.com/schemas/typearrays#/properties/string-or-number")

### string-or-number Type

any of the following: `string` or `number` ([Details](typearrays-properties-string-or-number.md))

## string-or-number-null

Types can be many things, even nothing at all.

`string-or-number-null`

*   is optional

*   Type: any of the following: `string` or `number` ([Details](typearrays-properties-string-or-number-null.md))

*   can be null

*   defined in: [Type Arrays](typearrays-properties-string-or-number-null.md "https://example.com/schemas/typearrays#/properties/string-or-number-null")

### string-or-number-null Type

any of the following: `string` or `number` ([Details](typearrays-properties-string-or-number-null.md))
