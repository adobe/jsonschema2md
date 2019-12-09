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
  each, values, map, list: flist, iter, flat, filter, size, foldl,
} = require('ferrum');
const {
  root, paragraph, text, heading, code, table, tableRow, tableCell, link, inlineCode, list, listItem
} = require('mdast-builder');
const i18n = require('es2015-i18n-tag').default;
const s = require('./symbols');
const { gentitle } = require('./formattingTools');
const { basename } = require('path');
const ghslugger = require('github-slugger');

function build({ header, links = {} }) {
  const headerprops = [
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
    const realtypes = flist(filter(types, type => type !== 'null' && type !== undefined));
    if (size(realtypes) === 0) {
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
    const nulltypes = flist(filter(types, type => type === 'null'));
    if (size(nulltypes)) {
      return text(i18n`can be null`);
    }
    return text(i18n`cannot be null`);
  }

  /**
   * Generates the overview table row for a single property definition
   * @param {*} param0
   */
  function makepropheader(required = [], slugger = ghslugger()) {
    return ([name, definition]) => tableRow([
      tableCell(link(`#${name}`, '', text(name))), // Property
      tableCell(type(definition)),
      tableCell(text(required.indexOf(name) > -1 ? i18n`Required` : i18n`Optional`)),
      tableCell(nullable(definition)),
      tableCell(link(`${definition[s.slug]}.md`, definition[s.id] + '#' + definition[s.pointer], text(definition[s.titles][0] || i18n`Untitled schema`))),
    ]);
  }

  /**
   * Generates the table of contents for a properties
   * object.
   * @param {*} props
   */
  function makeproptable(props, required, slugger) {
      const proprows = Object.entries(props).map(makepropheader(required, slugger));

    //const proprows = flist(map(iter(props || {}), makepropheader(required)));
  
    return table('left', [
      tableRow([
        tableCell(text(i18n`Property`)),
        tableCell(text(i18n`Type`)),
        tableCell(text(i18n`Required`)),
        tableCell(text(i18n`Nullable`)),
        tableCell(text(i18n`Defined by`)),
      ]),
      ...proprows,
    ]);
  }

  function maketypefact(definition) {
    return listItem([text(i18n`Type:`)]);
  }

  function makefactlist(name, definition, required = []) {
    const children = [];

    
    if (required.indexOf(name)>-1) {
      children.push(listItem(text(i18n`is required`)))
    } else {
      children.push(listItem(text(i18n`is optional`)))
    }

    children.push(maketypefact(definition));

    return list('unordered', children);
  }

  function makeproplist(properties, required, level = 2) {
    if (!properties) {
      return [];
    }
    return flist(flat(Object.entries(properties).map(([name, definition]) => {
      const description = definition[s.meta].longdescription || paragraph(text(i18n`no description`));

      return [
        heading(level + 1, text(name)),
        description,
        paragraph(inlineCode(name)),
        makefactlist(name, definition, required)
      ];
    })));
  }

  /**
   * Generates the definitions section for a schema
   * @param {*} schema
   */
  function makedefinitions(schema, slugger) {
    if (schema.definitions) {

      const defgroups = Object.entries(schema.definitions).map(([groupname, subschema]) => {
        const grouptable = makeproptable(subschema.properties, subschema.required, slugger);
        return [
          heading(2, text(i18n`Definitions group ${groupname}`)),
          paragraph(text(i18n`Reference this group by using`)),
          code('json', JSON.stringify({'$ref': `${subschema[s.id]}#${subschema[s.pointer]}`})),
          grouptable,
          ...makeproplist(subschema.properties, subschema.required, 2)
        ]
      });

      return [
        heading(1, text(i18n`${gentitle(schema[s.titles], schema.type)} Definitions`)),
        ...flist(flat(defgroups))
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
        makeproptable(schema.properties, schema.required, slugger),
      ];
    }
    return [];
  }

  console.log('generating markdown');
  return (schemas) => {
    return foldl(schemas, {}, (pv, schema) => {

      const slugger = ghslugger();
    // eslint-disable-next-line no-param-reassign
      pv[schema[s.slug]] = root([
      // todo add more elements
        ...makeheader(schema),
        ...makedefinitions(schema, slugger),
        ...makeproperties(schema, slugger),
      ]);
      return pv;
    });
  };
}

module.exports = build;
