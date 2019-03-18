---
template: reference
foo: bar
---

# Complex References  Schema

```
https://example.com/schemas/complex
```

This is an example schema that uses types defined in other schemas.

| [Abstract](../abstract.md) | Extensible | [Status](../status.md) | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------------------------|------------|------------------------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | No | Experimental | No | Forbidden | Permitted | [complex.schema.json](complex.schema.json) |
## Schema Hierarchy

* Complex References  `https://example.com/schemas/complex`
  * [Abstract](abstract.schema.md) `https://example.com/schemas/abstract`
  * [Simple](simple.schema.md) `https://example.com/schemas/simple`


# Complex References  Properties

| Property | Type | Required | Nullable | Defined by |
|----------|------|----------|----------|------------|
| [and](#and) | complex | Optional  | No | Complex References  (this schema) |
| [or](#or) | complex | Optional  | No | Complex References  (this schema) |
| [refabstract](#refabstract) | `object` | **Required**  | No | Complex References  (this schema) |
| [reflist](#reflist) | Simple | Optional  | No | Complex References  (this schema) |
| [refnamed](#refnamed) | Simple | Optional  | No | Complex References  (this schema) |
| [xor](#xor) | complex | Optional  | No | Complex References  (this schema) |
| `int.*` | `integer` | Pattern | No | Complex References  (this schema) |
| `str.*` | `string` | Pattern | No | Complex References  (this schema) |
| `*` | any | Additional | Yes | this schema *allows* additional properties |

## and

Number in a range

`and`

* is optional
* type: complex
* defined in this schema

### and Type


**All** of the following *requirements* need to be fulfilled.


#### Requirement 1


`number`

* maximum value: `10`


#### Requirement 2


`number`

* minimum value: `0`







## or

String or number…

`or`

* is optional
* type: complex
* defined in this schema

### or Type


**Any** following *options* needs to be fulfilled.


#### Option 1


`string`




#### Option 2


`number`

* minimum value: `0`







## refabstract


`refabstract`

* is **required**
* type: `object`
* defined in this schema

### refabstract Type


`object` with following properties:


| Property | Type | Required |
|----------|------|----------|
| `foo`| string | Optional |
| `nonfoo`| boolean | Optional |



#### foo

A unique identifier given to every addressable thing.

`foo`

* is optional
* type: `string`

##### foo Type


`string`









#### nonfoo

This is not foo.

`nonfoo`

* is optional
* type: `const`

The value of this property **must** be equal to:

```json
false
```










## reflist


`reflist`

* is optional
* type: Simple
* defined in this schema

### reflist Type


Array type: Simple

All items must be of the type:
* [Simple](simple.schema.md) – `https://example.com/schemas/simple`








## refnamed


`refnamed`

* is optional
* type: Simple
* defined in this schema

### refnamed Type


* [Simple](simple.schema.md) – `https://example.com/schemas/simple`





## xor

Exclusive choice.

`xor`

* is optional
* type: complex
* defined in this schema

### xor Type


**One** of the following *conditions* need to be fulfilled.


#### Condition 1


`number`

* maximum value: `0`


#### Condition 2


`number`

* minimum value: `10`







## Pattern: `int.*`
Applies to all properties that match the regular expression `int.*`


`int.*`

* is a property pattern
* type: `integer`
* defined in this schema

### Pattern int.* Type


`integer`







## Pattern: `str.*`
Applies to all properties that match the regular expression `str.*`


`str.*`

* is a property pattern
* type: `string`
* defined in this schema

### Pattern str.* Type


`string`






