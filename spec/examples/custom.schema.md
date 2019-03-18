---
template: reference
foo: bar
---

# Custom Schema

```
https://example.com/schemas/custom
```

This is an extensible schema. It has `definitions`, that can be used in other schemas. Additionally, it allows custom properties.

| [Abstract](../abstract.md) | Extensible | [Status](../status.md) | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------------------------|------------|------------------------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | Yes | Experimental | No | Allowed | Permitted | [custom.schema.json](custom.schema.json) |

# Custom Properties

| Property | Type | Required | Nullable | Defined by |
|----------|------|----------|----------|------------|
| [bar](#bar) | `string` | Optional  | No | Custom (this schema) |
| [foo](#foo) | `string` | Optional  | No | Custom (this schema) |
| `*` | any | Additional | Yes | this schema *allows* additional properties |

## bar

A unique identifier given to every addressable thing.

`bar`

* is optional
* type: `string`
* defined in this schema

### bar Type


`string`







## foo

A unique identifier given to every addressable thing.

`foo`

* is optional
* type: `string`
* defined in this schema

### foo Type


`string`








**All** of the following *requirements* need to be fulfilled.


#### Requirement 1


* []() – `https://ns.adobe.com/xdm/common/extensible.schema.json#/definitions/@context`


#### Requirement 2


* []() – `#/definitions/first`


#### Requirement 3


* []() – `#/definitions/second`

