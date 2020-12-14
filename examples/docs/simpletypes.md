# Simple Types Schema

```txt
https://example.com/schemas/simpletypes
```

This is an example schema with examples for multiple types and their constraints.


| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                     |
| :------------------ | ---------- | -------------- | ------------ | :---------------- | --------------------- | ------------------- | ---------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Allowed               | none                | [simpletypes.schema.json](../generated-schemas/simpletypes.schema.json "open original schema") |

## Simple Types Type

`object` ([Simple Types](simpletypes.md))

# Simple Types Properties

| Property                                                      | Type      | Required | Nullable       | Defined by                                                                                                                                                     |
| :------------------------------------------------------------ | --------- | -------- | -------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [string_unconstrained](#string_unconstrained)                 | `string`  | Optional | cannot be null | [Simple Types](simpletypes-properties-string_unconstrained.md "https&#x3A;//example.com/schemas/simpletypes#/properties/string_unconstrained")                 |
| [string_length](#string_length)                               | `string`  | Optional | cannot be null | [Simple Types](simpletypes-properties-string_length.md "https&#x3A;//example.com/schemas/simpletypes#/properties/string_length")                               |
| [string_pattern](#string_pattern)                             | `string`  | Optional | cannot be null | [Simple Types](simpletypes-properties-string_pattern.md "https&#x3A;//example.com/schemas/simpletypes#/properties/string_pattern")                             |
| [string_pattern_noexample](#string_pattern_noexample)         | `string`  | Optional | cannot be null | [Simple Types](simpletypes-properties-string_pattern_noexample.md "https&#x3A;//example.com/schemas/simpletypes#/properties/string_pattern_noexample")         |
| [string_pattern_singleexample](#string_pattern_singleexample) | `string`  | Optional | cannot be null | [Simple Types](simpletypes-properties-string_pattern_singleexample.md "https&#x3A;//example.com/schemas/simpletypes#/properties/string_pattern_singleexample") |
| [string_date](#string_date)                                   | `string`  | Optional | cannot be null | [Simple Types](simpletypes-properties-string_date.md "https&#x3A;//example.com/schemas/simpletypes#/properties/string_date")                                   |
| [string_email](#string_email)                                 | `string`  | Optional | cannot be null | [Simple Types](simpletypes-properties-string_email.md "https&#x3A;//example.com/schemas/simpletypes#/properties/string_email")                                 |
| [string_hostname](#string_hostname)                           | `string`  | Optional | cannot be null | [Simple Types](simpletypes-properties-string_hostname.md "https&#x3A;//example.com/schemas/simpletypes#/properties/string_hostname")                           |
| [string_ipv4](#string_ipv4)                                   | `string`  | Optional | cannot be null | [Simple Types](simpletypes-properties-string_ipv4.md "https&#x3A;//example.com/schemas/simpletypes#/properties/string_ipv4")                                   |
| [string_ipv6](#string_ipv6)                                   | `string`  | Optional | cannot be null | [Simple Types](simpletypes-properties-string_ipv6.md "https&#x3A;//example.com/schemas/simpletypes#/properties/string_ipv6")                                   |
| [string_uri](#string_uri)                                     | `string`  | Optional | cannot be null | [Simple Types](simpletypes-properties-string_uri.md "https&#x3A;//example.com/schemas/simpletypes#/properties/string_uri")                                     |
| [number_unconstrained](#number_unconstrained)                 | `number`  | Optional | cannot be null | [Simple Types](simpletypes-properties-number_unconstrained.md "https&#x3A;//example.com/schemas/simpletypes#/properties/number_unconstrained")                 |
| [interger_unconstrained](#interger_unconstrained)             | `integer` | Optional | cannot be null | [Simple Types](simpletypes-properties-interger_unconstrained.md "https&#x3A;//example.com/schemas/simpletypes#/properties/interger_unconstrained")             |
| [interger_constrained](#interger_constrained)                 | `integer` | Optional | cannot be null | [Simple Types](simpletypes-properties-interger_constrained.md "https&#x3A;//example.com/schemas/simpletypes#/properties/interger_constrained")                 |
| [number_constrained](#number_constrained)                     | `number`  | Optional | cannot be null | [Simple Types](simpletypes-properties-number_constrained.md "https&#x3A;//example.com/schemas/simpletypes#/properties/number_constrained")                     |
| [integer_threes](#integer_threes)                             | `integer` | Optional | cannot be null | [Simple Types](simpletypes-properties-integer_threes.md "https&#x3A;//example.com/schemas/simpletypes#/properties/integer_threes")                             |
| [yesno](#yesno)                                               | `boolean` | Required | cannot be null | [Simple Types](simpletypes-properties-yesno.md "https&#x3A;//example.com/schemas/simpletypes#/properties/yesno")                                               |

## string_unconstrained

A simple string, without any constraints.


`string_unconstrained`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Simple Types](simpletypes-properties-string_unconstrained.md "https&#x3A;//example.com/schemas/simpletypes#/properties/string_unconstrained")

### string_unconstrained Type

`string`

### string_unconstrained Examples

```json
"bar"
```

## string_length

A string with minumum and maximum length


`string_length`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Simple Types](simpletypes-properties-string_length.md "https&#x3A;//example.com/schemas/simpletypes#/properties/string_length")

### string_length Type

`string`

### string_length Constraints

**maximum length**: the maximum number of characters for this string is: `3`

**minimum length**: the minimum number of characters for this string is: `3`

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

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Simple Types](simpletypes-properties-string_pattern.md "https&#x3A;//example.com/schemas/simpletypes#/properties/string_pattern")

### string_pattern Type

`string`

### string_pattern Constraints

**pattern**: the string must match the following regular expression: 

```regexp
^ba.$
```

[try pattern](https://regexr.com/?expression=%5Eba.%24 "try regular expression with regexr.com")

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

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Simple Types](simpletypes-properties-string_pattern_noexample.md "https&#x3A;//example.com/schemas/simpletypes#/properties/string_pattern_noexample")

### string_pattern_noexample Type

`string`

### string_pattern_noexample Constraints

**pattern**: the string must match the following regular expression: 

```regexp
^ba.$
```

[try pattern](https://regexr.com/?expression=%5Eba.%24 "try regular expression with regexr.com")

## string_pattern_singleexample

A string following a regular expression


`string_pattern_singleexample`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Simple Types](simpletypes-properties-string_pattern_singleexample.md "https&#x3A;//example.com/schemas/simpletypes#/properties/string_pattern_singleexample")

### string_pattern_singleexample Type

`string`

### string_pattern_singleexample Constraints

**pattern**: the string must match the following regular expression: 

```regexp
^ba.$
```

[try pattern](https://regexr.com/?expression=%5Eba.%24 "try regular expression with regexr.com")

### string_pattern_singleexample Examples

```json
"bar"
```

## string_date

A date-like string.


`string_date`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Simple Types](simpletypes-properties-string_date.md "https&#x3A;//example.com/schemas/simpletypes#/properties/string_date")

### string_date Type

`string`

### string_date Constraints

**date time**: the string must be a date time string, according to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339 "check the specification")

## string_email

An email-like string.


`string_email`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Simple Types](simpletypes-properties-string_email.md "https&#x3A;//example.com/schemas/simpletypes#/properties/string_email")

### string_email Type

`string`

### string_email Constraints

**email**: the string must be an email address, according to [RFC 5322, section 3.4.1](https://tools.ietf.org/html/rfc5322 "check the specification")

## string_hostname

A hostname-like string.


`string_hostname`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Simple Types](simpletypes-properties-string_hostname.md "https&#x3A;//example.com/schemas/simpletypes#/properties/string_hostname")

### string_hostname Type

`string`

### string_hostname Constraints

**hostname**: the string must be a hostname, according to [RFC 1123, section 2.1](https://tools.ietf.org/html/rfc1123 "check the specification")

## string_ipv4

An IPv4-like string.


`string_ipv4`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Simple Types](simpletypes-properties-string_ipv4.md "https&#x3A;//example.com/schemas/simpletypes#/properties/string_ipv4")

### string_ipv4 Type

`string`

### string_ipv4 Constraints

**IPv4**: the string must be an IPv4 address (dotted quad), according to [RFC 2673, section 3.2](https://tools.ietf.org/html/rfc2673 "check the specification")

## string_ipv6

An IPv6-like string.


`string_ipv6`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Simple Types](simpletypes-properties-string_ipv6.md "https&#x3A;//example.com/schemas/simpletypes#/properties/string_ipv6")

### string_ipv6 Type

`string`

### string_ipv6 Constraints

**IPv6**: the string must be an IPv6 address, according to [RFC 4291, section 2.2](https://tools.ietf.org/html/rfc4291 "check the specification")

## string_uri

A URI.


`string_uri`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Simple Types](simpletypes-properties-string_uri.md "https&#x3A;//example.com/schemas/simpletypes#/properties/string_uri")

### string_uri Type

`string`

### string_uri Constraints

**URI**: the string must be a URI, according to [RFC 3986](https://tools.ietf.org/html/rfc3986 "check the specification")

## number_unconstrained

Just a number


`number_unconstrained`

-   is optional
-   Type: `number`
-   cannot be null
-   defined in: [Simple Types](simpletypes-properties-number_unconstrained.md "https&#x3A;//example.com/schemas/simpletypes#/properties/number_unconstrained")

### number_unconstrained Type

`number`

## interger_unconstrained

Just a whole number. I don't like fractions.


`interger_unconstrained`

-   is optional
-   Type: `integer`
-   cannot be null
-   defined in: [Simple Types](simpletypes-properties-interger_unconstrained.md "https&#x3A;//example.com/schemas/simpletypes#/properties/interger_unconstrained")

### interger_unconstrained Type

`integer`

## interger_constrained

Just a whole number. I don't like fractions. Don't get too small


`interger_constrained`

-   is optional
-   Type: `integer`
-   cannot be null
-   defined in: [Simple Types](simpletypes-properties-interger_constrained.md "https&#x3A;//example.com/schemas/simpletypes#/properties/interger_constrained")

### interger_constrained Type

`integer`

### interger_constrained Constraints

**minimum**: the value of this number must greater than or equal to: `10`

## number_constrained

Just a number. Don't get too big.


`number_constrained`

-   is optional
-   Type: `number`
-   cannot be null
-   defined in: [Simple Types](simpletypes-properties-number_constrained.md "https&#x3A;//example.com/schemas/simpletypes#/properties/number_constrained")

### number_constrained Type

`number`

### number_constrained Constraints

**maximum (exclusive)**: the value of this number must be smaller than: `10`

## integer_threes

Guess what number is valid


`integer_threes`

-   is optional
-   Type: `integer`
-   cannot be null
-   defined in: [Simple Types](simpletypes-properties-integer_threes.md "https&#x3A;//example.com/schemas/simpletypes#/properties/integer_threes")

### integer_threes Type

`integer`

### integer_threes Constraints

**multiple of**: the value of this number must be a multiple of: `3`

**maximum**: the value of this number must smaller than or equal to: `4`

**minimum**: the value of this number must greater than or equal to: `2`

## yesno




`yesno`

-   is required
-   Type: `boolean`
-   cannot be null
-   defined in: [Simple Types](simpletypes-properties-yesno.md "https&#x3A;//example.com/schemas/simpletypes#/properties/yesno")

### yesno Type

`boolean`
