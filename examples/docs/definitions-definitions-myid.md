# Untitled undefined type in Extending Schema

```txt
https://example.com/schemas/extending#/allOf/1
```




| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                   |
| :------------------ | ---------- | -------------- | ------------ | :---------------- | --------------------- | ------------------- | -------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | Yes          | Forbidden         | Allowed               | none                | [extending.schema.json\*](../generated-schemas/extending.schema.json "open original schema") |

## 1 Type

unknown

# undefined Properties

| Property            | Type     | Required | Nullable       | Defined by                                                                                                                       |
| :------------------ | -------- | -------- | -------------- | :------------------------------------------------------------------------------------------------------------------------------- |
| [id](#id)           | `string` | Optional | cannot be null | [Extending](deepextending-allof-1-properties-id.md "https&#x3A;//example.com/schemas/extending#/allOf/1/properties/id")          |
| [@id](#@id)         | `string` | Required | cannot be null | [Extending](deepextending-allof-1-properties-id-1.md "https&#x3A;//example.com/schemas/extending#/allOf/1/properties/@id")       |
| [meta:id](#meta:id) | `string` | Optional | cannot be null | [Extending](deepextending-allof-1-properties-metaid.md "https&#x3A;//example.com/schemas/extending#/allOf/1/properties/meta:id") |

## id

A unique identifier given to every addressable thing.


`id`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Extending](deepextending-allof-1-properties-id.md "https&#x3A;//example.com/schemas/extending#/allOf/1/properties/id")

### id Type

`string`

### id Constraints

**URI reference**: the string must be a URI reference, according to [RFC 3986](https://tools.ietf.org/html/rfc4291 "check the specification")

## @id

An `id` with an `@` in front of it. The `@` stands for "dot com"


`@id`

-   is required
-   Type: `string`
-   cannot be null
-   defined in: [Extending](deepextending-allof-1-properties-id-1.md "https&#x3A;//example.com/schemas/extending#/allOf/1/properties/@id")

### @id Type

`string`

### @id Constraints

**URI**: the string must be a URI, according to [RFC 3986](https://tools.ietf.org/html/rfc4291 "check the specification")

## meta:id

An about ids. It is meta. If you are confused, send an email to the address specified in this property value.


`meta:id`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Extending](deepextending-allof-1-properties-metaid.md "https&#x3A;//example.com/schemas/extending#/allOf/1/properties/meta:id")

### meta:id Type

`string`

### meta:id Constraints

**email**: the string must be an email address, according to [RFC 5322, section 3.4.1](https://tools.ietf.org/html/rfc5322 "check the specification")
