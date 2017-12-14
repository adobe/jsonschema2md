---
template: reference
foo: bar
---

# Simple Types Schema

```
https://example.com/schemas/simpletypes
```

This is an example schema with examples for multiple types and their constraints.

| Abstract | Extensible | Custom Properties | Defined In |
|----------|------------|-------------------|------------|
| Can be instantiated | No | Forbidden | [simpletypes.schema.json](simpletypes.schema.json) |

# Simple Types Properties

| Property | Type | Required | Defined by |
|----------|------|----------|------------|
| [string_unconstrained](#string_unconstrained) | `string` | Optional | Simple Types (this schema) |
| [string_length](#string_length) | `string` | Optional | Simple Types (this schema) |
| [string_pattern](#string_pattern) | `string` | Optional | Simple Types (this schema) |
| [string_pattern_noexample](#string_pattern_noexample) | `string` | Optional | Simple Types (this schema) |
| [string_pattern_singleexample](#string_pattern_singleexample) | `string` | Optional | Simple Types (this schema) |
| [string_date](#string_date) | `string` | Optional | Simple Types (this schema) |
| [string_email](#string_email) | `string` | Optional | Simple Types (this schema) |
| [string_hostname](#string_hostname) | `string` | Optional | Simple Types (this schema) |
| [string_ipv4](#string_ipv4) | `string` | Optional | Simple Types (this schema) |
| [string_ipv6](#string_ipv6) | `string` | Optional | Simple Types (this schema) |
| [string_uri](#string_uri) | `string` | Optional | Simple Types (this schema) |
| [number_unconstrained](#number_unconstrained) | `number` | Optional | Simple Types (this schema) |
| [interger_unconstrained](#interger_unconstrained) | complex | Optional | Simple Types (this schema) |
| [interger_constrained](#interger_constrained) | complex | Optional | Simple Types (this schema) |
| [number_constrained](#number_constrained) | `number` | Optional | Simple Types (this schema) |
| [integer_threes](#integer_threes) | complex | Optional | Simple Types (this schema) |

## string_unconstrained

A simple string, without any constraints.

`string_unconstrained`
* is optional
* type: `string`
* defined in this schema

### string_unconstrained Type


`string`



### Known Values

| Value | Description |
|-------|-------------|
| `hi`  | Welcome     |
| `bye` | Farewell    |

### string_unconstrained Example

```json
"bar"
```


## string_length

A string with minumum and maximum length

`string_length`
* is optional
* type: `string`
* defined in this schema

### string_length Type


`string`
* minimum length: 3 characters
* maximum length: 3 characters

### Known Values

| Value | Description |
|-------|-------------|
| `hi`  | Welcome     |
| `bye` | Farewell    |

### string_length Examples

```json
"bar"
```

```json
"baz"
```



## string_pattern

A string following a regular expression

`string_pattern`
* is optional
* type: `string`
* defined in this schema

### string_pattern Type


`string`


All instances must conform to this regular expression 
```regex
^ba.$
```

* test example: [bar](https://regexr.com/?expression=%5Eba.%24&text=bar)
* test example: [baz](https://regexr.com/?expression=%5Eba.%24&text=baz)
* test example: [bat](https://regexr.com/?expression=%5Eba.%24&text=bat)


### Known Values

| Value | Description |
|-------|-------------|
| `hi`  | Welcome     |
| `bye` | Farewell    |

### string_pattern Examples

```json
"bar"
```

```json
"baz"
```

```json
"bat"
```



## string_pattern_noexample

A string following a regular expression

`string_pattern_noexample`
* is optional
* type: `string`
* defined in this schema

### string_pattern_noexample Type


`string`


All instances must conform to this regular expression 
(test examples [here](https://regexr.com/?expression=%5Eba.%24)):
```regex
^ba.$
```



### Known Values

| Value | Description |
|-------|-------------|
| `hi`  | Welcome     |
| `bye` | Farewell    |



## string_pattern_singleexample

A string following a regular expression

`string_pattern_singleexample`
* is optional
* type: `string`
* defined in this schema

### string_pattern_singleexample Type


`string`


All instances must conform to this regular expression 
```regex
^ba.$
```

* test example: [bar](https://regexr.com/?expression=%5Eba.%24&text=bar)


### Known Values

| Value | Description |
|-------|-------------|
| `hi`  | Welcome     |
| `bye` | Farewell    |

### string_pattern_singleexample Example

```json
"bar"
```


## string_date

A date-like string.

`string_date`
* is optional
* type: `string`
* defined in this schema

### string_date Type


`string`
* format: `date-time` date and time (according to [RFC 3339, section 5.6](http://tools.ietf.org/html/rfc3339))


### Known Values

| Value | Description |
|-------|-------------|
| `hi`  | Welcome     |
| `bye` | Farewell    |



## string_email

An email-like string.

`string_email`
* is optional
* type: `string`
* defined in this schema

### string_email Type


`string`
* format: `email` email address (according to [RFC 5322, section 3.4.1](https://tools.ietf.org/html/rfc5322))


### Known Values

| Value | Description |
|-------|-------------|
| `hi`  | Welcome     |
| `bye` | Farewell    |



## string_hostname

A hostname-like string.

`string_hostname`
* is optional
* type: `string`
* defined in this schema

### string_hostname Type


`string`
* format: `hostname` Domain Name (according to [RFC 1034, section 3.1](https://tools.ietf.org/html/rfc1034))


### Known Values

| Value | Description |
|-------|-------------|
| `hi`  | Welcome     |
| `bye` | Farewell    |



## string_ipv4

An IPv4-like string.

`string_ipv4`
* is optional
* type: `string`
* defined in this schema

### string_ipv4 Type


`string`
* format: `ipv4` IP (v4) address (according to [RFC 2673, section 3.2](https://tools.ietf.org/html/rfc2673))


### Known Values

| Value | Description |
|-------|-------------|
| `hi`  | Welcome     |
| `bye` | Farewell    |



## string_ipv6

An IPv6-like string.

`string_ipv6`
* is optional
* type: `string`
* defined in this schema

### string_ipv6 Type


`string`
* format: `ipv6` IP (v6) address (according to [RFC 4291, section 2.2](https://tools.ietf.org/html/rfc4291))


### Known Values

| Value | Description |
|-------|-------------|
| `hi`  | Welcome     |
| `bye` | Farewell    |



## string_uri

A URI.

`string_uri`
* is optional
* type: `string`
* defined in this schema

### string_uri Type


`string`
* format: `uri` Uniformous Resource Identifier (according to [RFC3986](http://tools.ietf.org/html/rfc3986))


### Known Values

| Value | Description |
|-------|-------------|
| `hi`  | Welcome     |
| `bye` | Farewell    |



## number_unconstrained

Just a number

`number_unconstrained`
* is optional
* type: `number`
* defined in this schema

### number_unconstrained Type


`number`



### Known Values

| Value | Description |
|-------|-------------|
| `hi`  | Welcome     |
| `bye` | Farewell    |



## interger_unconstrained

Just a whole number. I don&#39;t like fractions.

`interger_unconstrained`
* is optional
* type: complex
* defined in this schema

### interger_unconstrained Type


`integer`



### Known Values

| Value | Description |
|-------|-------------|
| `hi`  | Welcome     |
| `bye` | Farewell    |



## interger_constrained

Just a whole number. I don&#39;t like fractions. Don&#39;t get too small

`interger_constrained`
* is optional
* type: complex
* defined in this schema

### interger_constrained Type


`integer`
* minimum value: `10`


### Known Values

| Value | Description |
|-------|-------------|
| `hi`  | Welcome     |
| `bye` | Farewell    |



## number_constrained

Just a number. Don&#39;t get too big.

`number_constrained`
* is optional
* type: `number`
* defined in this schema

### number_constrained Type


`number`
* value must not be greater or equal than: `10`


### Known Values

| Value | Description |
|-------|-------------|
| `hi`  | Welcome     |
| `bye` | Farewell    |



## integer_threes

Guess what number is valid

`integer_threes`
* is optional
* type: complex
* defined in this schema

### integer_threes Type


`integer`
* minimum value: `2`
* maximum value: `4`
* must be a multiple of `3`

### Known Values

| Value | Description |
|-------|-------------|
| `hi`  | Welcome     |
| `bye` | Farewell    |


