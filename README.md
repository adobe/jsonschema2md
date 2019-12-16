# JSON Schema Markdown Tools

[![CircleCI](https://circleci.com/gh/adobe/jsonschema2md.svg?style=svg)](https://circleci.com/gh/adobe/jsonschema2md)

Documenting and validating complex JSON Schemas can be hard. This tool makes it easier by providing a number of scripts that can turn JSON Schema files into readable Markdown documentation that is ready for consumption on GitHub or processed using Jekyll or other static site generators.

These tools have been introduced by Adobe to document Adobe's Experience Data Models (XDM), but can be used for other JSON Schema documents, too.

## JSON Schema Support

`jsonschema2md` is developed against JSON Schema `2019-09`, but not the full vocabulary is supported. Please check the [detailed list of JSON Schema keywords supported by `jsonschema2md`](schemasupport.md). This list is updated by our tests.

## Requirements

- `npm` version 3.10.8 or up
- `node` v10 or up

## Example Output

Using the schemas in [`examples/schemas`](examples/schemas), the output in [`examples/docs`](examples/docs) has been generated.

## Installing and running

```bash
$ npm install -g @adobe/jsonschema2md

# show usage information
$ jsonschema2md

# run task
$ jsonschema2md -d examples/schemas -o examples/docs
# generated output for whole folder is written to ./examples/docs
```

## Internationalization

The generated documentation can be internationalized. Select the language you want to use for the output using the `-l` parameter.

Supported languages are:
- English
- German

If you want to provide a translation of your own, [please use GitLocalize](https://gitlocalize.com/repo/3622)

## Display custom attributes in the property description
`jsonschema2md` displays only the attributes of an property which are defined by the JSON Schema standard. If you want to display additional attributes in the property description you could provide a comma separated list with your custom attributes.

```bash
$ jsonschema2md -d examples/schemas -o examples/docs -p version,test
```

## Disable header template
In some cases you do not need a header because it does not provide any useful information. With the `--header` (or `-h`) parameter you can disable the inclusion of headers.

```bash
# run against JSON Schema Draft 06
$ jsonschema2md -d examples/schemas -o examples/docs -v 06 -h false
```

## Using JSON Schema Markdown Tools from `npm`

You can conveniently use the JSON Schema Markdown Tools from `npm`. This makes it possible to set up a conversion toolchain for your JSON Schema project that is driven entirely by `npm`. To do so, first define the dependency by adding this to your `"devDependencies"` section of `package.json`

```json
  "devDependencies": {
    "@adobe/jsonschema2md": "^4.0.0"
  }
```

Then add the following to the `"scripts"` section of your `package.json` and adapt accordingly:

```json
"scripts": {
  "prepare": "mkdir -p docs/reference && jsonschema2md -o docs/reference -d schemas/draft-04
}
```

If you run `npm install` before running `npm run prepare`, `npm` will install the `@adobe/jsonschema2md` in a `node_modules/.bin` path, even if you did not install the JSON Schema Markdown beforehand.

## Tests

Ensure you have all the dependencies installed via `npm install`, then run:

```bash
npm test
```

This will run our Jasmine test suite as well as lint the JavaScript according to our style guide (see below).

### CI

Continuous integration runs on [CircleCI](https://circleci.com/gh/adobe/jsonschema2md). 
All pull requests automatically trigger a job that runs the [tests](#tests) by executing the [`config.yml`](.circleci/config.yml). 

### Code Coverage

`npm run test` will generate a code coverage report at the end of the test run. Anything below 100% coverage counts as a test failure.

## Style Guide / Linting

This project uses [eslint](https://eslint.org) to enforce JavaScript coding style. To run the linter:

```bash
npm run lint
```

## TODOs

Add support for [missing keywords](schemasupport.md)

## Contributing

Please see [Contributing.md](Contributing.md) for details. Pull requests are welcome.

## License/Copyright

Copyright 2017 Adobe Systems Incorporated. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
