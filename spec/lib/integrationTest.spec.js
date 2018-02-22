const { spawn } = require('child_process');
const { readdir, readFile } = require('fs');



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

describe('Compare results', () => {
  readdir('./spec/examples', (err, files) => {
    expect(err).toBeNull();
    files.forEach(file => {
      console.log('found ' + file);

      it('Comparing ' + file, done => {
        expect.file.toBeNull();
        console.log('file');
        readFile('./spec/examples/' + file, (err, expectedbuf) => {
          expect(err).toBeNull();
          done();
          readFile('./examples/docs/' + file, (err, actualbuf) => {
            expect(err).toBeNull();
            expect(actualbuf.toString()).toEqual(expectedbuf.toString());
            done();
          });
        });
      });
    });
  });
});
