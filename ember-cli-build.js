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

  if ('@embroider/webpack' in app.dependencies()) {
    const { Webpack } = require('@embroider/webpack'); // eslint-disable-line node/no-extraneous-require
    return require('@embroider/compat') // eslint-disable-line node/no-extraneous-require global-require
      .compatBuild(app, Webpack, {
        packagerOptions: {
          webpackConfig: {
            devtool: false,
          },
        },
      });
  }
  return app.toTree();
};
