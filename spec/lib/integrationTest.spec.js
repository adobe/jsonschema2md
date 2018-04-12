const { spawn } = require('child_process');
const { readFile, readdirSync } = require('fs');

beforeEach(function() {
  jasmine.addMatchers(require('jasmine-diff')(jasmine, {
    colors: true,
    inline: true
  }));
});

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
      'foo=bar',
      '--link-abstract',
      '../abstract.md'
    ]);

    ls.on('close', code => {
      expect(code).toEqual(0);
      done();
    });
  });
});

describe('Compare results', () => {
  const files = readdirSync('./spec/examples');

  files.forEach(file => {
    it('Comparing ' + file, done => {
      console.log('file ' + file);
      readFile('./spec/examples/' + file, (err, expectedbuf) => {
        expect(err).toBeNull();
        readFile('./examples/docs/' + file, (err, actualbuf) => {
          expect(err).toBeNull();
          expect(actualbuf.toString()).toEqual(expectedbuf.toString());
          done();
        });
      });
    });
  });
});
