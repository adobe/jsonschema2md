---
template: reference
foo: bar
---

# Subdir Schema

```
https://example.com/schemas/subdir/subdir
```

A schema in a sub directory

| [Abstract](../../abstract.md) | Extensible | [Status](../../status.md) | Identifiable | Custom Properties | Additional Properties | Defined In |
|-------------------------------|------------|---------------------------|--------------|-------------------|-----------------------|------------|
| Cannot be instantiated | Yes | Experimental | No | Forbidden | Permitted | [subdir/subdir.schema.json](subdir.schema.json) |


**All** of the following *requirements* need to be fulfilled.


#### Requirement 1


* []() – `#/definitions/id`


# Subdir Definitions

| Property | Type | Group |
|----------|------|-------|
| [id](#id) | `string` | `https://example.com/schemas/subdir/subdir#/definitions/content` |

## id

A unique identifier given to every addressable thing.

`id`

* is optional
* type: `string`
* defined in this schema

### id Type


`string`

* format: `uri` – Uniformous Resource Identifier (according to [RFC3986](http://tools.ietf.org/html/rfc3986))





