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
  blockquote,
} = require('mdast-builder');
const i18n = require('es2015-i18n-tag').default;
const ghslugger = require('github-slugger');
const yaml = require('js-yaml');
const s = require('./symbols');
const { gentitle } = require('./formattingTools');
const { keyword } = require('./keywords');

function build({
  header,
  links = {},
  includeproperties = [],
  rewritelinks = x => x,
  exampleformat = 'json',
  skipproperties = [],
} = {}) {
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
      speclink: 'https://tools.ietf.org/html/rfc3986',
    },
    iri: {
      label: i18n`IRI`,
      text: i18n`the string must be a IRI, according to `,
      specname: 'RFC 3987',
      speclink: 'https://tools.ietf.org/html/rfc3987',
    },
    'uri-reference': {
      label: i18n`URI reference`,
      text: i18n`the string must be a URI reference, according to `,
      specname: 'RFC 3986',
      speclink: 'https://tools.ietf.org/html/rfc3986',
    },
    'iri-reference': {
      label: i18n`IRI reference`,
      text: i18n`the string must be a IRI reference, according to `,
      specname: 'RFC 3987',
      speclink: 'https://tools.ietf.org/html/rfc3987',
    },
    uuid: {
      label: i18n`UUID`,
      text: i18n`the string must be a UUID, according to `,
      specname: 'RFC 4122',
      speclink: 'https://tools.ietf.org/html/rfc4122',
    },
    'json-pointer': {
      label: i18n`JSON Pointer`,
      text: i18n`the string must be a JSON Pointer, according to `,
      specname: 'RFC 6901, section 5',
      speclink: 'https://tools.ietf.org/html/rfc6901',
    },
    'relative-json-pointer': {
      label: i18n`Relative JSON Pointer`,
      text: i18n`the string must be a relative JSON Pointer, according to `,
      specname: 'draft-handrews-relative-json-pointer-01',
      speclink: 'https://tools.ietf.org/html/draft-handrews-relative-json-pointer-01',
    },
    regex: {
      label: i18n`RegEx`,
      text: i18n`the string must be a regular expression, according to `,
      specname: 'ECMA-262',
      speclink: 'http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf',
    },
    'uri-template': {
      label: i18n`URI Template`,
      text: i18n`the string must be a URI template, according to `,
      specname: 'RFC 6570',
      speclink: 'https://tools.ietf.org/html/rfc6570',
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
      name: 'restrictions',
      title: i18n`Access Restrictions`,
      readOnlylabel: i18n`Read only`,
      writeOnlylabel: i18n`Write only`,
      secretlabel: i18n`cannot be read or written`,
      undefinedlabel: i18n`none`,
    },
    {
      name: 'definedin',
      title: i18n`Defined In`,
      undefinedlabel: i18n`Unknown definition`,
    },
  ];

  function makecomment(schema) {
    if (schema[keyword`$comment`]) {
      return [
        blockquote(schema[s.meta].longcomment),
      ];
    }
    return [];
  }


  /**
   * Generates the overall header for the schema documentation
   * @param {*} schema
   */
  function makeheader(schema) {
    // console.log('making header for', schema[s.filename], schema[s.pointer]);
    if (header) {
      return [
        heading(1, text(i18n`${gentitle(schema[s.titles], schema[keyword`type`])} Schema`)),
        paragraph(code('txt', schema[s.id] + (schema[s.pointer] ? `#${schema[s.pointer]}` : ''))),
        schema[s.meta].longdescription,
        ...makecomment(schema),
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
                    return tableCell(link(rewritelinks(schema[s.meta][prop.name].link), i18n`open original schema`, [text(schema[s.meta][prop.name].text)]));
                  }
                  const value = schema[s.meta] ? schema[s.meta][prop.name] : undefined;
                  return tableCell(text(prop[`${String(value)}label`] || i18n`Unknown`));
                }), Array,
            ),
          ),
        ]),
      ];
    }
    return [];
  }

  function type(property) {
    if (!Array.isArray(property[keyword`type`]) && typeof property[keyword`type`] === 'object') {
      return text(i18n`Unknown Type`);
    }
    const types = Array.isArray(property[keyword`type`]) ? property[keyword`type`] : [property[keyword`type`]];
    const realtypes = flist(filter(types, mytype => mytype !== 'null' && mytype !== undefined));
    if (property[keyword`allOf`] || property[keyword`anyOf`] || property[keyword`oneOf`] || property[keyword`not`]) {
      return text(i18n`Merged`);
    } else if (size(realtypes) === 0) {
      return text(i18n`Not specified`);
    }
    return (size(realtypes) === 1) ? inlineCode(realtypes[0]) : text(i18n`Multiple`);
  }

  function nullable(property) {
    const types = Array.isArray(property[keyword`type`]) ? property[keyword`type`] : [property[keyword`type`]];
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
  function makepropheader(required = [], ispattern = false, slugger) {
    return ([name, definition]) => tableRow([
      tableCell(ispattern ? inlineCode(name) : link(`#${slugger.slug(name)}`, '', text(name))), // Property
      tableCell(type(definition)),
      tableCell(text(required.indexOf(name) > -1 ? i18n`Required` : i18n`Optional`)),
      tableCell(nullable(definition)),
      tableCell(link(`${definition[s.slug]}.md`, `${definition[s.id]}#${definition[s.pointer]}`,
        text(definition[s.titles] && definition[s.titles][0] ? definition[s.titles][0] : i18n`Untitled schema`))),
    ]);
  }

  /**
   * Generates the table of contents for a properties
   * object.
   * @param {*} props
   */
  function makeproptable(props = {}, patternProps = {}, additionalProps, required, slugger) {
    if (skipproperties.includes('proptable')) {
      return paragraph();
    }
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
          tableCell(any ? text('') : link(`${additionalProps[s.slug]}.md`, `${additionalProps[s.id]}#${additionalProps[s.pointer]}`, text(additionalProps[s.titles][0] || i18n`Untitled schema`))),
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

  function makearrayfact(items, additional) {
    if (skipproperties.includes('arrayfact')) {
      return '';
    }
    return listItem([
      paragraph([text(i18n`Type: `), text(i18n`an array where each item follows the corresponding schema in the following list:`)]),
      list('ordered',
        [...items.map(schema => listItem(paragraph(link(
          `${schema[s.slug]}.md`,
          i18n`check type definition`,
          text(gentitle(schema[s.titles], schema[keyword`type`])),
        )))),
        ...(() => {
          if (additional === true) {
            return [listItem(paragraph(text(i18n`and all following items may follow any schema`)))];
          } else if (typeof additional === 'object') {
            return [listItem(paragraph([text(i18n`and all following items must follow the schema: `),
              link(
                `${additional[s.slug]}.md`,
                i18n`check type definition`,
                text(gentitle(additional[s.titles], additional[keyword`type`])),
              )]))];
          }
          return [];
        })(),
        ])]);
  }

  function maketypefact(definition, isarray = '') {
    const alltypes = Array.isArray(definition[keyword`type`]) ? definition[keyword`type`] : [definition[keyword`type`]];
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
    const merged = !!(definition[keyword`allOf`] || definition[keyword`anyOf`] || definition[keyword`oneOf`] || definition[keyword`not`]);

    if (array && Array.isArray(definition[keyword`items`])) {
      return makearrayfact(definition[keyword`items`], definition[keyword`additionalItems`]);
    } else if (array && definition[keyword`items`]) {
      return maketypefact(definition[keyword`items`], `${isarray}[]`);
    }

    const typefact = (() => {
      if (nulltype) {
        return [inlineCode(`null${isarray}`), text(i18n`, the value must be null`)];
      } else if (singletype && firsttype && typeof firsttype === 'string') {
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
      if (definition[keyword`title`] && typeof definition[keyword`title`] === 'string') {
        // if the type has a title, always create a link to the schema
        return [text(' ('), link(`${definition[s.slug]}.md`, '', text(definition[keyword`title`])), text(')')];
      } else if (!singletype || firsttype === keyword`object` || merged) {
        return [text(' ('), link(`${definition[s.slug]}.md`, '', text(i18n`Details`)), text(')')];
      }
      return [];
    })();
    const retval = listItem(paragraph([text(i18n`Type: `), ...typefact, ...typelink]));
    return retval;
  }

  function makenullablefact(definition) {
    const alltypes = Array.isArray(definition[keyword`type`]) ? definition[keyword`type`] : [definition[keyword`type`]];
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
      link(`${definition[s.slug]}.md`, `${definition[s.id]}#${definition[s.pointer]}`, text(definition[s.titles] && definition[s.titles][0] ? definition[s.titles][0] : i18n`Untitled schema`)),
    ]));
  }

  function makefactlist(name, definition, required = []) {
    const children = [];


    if (required.indexOf(name) > -1) {
      children.push(listItem(text(i18n`is required`)));
    } else {
      children.push(listItem(text(i18n`is optional`)));
    }

    if (!skipproperties.includes('typefact')) {
      children.push(maketypefact(definition));
    }
    if (!skipproperties.includes('nullablefact')) {
      children.push(makenullablefact(definition));
    }
    if (!skipproperties.includes('definedinfact')) {
      children.push(makedefinedinfact(definition));
    }

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
    return schema[s.parent] ? schema[s.pointer].split('/').pop() : gentitle(schema[s.titles], schema[keyword`type`]);
  }

  function makejointypelist(schema, depth = 0, maxdepth = 3) {
    if (schema[keyword`oneOf`] && depth <= maxdepth) {
      return [
        paragraph(text(i18n`one (and only one) of`)),
        list('unordered', [
          ...schema[keyword`oneOf`].map(subschema => listItem(makejointypelist(subschema, depth + 1))),
        ]),
      ];
    } else if (schema[keyword`anyOf`] && depth <= maxdepth) {
      return [
        paragraph(text(i18n`any of`)),
        list('unordered', [
          ...schema[keyword`anyOf`].map(subschema => listItem(makejointypelist(subschema, depth + 1))),
        ]),
      ];
    } else if (schema[keyword`allOf`] && depth <= maxdepth) {
      return [
        paragraph(text(i18n`all of`)),
        list('unordered', [
          ...schema[keyword`allOf`].map(subschema => listItem(makejointypelist(subschema, depth + 1))),
        ]),
      ];
    } else if (schema[keyword`not`] && depth <= maxdepth) {
      const subschema = schema[keyword`not`];
      return [
        paragraph(text(i18n`not`)),
        list('unordered', [
          listItem(makejointypelist(subschema, depth + 1)),
        ]),
      ];
    } else if (depth > 0) {
      return [
        link(`${schema[s.slug]}.md`, i18n`check type definition`, text(gentitle(schema[s.titles], schema[keyword`type`]))),
      ];
    } else {
      return [];
    }
  }

  function maketypesection(schema, level = 1) {
    if (skipproperties.includes('typesection')) {
      return '';
    }
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
    if (schema[keyword`const`] !== undefined) {
      constraints.push(paragraph([strong(text(i18n`constant`)), text(': '), text(i18n`the value of this property must be equal to:`)]));
      constraints.push(code('json', JSON.stringify(schema[keyword`const`], undefined, 2)));
    }

    if (schema[keyword`enum`]) {
      const metas = schema[keyword`meta:enum`] || {};
      constraints.push(paragraph([strong(text(i18n`enum`)), text(': '), text(i18n`the value of this property must be equal to one of the following values:`)]));
      constraints.push(table('left', [
        tableRow([
          tableCell(text(i18n`Value`)),
          tableCell(text(i18n`Explanation`)),
        ]),
        ...schema[keyword`enum`].map(value => tableRow([
          tableCell(inlineCode(JSON.stringify(value))),
          tableCell(text(metas[Array.isArray(value) ? JSON.stringify(value) : value] || '')),
        ])),
      ]));
    }


    // https://json-schema.org/draft/2019-09/json-schema-validation.html#rfc.section.6.2
    if (schema[keyword`multipleOf`] !== undefined && typeof schema[keyword`multipleOf`] === 'number') {
      // console.log('multiple!', schema[s.filename], schema[s.pointer]);
      constraints.push(paragraph([strong(text(i18n`multiple of`)), text(': '), text(i18n`the value of this number must be a multiple of: `), inlineCode(String(schema[keyword`multipleOf`]))]));
    }
    if (schema[keyword`maximum`] !== undefined && typeof schema[keyword`maximum`] === 'number') {
      // console.log('maximum!', schema[s.filename], schema[s.pointer]);
      constraints.push(paragraph([strong(text(i18n`maximum`)), text(': '), text(i18n`the value of this number must smaller than or equal to: `), inlineCode(String(schema[keyword`maximum`]))]));
    }
    if (schema[keyword`exclusiveMaximum`] !== undefined && typeof schema[keyword`exclusiveMaximum`] === 'number') {
      // console.log('exclusiveMaximum!', schema[s.filename], schema[s.pointer]);
      constraints.push(paragraph([strong(text(i18n`maximum (exclusive)`)), text(': '), text(i18n`the value of this number must be smaller than: `), inlineCode(String(schema[keyword`exclusiveMaximum`]))]));
    }
    if (schema[keyword`minimum`] !== undefined && typeof schema[keyword`minimum`] === 'number') {
      // console.log('minimum!', schema[s.filename], schema[s.pointer]);
      constraints.push(paragraph([strong(text(i18n`minimum`)), text(': '), text(i18n`the value of this number must greater than or equal to: `), inlineCode(String(schema[keyword`minimum`]))]));
    }
    if (schema[keyword`exclusiveMinimum`] !== undefined && typeof schema[keyword`exclusiveMinimum`] === 'number') {
      // console.log('exclusiveMinimum!', schema[s.filename], schema[s.pointer]);
      constraints.push(paragraph([strong(text(i18n`minimum (exclusive)`)), text(': '), text(i18n`the value of this number must be greater than: `), inlineCode(String(schema[keyword`exclusiveMinimum`]))]));
    }

    // https://json-schema.org/draft/2019-09/json-schema-validation.html#rfc.section.6.3
    if (schema[keyword`maxLength`] !== undefined && typeof schema[keyword`maxLength`] === 'number') {
      // console.log('maxLength!', schema[s.filename], schema[s.pointer]);
      constraints.push(paragraph([strong(text(i18n`maximum length`)), text(': '), text(i18n`the maximum number of characters for this string is: `), inlineCode(String(schema[keyword`maxLength`]))]));
    }
    if (schema[keyword`minLength`] !== undefined && typeof schema[keyword`minLength`] === 'number') {
      // console.log('minLength!', schema[s.filename], schema[s.pointer]);
      constraints.push(paragraph([strong(text(i18n`minimum length`)), text(': '), text(i18n`the minimum number of characters for this string is: `), inlineCode(String(schema[keyword`minLength`]))]));
    }
    if (schema[keyword`pattern`]) {
      // console.log('pattern!', schema[s.filename], schema[s.pointer]);
      constraints.push(paragraph([strong(text(i18n`pattern`)), text(': '), text(i18n`the string must match the following regular expression: `)]));
      constraints.push(code('regexp', schema[keyword`pattern`]));
      constraints.push(paragraph([link(`https://regexr.com/?expression=${encodeURIComponent(schema[keyword`pattern`])}`, i18n`try regular expression with regexr.com`, text(i18n`try pattern`))]));
    }
    // https://json-schema.org/draft/2019-09/json-schema-validation.html#rfc.section.7.3
    if (schema.format && typeof schema.format === 'string' && formats[schema.format]) {
      constraints.push(paragraph([
        strong(text(formats[keyword([schema.format])].label)),
        text(': '),
        text(formats[schema.format].text),
        link(formats[schema.format].speclink, i18n`check the specification`, text(formats[schema.format].specname)),
      ]));
    } else if (schema.format && typeof schema.format === 'string') {
      constraints.push(paragraph([strong(text(i18n`unknown format`)), text(': '), text(i18n`the value of this string must follow the format: `), inlineCode(String(schema.format))]));
    }

    if (schema[keyword`contentEncoding`]) {
      constraints.push(paragraph([strong(text(i18n`encoding`)), text(': '), text(i18n`the string content must be using the ${schema[keyword`contentEncoding`]} content encoding.`)]));
    }
    if (schema[keyword`contentMediaType`]) {
      constraints.push(paragraph([strong(text(i18n`media type`)), text(': '), text(i18n`the media type of the contents of this string is: `), inlineCode(String(schema[keyword`contentMediaType`]))]));
    }
    if (schema[keyword`contentSchema`]) {
      constraints.push(paragraph([
        strong(text(i18n`schema`)), text(': '),
        text(i18n`the contents of this string should follow this schema: `),
        link(`${schema[keyword`contentSchema`][s.slug]}.md`, i18n`check type definition`, text(gentitle(schema[keyword`contentSchema`][s.titles], schema[keyword`contentSchema`][keyword`type`])))]));
    }

    // https://json-schema.org/draft/2019-09/json-schema-validation.html#rfc.section.6.4
    if (schema[keyword`maxItems`] !== undefined) {
      // console.log('maxItems!', schema[s.filename], schema[s.pointer]);
      constraints.push(paragraph([strong(text(i18n`maximum number of items`)), text(': '), text(i18n`the maximum number of items for this array is: `), inlineCode(String(schema[keyword`maxItems`]))]));
    }
    if (schema[keyword`minItems`] !== undefined) {
      // console.log('minItems!', schema[s.filename], schema[s.pointer]);
      constraints.push(paragraph([strong(text(i18n`minimum number of items`)), text(': '), text(i18n`the minimum number of items for this array is: `), inlineCode(String(schema[keyword`minItems`]))]));
    }
    if (schema[keyword`uniqueItems`]) {
      // console.log('uniqueItems!', schema[s.filename], schema[s.pointer]);
      constraints.push(paragraph([strong(text(i18n`unique items`)), text(': '), text(i18n`all items in this array must be unique. Duplicates are not allowed.`)]));
    }
    if (schema[keyword`minContains`] !== undefined && schema[keyword`contains`]) {
      // console.log('minContains!', schema[s.filename], schema[s.pointer]);
      constraints.push(paragraph([strong(text(i18n`minimum number of contained items`)), text(': '), text(`${i18n`this array may not contain fewer than ${schema[keyword`minContains`]} items that validate against the schema:`} `),
        link(`${schema[keyword`contains`][s.slug]}.md`, i18n`check type definition`, text(gentitle(schema[keyword`contains`][s.titles], schema[keyword`contains`][keyword`type`])))]));
    }
    if (schema[keyword`maxContains`] !== undefined && schema[keyword`contains`]) {
      // console.log('maxContains!', schema[s.filename], schema[s.pointer]);
      constraints.push(paragraph([strong(text(i18n`maximum number of contained items`)), text(': '), text(`${i18n`this array may not contain more than ${schema[keyword`maxContains`]} items that validate against the schema:`} `),
        link(`${schema[keyword`contains`][s.slug]}.md`, i18n`check type definition`, text(gentitle(schema[keyword`contains`][s.titles], schema[keyword`contains`][keyword`type`])))]));
    }

    // https://json-schema.org/draft/2019-09/json-schema-validation.html#rfc.section.6.5
    if (schema[keyword`maxProperties`] !== undefined) {
      // console.log('maxProperties!', schema[s.filename], schema[s.pointer]);
      constraints.push(paragraph([strong(text(i18n`maximum number of properties`)), text(': '), text(i18n`the maximum number of properties for this object is: `), inlineCode(String(schema[keyword`maxProperties`]))]));
    }
    if (schema[keyword`minProperties`] !== undefined) {
      // console.log('minProperties!', schema[s.filename], schema[s.pointer]);
      constraints.push(paragraph([strong(text(i18n`minimum number of properties`)), text(': '), text(i18n`the minimum number of properties for this object is: `), inlineCode(String(schema[keyword`minProperties`]))]));
    }

    if (constraints.length > 0) {
      return [heading(level + 1, text(i18n`${simpletitle(schema)} Constraints`)), ...constraints];
    }
    return [];
  }


  function makeexamples(schema, level = 1) {
    if (schema[keyword`examples`] && schema[keyword`examples`].length > 0 && exampleformat === 'yaml') {
      return [
        heading(level + 1, text(i18n`${simpletitle(schema)} Examples`)),
        ...schema[keyword`examples`].map(example => paragraph(code('yaml', yaml.safeDump(example, undefined, 2)))),
      ];
    }
    if (schema[keyword`examples`] && schema[keyword`examples`].length > 0 && exampleformat === 'json') {
      return [
        heading(level + 1, text(i18n`${simpletitle(schema)} Examples`)),
        ...schema[keyword`examples`].map(example => paragraph(code('json', JSON.stringify(example, undefined, 2)))),
      ];
    }
    return [];
  }

  function makedefault(schema, level = 1) {
    if (schema[keyword`default`]) {
      return [
        heading(level + 1, text(i18n`${simpletitle(schema)} Default Value`)),
        paragraph(text(i18n`The default value is:`)),
        paragraph(code('json', JSON.stringify(schema[keyword`default`], undefined, 2))),
      ];
    }
    return [];
  }

  function makerestrictions(schema, level = 1) {
    if (schema[keyword`readOnly`] && schema[keyword`writeOnly`]) {
      return [
        heading(level + 1, text(i18n`${simpletitle(schema)} Access Restrictions`)),
        paragraph(text(i18n`The value of this property is managed exclusively by the owning authority and never exposed to the outside. It can neither be read nor written.`)),
      ];
    }
    if (schema[keyword`readOnly`]) {
      return [
        heading(level + 1, text(i18n`${simpletitle(schema)} Access Restrictions`)),
        paragraph(text(i18n`The value of this property is managed exclusively by the owning authority, and attempts by an application to modify the value of this property are expected to be ignored or rejected by that owning authority`)),
      ];
    }
    if (schema[keyword`writeOnly`]) {
      return [
        heading(level + 1, text(i18n`${simpletitle(schema)} Access Restrictions`)),
        paragraph(text(i18n`The value of this property is never present when the instance is retrieved from the owning authority. It can be present when sent to the owning authority to update or create the document (or the resource it represents), but it will not be included in any updated or newly created version of the instance.`)),
      ];
    }
    return [];
  }


  function makeproplist(properties = {},
    patternProperties = {},
    additionalProperties,
    required,
    level = 2) {
    return [
      ...flist(flat(Object.entries(properties || {}).map(([name, definition]) => {
        const description = definition[s.meta] && definition[s.meta].longdescription ? definition[s.meta].longdescription : paragraph(text(i18n`no description`));

        return [
          heading(level + 1, text(name)),
          description,
          ...makecomment(definition),
          paragraph(inlineCode(name)),
          makefactlist(name, definition, required),
          ...maketypesection(definition, level + 1),
          ...makeconstraintssection(definition, level + 1),
          ...makedefault(definition, level + 1),
          ...makeexamples(definition, level + 1),
          ...makerestrictions(definition, level + 1),
        ];
      }))),
      ...flist(flat(Object.entries(patternProperties || {}).map(([name, definition]) => {
        const description = definition[s.meta].longdescription || paragraph(text(i18n`no description`));

        return [
          heading(level + 1, [text(i18n`Pattern: `), inlineCode(name)]),
          description,
          ...makecomment(definition),
          paragraph(inlineCode(name)),
          makefactlist(name, definition, required),
          ...maketypesection(definition, level + 1),
          ...makeconstraintssection(definition, level + 1),
          ...makedefault(definition, level + 1),
          ...makeexamples(definition, level + 1),
          ...makerestrictions(definition, level + 1),
        ];
      }))),
      ...((definition) => {
        if (typeof additionalProperties === 'object') {
          const description = definition[s.meta].longdescription || paragraph(text(i18n`no description`));
          return [
            heading(level + 1, text(i18n`Additional Properties`)),
            paragraph(text(i18n`Additional properties are allowed, as long as they follow this schema:`)),
            description,
            ...makecomment(definition),
            makefactlist(i18n`Additional properties`, definition, required),
            ...maketypesection(definition, level + 1),
            ...makeconstraintssection(definition, level + 1),
            ...makedefault(definition, level + 1),
            ...makeexamples(definition, level + 1),
            ...makerestrictions(definition, level + 1),
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
    if (schema.definitions || schema[keyword`$defs`]) {
      const defgroups = [
        ...Object.entries(schema[keyword`$defs`] || {}),
        ...Object.entries(schema.definitions || {})]
        .map(([groupname, subschema]) => {
          const grouptable = makeproptable(
            subschema[keyword`properties`],
            subschema[keyword`patternProperties`],
            subschema[keyword`additionalProperties`],
            subschema[keyword`required`],
            slugger,
          );
          return [
            heading(2, text(i18n`Definitions group ${groupname}`)),
            paragraph(text(i18n`Reference this group by using`)),
            code('json', JSON.stringify({ $ref: `${subschema[s.id]}#${subschema[s.pointer]}` })),
            grouptable,
            ...makeproplist(
              subschema[keyword`properties`],
              subschema[keyword`patternProperties`],
              subschema[keyword`additionalProperties`],
              subschema[keyword`required`],
              2,
            ),
          ];
        });

      return [
        heading(1, text(i18n`${gentitle(schema[s.titles], schema[keyword`type`])} Definitions`)),
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
    if (schema[keyword`properties`] || schema[keyword`patternProperties`] || schema[keyword`additionalProperties`]) {
      return [
        heading(1, text(i18n`${schema.title} Properties`)),
        makeproptable(
          schema[keyword`properties`],
          schema[keyword`patternProperties`],
          schema[keyword`additionalProperties`],
          schema[keyword`required`],
          slugger,
        ),
        ...makeproplist(
          schema[keyword`properties`],
          schema[keyword`patternProperties`],
          schema[keyword`additionalProperties`],
          schema[keyword`required`],
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
      ...makedefault(schema, 1),
      ...makeexamples(schema, 1),
      ...makeproperties(schema, slugger),
      ...makedefinitions(schema, slugger),
    ]);
    return pv;
  });
}

module.exports = build;
