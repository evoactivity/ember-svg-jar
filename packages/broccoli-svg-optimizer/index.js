'use strict';

const PersistentFilter = require('broccoli-persistent-filter');
const stringify = require('safe-stable-stringify');
const { optimize: svgoOptimize } = require('svgo');

class SVGOFilter extends PersistentFilter {
  constructor(inputNode, options) {
    options = options || {};

    super(inputNode, {
      name: 'SVGOFilter',
      extensions: ['svg'],
      targetExtension: 'svg',
      persist: typeof options.persist === 'undefined' ? true : options.persist,
      async: options.async,
      annotation: options.annotation,
    });

    this.svgoConfig = options.svgoConfig || {};
    this.svgoOptimize = options.svgoOptimize || svgoOptimize;
    this.optionsHash = stringify(options);
  }

  processString(svg, relativePath) {
    if (svg) {
      const { data } = this.svgoOptimize(svg, {
        ...this.svgoConfig,
        path: relativePath,
      });

      return data;
    }

    return '';
  }

  cacheKeyProcessString(string, relativePath) {
    return super.cacheKeyProcessString(string + this.optionsHash, relativePath);
  }

  baseDir() {
    return __dirname;
  }
}

module.exports = SVGOFilter;
