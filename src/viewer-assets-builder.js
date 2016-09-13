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

const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const CachingWriter = require('broccoli-caching-writer');
const mkdirp = require('mkdirp');
const validateAssets = require('./validate-assets');
const {
  filePathsOnlyFor, relativePathFor, makeAssetId, svgDataFor
} = require('./utils');

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

class ViewerAssetsBuilder extends CachingWriter {
  constructor(inputNode, options = {}) {
    super([inputNode], {
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

  build() {
    let { idGen, stripPath, strategy } = this.options;
    let inputPath = this.inputPaths[0];
    let toRelative = _.partial(relativePathFor, _, inputPath);
    let pathToAssetId = _.partial(makeAssetId, _, stripPath, idGen);
    let assets = this.getAssets(
      filePathsOnlyFor(this.listFiles()), toRelative, pathToAssetId
    );

    if (this.ui) {
      validateAssets(assets, strategy, this.ui);
    }

    let viewerItems = this.viewerItemsFor(assets, inputPath, this.options);
    let outputFilePath = path.join(this.outputPath, this.options.outputFile);
    mkdirp.sync(path.dirname(outputFilePath));
    fs.writeFileSync(outputFilePath, JSON.stringify(viewerItems));
  }

  getAssets(filePaths, toRelative, pathToAssetId) {
    return _(filePaths)
      .filter((filePath) => filePath.indexOf('__original__') === -1)
      .map((filePath) => [filePath, fs.readFileSync(filePath, 'UTF-8')])
      .filter(([, svgContent]) => !!svgContent)
      .map(([filePath, svgContent]) => {
        let relativePath = toRelative(filePath);

        return {
          id: pathToAssetId(relativePath),
          svgData: svgDataFor(svgContent),
          optimizedSvg: svgContent,
          relativePath
        };
      })
      .value();
  }

  viewerItemsFor(assets, inputPath, options) {
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
  }
}

module.exports = ViewerAssetsBuilder;
