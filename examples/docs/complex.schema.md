---
template: reference
foo: bar
---

# Complex References  Schema

```
https://example.com/schemas/complex
```

This is an example schema that uses types defined in other schemas.

| Abstract | Extensible | Custom Properties | Additional Properties | Defined In |
|----------|------------|-------------------|-----------------------|------------|
| Can be instantiated | No | Forbidden | Permitted | [complex.schema.json](complex.schema.json) |

## Schema Hierarchy

* Complex References  `https://example.com/schemas/complex`
  * [Abstract](abstract.schema.md) `https://example.com/schemas/abstract`
  * [Simple](simple.schema.md) `https://example.com/schemas/simple`

# Complex References  Properties

| Property | Type | Required | Defined by |
|----------|------|----------|------------|
| [and](#and) | complex | Optional | Complex References  (this schema) |
| [or](#or) | complex | Optional | Complex References  (this schema) |
| [refabstract](#refabstract) | complex | **Required** | Complex References  (this schema) |
| [reflist](#reflist) | Simple | Optional | Complex References  (this schema) |
| [refnamed](#refnamed) | Simple | Optional | Complex References  (this schema) |
| [xor](#xor) | complex | Optional | Complex References  (this schema) |
| `int.*` | `integer` | Optional | Complex References  (this schema) |
| `str.*` | `string` | Optional | Complex References  (this schema) |
| `*` | any | Optional | this schema *allows* additional properties |

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
* type: complex
* defined in this schema

### refabstract Type

Unknown type ``.

```json
{
  "properties": {
    "foo": {
      "type": "string",
      "description": "A unique identifier given to every addressable thing."
    }
  },
  "required": true,
  "simpletype": "complex"
}
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






