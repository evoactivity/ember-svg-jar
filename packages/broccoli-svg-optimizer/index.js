'use strict';

const PersistentFilter = require('broccoli-persistent-filter');
const stringify = require('safe-stable-stringify');
const defaultSvgo = require('svgo');
const { toModernConfig } = require('./svgo-config');

function promisify(optimize) {
  return svg => {
    return new Promise((resolve, reject) => {
      optimize(svg, result => {
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

// svgo 1 exported a class. svgo 2 and later export an `optimize` function
// that takes the config on each call.
function createOptimizer(svgoModule, svgoConfig) {
  if (typeof svgoModule === 'function') {
    let svgo = new svgoModule(svgoConfig);
    return promisifyIfNeeded(svgo.optimize.bind(svgo));
  }

  let config = toModernConfig(svgoConfig);

  return (svg, { path }) => {
    try {
      let result = svgoModule.optimize(
        svg,
        Object.assign({}, config, { path })
      );
      // svgo 2 returns errors instead of throwing them.
      return result.error
        ? Promise.reject(result.modernError || result.error)
        : Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  };
}

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

    this.optimize = createOptimizer(
      options.svgoModule || defaultSvgo,
      options.svgoConfig
    );
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
