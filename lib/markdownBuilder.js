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
  each, values, map, list: flist,
} = require('ferrum');
const {
  root, paragraph, text, heading, code, table, tableRow, tableCell, link,
} = require('mdast-builder');

function build({ header, links = {} }) {
  const headerprops = [
    {
      name: 'abstract',
      title: 'Abstract',
      truelabel: 'Cannot be instantiated',
      falselabel: 'Can be instantiated',
      undefinedlabel: 'Unknown abstraction'
    },
    {
      name: 'extensible',
      title: 'Extensible',
      undefinedlable: 'Unknown extensibility',
      truelabel: 'Yes',
      falselabel: 'No',
    },
    {
      name: 'status',
      title: 'Status',
      undefinedlabel: 'Unknown status',
      truelabel: 'Yes',
      falselabel: 'No',
    },
    {
      name: 'identifiable',
      title: 'Identifiable',
      truelabel: 'Yes',
      falselabel: 'No',
      undefinedlabel: 'Unknown identifiability'
    },
    {
      name: 'custom',
      title: 'Custom Properties',
      truelabel: 'Allowed',
      falselabel: 'Forbidden',
      undefinedlabel: 'Unknown custom properties'
    },
    {
      name: 'additional',
      title: 'Additional Properties',
      truelabel: 'Allowed',
      falselabel: 'Forbidden',
      undefinedlabel: 'Unknown additional properties'
    },
    {
      name: 'defined',
      title: 'Defined In',
      undefinedlabel: 'Unknown definition'
    },
  ];


  function makeheader(schema) {
    if (header) {
      return [
        heading(1, text(`${schema.title} Schema`)),
        paragraph(code('txt', schema.id + (schema.pointer ? `#${schema.pointer}` : ''))),
        schema.longdescription,
        table('left', [
          // iterate over header
          tableRow(
            flist(
              map(headerprops,
                ({ name, title }) => {
                  if (links[name]) {
                    return tableCell(link(links[name], `What does ${title} mean?`, text(title)));
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
                  
                  if (schema.meta && schema.meta[prop.name] && schema.meta[prop.name].link) {
                    return tableCell(link(schema.meta[prop.name].link, '', text(schema.meta[prop.name].text)));
                  }
                  const value = schema.meta ? schema.meta[prop.name] : undefined;
                  return tableCell(text(prop[String(value) + 'label'] || 'Unknown'));
                }), Array,
            ),
          ),
        ]),
      ];
    }
    return [];
  }

  return (schemas) => {
  // eslint-disable-next-line no-return-assign, no-param-reassign
    each(values(schemas), schema => schema.markdown = root([
    // todo add more elements
      ...makeheader(schema),
    ]));
    return schemas;
  };
}

module.exports = build;
