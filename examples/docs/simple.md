# Simple Schema

```txt
https://example.com/schemas/simple
```

This is a *very* simple example of a JSON schema. There is only one property.

| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                           |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :----------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Allowed               | none                | [simple.schema.json](../generated-schemas/simple.schema.json "open original schema") |

## Simple Type

`object` ([Simple](simple.md))

# Simple Properties

| Property  | Type     | Required | Nullable       | Defined by                                                                            |
| :-------- | :------- | :------- | :------------- | :------------------------------------------------------------------------------------ |
| [id](#id) | `string` | Optional | cannot be null | [Simple](simple-properties-id.md "https://example.com/schemas/simple#/properties/id") |

## id

A unique identifier given to every addressable thing.

`id`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Simple](simple-properties-id.md "https://example.com/schemas/simple#/properties/id")

### id Type

`string`

### id Constraints

**URI**: the string must be a URI, according to [RFC 3986](https://tools.ietf.org/html/rfc3986 "check the specification")
