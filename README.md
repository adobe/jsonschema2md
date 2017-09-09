# JSON Schema Markdown Tools

Documenting and validating complex JSON Schemas can be hard. This tool maks it easier by providing a number of scripts that can turn JSON Schema files into readable Markdown documenation that is ready to be read on GitHub, or processed using Jekyll or other static site generators.

These tools have been introduced by Adobe to document Adobe's Experience Data Models (XDM), but can be used for other JSON Schema documents, too.

## Requirements

- npm version 3.10.8 or up

## Installing and running

```bash
# clone models project
$ git clone git@git.corp.adobe.com:AdobeCloudPlatform/models.git

# clone machinery project
$ git clone git@git.corp.adobe.com:AdobeCloudPlatform/machinery.git

# install dependencies
$ cd machinery && npm install

# show usage information
$ node index.js

# Generate Markdown from JSON Schema
#
# Usage: node index.js
#
# Options:
#   -d, --input   path to directory containing all JSON Schemas or a single JSON Schema file. This will be considered as the baseURL  [required]
#   -f, --isFile  pass if input is a single file path
#   -o, --out   path to output directory (default: ./out)

# run task
 node index.js -d ../models/schemas/draft-04/
# generated output for whole folder is written to ./out
```

### Installing the `jsonschema2md` Command Line Tools

The JSON Schema Markdown tools also includes a convenient `jsonschema2md` command line tool that can be installed using:

```bash
$ npm link
```

The command line arguments are identical between the `jsonschema2md` binary and the `index.js` node script

## Using JSON Schema Markdown Tools from `npm`

You can conveniently use the JSON Schema Markdown Tools from `npm`. This makes it possible to set up a conversion toolchain for your JSON Schema project that is driven entirely by `npm`. To do so, first define the dependency by adding this to your `"devDependencies"` section of `package.json`

```json
  "devDependencies": {
    "adobecloudplatform-machinery": "git+ssh://git@git.corp.adobe.com:AdobeCloudPlatform/machinery.git"
  }
```


Then add the following to the `"scripts"` section of your `package.json` and adapt accordingly:

```json
"scripts": {
  "prepare": "mkdir -p docs/reference && jsonschema2md -o docs/reference -d schemas/draft-04
}
```

If you run `npm install` before running `npm run prepare`, `npm` will install the `jsonschema2md` in a `node_modules/.bin` path, even if you did not install the JSON Schema Markdown beforehand.

## TODOs

* JSON Schema validation:
  * property naming convention
  * vocabulary spellchecking 
* …
