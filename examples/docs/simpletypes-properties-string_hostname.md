# Untitled string in Simple Types Schema

```txt
https://example.com/schemas/simpletypes#/properties/string_hostname
```

A hostname-like string.

| Abstract            | Extensible | Status         | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                      |
| :------------------ | :--------- | :------------- | :---------------------- | :---------------- | :-------------------- | :------------------ | :---------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | Unknown identifiability | Forbidden         | Allowed               | none                | [simpletypes.schema.json*](../generated-schemas/simpletypes.schema.json "open original schema") |

## string_hostname Type

`string`

## string_hostname Constraints

**hostname**: the string must be a hostname, according to [RFC 1123, section 2.1](https://tools.ietf.org/html/rfc1123 "check the specification")
