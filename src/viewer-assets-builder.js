const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const CachingWriter = require('broccoli-caching-writer');
const mkdirp = require('mkdirp');
const validateAssets = require('./validate-assets');
const svgDataFor = require('./utils/svg-data-for');
const { filePathsOnlyFor, relativePathFor, makeAssetId } = require('./utils/general');

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

/**
  Required options:
    idGen
    idGenOpts
    copypastaGen
    stripPath
    strategy
    outputFile

  Optional:
    ui
    annotation
*/
function ViewerAssetsBuilder(inputNode, options = {}) {
  CachingWriter.call(this, [inputNode], {
    name: 'ViewerAssetsBuilder',
    annotation: options.annotation,
  });

  this.ui = options.ui;
  this.options = {
    idGen: _.partial(options.idGen, _, options.idGenOpts),
    copypastaGen: options.copypastaGen,
    stripPath: options.stripPath,
    strategy: options.strategy,
    outputFile: options.outputFile
  };
}

ViewerAssetsBuilder.prototype = Object.create(CachingWriter.prototype);
ViewerAssetsBuilder.prototype.constructor = ViewerAssetsBuilder;

ViewerAssetsBuilder.prototype.build = function() {
  let { idGen, stripPath, strategy } = this.options;
  let inputPath = this.inputPaths[0];
  let toRelative = _.partial(relativePathFor, _, inputPath);
  let idFor = _.partial(makeAssetId, _, stripPath, idGen);
  let assets = this.getAssets(
    filePathsOnlyFor(this.listFiles()), toRelative, idFor
  );

  if (this.ui) {
    validateAssets(assets, strategy, this.ui);
  }

  let viewerItems = this.viewerItemsFor(assets, inputPath, this.options);
  let outputFilePath = path.join(this.outputPath, this.options.outputFile);
  mkdirp.sync(path.dirname(outputFilePath));
  fs.writeFileSync(outputFilePath, JSON.stringify(viewerItems));
};

ViewerAssetsBuilder.prototype.getAssets = function(filePaths, toRelative, idFor) {
  return _(filePaths)
    .filter((filePath) => filePath.indexOf('__original__') === -1)
    .map((filePath) => [filePath, fs.readFileSync(filePath, 'UTF-8')])
    .filter(([, svgContent]) => !!svgContent)
    .map(([filePath, svgContent]) => {
      let relativePath = toRelative(filePath);

      return {
        id: idFor(relativePath),
        svgData: svgDataFor(svgContent),
        optimizedSvg: svgContent,
        relativePath
      };
    })
    .value();
};

ViewerAssetsBuilder.prototype.viewerItemsFor = function(assets, inputPath, options) {
  let { strategy, copypastaGen } = options;
  let originalPath = path.join(inputPath, '__original__');

  return assets.map((asset) => {
    let { width, height } = svgSizeFor(asset.svgData.attrs);
    let originalFilePath = path.join(originalPath, asset.relativePath);
    let originalSvg = fs.readFileSync(originalFilePath, 'UTF-8');

    return {
      svg: asset.svgData,
      originalSvg,
      width,
      height,
      fileName: path.basename(asset.relativePath),
      fileDir: path.dirname(asset.relativePath).replace('.', '/'),
      fileSize: `${stringSizeInKb(originalSvg)} KB`,
      optimizedFileSize: `${stringSizeInKb(asset.optimizedSvg)} KB`,
      baseSize: _.isNull(height) ? 'unknown' : `${height}px`,
      fullBaseSize: `${width}x${height}px`,
      copypasta: copypastaGen(asset.id),
      strategy
    };
  });
};

module.exports = ViewerAssetsBuilder;
