const CachingWriter = require('broccoli-caching-writer');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const mkdirp = require('mkdirp');
const cheerio = require('cheerio');
const utils = require('./utils');
const ensurePosix = utils.ensurePosix;
const stripExtension = utils.stripExtension;
const checkForDuplicates = utils.checkForDuplicates;

function svgDataFor(svgString) {
  let $svg = cheerio.load(svgString, { xmlMode: true })('svg');
  let viewBox = $svg.attr('viewBox');
  let viewBoxValues = viewBox.split(/\s+/);

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

  this.ui = options.ui;
  this.options = options;
}

function stringSizeInKb(string) {
  let bytes = Buffer.byteLength(string, 'utf8');
  return parseFloat((bytes / 1024).toFixed(2));
}

ViewerAssetsBuilder.prototype = Object.create(CachingWriter.prototype);
ViewerAssetsBuilder.prototype.constructor = ViewerAssetsBuilder;

ViewerAssetsBuilder.prototype.build = function() {
  let dataToWite = JSON.stringify(this.getViewerAssets());
  let outputFilePath = path.join(this.outputPath, this.options.outputFile);
  mkdirp.sync(path.dirname(outputFilePath));
  fs.writeFileSync(outputFilePath, dataToWite);
};

ViewerAssetsBuilder.prototype.getFilePaths = function() {
  let posixFilePaths = this.listFiles().map(ensurePosix);

  return _.uniq(posixFilePaths).filter(function(filePath) {
    // files returned from this.listFiles are directories if they end in /
    let isDirectory = filePath.charAt(filePath.length - 1) === '/';
    return !isDirectory;
  });
};

ViewerAssetsBuilder.prototype.getViewerAssets = function() {
  let inputPath = this.inputPaths[0];
  let posixInputPath = ensurePosix(inputPath);
  let strategy = this.options.strategy;
  let idGen = this.options.idGen;
  let idGenOpts = this.options.idGenOpts;
  let copypastaGen = this.options.copypastaGen;
  let itemsToCheck = [];

  let assets = this.getFilePaths().map(function(posixFilePath) {
    let relativePath = posixFilePath.replace(posixInputPath + '/', '');
    let filePath = path.join(inputPath, relativePath);
    let svgString = fs.readFileSync(filePath, 'UTF-8');
    let fileName = path.basename(relativePath);
    let fileDir = '/' + relativePath.replace(fileName, '');
    let svgData = svgDataFor(svgString);
    let assetId = idGen(stripExtension(relativePath), idGenOpts);
    itemsToCheck.push({ id: assetId, path: relativePath });

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

  checkForDuplicates(itemsToCheck, strategy, this.ui);
  return assets;
};

module.exports = ViewerAssetsBuilder;
