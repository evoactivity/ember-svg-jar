'use strict';

var Filter = require('broccoli-persistent-filter');
var stringify = require('json-stable-stringify');
var RSVP = require('rsvp');
var SVGO = require('svgo');

function SVGOFilter(inputNode, _options) {
  var options = _options || {};

  if (!options.hasOwnProperty('persist')) {
    options.persist = true;
  }

  Filter.call(this, inputNode, options);

  this.options = options;
  this.svgo = new SVGO(options.svgoConfig);
}

SVGOFilter.prototype = Object.create(Filter.prototype);
SVGOFilter.prototype.constructor = SVGOFilter;
SVGOFilter.prototype.extensions = ['svg'];
SVGOFilter.prototype.targetExtension = 'svg';

SVGOFilter.prototype.baseDir = function() {
  return __dirname;
};

SVGOFilter.prototype.processString = function(svgContent) {
  var svgo = this.svgo;

  if (!svgContent) {
    return '';
  }

  return new RSVP.Promise(function(resolve, reject) {
    svgo.optimize(svgContent, function(result) {
      if (result.error) {
        reject(result.error);
      } else {
        resolve(result.data);
      }
    });
  });
};

SVGOFilter.prototype.optionsHash = function() {
  if (!this._optionsHash) {
    this._optionsHash = stringify(this.options);
  }

  return this._optionsHash;
};

SVGOFilter.prototype.cacheKeyProcessString = function(string, relativePath) {
  return Filter.prototype.cacheKeyProcessString.call(
    this, string + this.optionsHash(), relativePath);
};

module.exports = SVGOFilter;
