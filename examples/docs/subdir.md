# Subdir Schema

```txt
https://example.com/schemas/subdir/subdir
```

A schema in a sub directory

| Abstract               | Extensible | Status         | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                  |
| :--------------------- | :--------- | :------------- | :---------------------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------------------------------ |
| Cannot be instantiated | Yes        | Unknown status | Unknown identifiability | Forbidden         | Allowed               | none                | [subdir.schema.json](../generated-schemas/subdir/subdir.schema.json "open original schema") |

## Subdir Type

`object` ([Subdir](subdir.md))

all of

*   [Untitled undefined type in Subdir](subdir-allof-0.md "check type definition")

# Subdir Definitions

## Definitions group content

Reference this group by using

```json
{"$ref":"https://example.com/schemas/subdir/subdir#/definitions/content"}
```

| Property  | Type     | Required | Nullable       | Defined by                                                                                                                           |
| :-------- | :------- | :------- | :------------- | :----------------------------------------------------------------------------------------------------------------------------------- |
| [id](#id) | `string` | Optional | cannot be null | [Subdir](subdir-definitions-content-properties-id.md "https://example.com/schemas/subdir/subdir#/definitions/content/properties/id") |

### id

A unique identifier given to every addressable thing.

`id`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Subdir](subdir-definitions-content-properties-id.md "https://example.com/schemas/subdir/subdir#/definitions/content/properties/id")

#### id Type

`string`

#### id Constraints

**URI**: the string must be a URI, according to [RFC 3986](https://tools.ietf.org/html/rfc3986 "check the specification")
