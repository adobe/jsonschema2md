# Examples Schema

```txt
https://example.com/schemas/examples
```

This is an example schema with *multiple* examples. Too many examples? There can never be too many examples!

| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                               |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :--------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Allowed               | none                | [examples.schema.json](../generated-schemas/examples.schema.json "open original schema") |

## Examples Type

`object` ([Examples](examples.md))

## Examples Examples

```json
{
  "foo": "bi",
  "bar": "bu"
}
```

```json
{
  "foo": "zip",
  "bar": "zap"
}
```

# Examples Properties

| Property    | Type     | Required | Nullable       | Defined by                                                                                    |
| :---------- | :------- | :------- | :------------- | :-------------------------------------------------------------------------------------------- |
| [foo](#foo) | `string` | Optional | cannot be null | [Examples](examples-properties-foo.md "https://example.com/schemas/examples#/properties/foo") |
| [bar](#bar) | `string` | Required | cannot be null | [Examples](examples-properties-bar.md "https://example.com/schemas/examples#/properties/bar") |

## foo

A simple string.

`foo`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Examples](examples-properties-foo.md "https://example.com/schemas/examples#/properties/foo")

### foo Type

`string`

### foo Examples

```json
"bar"
```

## bar

A simple string.

`bar`

*   is required

*   Type: `string`

*   cannot be null

*   defined in: [Examples](examples-properties-bar.md "https://example.com/schemas/examples#/properties/bar")

### bar Type

`string`

### bar Examples

```json
"bar"
```

```json
"baz"
```
