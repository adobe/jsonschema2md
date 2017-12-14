---
template: reference
foo: bar
---

# Complex References  Schema

```
https://example.com/schemas/complex
```

This is an example schema that uses types defined in other schemas.

| Abstract | Extensible | Custom Properties | Defined In |
|----------|------------|-------------------|------------|
| Can be instantiated | No | Forbidden | [complex.schema.json](complex.schema.json) |

## Schema Hierarchy

* Complex References  `https://example.com/schemas/complex`
  * [Abstract](abstract.schema.md) `https://example.com/schemas/abstract`
  * [Simple](simple.schema.md) `https://example.com/schemas/simple`

# Complex References  Properties

| Property | Type | Required | Defined by |
|----------|------|----------|------------|
| [refabstract](#refabstract) | complex | **Required** | Complex References  (this schema) |
| [refnamed](#refnamed) | Simple | Optional | Complex References  (this schema) |
| [reflist](#reflist) | Simple | Optional | Complex References  (this schema) |
| [or](#or) | complex | Optional | Complex References  (this schema) |

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





## refnamed



`refnamed`
* is optional
* type: Simple
* defined in this schema

### refnamed Type


* [Simple](simple.schema.md) – `https://example.com/schemas/simple`





## reflist



`reflist`
* is optional
* type: Simple

* defined in this schema

### reflist Type


Array type: Simple

All items must be of the type:
* [Simple](simple.schema.md) – `https://example.com/schemas/simple`








## or

String or number…

`or`
* is optional
* type: complex
* defined in this schema

### or Type

Unknown type ``.

```json
{
  "description": "String or number…",
  "anyOf": [
    {
      "type": "string"
    },
    {
      "type": "number"
    }
  ],
  "simpletype": "complex"
}
```




