## [4.1.5](https://github.com/adobe/jsonschema2md/compare/v4.1.4...v4.1.5) (2020-06-22)


### Bug Fixes

* **deps:** npm audit fix ([2be8a58](https://github.com/adobe/jsonschema2md/commit/2be8a58))
* **markdown:** avoid ambiguities around property names ([a4543c4](https://github.com/adobe/jsonschema2md/commit/a4543c4)), closes [#232](https://github.com/adobe/jsonschema2md/issues/232)

## [4.1.4](https://github.com/adobe/jsonschema2md/compare/v4.1.3...v4.1.4) (2020-06-22)


### Bug Fixes

* definition object defintions based on proplist structure ([2fb9fc5](https://github.com/adobe/jsonschema2md/commit/2fb9fc5)), closes [#228](https://github.com/adobe/jsonschema2md/issues/228)

## [4.1.3](https://github.com/adobe/jsonschema2md/compare/v4.1.2...v4.1.3) (2020-06-04)


### Bug Fixes

* moved definitions to bottom of output file ([1b27fff](https://github.com/adobe/jsonschema2md/commit/1b27fff)), closes [#226](https://github.com/adobe/jsonschema2md/issues/226)

## [4.1.2](https://github.com/adobe/jsonschema2md/compare/v4.1.1...v4.1.2) (2020-04-23)


### Bug Fixes

* **lib/index.js:** made -h/--header a boolean arg ([5ba2719](https://github.com/adobe/jsonschema2md/commit/5ba2719)), closes [#209](https://github.com/adobe/jsonschema2md/issues/209)

## [4.1.1](https://github.com/adobe/jsonschema2md/compare/v4.1.0...v4.1.1) (2020-04-14)


### Bug Fixes

* **deps:** npm audit fix ([b13ab35](https://github.com/adobe/jsonschema2md/commit/b13ab35))
* **enum:** fix doc generation for enums that contain arrays ([667a106](https://github.com/adobe/jsonschema2md/commit/667a106)), closes [#219](https://github.com/adobe/jsonschema2md/issues/219)

# [4.1.0](https://github.com/adobe/jsonschema2md/compare/v4.0.13...v4.1.0) (2020-03-05)


### Features

* **examples:** enable examples to be formatted in YAML using command line option `-f yaml` ([01119ba](https://github.com/adobe/jsonschema2md/commit/01119ba))

## [4.0.13](https://github.com/adobe/jsonschema2md/compare/v4.0.12...v4.0.13) (2020-01-31)


### Bug Fixes

* **i18n:** update German translations ([8cf38e4](https://github.com/adobe/jsonschema2md/commit/8cf38e4))

## [4.0.12](https://github.com/adobe/jsonschema2md/compare/v4.0.11...v4.0.12) (2020-01-30)


### Bug Fixes

* dont use backslash for URLs on windows ([5149522](https://github.com/adobe/jsonschema2md/commit/5149522)), closes [#211](https://github.com/adobe/jsonschema2md/issues/211)

## [4.0.11](https://github.com/adobe/jsonschema2md/compare/v4.0.10...v4.0.11) (2020-01-26)


### Bug Fixes

* **package:** fix & clean up dependencies ([890e86d](https://github.com/adobe/jsonschema2md/commit/890e86d)), closes [#210](https://github.com/adobe/jsonschema2md/issues/210)

## [4.0.10](https://github.com/adobe/jsonschema2md/compare/v4.0.9...v4.0.10) (2020-01-21)


### Bug Fixes

* **deps:** pin es2015-i18n-tag version ([c531b50](https://github.com/adobe/jsonschema2md/commit/c531b50)), closes [#207](https://github.com/adobe/jsonschema2md/issues/207)

## [4.0.9](https://github.com/adobe/jsonschema2md/compare/v4.0.8...v4.0.9) (2020-01-20)


### Bug Fixes

* **markdown:** prevent unescaped objects in markdown AST ([87d709a](https://github.com/adobe/jsonschema2md/commit/87d709a)), closes [#201](https://github.com/adobe/jsonschema2md/issues/201)

## [4.0.8](https://github.com/adobe/jsonschema2md/compare/v4.0.7...v4.0.8) (2020-01-15)


### Bug Fixes

* **index.js:** -x flag is not working properly for the suppression case ([d929d9b](https://github.com/adobe/jsonschema2md/commit/d929d9b))

## [4.0.7](https://github.com/adobe/jsonschema2md/compare/v4.0.6...v4.0.7) (2020-01-14)


### Bug Fixes

* **markdown:** increase robustness when using format as a property name ([cda0bec](https://github.com/adobe/jsonschema2md/commit/cda0bec)), closes [#198](https://github.com/adobe/jsonschema2md/issues/198)

## [4.0.6](https://github.com/adobe/jsonschema2md/compare/v4.0.5...v4.0.6) (2020-01-14)


### Bug Fixes

* **markdown:** catch error when using `title` as a property name ([b4b8855](https://github.com/adobe/jsonschema2md/commit/b4b8855))

## [4.0.5](https://github.com/adobe/jsonschema2md/compare/v4.0.4...v4.0.5) (2020-01-14)


### Bug Fixes

* **slugger:** fix slugger crash due to title property ([4f0ab31](https://github.com/adobe/jsonschema2md/commit/4f0ab31)), closes [#196](https://github.com/adobe/jsonschema2md/issues/196)

## [4.0.4](https://github.com/adobe/jsonschema2md/compare/v4.0.3...v4.0.4) (2020-01-14)


### Bug Fixes

* **cli:** do not exit after creating readme.md ([cb7d012](https://github.com/adobe/jsonschema2md/commit/cb7d012))
* **cli:** make the -n or --no-readme option work again ([3c63c03](https://github.com/adobe/jsonschema2md/commit/3c63c03))
* **loader:** guard against endless wrapping ([dd1f7f6](https://github.com/adobe/jsonschema2md/commit/dd1f7f6)), closes [#194](https://github.com/adobe/jsonschema2md/issues/194)

## [4.0.3](https://github.com/adobe/jsonschema2md/compare/v4.0.2...v4.0.3) (2020-01-09)


### Bug Fixes

* **schema:** do not recurse endlessly when writing cyclic schemas ([297f0d5](https://github.com/adobe/jsonschema2md/commit/297f0d5)), closes [#185](https://github.com/adobe/jsonschema2md/issues/185)

## [4.0.2](https://github.com/adobe/jsonschema2md/compare/v4.0.1...v4.0.2) (2019-12-20)


### Bug Fixes

* **cli:** fix `traverse` function when called from CLI ([f211375](https://github.com/adobe/jsonschema2md/commit/f211375))

## [4.0.1](https://github.com/adobe/jsonschema2md/compare/v4.0.0...v4.0.1) (2019-12-20)


### Bug Fixes

* **titles:** more robust handling of title generation for untitled schemas ([c546a28](https://github.com/adobe/jsonschema2md/commit/c546a28)), closes [#185](https://github.com/adobe/jsonschema2md/issues/185)
* **traversal:** fix endless loop in schema traversal ([af85c59](https://github.com/adobe/jsonschema2md/commit/af85c59)), closes [#185](https://github.com/adobe/jsonschema2md/issues/185)

# [4.0.0](https://github.com/adobe/jsonschema2md/compare/v3.3.1...v4.0.0) (2019-12-16)


### Bug Fixes

* **i18n:** use correct file name format ([43a74f4](https://github.com/adobe/jsonschema2md/commit/43a74f4))
* **markdown:** constraint values can be zero now ([2e057fd](https://github.com/adobe/jsonschema2md/commit/2e057fd))
* **markdown:** handle null as a constant value ([e652e11](https://github.com/adobe/jsonschema2md/commit/e652e11))
* **proxy:** remove logging statements ([616a1d9](https://github.com/adobe/jsonschema2md/commit/616a1d9))
* **schemas:** remove references going nowhere ([2186142](https://github.com/adobe/jsonschema2md/commit/2186142))


### Build System

* **dependencies:** remove unused dependencies ([dbc9192](https://github.com/adobe/jsonschema2md/commit/dbc9192))


### Code Refactoring

* **cli:** remove bluebird, lodash, simplify arg parsing ([b6b1822](https://github.com/adobe/jsonschema2md/commit/b6b1822))


### Continuous Integration

* **test:** require node 10 ([ba4a947](https://github.com/adobe/jsonschema2md/commit/ba4a947))


### Documentation

* **changelog:** mention changes for v4 ([4dfe90c](https://github.com/adobe/jsonschema2md/commit/4dfe90c)), closes [#126](https://github.com/adobe/jsonschema2md/issues/126) [#174](https://github.com/adobe/jsonschema2md/issues/174) [#72](https://github.com/adobe/jsonschema2md/issues/72) [#73](https://github.com/adobe/jsonschema2md/issues/73) [#94](https://github.com/adobe/jsonschema2md/issues/94) [#52](https://github.com/adobe/jsonschema2md/issues/52) [#20](https://github.com/adobe/jsonschema2md/issues/20) [#125](https://github.com/adobe/jsonschema2md/issues/125) [#177](https://github.com/adobe/jsonschema2md/issues/177) [#34](https://github.com/adobe/jsonschema2md/issues/34) [#123](https://github.com/adobe/jsonschema2md/issues/123)


### Features

* **cli:** generate JSON schema output ([dd18f3b](https://github.com/adobe/jsonschema2md/commit/dd18f3b)), closes [#176](https://github.com/adobe/jsonschema2md/issues/176)
* **formats:** add support for formats: json-pointer, relative-json-pointer, regex, and uri-template ([689c158](https://github.com/adobe/jsonschema2md/commit/689c158))
* **i18n:** new internationalization system ([1a664de](https://github.com/adobe/jsonschema2md/commit/1a664de))
* **i18n:** provide complete en_US translation ([5eb0c89](https://github.com/adobe/jsonschema2md/commit/5eb0c89))
* **markdown:** add header surpression ([6225b9f](https://github.com/adobe/jsonschema2md/commit/6225b9f))
* **markdown:** add support for `default` keyword ([72a0fde](https://github.com/adobe/jsonschema2md/commit/72a0fde))
* **markdown:** add support for comments ([07bb52f](https://github.com/adobe/jsonschema2md/commit/07bb52f))
* **markdown:** add YAML frontmatter support ([4df92e6](https://github.com/adobe/jsonschema2md/commit/4df92e6))
* **markdown:** create and write markdown ([e521541](https://github.com/adobe/jsonschema2md/commit/e521541))
* **markdown:** generate additional detail ([cc07df2](https://github.com/adobe/jsonschema2md/commit/cc07df2))
* **markdown:** generate header again ([011427c](https://github.com/adobe/jsonschema2md/commit/011427c))
* **markdown:** generate some property details ([fa34cf1](https://github.com/adobe/jsonschema2md/commit/fa34cf1))
* **markdown:** generate type details ([c9f19e1](https://github.com/adobe/jsonschema2md/commit/c9f19e1))
* **markdown:** highlight keyword usage for documentation ([d35e4ed](https://github.com/adobe/jsonschema2md/commit/d35e4ed)), closes [#100](https://github.com/adobe/jsonschema2md/issues/100)
* **markdown:** list nested schemas in README ([608674b](https://github.com/adobe/jsonschema2md/commit/608674b))
* **markdown:** list nested schemas in README ([87e8489](https://github.com/adobe/jsonschema2md/commit/87e8489))
* **markdown:** show examples ([c8e8dfa](https://github.com/adobe/jsonschema2md/commit/c8e8dfa))
* **markdown:** show extensibility and abstraction in header ([90a9a8e](https://github.com/adobe/jsonschema2md/commit/90a9a8e))
* **markdown:** show id and status in header ([08e1923](https://github.com/adobe/jsonschema2md/commit/08e1923))
* **markdown:** show id and status in header ([b6fcf53](https://github.com/adobe/jsonschema2md/commit/b6fcf53))
* **markdown:** show join types ([12af018](https://github.com/adobe/jsonschema2md/commit/12af018))
* **markdown:** show some info about properties, switch i18n library ([f8a32df](https://github.com/adobe/jsonschema2md/commit/f8a32df))
* **markdown:** show type, link, additional and custom properties in header ([eff129a](https://github.com/adobe/jsonschema2md/commit/eff129a))
* **markdown:** show value constraints ([515969c](https://github.com/adobe/jsonschema2md/commit/515969c))
* **markdown:** support item arrays and additionalItems ([c9fbcdf](https://github.com/adobe/jsonschema2md/commit/c9fbcdf)), closes [#31](https://github.com/adobe/jsonschema2md/issues/31)
* **markdown:** support patternProperties and additionalProperties ([1386ee3](https://github.com/adobe/jsonschema2md/commit/1386ee3)), closes [#95](https://github.com/adobe/jsonschema2md/issues/95) [#180](https://github.com/adobe/jsonschema2md/issues/180)
* **proxy:** generate meta information ([ac65ac6](https://github.com/adobe/jsonschema2md/commit/ac65ac6))
* **proxy:** generate slugs ([eacbf38](https://github.com/adobe/jsonschema2md/commit/eacbf38))
* **proxy:** resolve references ([4cea068](https://github.com/adobe/jsonschema2md/commit/4cea068))
* **readme:** generate readme again ([d6b9e5e](https://github.com/adobe/jsonschema2md/commit/d6b9e5e))
* **readme:** mention the most common schema version ([fc583d7](https://github.com/adobe/jsonschema2md/commit/fc583d7))
* **schema:** add full support for "A Vocabulary for the Contents of String-Encoded Data" ([96ca3a6](https://github.com/adobe/jsonschema2md/commit/96ca3a6))
* **schema:** add support for keyword `$defs` ([70b63c8](https://github.com/adobe/jsonschema2md/commit/70b63c8))
* **schema:** add support for keyword `deprecated` ([934b856](https://github.com/adobe/jsonschema2md/commit/934b856))
* **schema:** add support for readOnly and writeOnly schemas and properties ([7452882](https://github.com/adobe/jsonschema2md/commit/7452882))


### BREAKING CHANGES

* **changelog:** 
* **i18n:** The file format for the i18n files has changed

You can now specify the language to use using `-l` and `jsonschema2md` will pick up the correct language configuration.
* **test:** Node 8 is no longer supported
* **dependencies:** Removes the JSON schema validation feature entirely
* **cli:** Repaces lodash with ferrum, removed bluebird, changes the meaning of `--schema-out` or `-x` to be no longer relative to output dir

The `--schema-out` or `-x` command line option is no longer relative to the output path (specified with `-o` or `--out`)

---

# Note about Version 4.0

`jsonschema2md` v4.0.0 has been a major rewrite that changes output format, command line parameters, i18n templates in order to increase the [coverage of the JSON Schema specification](schemasupport.md) and to make the project more maintainable.

The JSON Schema validation functionality has been dropped entirely, as it is easier to just use `ajv` for that directly.

---

## [3.3.1](https://github.com/adobe/jsonschema2md/compare/v3.3.0...v3.3.1) (2019-09-18)


### Bug Fixes

* **package:** update @adobe/helix-log to version 2.0.0 ([33792f6](https://github.com/adobe/jsonschema2md/commit/33792f6))

# [3.3.0](https://github.com/adobe/jsonschema2md/compare/v3.2.0...v3.3.0) (2019-08-26)


### Features

* allow display of custom attributes in the property description ([0634309](https://github.com/adobe/jsonschema2md/commit/0634309)), closes [#151](https://github.com/adobe/jsonschema2md/issues/151)

# [3.2.0](https://github.com/adobe/jsonschema2md/compare/v3.1.2...v3.2.0) (2019-08-20)


### Features

* disable header.ejs using console args ([104452f](https://github.com/adobe/jsonschema2md/commit/104452f)), closes [#153](https://github.com/adobe/jsonschema2md/issues/153) [#153](https://github.com/adobe/jsonschema2md/issues/153) [#153](https://github.com/adobe/jsonschema2md/issues/153) [#153](https://github.com/adobe/jsonschema2md/issues/153) [#153](https://github.com/adobe/jsonschema2md/issues/153) [#153](https://github.com/adobe/jsonschema2md/issues/153) [#153](https://github.com/adobe/jsonschema2md/issues/153)

## [3.1.2](https://github.com/adobe/jsonschema2md/compare/v3.1.1...v3.1.2) (2019-08-07)


### Bug Fixes

* always output POSIX paths ([3c1c42c](https://github.com/adobe/jsonschema2md/commit/3c1c42c))
* fix error logging from submodules ([dc634b2](https://github.com/adobe/jsonschema2md/commit/dc634b2))

## [3.1.1](https://github.com/adobe/jsonschema2md/compare/v3.1.0...v3.1.1) (2019-07-31)


### Bug Fixes

* **i18n init:** moved the i18n init part to the cli.js ([5e37d2d](https://github.com/adobe/jsonschema2md/commit/5e37d2d)), closes [#157](https://github.com/adobe/jsonschema2md/issues/157)
* **markdownwriter.js:** use path function to resolve the path ([5fe7db2](https://github.com/adobe/jsonschema2md/commit/5fe7db2)), closes [#157](https://github.com/adobe/jsonschema2md/issues/157)

# [3.1.0](https://github.com/adobe/jsonschema2md/compare/v3.0.1...v3.1.0) (2019-07-30)


### Features

* **i18n:** enable localization of all strings, provide en as default language ([daa58a2](https://github.com/adobe/jsonschema2md/commit/daa58a2)), closes [#143](https://github.com/adobe/jsonschema2md/issues/143)

## [3.0.1](https://github.com/adobe/jsonschema2md/compare/v3.0.0...v3.0.1) (2019-07-29)


### Bug Fixes

* **schema.js:** fix $ref not being resolved when nested deeper than once within an object ([6eb73c3](https://github.com/adobe/jsonschema2md/commit/6eb73c3)), closes [#155](https://github.com/adobe/jsonschema2md/issues/155)

# [3.0.0](https://github.com/adobe/jsonschema2md/compare/v2.1.2...v3.0.0) (2019-07-24)


### Bug Fixes

* **cli:** fix breaking changes to readdirp API ([5150f3f](https://github.com/adobe/jsonschema2md/commit/5150f3f))
* **package:** update readdirp to version 3.1.1 ([05cd51e](https://github.com/adobe/jsonschema2md/commit/05cd51e)), closes [#127](https://github.com/adobe/jsonschema2md/issues/127)


### Build System

* **package:** require minimum node version: 8 ([a9ec935](https://github.com/adobe/jsonschema2md/commit/a9ec935))


### BREAKING CHANGES

* **package:** Node 7 and lower are no longer supported, Node 8 is now the minimum version

## [2.1.2](https://github.com/adobe/jsonschema2md/compare/v2.1.1...v2.1.2) (2019-07-19)


### Bug Fixes

* Fix `$ref` within nested objects not generating correct markdown ([b8c9a49](https://github.com/adobe/jsonschema2md/commit/b8c9a49)), closes [#136](https://github.com/adobe/jsonschema2md/issues/136)

## [2.1.1](https://github.com/adobe/jsonschema2md/compare/v2.1.0...v2.1.1) (2019-05-29)


### Bug Fixes

* **package:** update async to version 3.0.1 ([4ffa21e](https://github.com/adobe/jsonschema2md/commit/4ffa21e))

# [2.1.0](https://github.com/adobe/jsonschema2md/compare/v2.0.0...v2.1.0) (2019-04-30)


### Features

* Apply prettier to generated markdown files for improved formatting ([0e8bde4](https://github.com/adobe/jsonschema2md/commit/0e8bde4))

# [2.0.0](https://github.com/adobe/jsonschema2md/compare/v1.0.0...v2.0.0) (2019-03-26)


### Bug Fixes

* **release:** Fix release process ([6bf5a10](https://github.com/adobe/jsonschema2md/commit/6bf5a10)), closes [#109](https://github.com/adobe/jsonschema2md/issues/109) [#90](https://github.com/adobe/jsonschema2md/issues/90)


### BREAKING CHANGES

* **release:** Major version bump

# 1.0.0 (2019-03-18)


### Bug Fixes

* **ci:** use node8 for releases ([9c2a186](https://github.com/adobe/jsonschema2md/commit/9c2a186))
