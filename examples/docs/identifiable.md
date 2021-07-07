# Identifiable Schema

```txt
https://example.com/schemas/identifiable
```

This is a *very* simple example of a JSON schema. There is only one property.

| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                       |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :----------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | Yes          | Forbidden         | Allowed               | none                | [identifiable.schema.json](../generated-schemas/identifiable.schema.json "open original schema") |

## Identifiable Type

`object` ([Identifiable](identifiable.md))

# Identifiable Properties

| Property   | Type     | Required | Nullable       | Defined by                                                                                               |
| :--------- | :------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------- |
| [@id](#id) | `string` | Optional | cannot be null | [Identifiable](identifiable-properties-id.md "https://example.com/schemas/identifiable#/properties/@id") |

## @id

A unique identifier given to every addressable thing.

`@id`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Identifiable](identifiable-properties-id.md "https://example.com/schemas/identifiable#/properties/@id")

### @id Type

`string`

### @id Constraints

**URI**: the string must be a URI, according to [RFC 3986](https://tools.ietf.org/html/rfc3986 "check the specification")
