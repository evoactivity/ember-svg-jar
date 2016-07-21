'use strict';

var CachingWriter = require('broccoli-caching-writer');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var mkdirp = require('mkdirp');
var cheerio = require('cheerio');
var utils = require('./utils');
var ensurePosix = utils.ensurePosix;
var stripExtension = utils.stripExtension;

function svgDataFor(svgString) {
  var $svg = cheerio.load(svgString, { xmlMode: true })('svg');
  var viewBox = $svg.attr('viewBox');
  var viewBoxValues = viewBox.split(/\s+/);

  return {
    content: $svg.html(),
    viewBox: viewBox,
    width: parseFloat($svg.attr('width') || viewBoxValues[2]),
    height: parseFloat($svg.attr('height') || viewBoxValues[3])
  };
}

function ViewerAssetsBuilder(inputNode, options) {
  if (!options || !options.outputFile) {
    throw new Error('the outputFile option is required');
  }

  CachingWriter.call(this, [inputNode], {
    name: 'ViewerAssetsBuilder',
    annotation: options.annotation,
  });

  this.options = options;
}

function stringSizeInKb(string) {
  var bytes = Buffer.byteLength(string, 'utf8');
  return parseFloat((bytes / 1024).toFixed(2));
}

ViewerAssetsBuilder.prototype = Object.create(CachingWriter.prototype);
ViewerAssetsBuilder.prototype.constructor = ViewerAssetsBuilder;

ViewerAssetsBuilder.prototype.build = function() {
  var dataToWite = JSON.stringify(this.getViewerAssets());
  var outputFilePath = path.join(this.outputPath, this.options.outputFile);
  mkdirp.sync(path.dirname(outputFilePath));
  fs.writeFileSync(outputFilePath, dataToWite);
};

ViewerAssetsBuilder.prototype.getFilePaths = function() {
  var posixFilePaths = this.listFiles().map(ensurePosix);

  return _.uniq(posixFilePaths).filter(function(filePath) {
    // files returned from this.listFiles are directories if they end in /
    var isDirectory = filePath.charAt(filePath.length - 1) === '/';
    return !isDirectory;
  });
};

ViewerAssetsBuilder.prototype.getViewerAssets = function() {
  var inputPath = this.inputPaths[0];
  var posixInputPath = ensurePosix(inputPath);
  var strategy = this.options.strategy;
  var idGen = this.options.idGen;
  var idGenOpts = this.options.idGenOpts;
  var copypastaGen = this.options.copypastaGen;

  return this.getFilePaths().map(function(posixFilePath) {
    var relativePath = posixFilePath.replace(posixInputPath + '/', '');
    var filePath = path.join(inputPath, relativePath);
    var svgString = fs.readFileSync(filePath, 'UTF-8');
    var fileName = path.basename(relativePath);
    var fileDir = '/' + relativePath.replace(fileName, '');
    var svgData = svgDataFor(svgString);
    var assetId = idGen(stripExtension(relativePath), idGenOpts);

    return {
      svg: svgData,
      copypasta: copypastaGen(assetId),
      fileName: fileName,
      fileDir: fileDir,
      fileSize: stringSizeInKb(svgString) + ' KB',
      baseSize: svgData.height + 'px',
      strategy: strategy
    };
  });
};

module.exports = ViewerAssetsBuilder;
