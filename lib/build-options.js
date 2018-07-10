'use strict';

const path = require('path-posix');
const _ = require('lodash');
const defaultGens = require('./default-gens');

function getAddonPublicDir(app) {
  // When SVGJar is used by an addon, the addon's public directory
  // is used as the default source of SVG images.
  return path.join(app.root, app.treePaths.public);
}

function getAppPublicDir(app) {
  // When SVGJar is used by an app, the apps's public directory
  // is used as the default source of SVG images.
  return app.options.trees.public;
}

function buildOptions(app) {
  let customOpts = app.options.svgJar || {};
  let isDevelopment = app.env === 'development';
  let isUsedByAddon = !!app.parent;

  let defaultSourceDir = isUsedByAddon
    ? getAddonPublicDir(app)
    : getAppPublicDir(app);

  let defaultOpts = {
    rootURL: '/',
    sourceDirs: [defaultSourceDir],
    strategy: 'inline',
    stripPath: true,
    optimizer: {},
    persist: true,

    validations: {
      validateViewBox: true,
      checkForDuplicates: true
    },

    viewer: {
      enabled: isDevelopment && !isUsedByAddon,
      embed: isDevelopment && !isUsedByAddon
    },

    inline: {
      idGen: defaultGens.inlineIdGen,
      copypastaGen: defaultGens.inlineCopypastaGen
    },

    symbol: {
      idGen: defaultGens.symbolIdGen,
      copypastaGen: defaultGens.symbolCopypastaGen,
      outputFile: '/assets/symbols.svg',
      prefix: '',
      includeLoader: true,
      containerAttrs: {
        style: 'position: absolute; width: 0; height: 0;',
        width: '0',
        height: '0',
        version: '1.1',
        xmlns: 'http://www.w3.org/2000/svg',
        'xmlns:xlink': 'http://www.w3.org/1999/xlink'
      }
    }
  };

  let options = _.merge(defaultOpts, customOpts);
  options.strategy = _.castArray(options.strategy);

  if (customOpts.symbol && customOpts.symbol.containerAttrs) {
    options.symbol.containerAttrs = customOpts.symbol.containerAttrs;
  }

  return options;
}

module.exports = buildOptions;
