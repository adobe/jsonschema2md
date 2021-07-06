# Constant Types Schema

```txt
https://example.com/schemas/constants
```

This is an example schema with examples for properties with constant values

| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                 |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :----------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Allowed               | none                | [constants.schema.json](../generated-schemas/constants.schema.json "open original schema") |

## Constant Types Type

`object` ([Constant Types](constants.md))

# Constant Types Properties

| Property        | Type     | Required | Nullable       | Defined by                                                                                                |
| :-------------- | :------- | :------- | :------------- | :-------------------------------------------------------------------------------------------------------- |
| [hello](#hello) | `string` | Required | cannot be null | [Constant Types](constants-properties-hello.md "https://example.com/schemas/constants#/properties/hello") |

## hello

A simple string, without strong constraints.

`hello`

*   is required

*   Type: `string`

*   cannot be null

*   defined in: [Constant Types](constants-properties-hello.md "https://example.com/schemas/constants#/properties/hello")

### hello Type

`string`

### hello Constraints

**constant**: the value of this property must be equal to:

```json
"World"
```
