---
template: reference
foo: bar
---

# Extending Schema

```
https://example.com/schemas/extending
```

This is an extending schema. It pulls `definitions` from other schemas.

| Abstract | Extensible | Custom Properties | Defined In |
|----------|------------|-------------------|------------|
| Can be instantiated | Yes | Forbidden | [extending.schema.json](extending.schema.json) |

## Schema Hierarchy

* Extending `https://example.com/schemas/extending`
  * [Extensible](extensible.schema.md) `https://example.com/schemas/extensible`
  * [Definitions](definitions.schema.md) `https://example.com/schemas/definitions`

# Extending Properties

| Property | Type | Required |
|----------|------|----------|
| [bar](#bar) | `string` | Optional |
| [id](#id) | `string` | Optional |
| [baz](#baz) | `string` | Optional |
