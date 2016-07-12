'use strict';

var CachingWriter = require('broccoli-caching-writer');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var mkdirp = require('mkdirp');
var utils = require('./utils');
var ensurePosix = utils.ensurePosix;
var assetKeyFor = utils.assetKeyFor;

/**
  SVG assets packer for `inline` strategy.
  It concatenates inputNode files into a single JSON file like:

  {
    'asset-1 key': 'asset-1 content',
    'asset-2 key': 'asset-2 content'
  }

  The file can optionally include ES6 module export.
*/
function AssetsPacker(inputNode, options) {
  if (!(this instanceof AssetsPacker)) {
    return new AssetsPacker(inputNode, options);
  }

  if (!options || !options.outputFile) {
    throw new Error('the outputFile option is required');
  }

  CachingWriter.call(this, [inputNode], {
    name: 'AssetsPacker',
    annotation: options.annotation,
  });

  this.options = _.defaults(options, {
    moduleExport: false,
    trimPath: false
  });
}

AssetsPacker.prototype = Object.create(CachingWriter.prototype);
AssetsPacker.prototype.constructor = AssetsPacker;

AssetsPacker.prototype.build = function() {
  this.saveObjectAsJson(this.buildAssetsStore());
};

AssetsPacker.prototype.getFilePaths = function() {
  var posixFilePaths = this.listFiles().map(ensurePosix);

  return _.uniq(posixFilePaths).filter(function(filePath) {
    // files returned from this.listFiles are directories if they end in /
    var isDirectory = filePath.charAt(filePath.length - 1) === '/';
    return !isDirectory;
  });
};

AssetsPacker.prototype.buildAssetsStore = function() {
  var inputPath = this.inputPaths[0];
  var posixInputPath = ensurePosix(inputPath);
  var assetsStore = {};
  var trimPath = this.options.trimPath;

  this.getFilePaths().forEach(function(posixFilePath) {
    var relativePath = posixFilePath.replace(posixInputPath + '/', '');
    var assetKey = assetKeyFor(relativePath, {
      strategy: 'inline',
      trimPath: trimPath
    });
    var filePath = path.join(inputPath, relativePath);

    assetsStore[assetKey] = fs.readFileSync(filePath, 'UTF-8');
  });

  return assetsStore;
};

AssetsPacker.prototype.saveObjectAsJson = function(outputObj) {
  var output = JSON.stringify(outputObj, null, 2);
  var outputFilePath = path.join(this.outputPath, this.options.outputFile);

  if (this.options.moduleExport) {
    output = 'export default ' + output;
  }

  mkdirp.sync(path.dirname(outputFilePath));
  fs.writeFileSync(outputFilePath, output);
};

module.exports = AssetsPacker;
