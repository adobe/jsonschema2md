---
template: reference
foo: bar
---

# Join Types Schema

```
https://example.com/schemas/join
```

This is an example of a JSON schema with only a join type key. Here a 'oneOf'.

| [Abstract](../abstract.md) | Extensible | [Status](../status.md) | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------------------------|------------|------------------------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | No | Experimental | No | Forbidden | Permitted | [join.schema.json](join.schema.json) |


**One** of the following *conditions* need to be fulfilled.


#### Condition 1


`object` with following properties:


| Property | Type | Required |
|----------|------|----------|
| `foo`| string | Optional |



#### foo

A simple string.

`foo`

* is optional
* type: `string`

##### foo Type


`string`






##### foo Example

```json
hello
```




#### Condition 2


`object` with following properties:


| Property | Type | Required |
|----------|------|----------|
| `bar`| string | Optional |



#### bar

A simple string.

`bar`

* is optional
* type: `string`

##### bar Type


`string`






##### bar Example

```json
world
```



