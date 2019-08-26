'use strict';

const _ = require('lodash');
const Concat = require('broccoli-concat');
const SymbolFilter = require('./symbol-filter');
const formatAttrs = require('./format-attrs');

module.exports = function BroccoliSymbolizer(inputNode, options = {}) {
  if (!options.outputFile) {
    throw new Error('outputFile is required');
  }

  let config = _.defaults(options, {
    persist: true,
    svgAttrs: {
      style: 'position: absolute; width: 0; height: 0;',
      width: '0',
      height: '0',
      version: '1.1',
      xmlns: 'http://www.w3.org/2000/svg',
      'xmlns:xlink': 'http://www.w3.org/1999/xlink'
    }
  });

  let symbolsNode = new SymbolFilter(inputNode, {
    makeAssetID: config.makeAssetID,
    persist: config.persist
  });

  return new Concat(symbolsNode, {
    outputFile: config.outputFile,
    header: `<svg ${formatAttrs(config.svgAttrs)}>`,
    footer: '</svg>',
    allowNone: true,
    sourceMapConfig: { enabled: false }
  });
};
