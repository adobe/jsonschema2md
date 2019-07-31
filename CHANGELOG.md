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
