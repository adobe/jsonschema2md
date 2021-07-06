# Enumerated  Schema

```txt
https://example.com/schemas/enums
```

This is an example schema with examples for properties with enum values

| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                         |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :--------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Allowed               | none                | [enums.schema.json](../generated-schemas/enums.schema.json "open original schema") |

## Enumerated  Type

`object` ([Enumerated ](enums.md))

# Enumerated  Properties

| Property          | Type     | Required | Nullable       | Defined by                                                                                                  |
| :---------------- | :------- | :------- | :------------- | :---------------------------------------------------------------------------------------------------------- |
| [hello](#hello)   | `string` | Required | cannot be null | [Enumerated ](enums-properties-hello.md "https://example.com/schemas/enums#/properties/hello")              |
| [nested](#nested) | `object` | Optional | cannot be null | [Enumerated ](enums-properties-enumerated-nested.md "https://example.com/schemas/enums#/properties/nested") |

## hello

A simple string. Pick a value.

`hello`

*   is required

*   Type: `string`

*   cannot be null

*   defined in: [Enumerated ](enums-properties-hello.md "https://example.com/schemas/enums#/properties/hello")

### hello Type

`string`

### hello Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value     | Explanation |
| :-------- | :---------- |
| `"World"` |             |
| `"Welt"`  |             |

## nested

This is an example schema with examples for properties of nested objects with enum values

`nested`

*   is optional

*   Type: `object` ([Enumerated (Nested)](enums-properties-enumerated-nested.md))

*   cannot be null

*   defined in: [Enumerated ](enums-properties-enumerated-nested.md "https://example.com/schemas/enums#/properties/nested")

### nested Type

`object` ([Enumerated (Nested)](enums-properties-enumerated-nested.md))
