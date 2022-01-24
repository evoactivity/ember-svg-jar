'use strict';

const PersistentFilter = require('broccoli-persistent-filter');
const _ = require('lodash');
const stringify = require('json-stable-stringify');
const { Promise } = require('rsvp');
const DefaultSVGO = require('svgo');

function promisify(optimize) {
  return (svg) => {
    return new Promise((resolve, reject) => {
      optimize(svg, (result) => {
        if (result.error) {
          reject(result.error);
        } else {
          resolve(result);
        }
      });
    });
  };
}

function promisifyIfNeeded(optimize) {
  let isPromise = false;

  try {
    isPromise = 'then' in optimize('');
  } catch (e) {
    // pass
  }

  return isPromise ? optimize : promisify(optimize);
}

class SVGOFilter extends PersistentFilter {
  constructor(inputNode, options) {
    options = options || {};

    super(inputNode, {
      name: 'SVGOFilter',
      extensions: ['svg'],
      targetExtension: 'svg',
      persist: _.isUndefined(options.persist) ? true : options.persist,
      async: options.async,
      annotation: options.annotation
    });

    let SVGO = options.svgoModule || DefaultSVGO;
    let svgo = new SVGO(options.svgoConfig);
    let optimize = svgo.optimize.bind(svgo);
    this.optimize = promisifyIfNeeded(optimize);
    this.optionsHash = stringify(options);
  }

  processString(svg, relativePath) {
    return svg
      ? this.optimize(svg, { path: relativePath }).then(({ data }) => data)
      : Promise.resolve('');
  }

  cacheKeyProcessString(string, relativePath) {
    return super.cacheKeyProcessString(string + this.optionsHash, relativePath);
  }

  baseDir() {
    return __dirname;
  }
}

module.exports = SVGOFilter;
