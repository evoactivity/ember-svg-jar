'use strict';

const PersistentFilter = require('broccoli-persistent-filter');
const _ = require('lodash');
const stringify = require('json-stable-stringify');
const RSVP = require('rsvp');
const SVGO = require('svgo');

class SVGOFilter extends PersistentFilter {
  constructor(inputNode, options) {
    options = options || {};

    super(inputNode, {
      name: 'SVGOFilter',
      extensions: ['svg'],
      targetExtension: 'svg',
      persist: _.isUndefined(options.persist) ? true : options.persist,
      async: _.isUndefined(options.async) ? true : options.async,
      annotation: options.annotation
    });

    this.svgo = new SVGO(options.svgoConfig);
    this.optionsHashString = stringify(options);
  }

  processString(svgContent) {
    if (!svgContent) {
      return '';
    }

    return new RSVP.Promise((resolve, reject) => {
      this.svgo.optimize(svgContent, (result) => {
        if (result.error) {
          reject(result.error);
        } else {
          resolve(result.data);
        }
      });
    });
  }

  cacheKeyProcessString(string, relativePath) {
    return super.cacheKeyProcessString(string + this.optionsHashString, relativePath);
  }

  baseDir() {
    return __dirname;
  }
}

module.exports = SVGOFilter;
