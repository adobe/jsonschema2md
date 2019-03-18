---
template: reference
foo: bar
---

# Definitions Schema

```
https://example.com/schemas/definitions
```

This is an example of using a `definitions` object within a schema.

It is imported using `allOf` and `$ref`.

And the description has line breaks.

So.

Many.

Line.

Bre-

aks.

> Everything is better with a quote.


| [Abstract](../abstract.md) | Extensible | [Status](../status.md) | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------------------------|------------|------------------------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | Yes | Experimental | Yes | Forbidden | Permitted | [definitions.schema.json](definitions.schema.json) |

# Definitions Properties

| Property | Type | Required | Nullable | Defined by |
|----------|------|----------|----------|------------|
| [@id](#id) | `string` | Optional  | No | Definitions (this schema) |
| [id](#id-1) | `string` | **Required**  | No | Definitions (this schema) |
| [meta:id](#metaid) | `string` | Optional  | No | Definitions (this schema) |
| `*` | any | Additional | Yes | this schema *allows* additional properties |

## @id

An `id` with an `@` in front of it. The `@` stands for "dot com"

`@id`

* is optional
* type: `string`
* defined in this schema

### @id Type


`string`

* format: `uri` – Uniformous Resource Identifier (according to [RFC3986](http://tools.ietf.org/html/rfc3986))






## id

A unique identifier given to every addressable thing.

`id`

* is **required**
* type: `string`
* defined in this schema

### id Type


`string`

* format: `uri-reference` – URI Reference (according to [RFC3986](https://tools.ietf.org/html/rfc3986))






## meta:id

An about ids. It is meta. If you are confused, send an email to the address specified in this property value.

`meta:id`

* is optional
* type: `string`
* defined in this schema

### meta:id Type


`string`

* format: `email` – email address (according to [RFC 5322, section 3.4.1](https://tools.ietf.org/html/rfc5322))







**All** of the following *requirements* need to be fulfilled.


#### Requirement 1


* []() – `#/definitions/myid`

