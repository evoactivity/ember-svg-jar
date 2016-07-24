const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const CachingWriter = require('broccoli-caching-writer');
const mkdirp = require('mkdirp');
const cheerio = require('cheerio');
const { ensurePosix, stripExtension } = require('./utils');
const validateAssets = require('./validate-assets');

function svgDataFor(svgContents) {
  let $svg = cheerio.load(svgContents, { xmlMode: true })('svg');
  let viewBox = $svg.attr('viewBox');
  let [viewBoxWidth, viewBoxHeight] = (viewBox || '').split(/\s+/);
  let width = $svg.attr('width') || viewBoxWidth || 0;
  let height = $svg.attr('height') || viewBoxHeight || 0;

  return {
    content: $svg.html(),
    viewBox,
    width: width && parseFloat(width),
    height: height && parseFloat(height)
  };
}

function ViewerAssetsBuilder(inputNode, options = {}) {
  if (!options.outputFile) {
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

  return _.uniq(posixFilePaths).filter((filePath) => {
    // files returned from this.listFiles are directories if they end in /
    let isDirectory = filePath.charAt(filePath.length - 1) === '/';
    return !isDirectory;
  });
};

ViewerAssetsBuilder.prototype.getViewerAssets = function() {
  let assetsToValidate = [];
  let assets = this.getFilePaths().map((posixFilePath) => {
    let { strategy, idGen, idGenOpts, copypastaGen } = this.options;
    let inputPath = this.inputPaths[0];
    let posixInputPath = ensurePosix(inputPath);
    let relativePath = posixFilePath.replace(`${posixInputPath}/`, '');

    let filePath = path.join(inputPath, relativePath);
    let svgContents = fs.readFileSync(filePath, 'UTF-8');
    let svgData = svgDataFor(svgContents);

    let fileName = path.basename(relativePath);
    let fileDir = relativePath.replace(fileName, '');
    let assetId = idGen(stripExtension(relativePath), idGenOpts);

    assetsToValidate.push({
      id: assetId,
      viewBox: svgData.viewBox,
      path: relativePath
    });

    return {
      svg: svgData,
      copypasta: copypastaGen(assetId),
      fileName,
      fileDir: `/${fileDir}`,
      fileSize: `${stringSizeInKb(svgContents)} KB`,
      baseSize: `${svgData.height}px`,
      strategy
    };
  });

  validateAssets(assetsToValidate, this.options.strategy, this.ui);
  return assets;
};

module.exports = ViewerAssetsBuilder;
