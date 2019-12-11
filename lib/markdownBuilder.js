/*
 * Copyright 2019 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
const {
  map, list: flist, flat, filter, size, foldl,
} = require('ferrum');
const {
  root, paragraph, text, heading, code, table,
  tableRow, tableCell, link, inlineCode, list, listItem, strong,
} = require('mdast-builder');
const i18n = require('es2015-i18n-tag').default;
const ghslugger = require('github-slugger');
const s = require('./symbols');
const { gentitle } = require('./formattingTools');
const { keyword } = require('./keywords');

function build({ header, links = {}, includeproperties = [] } = {}) {
  const formats = {
    'date-time': {
      label: i18n`date time`,
      text: i18n`the string must be a date time string, according to `,
      specname: 'RFC 3339, section 5.6',
      speclink: 'https://tools.ietf.org/html/rfc3339',
    },
    date: {
      label: i18n`date`,
      text: i18n`the string must be a date string, according to `,
      specname: 'RFC 3339, section 5.6',
      speclink: 'https://tools.ietf.org/html/rfc3339',
    },
    time: {
      label: i18n`time`,
      text: i18n`the string must be a time string, according to `,
      specname: 'RFC 3339, section 5.6',
      speclink: 'https://tools.ietf.org/html/rfc3339',
    },
    duration: {
      label: i18n`duration`,
      text: i18n`the string must be a duration string, according to `,
      specname: 'RFC 3339, section 5.6',
      speclink: 'https://tools.ietf.org/html/rfc3339',
    },
    email: {
      label: i18n`email`,
      text: i18n`the string must be an email address, according to `,
      specname: 'RFC 5322, section 3.4.1',
      speclink: 'https://tools.ietf.org/html/rfc5322',
    },
    'idn-email': {
      label: i18n`(international) email`,
      text: i18n`the string must be an (international) email address, according to `,
      specname: 'RFC 6531',
      speclink: 'https://tools.ietf.org/html/rfc6531',
    },
    hostname: {
      label: i18n`hostname`,
      text: i18n`the string must be a hostname, according to `,
      specname: 'RFC 1123, section 2.1',
      speclink: 'https://tools.ietf.org/html/rfc1123',
    },
    'idn-hostname': {
      label: i18n`(international) hostname`,
      text: i18n`the string must be an (IDN) hostname, according to `,
      specname: 'RFC 5890, section 2.3.2.3',
      speclink: 'https://tools.ietf.org/html/rfc5890',
    },
    ipv4: {
      label: i18n`IPv4`,
      text: i18n`the string must be an IPv4 address (dotted quad), according to `,
      specname: 'RFC 2673, section 3.2',
      speclink: 'https://tools.ietf.org/html/rfc2673',
    },
    ipv6: {
      label: i18n`IPv6`,
      text: i18n`the string must be an IPv6 address, according to `,
      specname: 'RFC 4291, section 2.2',
      speclink: 'https://tools.ietf.org/html/rfc4291',
    },
    uri: {
      label: i18n`URI`,
      text: i18n`the string must be a URI, according to `,
      specname: 'RFC 3986',
      speclink: 'https://tools.ietf.org/html/rfc4291',
    },
    iri: {
      label: i18n`IRI`,
      text: i18n`the string must be a IRI, according to `,
      specname: 'RFC 3987',
      speclink: 'https://tools.ietf.org/html/rfc4291',
    },
    'uri-reference': {
      label: i18n`URI reference`,
      text: i18n`the string must be a URI reference, according to `,
      specname: 'RFC 3986',
      speclink: 'https://tools.ietf.org/html/rfc4291',
    },
    'iri-reference': {
      label: i18n`IRI reference`,
      text: i18n`the string must be a IRI reference, according to `,
      specname: 'RFC 3987',
      speclink: 'https://tools.ietf.org/html/rfc4291',
    },
    uuid: {
      label: i18n`UUID`,
      text: i18n`the string must be a UUID, according to `,
      specname: 'RFC 4122',
      speclink: 'https://tools.ietf.org/html/rfc4122',
    },
  };

  const headerprops = [
    /*
    {
      name: 'type',
      title: i18n`Type`,
      objectlabel: i18n`Object`,
      arraylabel: i18n`Array`,
      multiplelabel: i18n`Multiple`,
      mergedlabel: i18n`Merged`,
      undefinedlabel: i18n`Undefined`,
      numberlabel: i18n`Number`,
      booleanlabel: i18n`Boolean`,
      stringlabel: i18n`String`,
      integerlabel: i18n`Integer`,
      nulllabel: i18n`Null`,
    },
    */
    {
      name: 'abstract',
      title: i18n`Abstract`,
      truelabel: i18n`Cannot be instantiated`,
      falselabel: i18n`Can be instantiated`,
      undefinedlabel: i18n`Unknown abstraction`,
    },
    {
      name: 'extensible',
      title: i18n`Extensible`,
      undefinedlable: i18n`Unknown extensibility`,
      truelabel: i18n`Yes`,
      falselabel: i18n`No`,
    },
    {
      name: 'status',
      title: i18n`Status`,
      undefinedlabel: 'Unknown status',
      deprecatedlabel: i18n`Deprecated`,
      stablelabel: i18n`Stable`,
      stabilizinglabel: i18n`Stabilizing`,
      experimentallabel: i18n`Experimental`,
    },
    {
      name: 'identifiable',
      title: i18n`Identifiable`,
      truelabel: i18n`Yes`,
      falselabel: i18n`No`,
      undefinedlabel: i18n`Unknown identifiability`,
    },
    {
      name: 'custom',
      title: i18n`Custom Properties`,
      truelabel: i18n`Allowed`,
      falselabel: i18n`Forbidden`,
      undefinedlabel: i18n`Unknown custom properties`,
    },
    {
      name: 'additional',
      title: i18n`Additional Properties`,
      truelabel: i18n`Allowed`,
      falselabel: i18n`Forbidden`,
      undefinedlabel: i18n`Unknown additional properties`,
    },
    {
      name: 'definedin',
      title: i18n`Defined In`,
      undefinedlabel: i18n`Unknown definition`,
    },
  ];


  /**
   * Generates the overall header for the schema documentation
   * @param {*} schema
   */
  function makeheader(schema) {
    if (header) {
      return [
        heading(1, text(i18n`${gentitle(schema[s.titles], schema.type)} Schema`)),
        paragraph(code('txt', schema[s.id] + (schema[s.pointer] ? `#${schema[s.pointer]}` : ''))),
        schema[s.meta].longdescription,
        table('left', [
          // iterate over header
          tableRow(
            flist(
              map(headerprops,
                ({ name, title }) => {
                  if (links[name]) {
                    return tableCell(link(links[name], i18n`What does ${title} mean?`, text(title)));
                  }
                  return tableCell(text(title));
                }), Array,
            ),
          ),
          tableRow(
            flist(
              map(headerprops,
                (prop) => {
                  // this is a linked property
                  if (schema[s.meta]
                    && typeof schema[s.meta][prop.name] === 'object'
                    && schema[s.meta][prop.name].link
                    && schema[s.meta][prop.name].text) {
                    return tableCell(link(schema[s.meta][prop.name].link, i18n`open original schema`, [text(schema[s.meta][prop.name].text)]));
                  }
                  const value = schema[s.meta] ? schema[s.meta][prop.name] : undefined;
                  if (prop[`${String(value)}label`]) {
                    return tableCell(text(prop[`${String(value)}label`] || i18n`Unknown`));
                  } else {
                    const warn = `Unknown label in ${prop.name} for value ${String(value)}`;
                    console.log(warn);
                    return tableCell(text(i18n`Unknown`));
                  }
                }), Array,
            ),
          ),
        ]),
      ];
    }
    return [];
  }

  function type(property) {
    const types = Array.isArray(property.type) ? property.type : [property.type];
    const realtypes = flist(filter(types, mytype => mytype !== 'null' && mytype !== undefined));
    if (property.allOf || property.anyOf || property.oneOf || property.not) {
      return text(i18n`Merged`);
    } else if (size(realtypes) === 0) {
      return text(i18n`Not specified`);
    } else if (size(realtypes) === 1) {
      const [realtype] = realtypes;
      // TODO needs better handling of named types
      return inlineCode(realtype);
    } else {
      return text(i18n`Multiple`);
    }
  }

  function nullable(property) {
    const types = Array.isArray(property.type) ? property.type : [property.type];
    const nulltypes = flist(filter(types, mytype => mytype === keyword`null`));
    if (size(nulltypes)) {
      return text(i18n`can be null`);
    }
    return text(i18n`cannot be null`);
  }

  /**
   * Generates the overview table row for a single property definition
   * @param {*} param0
   */
  function makepropheader(required = [], ispattern = false) {
    return ([name, definition]) => tableRow([
      tableCell(ispattern ? inlineCode(name) : link(`#${name}`, '', text(name))), // Property
      tableCell(type(definition)),
      tableCell(text(required.indexOf(name) > -1 ? i18n`Required` : i18n`Optional`)),
      tableCell(nullable(definition)),
      tableCell(link(`${definition[s.slug]}.md`, `${definition[s.id]}#${definition[s.pointer]}`, text(definition[s.titles][0] || i18n`Untitled schema`))),
    ]);
  }

  /**
   * Generates the table of contents for a properties
   * object.
   * @param {*} props
   */
  function makeproptable(props, patternProps = {}, additionalProps, required, slugger) {
    const proprows = Object
      .entries(props)
      .map(makepropheader(required, false, slugger));
    const patternproprows = Object
      .entries(patternProps)
      .map(makepropheader(required, true, slugger));
    const additionalproprows = (() => {
      if (additionalProps) {
        const any = additionalProps === true;
        return [tableRow([
          tableCell(text(i18n`Additional Properties`)),
          tableCell(any ? text('Any') : type(additionalProps)),
          tableCell(text(i18n`Optional`)),
          tableCell(any ? text('can be null') : nullable(additionalProps)),
          tableCell(link(`${additionalProps[s.slug]}.md`, `${additionalProps[s.id]}#${additionalProps[s.pointer]}`, text(additionalProps[s.titles][0] || i18n`Untitled schema`))),
        ])];
      }
      return [];
    })();

    // const proprows = flist(map(iter(props || {}), makepropheader(required)));

    return table('left', [
      tableRow([
        tableCell(text(i18n`Property`)),
        tableCell(text(i18n`Type`)),
        tableCell(text(i18n`Required`)),
        tableCell(text(i18n`Nullable`)),
        tableCell(text(i18n`Defined by`)),
      ]),
      ...proprows,
      ...patternproprows,
      ...additionalproprows,
    ]);
  }

  function maketypefact(definition, isarray = '') {
    const alltypes = Array.isArray(definition.type) ? definition.type : [definition.type];
    // filter out types that are null
    const realtypes = alltypes.filter(mytype => mytype !== keyword`null`);
    // can the type be `null`
    const isnullable = alltypes.filter(mytype => mytype === keyword`null`).length > 0;
    // is there only a single type or can there be multiple types
    const singletype = realtypes.length <= 1;
    const [firsttype] = realtypes;
    // is `null` the only allowed value
    const nulltype = isnullable && realtypes.length === 0;

    const array = firsttype === keyword`array`;
    const merged = !!(definition.allOf || definition.anyOf || definition.oneOf || definition.not);

    if (array && definition.items) {
      return maketypefact(definition.items, `${isarray}[]`);
    }

    const typefact = (() => {
      if (nulltype) {
        return [inlineCode(`null${isarray}`), text(i18n`, the value must be null`)];
      } else if (singletype && firsttype) {
        return [inlineCode(firsttype + isarray)];
      } else if (!singletype) {
        return [text(isarray ? i18n`an array of the following:` : i18n`any of the folllowing: `), ...flist(flat(realtypes.map((mytype, index) => [inlineCode(mytype || i18n`not defined`), text(index === realtypes.length - 1 ? '' : i18n` or `)])))];
      } else if (merged) {
        return [text(isarray ? 'an array of merged types' : i18n`merged type`)];
      }
      // console.log('unknown type', realtypes, singletype, merged, definition[s.pointer]);
      return [text(i18n`unknown` + isarray)];
    })();

    const typelink = (() => {
      if (definition.title) {
        // if the type has a title, always create a link to the schema
        return [text(' ('), link(`${definition[s.slug]}.md`, '', text(definition.title)), text(')')];
      } else if (!singletype || firsttype === keyword`object` || merged) {
        return [text(' ('), link(`${definition[s.slug]}.md`, '', text(i18n`Details`)), text(')')];
      }
      return [];
    })();
    const retval = listItem(paragraph([text(i18n`Type: `), ...typefact, ...typelink]));
    return retval;
  }

  function makenullablefact(definition) {
    const alltypes = Array.isArray(definition.type) ? definition.type : [definition.type];
    // can the type be `null`
    const isnullable = alltypes.filter(mytype => mytype === keyword`null`).length > 0;

    if (isnullable) {
      return listItem(paragraph(text(i18n`can be null`)));
    } else {
      return listItem(paragraph(text(i18n`cannot be null`)));
    }
  }

  function makedefinedinfact(definition) {
    return listItem(paragraph([
      text(i18n`defined in: `),
      link(`${definition[s.slug]}.md`, `${definition[s.id]}#${definition[s.pointer]}`, text(definition[s.titles][0] || i18n`Untitled schema`)),
    ]));
  }

  function makefactlist(name, definition, required = []) {
    const children = [];


    if (required.indexOf(name) > -1) {
      children.push(listItem(text(i18n`is required`)));
    } else {
      children.push(listItem(text(i18n`is optional`)));
    }

    children.push(maketypefact(definition));
    children.push(makenullablefact(definition));
    children.push(makedefinedinfact(definition));

    const additionalfacts = includeproperties.map((propname) => {
      if (definition[propname]) {
        return listItem(text(`${propname}: ${String(definition[propname])}`));
      }
      return undefined;
    }).filter(item => item !== undefined);

    children.push(...additionalfacts);

    return list('unordered', children);
  }


  function simpletitle(schema) {
    return schema[s.parent] ? schema[s.pointer].split('/').pop() : gentitle(schema[s.titles], schema.type);
  }

  function makejointypelist(schema, depth = 0, maxdepth = 3) {
    if (schema.oneOf && depth <= maxdepth) {
      return [
        paragraph(text(i18n`one (and only one) of`)),
        list('unordered', [
          ...schema.oneOf.map(subschema => listItem(makejointypelist(subschema, depth + 1))),
        ]),
      ];
    } else if (schema.anyOf && depth <= maxdepth) {
      return [
        paragraph(text(i18n`any of`)),
        list('unordered', [
          ...schema.anyOf.map(subschema => listItem(makejointypelist(subschema, depth + 1))),
        ]),
      ];
    } else if (schema.allOf && depth <= maxdepth) {
      return [
        paragraph(text(i18n`all of`)),
        list('unordered', [
          ...schema.allOf.map(subschema => listItem(makejointypelist(subschema, depth + 1))),
        ]),
      ];
    } else if (schema.not && depth <= maxdepth) {
      const subschema = schema.not;
      return [
        paragraph(text(i18n`not`)),
        list('unordered', [
          listItem(makejointypelist(subschema, depth + 1)),
        ]),
      ];
    } else if (depth > 0) {
      return [
        link(`${schema[s.slug].md}`, i18n`check type definition`, text(gentitle(schema[s.titles], schema.type))),
      ];
    } else {
      return [];
    }
  }

  function maketypesection(schema, level = 1) {
    const { children } = maketypefact(schema);
    children[0].children.shift();
    return [
      heading(level + 1, text(i18n`${simpletitle(schema)} Type`)),
      ...children,
      ...makejointypelist(schema),
    ];
  }


  function makeconstraintssection(schema, level = 1) {
    const constraints = [];
    if (schema.const) {
      // console.log('const!', schema[s.pointer]);
      constraints.push(paragraph([strong(text(i18n`constant`)), text(': '), text(i18n`the value of this property must be equal to:`)]));
      constraints.push(code('json', JSON.stringify(schema.const, undefined, 2)));
    }

    if (schema.enum) {
      console.log('enum!', schema[s.filename], schema[s.pointer]);
      const metas = schema[keyword`meta:enum`] || {};
      constraints.push(paragraph([strong(text(i18n`constant`)), text(': '), text(i18n`the value of this property must be equal to one of the following values:`)]));
      constraints.push(table('left', [
        tableRow([
          tableCell(text(i18n`Value`)),
          tableCell(text(i18n`Explanation`)),
        ]),
        ...schema.enum.map(value => tableRow([
          tableCell(inlineCode(JSON.stringify(value))),
          tableCell(text(metas[value] || '')),
        ])),
      ]));
    }


    // https://json-schema.org/draft/2019-09/json-schema-validation.html#rfc.section.6.2
    if (schema.multipleOf) {
      // console.log('multiple!', schema[s.filename], schema[s.pointer]);
      constraints.push(paragraph([strong(text(i18n`multiple of`)), text(': '), text(i18n`the value of this number must be a multiple of: `), inlineCode(String(schema.multipleOf))]));
    }
    if (schema.maximum) {
      // console.log('maximum!', schema[s.filename], schema[s.pointer]);
      constraints.push(paragraph([strong(text(i18n`maximum`)), text(': '), text(i18n`the value of this number must smaller than or equal to: `), inlineCode(String(schema.maximum))]));
    }
    if (schema.exclusiveMaximum) {
      // console.log('exclusiveMaximum!', schema[s.filename], schema[s.pointer]);
      constraints.push(paragraph([strong(text(i18n`maximum (exclusive)`)), text(': '), text(i18n`the value of this number must be smaller than: `), inlineCode(String(schema.exclusiveMaximum))]));
    }
    if (schema.minimum) {
      // console.log('minimum!', schema[s.filename], schema[s.pointer]);
      constraints.push(paragraph([strong(text(i18n`minimum`)), text(': '), text(i18n`the value of this number must greater than or equal to: `), inlineCode(String(schema.minimum))]));
    }
    if (schema.exclusiveMinimum) {
      // console.log('exclusiveMinimum!', schema[s.filename], schema[s.pointer]);
      constraints.push(paragraph([strong(text(i18n`minimum (exclusive)`)), text(': '), text(i18n`the value of this number must be greater than: `), inlineCode(String(schema.exclusiveMinimum))]));
    }

    // https://json-schema.org/draft/2019-09/json-schema-validation.html#rfc.section.6.3
    if (schema.maxLength) {
      // console.log('maxLength!', schema[s.filename], schema[s.pointer]);
      constraints.push(paragraph([strong(text(i18n`maximum length`)), text(': '), text(i18n`the maximum number of characters for this string is: `), inlineCode(String(schema.maxLength))]));
    }
    if (schema.minLength) {
      // console.log('minLength!', schema[s.filename], schema[s.pointer]);
      constraints.push(paragraph([strong(text(i18n`minimum length`)), text(': '), text(i18n`the minimum number of characters for this string is: `), inlineCode(String(schema.minLength))]));
    }
    if (schema.pattern) {
      // console.log('pattern!', schema[s.filename], schema[s.pointer]);
      constraints.push(paragraph([strong(text(i18n`pattern`)), text(': '), text(i18n`the string must match the following regular expression: `)]));
      constraints.push(code('regexp', schema.pattern));
      constraints.push(paragraph([link(`https://regexr.com/?expression=${encodeURIComponent(schema.pattern)}`, i18n`try regular expression with regexr.com`, text(i18n`try pattern`))]));
    }
    // https://json-schema.org/draft/2019-09/json-schema-validation.html#rfc.section.7.3
    if (schema.format && formats[schema.format]) {
      constraints.push(paragraph([
        strong(text(formats[schema.format].label)),
        text(': '),
        text(formats[schema.format].text),
        link(formats[schema.format].speclink, i18n`check the specification`, text(formats[schema.format].specname)),
      ]));
    } else if (schema.format) {
      constraints.push(paragraph([strong(text(i18n`unknown format`)), text(': '), text(i18n`the value of this string must follow the format: `), inlineCode(String(schema.format))]));
    }

    // https://json-schema.org/draft/2019-09/json-schema-validation.html#rfc.section.6.4
    if (schema.maxItems) {
      // console.log('maxItems!', schema[s.filename], schema[s.pointer]);
      constraints.push(paragraph([strong(text(i18n`maximum number of items`)), text(': '), text(i18n`the maximum number of items for this array is: `), inlineCode(String(schema.maxItems))]));
    }
    if (schema.minItems) {
      // console.log('minItems!', schema[s.filename], schema[s.pointer]);
      constraints.push(paragraph([strong(text(i18n`minimum number of items`)), text(': '), text(i18n`the minimum number of items for this array is: `), inlineCode(String(schema.minItems))]));
    }
    if (schema.uniqueItems) {
      // console.log('uniqueItems!', schema[s.filename], schema[s.pointer]);
      constraints.push(paragraph([strong(text(i18n`unique items`)), text(': '), text(i18n`all items in this array must be unique. Duplicates are not allowed.`)]));
    }
    if (schema.minContains && schema.contains) {
      // console.log('minContains!', schema[s.filename], schema[s.pointer]);
      constraints.push(paragraph([strong(text(i18n`minimum number of contained items`)), text(': '), text(i18n`this array may not contain more than ${schema.minContains} items that validate against the schema:`),
        link(`${schema.contains[s.slug].md}`, i18n`check type definition`, gentitle(schema.contains[s.titles], schema.contains.type))]));
    }
    if (schema.maxContains && schema.contains) {
      // console.log('maxContains!', schema[s.filename], schema[s.pointer]);
      constraints.push(paragraph([strong(text(i18n`maximum number of contained items`)), text(': '), text(i18n`this array may not contain fewer than ${schema.maxContains} items that validate against the schema:`),
        link(`${schema.contains[s.slug].md}`, i18n`check type definition`, gentitle(schema.contains[s.titles], schema.contains.type))]));
    }

    // https://json-schema.org/draft/2019-09/json-schema-validation.html#rfc.section.6.5
    if (schema.maxProperties) {
      // console.log('maxProperties!', schema[s.filename], schema[s.pointer]);
      constraints.push(paragraph([strong(text(i18n`maximum number of properties`)), text(': '), text(i18n`the maximum number of properties for this object is: `), inlineCode(String(schema.maxProperties))]));
    }
    if (schema.minProperties) {
      // console.log('minProperties!', schema[s.filename], schema[s.pointer]);
      constraints.push(paragraph([strong(text(i18n`minimum number of properties`)), text(': '), text(i18n`the minimum number of properties for this object is: `), inlineCode(String(schema.minProperties))]));
    }

    if (constraints.length > 0) {
      return [heading(level + 1, text(i18n`${simpletitle(schema)} Constraints`)), ...constraints];
    }
    return [];
  }


  function makeexamples(schema, level = 1) {
    if (schema.examples && schema.examples.length > 0) {
      return [
        heading(level + 1, text(i18n`${simpletitle(schema)} Examples`)),
        ...schema.examples.map(example => paragraph(code('json', JSON.stringify(example, undefined, 2)))),
      ];
    }
    return [];
  }

  function makeproplist(properties = {},
    patternProperties = {},
    additionalProperties,
    required,
    level = 2) {
    if (!properties) {
      return [];
    }
    return [
      ...flist(flat(Object.entries(properties).map(([name, definition]) => {
        const description = definition[s.meta].longdescription || paragraph(text(i18n`no description`));

        return [
          heading(level + 1, text(name)),
          description,
          paragraph(inlineCode(name)),
          makefactlist(name, definition, required),
          ...maketypesection(definition, level + 1),
          ...makeconstraintssection(definition, level + 1),
          ...makeexamples(definition, level + 1),
        ];
      }))),
      ...flist(flat(Object.entries(patternProperties).map(([name, definition]) => {
        const description = definition[s.meta].longdescription || paragraph(text(i18n`no description`));

        return [
          heading(level + 1, [text(i18n`Pattern: `), inlineCode(name)]),
          description,
          paragraph(inlineCode(name)),
          makefactlist(name, definition, required),
          ...maketypesection(definition, level + 1),
          ...makeconstraintssection(definition, level + 1),
          ...makeexamples(definition, level + 1),
        ];
      }))),
      ...((definition) => {
        if (typeof additionalProperties === 'object') {
          const description = definition[s.meta].longdescription || paragraph(text(i18n`no description`));
          return [
            heading(level + 1, text(i18n`Additional Properties`)),
            paragraph(text(i18n`Additional properties are allowed, as long as they follow this schema:`)),
            description,
            makefactlist(i18n`Additional properties`, definition, required),
            ...maketypesection(definition, level + 1),
            ...makeconstraintssection(definition, level + 1),
            ...makeexamples(definition, level + 1),
          ];
        } else if (additionalProperties === true) {
          return [
            heading(level + 1, text(i18n`Additional Properties`)),
            paragraph(text(i18n`Additional properties are allowed and do not have to follow a specific schema`)),
          ];
        }
        // nothing
        return [];
      })(additionalProperties),
    ];
  }

  /**
   * Generates the definitions section for a schema
   * @param {*} schema
   */
  function makedefinitions(schema, slugger) {
    if (schema.definitions) {
      const defgroups = Object.entries(schema.definitions).map(([groupname, subschema]) => {
        const grouptable = makeproptable(
          subschema.properties,
          subschema.patternProperties,
          subschema.additionalProperties,
          subschema.required,
          slugger,
        );
        return [
          heading(2, text(i18n`Definitions group ${groupname}`)),
          paragraph(text(i18n`Reference this group by using`)),
          code('json', JSON.stringify({ $ref: `${subschema[s.id]}#${subschema[s.pointer]}` })),
          grouptable,
          ...makeproplist(
            subschema.properties,
            subschema.patternProperties,
            subschema.additionalProperties,
            subschema.required,
            2,
          ),
        ];
      });

      return [
        heading(1, text(i18n`${gentitle(schema[s.titles], schema.type)} Definitions`)),
        ...flist(flat(defgroups)),
      ];
    }
    return [];
  }

  /**
   * Generates the properties section for a schema
   * @param {*} schema
   */
  function makeproperties(schema, slugger) {
    if (schema.properties) {
      return [
        heading(1, text(i18n`${schema.title} Properties`)),
        makeproptable(
          schema.properties,
          schema.patternProperties,
          schema.additionalProperties,
          schema.required,
          slugger,
        ),
        ...makeproplist(
          schema.properties,
          schema.patternProperties,
          schema.additionalProperties,
          schema.required,
          1,
        ),
      ];
    }
    return [];
  }

  console.log('generating markdown');
  return schemas => foldl(schemas, {}, (pv, schema) => {
    const slugger = ghslugger();
    // eslint-disable-next-line no-param-reassign
    pv[schema[s.slug]] = root([
      // todo add more elements
      ...makeheader(schema),
      ...maketypesection(schema, 1),
      ...makeconstraintssection(schema, 1),
      ...makeexamples(schema, 1),
      ...makedefinitions(schema, slugger),
      ...makeproperties(schema, slugger),
    ]);
    return pv;
  });
}

module.exports = build;
