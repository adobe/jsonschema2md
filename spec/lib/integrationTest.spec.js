const { spawn } = require('child_process');



describe('Process examples', () => {
  it('Run jsonschema2md on example schemas', done => {
    const ls = spawn('node', [
      'cli.js',
      '-d',
      'examples/schemas',
      '-o',
      'examples/docs',
      '-x',
      'examples/generated-schemas',
      '-m',
      'template=reference',
      '-m',
      'foo=bar'
    ]);

    ls.on('close', code => {
      expect(code).toEqual(0);
      done();
    });
  });
});
