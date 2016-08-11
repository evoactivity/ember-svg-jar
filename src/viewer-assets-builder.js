const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const CachingWriter = require('broccoli-caching-writer');
const mkdirp = require('mkdirp');
const validateAssets = require('./validate-assets');
const svgDataFor = require('./utils/svg-data-for');
const { filePathsOnlyFor, idGenPathFor } = require('./utils/filepath');

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

  this.options = options;
}

ViewerAssetsBuilder.prototype = Object.create(CachingWriter.prototype);
ViewerAssetsBuilder.prototype.constructor = ViewerAssetsBuilder;

ViewerAssetsBuilder.prototype.build = function() {
  let { strategy, ui } = this.options;
  let inputPath = this.inputPaths[0];
  let assets = this.getAssets(
    filePathsOnlyFor(this.listFiles()), inputPath, this.options
  );

  if (ui) {
    validateAssets(assets, strategy, ui);
  }

  let viewerItems = this.viewerItemsFor(assets, inputPath, this.options);
  let outputFilePath = path.join(this.outputPath, this.options.outputFile);
  mkdirp.sync(path.dirname(outputFilePath));
  fs.writeFileSync(outputFilePath, JSON.stringify(viewerItems));
};

ViewerAssetsBuilder.prototype.viewerItemsFor = function(assets, inputPath, options) {
  let { strategy, copypastaGen } = options;

  return assets.map((asset) => {
    let { width, height } = svgSizeFor(asset.svgData.attrs);
    let originalFilePath = path.join(inputPath, '__original__', asset.relativePath);
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

ViewerAssetsBuilder.prototype.getAssets = function(filePaths, inputPath, options) {
  let { stripPath, idGen, idGenOpts } = options;

  return _(filePaths)
    .filter((filePath) => filePath.indexOf('__original__') === -1)
    .map((filePath) => {
      let svg = fs.readFileSync(filePath, 'UTF-8');

      return {
        id: idGen(idGenPathFor(filePath, inputPath, stripPath), idGenOpts),
        svgData: svgDataFor(svg),
        optimizedSvg: svg,
        relativePath: filePath.replace(`${inputPath}${path.sep}`, '')
      };
    })
    .value();
};

module.exports = ViewerAssetsBuilder;
