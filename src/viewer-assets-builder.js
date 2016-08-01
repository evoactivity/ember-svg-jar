const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const CachingWriter = require('broccoli-caching-writer');
const mkdirp = require('mkdirp');
const { ensurePosix, stripExtension, svgDataFor } = require('./utils');
const validateAssets = require('./validate-assets');

function svgSizeFor(svgAttrs) {
  let [, , vbWidth, vgHeight] = (svgAttrs.viewBox || '').split(/\s+/);

  return {
    width: parseFloat(svgAttrs.width || vbWidth) || null,
    height: parseFloat(svgAttrs.height || vgHeight) || null
  };
}

function stringSizeInKb(string) {
  let bytes = Buffer.byteLength(string, 'utf8');
  return parseFloat((bytes / 1024).toFixed(2));
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
    let { strategy, stripPath, idGen, idGenOpts, copypastaGen } = this.options;
    let inputPath = this.inputPaths[0];
    let posixInputPath = ensurePosix(inputPath);
    let relativePath = posixFilePath.replace(`${posixInputPath}/`, '');

    let filePath = path.join(inputPath, relativePath);
    let svgContents = fs.readFileSync(filePath, 'UTF-8');
    let svgData = svgDataFor(svgContents);
    let { width, height } = svgSizeFor(svgData.attrs);

    let fileName = path.basename(relativePath);
    let fileDir = relativePath.replace(fileName, '');
    let idGenPath = stripPath ? path.basename(relativePath) : relativePath;
    let assetId = idGen(stripExtension(idGenPath), idGenOpts);

    assetsToValidate.push({
      id: assetId,
      viewBox: svgData.attrs.viewBox,
      path: relativePath
    });

    return {
      svg: svgData,
      width,
      height,
      fileName,
      fileDir: `/${fileDir}`,
      fileSize: `${stringSizeInKb(svgContents)} KB`,
      baseSize: _.isNull(height) ? 'unknown' : `${height}px`,
      copypasta: copypastaGen(assetId),
      strategy
    };
  });

  validateAssets(assetsToValidate, this.options.strategy, this.ui);
  return assets;
};

module.exports = ViewerAssetsBuilder;
