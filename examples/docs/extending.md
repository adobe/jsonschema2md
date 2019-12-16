# Extending Schema

```txt
https://example.com/schemas/extending
```

This is an extending schema. It pulls `definitions` from other schemas.


| Abstract               | Extensible | Status         | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                 |
| :--------------------- | ---------- | -------------- | ----------------------- | :---------------- | --------------------- | ------------------- | ------------------------------------------------------------------------------------------ |
| Cannot be instantiated | Yes        | Unknown status | Unknown identifiability | Forbidden         | Allowed               | none                | [extending.schema.json](../generated-schemas/extending.schema.json "open original schema") |

## Extending Type

`object` ([Extending](extending.md))

all of

-   [Untitled undefined type in Extending](extending-allof-0.md "check type definition")
-   [Untitled undefined type in Extending](definitions-definitions-myid.md "check type definition")
-   [Untitled undefined type in Extending](extending-allof-2.md "check type definition")

# Extending Definitions

## Definitions group third

Reference this group by using

```json
{"$ref":"https://example.com/schemas/extending#/definitions/third"}
```

| Property    | Type     | Required | Nullable       | Defined by                                                                                                                            |
| :---------- | -------- | -------- | -------------- | :------------------------------------------------------------------------------------------------------------------------------------ |
| [baz](#baz) | `string` | Optional | cannot be null | [Extending](deepextending-allof-2-properties-baaaz.md "https&#x3A;//example.com/schemas/extending#/definitions/third/properties/baz") |

### baz

This property has a unique name to demonstrate it's uniqueness.


`baz`

-   is optional
-   Type: `string` ([BAAAZ!](deepextending-allof-2-properties-baaaz.md))
-   cannot be null
-   defined in: [Extending](deepextending-allof-2-properties-baaaz.md "https&#x3A;//example.com/schemas/extending#/definitions/third/properties/baz")

#### baz Type

`string` ([BAAAZ!](deepextending-allof-2-properties-baaaz.md))

#### baz Examples

```json
"I'm just a humble example"
```
