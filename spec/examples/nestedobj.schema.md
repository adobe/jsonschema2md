---
template: reference
foo: bar
---

# Nested Object Schema

```
https://example.com/schemas/nestedobject
```


| [Abstract](../abstract.md) | Extensible | [Status](../status.md) | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------------------------|------------|------------------------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | No | Experimental | No | Forbidden | Forbidden | [nestedobj.schema.json](nestedobj.schema.json) |

# Nested Object Properties

| Property | Type | Required | Nullable | Defined by |
|----------|------|----------|----------|------------|
| [settings](#settings) | `object` | Optional  | No | Nested Object (this schema) |

## settings

settings

`settings`

* is optional
* type: `object`
* defined in this schema

### settings Type


`object` with following properties:


| Property | Type | Required |
|----------|------|----------|
| `collaborators`| object | Optional |



#### collaborators

collaborators

`collaborators`

* is optional
* type: `object`

##### collaborators Type


`object` with following properties:


| Property | Type | Required |
|----------|------|----------|
| `id`| string | Optional |



#### id


`id`

* is optional
* type: `string`

##### id Type


`string`
















