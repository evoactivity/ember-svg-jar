/* eslint-env node */
'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  let app = new EmberAddon(defaults, {
    svgJar: {
      strategy: ['symbol', 'inline'],
      sourceDirs: ['tests/dummy/public'],
      stripPath: false
    }
  });

  return app.toTree();
};
