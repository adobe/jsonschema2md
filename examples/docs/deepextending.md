# Deeply Extending Schema

```txt
https://example.com/schemas/deepextending
```

This is an extending schema. It is extending another extending schema. It pulls `definitions` from other schemas.

| Abstract               | Extensible | Status         | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                         |
| :--------------------- | :--------- | :------------- | :---------------------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------------------------------------- |
| Cannot be instantiated | Yes        | Unknown status | Unknown identifiability | Forbidden         | Allowed               | none                | [deepextending.schema.json](../generated-schemas/deepextending.schema.json "open original schema") |

## Deeply Extending Type

`object` ([Deeply Extending](deepextending.md))

all of

*   [Untitled undefined type in Deeply Extending](deepextending-allof-0.md "check type definition")

*   [Untitled undefined type in Deeply Extending](deepextending-allof-1.md "check type definition")

*   [Untitled object in Deeply Extending](extending-definitions-third.md "check type definition")

*   [Untitled undefined type in Deeply Extending](deepextending-allof-3.md "check type definition")

# Deeply Extending Definitions

## Definitions group fourth

Reference this group by using

```json
{"$ref":"https://example.com/schemas/deepextending#/definitions/fourth"}
```

| Property    | Type     | Required | Nullable       | Defined by                                                                                                                                            |
| :---------- | :------- | :------- | :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| [hey](#hey) | `string` | Optional | cannot be null | [Deeply Extending](deepextending-definitions-fourth-properties-hey.md "https://example.com/schemas/deepextending#/definitions/fourth/properties/hey") |

### hey

A unique identifier given to every addressable thing.

`hey`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Deeply Extending](deepextending-definitions-fourth-properties-hey.md "https://example.com/schemas/deepextending#/definitions/fourth/properties/hey")

#### hey Type

`string`
