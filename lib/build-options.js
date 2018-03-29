'use strict';

const _ = require('lodash');

const defaultGenerators = {
  symbolIdGen: (svgPath, opts) => `${opts.prefix}${svgPath}`.replace(/[\s]/g, '-'),
  symbolCopypastaGen: (assetId) => `{{svg-jar "#${assetId}"}}`,
  inlineIdGen: (svgPath) => svgPath,
  inlineCopypastaGen: (assetId) => `{{svg-jar "${assetId}"}}`
};

function buildOptions(customOpts, defaultSourceDir, isUsedByAddon, isDevelopment) {
  customOpts = customOpts || {}; // eslint-disable-line no-param-reassign
  let viewerDefault = isUsedByAddon ? false : isDevelopment;

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
      enabled: viewerDefault,
      embed: viewerDefault
    },

    inline: {
      idGen: defaultGenerators.inlineIdGen,
      copypastaGen: defaultGenerators.inlineCopypastaGen
    },

    symbol: {
      idGen: defaultGenerators.symbolIdGen,
      copypastaGen: defaultGenerators.symbolCopypastaGen,
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
