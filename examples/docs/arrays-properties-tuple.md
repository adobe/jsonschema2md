# Untitled array in Arrays Schema

```txt
https://example.com/schemas/arrays#/properties/tuple
```

This is an array of two values, one positive, one negative. All additional values must be 0.


| Abstract            | Extensible | Status         | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                             |
| :------------------ | ---------- | -------------- | ----------------------- | :---------------- | --------------------- | ------------------- | -------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | Unknown identifiability | Forbidden         | Allowed               | none                | [arrays.schema.json\*](../generated-schemas/arrays.schema.json "open original schema") |

## tuple Type

an array where each item follows the corresponding schema in the following list:

1.  [Positive Integer](arrays-properties-tuple-items-positive-integer.md "check type definition")
2.  [Negative Integer](arrays-properties-tuple-items-negative-integer.md "check type definition")
3.  and all following items must follow the schema: [Zero](arrays-properties-tuple-zero.md "check type definition")
