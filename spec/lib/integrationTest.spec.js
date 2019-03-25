const { spawn } = require('child_process');
const path = require('path');
const { readFileSync, readdirSync, statSync } = require('fs');

beforeEach(function() {
  jasmine.addMatchers(
    require('jasmine-diff')(jasmine, {
      colors: true,
      inline: true
    })
  );
});

describe('Compare results', () => {

  it('Run jsonschema2md for custom file extension', done => {
    const ls = spawn('node', [
      'cli.js',
      '-d',
      'examples/schemas',
      '-o',
      'examples/tmp-docs',
      '-x',
      'examples/generated-schemas',
      '-e',
      'js'
    ]);

    ls.on('close', code => {
      expect(code).toEqual(0);
      done();
    });
  });


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
      'abstract.md',
      '--link-status',
      'status.md',
      '-v', '06'
    ]);
    ls.on('close', code => {
      expect(code).toEqual(0);
      const files = readdirSync('./spec/examples').filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));
      expect(files.length).toEqual(22);

      files.forEach(file => {
        if (statSync('./spec/examples/' + file).isFile()) {
          const expectedstr = readFileSync(path.resolve('./spec/examples/', file)).toString();
          const actualstr = readFileSync(path.resolve('./examples/docs/', file)).toString();
          expect(actualstr).toEqual(expectedstr, file + ' does not match');
        }
      });

      done();
    });
  });
});
