---
template: reference
foo: bar
---

# Simple Types Schema

```
https://example.com/schemas/simpletypes
```

This is an example schema with examples for multiple types and their constraints.

| [Abstract](../abstract.md) | Extensible | [Status](../status.md) | Identifiable | Custom Properties | Additional Properties | Defined In |
|----------------------------|------------|------------------------|--------------|-------------------|-----------------------|------------|
| Can be instantiated | No | Experimental | No | Forbidden | Permitted | [simpletypes.schema.json](simpletypes.schema.json) |

# Simple Types Properties

| Property | Type | Required | Nullable | Defined by |
|----------|------|----------|----------|------------|
| [integer_threes](#integer_threes) | `integer` | Optional  | No | Simple Types (this schema) |
| [interger_constrained](#interger_constrained) | `integer` | Optional  | No | Simple Types (this schema) |
| [interger_unconstrained](#interger_unconstrained) | `integer` | Optional  | No | Simple Types (this schema) |
| [number_constrained](#number_constrained) | `number` | Optional  | No | Simple Types (this schema) |
| [number_unconstrained](#number_unconstrained) | `number` | Optional  | No | Simple Types (this schema) |
| [string_date](#string_date) | `string` | Optional  | No | Simple Types (this schema) |
| [string_email](#string_email) | `string` | Optional  | No | Simple Types (this schema) |
| [string_hostname](#string_hostname) | `string` | Optional  | No | Simple Types (this schema) |
| [string_ipv4](#string_ipv4) | `string` | Optional  | No | Simple Types (this schema) |
| [string_ipv6](#string_ipv6) | `string` | Optional  | No | Simple Types (this schema) |
| [string_length](#string_length) | `string` | Optional  | No | Simple Types (this schema) |
| [string_pattern](#string_pattern) | `string` | Optional  | No | Simple Types (this schema) |
| [string_pattern_noexample](#string_pattern_noexample) | `string` | Optional  | No | Simple Types (this schema) |
| [string_pattern_singleexample](#string_pattern_singleexample) | `string` | Optional  | No | Simple Types (this schema) |
| [string_unconstrained](#string_unconstrained) | `string` | Optional  | No | Simple Types (this schema) |
| [string_uri](#string_uri) | `string` | Optional  | No | Simple Types (this schema) |
| [yesno](#yesno) | `boolean` | **Required**  | No | Simple Types (this schema) |
| `*` | any | Additional | Yes | this schema *allows* additional properties |

## integer_threes

Guess what number is valid

`integer_threes`

* is optional
* type: `integer`
* defined in this schema

### integer_threes Type


`integer`

* minimum value: `2`
* maximum value: `4`
* must be a multiple of `3`





## interger_constrained

Just a whole number. I don't like fractions. Don't get too small

`interger_constrained`

* is optional
* type: `integer`
* defined in this schema

### interger_constrained Type


`integer`

* minimum value: `10`






## interger_unconstrained

Just a whole number. I don't like fractions.

`interger_unconstrained`

* is optional
* type: `integer`
* defined in this schema

### interger_unconstrained Type


`integer`







## number_constrained

Just a number. Don't get too big.

`number_constrained`

* is optional
* type: `number`
* defined in this schema

### number_constrained Type


`number`

* value must not be greater or equal than: `10`





## number_unconstrained

Just a number

`number_unconstrained`

* is optional
* type: `number`
* defined in this schema

### number_unconstrained Type


`number`







## string_date

A date-like string.

`string_date`

* is optional
* type: `string`
* defined in this schema

### string_date Type


`string`

* format: `date-time` – date and time (according to [RFC 3339, section 5.6](http://tools.ietf.org/html/rfc3339))






## string_email

An email-like string.

`string_email`

* is optional
* type: `string`
* defined in this schema

### string_email Type


`string`

* format: `email` – email address (according to [RFC 5322, section 3.4.1](https://tools.ietf.org/html/rfc5322))






## string_hostname

A hostname-like string.

`string_hostname`

* is optional
* type: `string`
* defined in this schema

### string_hostname Type


`string`

* format: `hostname` – Domain Name (according to [RFC 1034, section 3.1](https://tools.ietf.org/html/rfc1034))






## string_ipv4

An IPv4-like string.

`string_ipv4`

* is optional
* type: `string`
* defined in this schema

### string_ipv4 Type


`string`

* format: `ipv4` – IP (v4) address (according to [RFC 2673, section 3.2](https://tools.ietf.org/html/rfc2673))






## string_ipv6

An IPv6-like string.

`string_ipv6`

* is optional
* type: `string`
* defined in this schema

### string_ipv6 Type


`string`

* format: `ipv6` – IP (v6) address (according to [RFC 4291, section 2.2](https://tools.ietf.org/html/rfc4291))






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


### string_pattern Known Values
| Value | Description |
|-------|-------------|
| `baa` | the sounds of sheeps |
| `bad` | German bathroom |
| `bag` | holding device |
| `bah` | humbug! |
| `bam` | a loud sound |
| `ban` | don&#39;t do this |
| `bap` | a British soft bread roll |
| `bas` | from ancient Egyptian religion, an aspect of the soul |
| `bat` | …out of hell |
| `bay` | , sitting by the dock of the |



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




### string_pattern_singleexample Example

```json
"bar"
```


## string_unconstrained

A simple string, without any constraints.

`string_unconstrained`

* is optional
* type: `string`
* defined in this schema

### string_unconstrained Type


`string`






### string_unconstrained Example

```json
"bar"
```


## string_uri

A URI.

`string_uri`

* is optional
* type: `string`
* defined in this schema

### string_uri Type


`string`

* format: `uri` – Uniformous Resource Identifier (according to [RFC3986](http://tools.ietf.org/html/rfc3986))






## yesno


`yesno`

* is **required**
* type: `boolean`
* defined in this schema

### yesno Type


`boolean`




