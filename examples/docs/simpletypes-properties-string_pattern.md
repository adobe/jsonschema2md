# Untitled string in Simple Types Schema

```txt
https://example.com/schemas/simpletypes#/properties/string_pattern
```

A string following a regular expression

| Abstract            | Extensible | Status         | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                      |
| :------------------ | :--------- | :------------- | :---------------------- | :---------------- | :-------------------- | :------------------ | :---------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | Unknown identifiability | Forbidden         | Allowed               | none                | [simpletypes.schema.json*](../generated-schemas/simpletypes.schema.json "open original schema") |

## string_pattern Type

`string`

## string_pattern Constraints

**pattern**: the string must match the following regular expression: 

```regexp
^ba.$
```

[try pattern](https://regexr.com/?expression=%5Eba.%24 "try regular expression with regexr.com")

## string_pattern Examples

```json
"bar"
```

```json
"baz"
```

```json
"bat"
```
