# Custom Schema

```txt
https://example.com/schemas/custom
```

This is an extensible schema. It has `definitions`, that can be used in other schemas. Additionally, it allows custom properties.

| Abstract               | Extensible | Status         | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                           |
| :--------------------- | :--------- | :------------- | :---------------------- | :---------------- | :-------------------- | :------------------ | :----------------------------------------------------------------------------------- |
| Cannot be instantiated | Yes        | Unknown status | Unknown identifiability | Allowed           | Allowed               | none                | [custom.schema.json](../generated-schemas/custom.schema.json "open original schema") |

## Custom Type

`object` ([Custom](custom.md))

all of

*   [Untitled undefined type in Custom](custom-allof-0.md "check type definition")

*   [Untitled undefined type in Custom](custom-allof-1.md "check type definition")

*   [Untitled undefined type in Custom](custom-allof-2.md "check type definition")

# Custom Definitions

## Definitions group first

Reference this group by using

```json
{"$ref":"https://example.com/schemas/custom#/definitions/first"}
```

| Property    | Type     | Required | Nullable       | Defined by                                                                                                                  |
| :---------- | :------- | :------- | :------------- | :-------------------------------------------------------------------------------------------------------------------------- |
| [foo](#foo) | `string` | Optional | cannot be null | [Custom](custom-definitions-first-properties-foo.md "https://example.com/schemas/custom#/definitions/first/properties/foo") |

### foo

A unique identifier given to every addressable thing.

`foo`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Custom](custom-definitions-first-properties-foo.md "https://example.com/schemas/custom#/definitions/first/properties/foo")

#### foo Type

`string`

## Definitions group second

Reference this group by using

```json
{"$ref":"https://example.com/schemas/custom#/definitions/second"}
```

| Property    | Type     | Required | Nullable       | Defined by                                                                                                                    |
| :---------- | :------- | :------- | :------------- | :---------------------------------------------------------------------------------------------------------------------------- |
| [bar](#bar) | `string` | Optional | cannot be null | [Custom](custom-definitions-second-properties-bar.md "https://example.com/schemas/custom#/definitions/second/properties/bar") |

### bar

A unique identifier given to every addressable thing.

`bar`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Custom](custom-definitions-second-properties-bar.md "https://example.com/schemas/custom#/definitions/second/properties/bar")

#### bar Type

`string`
