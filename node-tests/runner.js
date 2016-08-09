'use strict';

var glob = require('glob');
var Mocha = require('mocha');

function addFiles(mocha, files) {
  glob.sync('node-tests/' + files)
    .forEach(mocha.addFile.bind(mocha));
}

function runMocha(mocha) {
  // eslint-disable-next-line no-console
  console.time('Node Tests Running Time');

  mocha.run(function(failures) {
    process.on('exit', function() {
      // eslint-disable-next-line no-console
      console.timeEnd('Node Tests Running Time');
      process.exit(failures);
    });
  });
}

var mocha = new Mocha({
  reporter: 'spec'
});

addFiles(mocha, '/**/*-test.js');
runMocha(mocha);
