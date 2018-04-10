const { header, headers } = require('../../lib/header');

describe('Header Integration Test', () => {
  it('Renders a header without link if link is unknown', () => {
    const h = header('Foo');
    expect(h.renderHeader()).toEqual('Foo');
  });

  it('Renders a header with link if link is known', () => {
    const h = header('Foo', '../bar.md');
    expect(h.renderHeader()).toEqual('[Foo](../bar.md)');
  });

  it('Renders a header body without link if link is unknown', () => {
    const h = header('Foo', null, 'Bar');
    expect(h.renderValue()).toEqual('Bar');
  });

  it('Renders a header body with link if link is known', () => {
    const h = header('Foo', '../bar.md', 'Bar', '#bar-md');
    expect(h.renderValue()).toEqual('[Bar](#bar-md)');
  });
});
