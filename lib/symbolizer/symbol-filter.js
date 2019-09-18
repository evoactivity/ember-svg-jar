'use strict';

/*
  To clear the persistent cache on any particular build, set the
  CLEAR_BROCCOLI_PERSISTENT_FILTER_CACHE environment variable to true like so:
  CLEAR_BROCCOLI_PERSISTENT_FILTER_CACHE=true ember serve
*/

const path = require('path-posix');
const crypto = require('crypto');
const _ = require('lodash');
const PersistentFilter = require('broccoli-persistent-filter');
const stringify = require('json-stable-stringify');
const cheerio = require('cheerio');
const consoleUI = require('../console-ui');
const formatAttrs = require('./format-attrs');

function stringifyFunction(fn) {
  return _.isFunction(fn) ? String(fn) : fn;
}

function createOptionsHash(options) {
  let optionsString = stringify(_.mapValues(options, stringifyFunction));

  return crypto
    .createHash('md5')
    .update(optionsString, 'utf8')
    .digest('hex');
}

class SymbolFilter extends PersistentFilter {
  constructor(inputNode, options = {}) {
    super(inputNode, {
      name: 'SymbolFilter',
      extensions: ['svg'],
      targetExtension: 'svg',
      persist: _.isUndefined(options.persist) ? true : options.persist,
      async: options.async,
      annotation: options.annotation,
    });

    this.optionsHash = createOptionsHash(options);
    this.options = options;
  }

  processString(svgContent, filePath) {
    let { makeAssetID } = this.options;
    let $svg = cheerio.load(svgContent, { xmlMode: true })('svg');
    let [svgAttrs, svgHTML] = [$svg.attr(), $svg.html()];

    if (!svgHTML || !svgAttrs) {
      consoleUI.warn(`invalid SVG found ${filePath}`);
      return '';
    }

    let symbolAttrs = {
      id: makeAssetID(filePath),
      viewBox: svgAttrs.viewBox,
    };
    let symbolContent = `<symbol ${formatAttrs(symbolAttrs)}></symbol>`;
    let $symbolWrapper = cheerio.load(symbolContent, { xmlMode: true });
    let $symbol = $symbolWrapper('symbol');

    $symbol.html(svgHTML);
    return $symbolWrapper.html();
  }

  cacheKeyProcessString(string, relativePath) {
    return super.cacheKeyProcessString(
      `${string}${this.optionsHash}`,
      relativePath
    );
  }

  /* eslint-disable class-methods-use-this */
  baseDir() {
    return path.join(__dirname, '../..');
  }
}

module.exports = SymbolFilter;
