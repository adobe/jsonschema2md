---
template: reference
foo: bar
---

# Subdir Schema

```
https://example.com/schemas/subdir/subdir
```

A schema in a sub directory

| [Abstract](../../abstract.md) | Extensible | [Status](../../status.md) | Identifiable | Custom Properties | Additional Properties | Defined In                                      |
| ----------------------------- | ---------- | ------------------------- | ------------ | ----------------- | --------------------- | ----------------------------------------------- |
| Can be instantiated           | Yes        | Experimental              | No           | Forbidden         | Permitted             | [subdir/subdir.schema.json](subdir.schema.json) |

# Subdir Properties

| Property  | Type     | Required   | Nullable | Defined by                                 |
| --------- | -------- | ---------- | -------- | ------------------------------------------ |
| [id](#id) | `string` | Optional   | No       | Subdir (this schema)                       |
| `*`       | any      | Additional | Yes      | this schema _allows_ additional properties |

## id

A unique identifier given to every addressable thing.

`id`

- is optional
- type: `string`
- defined in this schema

### id Type

`string`

- format: `uri` – Uniformous Resource Identifier (according to [RFC3986](http://tools.ietf.org/html/rfc3986))

**All** of the following _requirements_ need to be fulfilled.

#### Requirement 1

- []() – `#/definitions/content`
