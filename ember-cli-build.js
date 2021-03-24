'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  let app = new EmberAddon(defaults, {
    svgJar: {
      strategy: ['symbol', 'inline', 'hbs'],
      sourceDirs: ['tests/dummy/public'],
      stripPath: false
    },
    // ember-cli-resolve-asset config
    fingerprint: {
      enabled: true,
      generateAssetMap: true, // Required.
      fingerprintAssetMap: true // Recommended to prevent caching issues.
    },
    'ember-fetch': {
      preferNative: true // Recommended to enable faster preloading for browsers that support it.
    }
  });

  if ('@embroider/webpack' in app.dependencies()) {
    const { Webpack } = require('@embroider/webpack'); // eslint-disable-line
    return require('@embroider/compat') // eslint-disable-line
      .compatBuild(app, Webpack, {
        staticAddonTestSupportTrees: true,
        staticAddonTrees: true,
        staticHelpers: true,
        staticComponents: true,
      });
  }
  return app.toTree();
};
