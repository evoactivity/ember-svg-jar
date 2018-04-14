'use strict';

const path = require('path');
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
  const customOpts = app.options.svgJar || {};
  const isDevelopment = app.env === 'development';
  const isUsedByAddon = !!app.parent;

  const defaultSourceDir = isUsedByAddon
    ? getAddonPublicDir(app)
    : getAppPublicDir(app);

  const defaultOpts = {
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

  const options = _.merge(defaultOpts, customOpts);
  options.strategy = _.castArray(options.strategy);

  if (customOpts.symbol && customOpts.symbol.containerAttrs) {
    options.symbol.containerAttrs = customOpts.symbol.containerAttrs;
  }

  return options;
}

module.exports = buildOptions;
