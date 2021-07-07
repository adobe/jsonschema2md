# Abstract Schema

```txt
https://example.com/schemas/abstract
```

This is an abstract schema. It has `definitions`, but does not declare any properties

| Abstract               | Extensible | Status         | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                               |
| :--------------------- | :--------- | :------------- | :---------------------- | :---------------- | :-------------------- | :------------------ | :--------------------------------------------------------------------------------------- |
| Cannot be instantiated | Yes        | Unknown status | Unknown identifiability | Forbidden         | Allowed               | none                | [abstract.schema.json](../generated-schemas/abstract.schema.json "open original schema") |

## Abstract Type

`object` ([Abstract](abstract.md))

# Abstract Definitions

## Definitions group first

Reference this group by using

```json
{"$ref":"https://example.com/schemas/abstract#/definitions/first"}
```

| Property          | Type      | Required | Nullable       | Defined by                                                                                                                              |
| :---------------- | :-------- | :------- | :------------- | :-------------------------------------------------------------------------------------------------------------------------------------- |
| [foo](#foo)       | `string`  | Optional | cannot be null | [Abstract](abstract-definitions-first-properties-foo.md "https://example.com/schemas/abstract#/definitions/first/properties/foo")       |
| [nonfoo](#nonfoo) | `boolean` | Optional | cannot be null | [Abstract](abstract-definitions-first-properties-nonfoo.md "https://example.com/schemas/abstract#/definitions/first/properties/nonfoo") |

### foo

A unique identifier given to every addressable thing.

`foo`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Abstract](abstract-definitions-first-properties-foo.md "https://example.com/schemas/abstract#/definitions/first/properties/foo")

#### foo Type

`string`

### nonfoo

This is not foo.

`nonfoo`

*   is optional

*   Type: `boolean`

*   cannot be null

*   defined in: [Abstract](abstract-definitions-first-properties-nonfoo.md "https://example.com/schemas/abstract#/definitions/first/properties/nonfoo")

#### nonfoo Type

`boolean`

#### nonfoo Constraints

**constant**: the value of this property must be equal to:

```json
false
```

## Definitions group second

Reference this group by using

```json
{"$ref":"https://example.com/schemas/abstract#/definitions/second"}
```

| Property    | Type     | Required | Nullable       | Defined by                                                                                                                          |
| :---------- | :------- | :------- | :------------- | :---------------------------------------------------------------------------------------------------------------------------------- |
| [bar](#bar) | `string` | Optional | cannot be null | [Abstract](abstract-definitions-second-properties-bar.md "https://example.com/schemas/abstract#/definitions/second/properties/bar") |

### bar

A unique identifier given to every addressable thing.

`bar`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Abstract](abstract-definitions-second-properties-bar.md "https://example.com/schemas/abstract#/definitions/second/properties/bar")

#### bar Type

`string`
