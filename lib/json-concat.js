'use strict';

var CachingWriter = require('broccoli-caching-writer');
var path = require('path');
var fs = require('fs');
var uniq = require('lodash.uniq');
var mkdirp = require('mkdirp');
var defaults = require('lodash.defaults');

function ensurePosix(filePath) {
  if (path.sep !== '/') {
    return filePath.split(path.sep).join('/');
  }
  return filePath;
}

/**
  Concatenate inputNode files into a single JSON file as an object,
  where properties represent file paths and values represent file contents.

  The file can optionally include ES6 module export.
*/
function JsonConcat(inputNode, options) {
  if (!(this instanceof JsonConcat)) {
    return new JsonConcat(inputNode, options);
  }

  if (!options || !options.outputFile) {
    throw new Error('the outputFile option is required');
  }

  CachingWriter.call(this, [inputNode], {
    name: 'JsonConcat',
    annotation: options.annotation,
  });

  this.options = defaults(options, {
    moduleExport: false,
    trimExtensions: false
  });
}

JsonConcat.prototype = Object.create(CachingWriter.prototype);
JsonConcat.prototype.constructor = JsonConcat;

JsonConcat.prototype.build = function() {
  this.saveObjectAsJson(this.getFilesObject());
};

JsonConcat.prototype.getFilePaths = function() {
  var posixFilePaths = this.listFiles().map(ensurePosix);

  return uniq(posixFilePaths).filter(function(filePath) {
    // files returned from this.listFiles are directories if they end in /
    var isDirectory = filePath.charAt(filePath.length - 1) === '/';
    return !isDirectory;
  });
};

JsonConcat.prototype.getFilesObject = function() {
  var inputPath = this.inputPaths[0];
  var posixInputPath = ensurePosix(inputPath);
  var trimExtensions = this.options.trimExtensions;
  var filesObject = {};

  this.getFilePaths().forEach(function(posixFilePath) {
    var relativePath = posixFilePath.replace(posixInputPath + '/', '');
    var propName = trimExtensions ? relativePath.split('.')[0] : relativePath;
    var filePath = path.join(inputPath, relativePath);

    filesObject[propName] = fs.readFileSync(filePath, 'UTF-8');
  });

  return filesObject;
};

JsonConcat.prototype.saveObjectAsJson = function(outputObj) {
  var output = JSON.stringify(outputObj, null, 2);
  var outputFilePath = path.join(this.outputPath, this.options.outputFile);

  if (this.options.moduleExport) {
    output = 'export default ' + output;
  }

  mkdirp.sync(path.dirname(outputFilePath));
  fs.writeFileSync(outputFilePath, output);
};

module.exports = JsonConcat;
