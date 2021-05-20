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

  // eslint-disable-next-line global-require
  const { maybeEmbroider } = require('@embroider/test-setup');
  return maybeEmbroider(app);
};
