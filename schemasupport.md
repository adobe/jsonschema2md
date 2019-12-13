# JSON Schema Spec Coverage Report

This report lists the keywords of the JSON Schema spec that are covered in the tests. The overall coverage is 40%

## The JSON Schema Core Vocabulary

Coverage for [The JSON Schema Core Vocabulary](https://json-schema.org/draft/2019-09/json-schema-core.html#rfc.section.8.1) is 11%.

| Keyword            | Supported |
| :----------------- | --------- |
| `$anchor`          | No        |
| `$comment`         | No        |
| `$defs`            | No        |
| `$id`              | Yes       |
| `$recursiveAnchor` | No        |
| `$recursiveRef`    | No        |
| `$ref`             | No        |
| `$schema`          | No        |
| `$vocabulary`      | No        |

## A Vocabulary for Applying Subschemas

Coverage for [A Vocabulary for Applying Subschemas](https://json-schema.org/draft/2019-09/json-schema-core.html#rfc.section.9) is 41%.

| Keyword                 | Supported |
| :---------------------- | --------- |
| `additionalItems`       | No        |
| `additionalProperties`  | Yes       |
| `allOf`                 | Yes       |
| `anyOf`                 | Yes       |
| `contains`              | No        |
| `dependentSchemas`      | No        |
| `else`                  | No        |
| `if`                    | No        |
| `items`                 | No        |
| `not`                   | Yes       |
| `oneOf`                 | Yes       |
| `patternProperties`     | Yes       |
| `properties`            | Yes       |
| `propertyNames`         | No        |
| `then`                  | No        |
| `unevaluatedItems`      | No        |
| `unevaluatedProperties` | No        |

## Validation Keywords for Any Instance Type

Coverage for [Validation Keywords for Any Instance Type](https://json-schema.org/draft/2019-09/json-schema-validation.html#rfc.section.6.1) is 100%.

| Keyword | Supported |
| :------ | --------- |
| `const` | Yes       |
| `enum`  | Yes       |
| `type`  | Yes       |

## Validation Keywords for Numeric Instances

Coverage for [Validation Keywords for Numeric Instances](https://json-schema.org/draft/2019-09/json-schema-validation.html#rfc.section.6.2) is 100%.

| Keyword            | Supported |
| :----------------- | --------- |
| `exclusiveMaximum` | Yes       |
| `exclusiveMinimum` | Yes       |
| `maximum`          | Yes       |
| `minimum`          | Yes       |
| `multipleOf`       | Yes       |

## Validation Keywords for Strings

Coverage for [Validation Keywords for Strings](https://json-schema.org/draft/2019-09/json-schema-validation.html#rfc.section.6.3) is 100%.

| Keyword     | Supported |
| :---------- | --------- |
| `maxLength` | Yes       |
| `minLength` | Yes       |
| `pattern`   | Yes       |

## Validation Keywords for Arrays

Coverage for [Validation Keywords for Arrays](https://json-schema.org/draft/2019-09/json-schema-validation.html#rfc.section.6.4) is 80%.

| Keyword       | Supported |
| :------------ | --------- |
| `maxContains` | Yes       |
| `maxItems`    | No        |
| `minContains` | Yes       |
| `minItems`    | Yes       |
| `uniqueItems` | Yes       |

## Validation Keywords for Objects

Coverage for [Validation Keywords for Objects](https://json-schema.org/draft/2019-09/json-schema-validation.html#rfc.section.6.5) is 75%.

| Keyword             | Supported |
| :------------------ | --------- |
| `dependentRequired` | No        |
| `maxProperties`     | Yes       |
| `minProperties`     | Yes       |
| `required`          | Yes       |

## Defined Formats

Coverage for [Defined Formats](https://json-schema.org/draft/2019-09/json-schema-validation.html#rfc.section.7.3) is 5%.

| Keyword                 | Supported |
| :---------------------- | --------- |
| `date`                  | No        |
| `date-time`             | No        |
| `duration`              | No        |
| `email`                 | No        |
| `hostname`              | No        |
| `idn-email`             | No        |
| `idn-hostname`          | No        |
| `ipv4`                  | No        |
| `ipv6`                  | No        |
| `iri`                   | No        |
| `iri-reference`         | No        |
| `json-pointer`          | No        |
| `regex`                 | No        |
| `relative-json-pointer` | No        |
| `time`                  | No        |
| `uri`                   | Yes       |
| `uri-reference`         | No        |
| `uri-template`          | No        |
| `uuid`                  | No        |

## A Vocabulary for the Contents of String-Encoded Data

Coverage for [A Vocabulary for the Contents of String-Encoded Data](https://json-schema.org/draft/2019-09/json-schema-validation.html#rfc.section.8) is 0%.

| Keyword            | Supported |
| :----------------- | --------- |
| `contentEncoding`  | No        |
| `contentMediaType` | No        |
| `contentSchema`    | No        |

## A Vocabulary for Basic Meta-Data Annotations

Coverage for [A Vocabulary for Basic Meta-Data Annotations](https://json-schema.org/draft/2019-09/json-schema-validation.html#rfc.section.9) is 42%.

| Keyword       | Supported |
| :------------ | --------- |
| `default`     | No        |
| `deprecated`  | No        |
| `description` | Yes       |
| `examples`    | Yes       |
| `readOnly`    | No        |
| `title`       | Yes       |
| `writeOnly`   | No        |
