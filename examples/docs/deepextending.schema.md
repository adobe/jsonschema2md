---
template: reference
foo: bar
---

# Custom Schema

```
https://example.com/schemas/deepextending
```

This is an extending schema. It is extending another extending schema. It pulls `definitions` from other schemas.

| Abstract | Extensible | Custom Properties | Defined In |
|----------|------------|-------------------|------------|
| Can be instantiated | Yes | Forbidden | [deepextending.schema.json](deepextending.schema.json) |

## Schema Hierarchy

* Custom `schema.$id`
 * [Extensible](extensible.schema.md) `https://example.com/schemas/extensible`
 * [Definitions](definitions.schema.md) `https://example.com/schemas/definitions`
 * [Extending](extending.schema.md) `https://example.com/schemas/extending`

---