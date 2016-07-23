const CachingWriter = require('broccoli-caching-writer');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const mkdirp = require('mkdirp');
const utils = require('./utils');
const ensurePosix = utils.ensurePosix;
const stripExtension = utils.stripExtension;

/**
  SVG assets packer for `inline` strategy.
  It concatenates inputNode files into a single JSON file like:

  {
    'asset-1 key': 'asset-1 content',
    'asset-2 key': 'asset-2 content'
  }

  The file can optionally include ES6 module export.
*/
function InlinePacker(inputNode, options) {
  if (!(this instanceof InlinePacker)) {
    return new InlinePacker(inputNode, options);
  }

  if (!options || !options.outputFile) {
    throw new Error('the outputFile option is required');
  }

  CachingWriter.call(this, [inputNode], {
    name: 'InlinePacker',
    annotation: options.annotation,
  });

  this.options = _.defaults(options, {
    moduleExport: true
  });
}

InlinePacker.prototype = Object.create(CachingWriter.prototype);
InlinePacker.prototype.constructor = InlinePacker;

InlinePacker.prototype.build = function() {
  this.saveObjectAsJson(this.buildAssetsStore());
};

InlinePacker.prototype.getFilePaths = function() {
  let posixFilePaths = this.listFiles().map(ensurePosix);

  return _.uniq(posixFilePaths).filter(function(filePath) {
    // files returned from this.listFiles are directories if they end in /
    let isDirectory = filePath.charAt(filePath.length - 1) === '/';
    return !isDirectory;
  });
};

InlinePacker.prototype.buildAssetsStore = function() {
  let inputPath = this.inputPaths[0];
  let posixInputPath = ensurePosix(inputPath);
  let assetsStore = {};
  let idGen = this.options.idGen;
  let idGenOpts = { stripPath: this.options.stripPath };

  this.getFilePaths().forEach(function(posixFilePath) {
    let relativePath = posixFilePath.replace(posixInputPath + '/', '');
    let assetId = idGen(stripExtension(relativePath), idGenOpts);
    let filePath = path.join(inputPath, relativePath);

    assetsStore[assetId] = fs.readFileSync(filePath, 'UTF-8');
  });

  return assetsStore;
};

InlinePacker.prototype.saveObjectAsJson = function(outputObj) {
  let output = JSON.stringify(outputObj, null, 2);
  let outputFilePath = path.join(this.outputPath, this.options.outputFile);

  if (this.options.moduleExport) {
    output = 'export default ' + output;
  }

  mkdirp.sync(path.dirname(outputFilePath));
  fs.writeFileSync(outputFilePath, output);
};

module.exports = InlinePacker;
