# Complex References Schema

```txt
https://example.com/schemas/complex
```

This is an example schema that uses types defined in other schemas.

| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                             |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Allowed               | none                | [complex.schema.json](../generated-schemas/complex.schema.json "open original schema") |

## Complex References Type

`object` ([Complex References](complex.md))

# Complex References Properties

| Property                            | Type      | Required | Nullable       | Defined by                                                                                                                    |
| :---------------------------------- | :-------- | :------- | :------------- | :---------------------------------------------------------------------------------------------------------------------------- |
| [refabstract](#refabstract)         | `object`  | Required | cannot be null | [Complex References](abstract-definitions-first.md "https://example.com/schemas/complex#/properties/refabstract")             |
| [refnamed](#refnamed)               | `object`  | Optional | cannot be null | [Complex References](complex-properties-simple.md "https://example.com/schemas/simple#/properties/refnamed")                  |
| [refrefed](#refrefed)               | `object`  | Optional | cannot be null | [Complex References](complex-properties-simple.md "https://example.com/schemas/simple#/properties/refrefed")                  |
| [refobj](#refobj)                   | `object`  | Optional | cannot be null | [Complex References](complex-properties-refobj.md "https://example.com/schemas/complex#/properties/refobj")                   |
| [refnestedobj](#refnestedobj)       | `object`  | Optional | cannot be null | [Complex References](complex-properties-refnestedobj.md "https://example.com/schemas/complex#/properties/refnestedobj")       |
| [reflocalfile](#reflocalfile)       | `object`  | Optional | cannot be null | [Complex References](simple.md "https://example.com/schemas/simple#/properties/reflocalfile")                                 |
| [reflocalfiledef](#reflocalfiledef) | `object`  | Optional | cannot be null | [Complex References](complex-properties-reflocalfiledef.md "https://example.com/schemas/complex#/properties/reflocalfiledef") |
| [or](#or)                           | Merged    | Optional | cannot be null | [Complex References](complex-properties-or.md "https://example.com/schemas/complex#/properties/or")                           |
| [and](#and)                         | Merged    | Optional | cannot be null | [Complex References](complex-properties-and.md "https://example.com/schemas/complex#/properties/and")                         |
| [xor](#xor)                         | Merged    | Optional | cannot be null | [Complex References](complex-properties-xor.md "https://example.com/schemas/complex#/properties/xor")                         |
| `int.*`                             | `integer` | Optional | cannot be null | [Complex References](complex-patternproperties-int.md "https://example.com/schemas/complex#/patternProperties/int.*")         |
| `str.*`                             | `string`  | Optional | cannot be null | [Complex References](complex-patternproperties-str.md "https://example.com/schemas/complex#/patternProperties/str.*")         |
| Additional Properties               | `boolean` | Optional | cannot be null | [Complex References](complex-additionalproperties.md "https://example.com/schemas/complex#/additionalProperties")             |

## refabstract



`refabstract`

*   is required

*   Type: `object` ([Details](abstract-definitions-first.md))

*   cannot be null

*   defined in: [Complex References](abstract-definitions-first.md "https://example.com/schemas/complex#/properties/refabstract")

### refabstract Type

`object` ([Details](abstract-definitions-first.md))

## refnamed

This is a *very* simple example of a JSON schema. There is only one property.

`refnamed`

*   is optional

*   Type: `object` ([Simple](simple.md))

*   cannot be null

*   defined in: [Complex References](simple.md "https://example.com/schemas/simple#/properties/refnamed")

### refnamed Type

`object` ([Simple](simple.md))

## refrefed

This is a *very* simple example of a JSON schema. There is only one property.

`refrefed`

*   is optional

*   Type: `object` ([Simple](simple.md))

*   cannot be null

*   defined in: [Complex References](simple.md "https://example.com/schemas/simple#/properties/refrefed")

### refrefed Type

`object` ([Simple](simple.md))

## refobj



`refobj`

*   is optional

*   Type: `object` ([Details](complex-properties-refobj.md))

*   cannot be null

*   defined in: [Complex References](complex-properties-refobj.md "https://example.com/schemas/complex#/properties/refobj")

### refobj Type

`object` ([Details](complex-properties-refobj.md))

## refnestedobj



`refnestedobj`

*   is optional

*   Type: `object` ([Details](complex-properties-refnestedobj.md))

*   cannot be null

*   defined in: [Complex References](complex-properties-refnestedobj.md "https://example.com/schemas/complex#/properties/refnestedobj")

### refnestedobj Type

`object` ([Details](complex-properties-refnestedobj.md))

## reflocalfile

This is a *very* simple example of a JSON schema. There is only one property.

`reflocalfile`

*   is optional

*   Type: `object` ([Simple](simple.md))

*   cannot be null

*   defined in: [Complex References](simple.md "https://example.com/schemas/simple#/properties/reflocalfile")

### reflocalfile Type

`object` ([Simple](simple.md))

## reflocalfiledef



`reflocalfiledef`

*   is optional

*   Type: `object` ([Details](complex-properties-reflocalfiledef.md))

*   cannot be null

*   defined in: [Complex References](complex-properties-reflocalfiledef.md "https://example.com/schemas/complex#/properties/reflocalfiledef")

### reflocalfiledef Type

`object` ([Details](complex-properties-reflocalfiledef.md))

## or

String or number…

`or`

*   is optional

*   Type: merged type ([Details](complex-properties-or.md))

*   cannot be null

*   defined in: [Complex References](complex-properties-or.md "https://example.com/schemas/complex#/properties/or")

### or Type

merged type ([Details](complex-properties-or.md))

any of

*   [Untitled string in Complex References](complex-properties-or-anyof-0.md "check type definition")

*   [Untitled number in Complex References](complex-properties-or-anyof-1.md "check type definition")

## and

Number in a range

`and`

*   is optional

*   Type: merged type ([Details](complex-properties-and.md))

*   cannot be null

*   defined in: [Complex References](complex-properties-and.md "https://example.com/schemas/complex#/properties/and")

### and Type

merged type ([Details](complex-properties-and.md))

all of

*   [Untitled number in Complex References](complex-properties-and-allof-0.md "check type definition")

*   [Untitled number in Complex References](complex-properties-and-allof-1.md "check type definition")

## xor

Exclusive choice.

`xor`

*   is optional

*   Type: merged type ([Details](complex-properties-xor.md))

*   cannot be null

*   defined in: [Complex References](complex-properties-xor.md "https://example.com/schemas/complex#/properties/xor")

### xor Type

merged type ([Details](complex-properties-xor.md))

one (and only one) of

*   [Untitled number in Complex References](complex-properties-xor-oneof-0.md "check type definition")

*   [Untitled number in Complex References](complex-properties-xor-oneof-1.md "check type definition")

## Pattern: `int.*`



`int.*`

*   is optional

*   Type: `integer`

*   cannot be null

*   defined in: [Complex References](complex-patternproperties-int.md "https://example.com/schemas/complex#/patternProperties/int.\*")

### int.\* Type

`integer`

## Pattern: `str.*`



`str.*`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Complex References](complex-patternproperties-str.md "https://example.com/schemas/complex#/patternProperties/str.\*")

### str.\* Type

`string`

## Additional Properties

Additional properties are allowed, as long as they follow this schema:



*   is optional

*   Type: `boolean`

*   cannot be null

*   defined in: [Complex References](complex-additionalproperties.md "https://example.com/schemas/complex#/additionalProperties")

### additionalProperties Type

`boolean`
