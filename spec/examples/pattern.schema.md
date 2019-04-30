---
template: reference
foo: bar
---

# Pattern Properties Schema

```
https://example.com/schemas/pattern
```

This is an example of a JSON schema with only a `patternProperties` key.

| [Abstract](../abstract.md) | Extensible | [Status](../status.md) | Identifiable | Custom Properties | Additional Properties | Defined In                                 |
| -------------------------- | ---------- | ---------------------- | ------------ | ----------------- | --------------------- | ------------------------------------------ |
| Can be instantiated        | No         | Experimental           | No           | Forbidden         | Permitted             | [pattern.schema.json](pattern.schema.json) |

## Pattern: `[0-9]`

Applies to all properties that match the regular expression `[0-9]`

A simple string.

`[0-9]`

- is a property pattern
- type: `string`
- defined in this schema

### Pattern [0-9] Type

`string`

### [0-9] Example

```json
"bar"
```
