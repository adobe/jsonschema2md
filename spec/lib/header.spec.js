const { Header, headers } = require('../../lib/header');

describe('Header Integration Test', () => {
  it('Renders a header without link if link is unknown', () => {
    const h = new Header('Foo');
    expect(h.renderHeader()).toEqual('Foo');
  });

  it('Renders a header with link if link is known', () => {
    const h = new Header('Foo', '../bar.md');
    expect(h.renderHeader()).toEqual('[Foo](../bar.md)');
  });

  it('Renders a header body without link if link is unknown', () => {
    const h = new Header('Foo', null, 'Bar');
    expect(h.renderValue()).toEqual('Bar');
  });

  it('Renders a header body with link if link is known', () => {
    const h = new Header('Foo', '../bar.md', 'Bar', '#bar-md');
    expect(h.renderValue()).toEqual('[Bar](#bar-md)');
  });
});

describe('Headers Integration Test', () => {
  it('Abstract', () => {
    const schema = {
      additionalProperties: true
    };
    const props = {
      abstract: 'Can be instantiated',
      extensible: 'No',
      status: 'Experimental',
      custom: 'Forbidden',
      original: 'complex.schema.json'
    };

    const h = headers(schema, props);

    const result = `| Abstract | Extensible | Status | Custom Properties | Additional Properties | Defined In |
|----------|------------|--------|-------------------|-----------------------|------------|
| Can be instantiated | No | Experimental | Forbidden | Permitted | [complex.schema.json](complex.schema.json) |`;
    expect(h.render()).toEqual(result);
  });

});
