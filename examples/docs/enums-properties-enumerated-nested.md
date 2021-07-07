# Enumerated (Nested) Schema

```txt
https://example.com/schemas/enums#/properties/nested
```

This is an example schema with examples for properties of nested objects with enum values

| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                          |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :---------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Allowed               | none                | [enums.schema.json*](../generated-schemas/enums.schema.json "open original schema") |

## nested Type

`object` ([Enumerated (Nested)](enums-properties-enumerated-nested.md))

# nested Properties

| Property      | Type     | Required | Nullable       | Defined by                                                                                                                                  |
| :------------ | :------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------ |
| [test](#test) | `string` | Optional | cannot be null | [Enumerated ](enums-properties-enumerated-nested-properties-test.md "https://example.com/schemas/enums#/properties/nested/properties/test") |

## test

A simple string. Pick a value.

`test`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Enumerated ](enums-properties-enumerated-nested-properties-test.md "https://example.com/schemas/enums#/properties/nested/properties/test")

### test Type

`string`

### test Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value      | Explanation |
| :--------- | :---------- |
| `"nested"` |             |
| `"object"` |             |
| `"works"`  |             |
