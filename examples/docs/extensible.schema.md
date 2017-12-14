---
template: reference
foo: bar
---

# Extensible Schema

```
https://example.com/schemas/extensible
```

This is an extensible schema. It has `definitions`, that can be used in other schemas

| Abstract | Extensible | Custom Properties | Defined In |
|----------|------------|-------------------|------------|
| Cannot be instantiated | Yes | Forbidden | [extensible.schema.json](extensible.schema.json) |

# Extensible Definitions

| Property | Type |
|----------|------|
| [foo](#foo) | `string` |
| [bar](#bar) | `string` |
