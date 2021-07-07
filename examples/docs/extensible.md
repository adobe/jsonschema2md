# Extensible Schema

```txt
https://example.com/schemas/extensible
```

This is an extensible schema. It has `definitions`, that can be used in other schemas

| Abstract               | Extensible | Status         | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                   |
| :--------------------- | :--------- | :------------- | :---------------------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------------------------------- |
| Cannot be instantiated | Yes        | Unknown status | Unknown identifiability | Forbidden         | Allowed               | none                | [extensible.schema.json](../generated-schemas/extensible.schema.json "open original schema") |

## Extensible Type

`object` ([Extensible](extensible.md))

# Extensible Definitions

## Definitions group first

Reference this group by using

```json
{"$ref":"https://example.com/schemas/extensible#/definitions/first"}
```

| Property    | Type     | Required | Nullable       | Defined by                                                                                                                              |
| :---------- | :------- | :------- | :------------- | :-------------------------------------------------------------------------------------------------------------------------------------- |
| [foo](#foo) | `string` | Optional | cannot be null | [Extensible](extensible-definitions-first-properties-foo.md "https://example.com/schemas/extensible#/definitions/first/properties/foo") |

### foo

A unique identifier given to every addressable thing.

`foo`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Extensible](extensible-definitions-first-properties-foo.md "https://example.com/schemas/extensible#/definitions/first/properties/foo")

#### foo Type

`string`

#### foo Examples

```json
"bar"
```

## Definitions group second

Reference this group by using

```json
{"$ref":"https://example.com/schemas/extensible#/definitions/second"}
```

| Property    | Type     | Required | Nullable       | Defined by                                                                                                                                |
| :---------- | :------- | :------- | :------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| [bar](#bar) | `string` | Optional | cannot be null | [Extensible](extensible-definitions-second-properties-bar.md "https://example.com/schemas/extensible#/definitions/second/properties/bar") |

### bar

A horse walks into it.

`bar`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Extensible](extensible-definitions-second-properties-bar.md "https://example.com/schemas/extensible#/definitions/second/properties/bar")

#### bar Type

`string`

#### bar Examples

```json
"whoo"
```

```json
"hoo"
```
