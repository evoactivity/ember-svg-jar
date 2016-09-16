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
const fp = require('lodash/fp');
const CachingWriter = require('broccoli-caching-writer');
const mkdirp = require('mkdirp');
const validateAssets = require('./validate-assets');
const {
  filePathsOnly, relativePathFor, makeAssetId, svgDataFor
} = require('./utils');

function svgSizeFor(svgAttrs) {
  const [, , vbWidth, vgHeight] = (svgAttrs.viewBox || '').split(/\s+/);

  return {
    width: parseFloat(svgAttrs.width || vbWidth) || null,
    height: parseFloat(svgAttrs.height || vgHeight) || null
  };
}

function stringSizeInKb(string) {
  const bytes = Buffer.byteLength(string, 'utf8');
  return parseFloat((bytes / 1024).toFixed(2));
}

const readFile = _.partial(fs.readFileSync, _, 'UTF-8');

const saveToFile = _.curry((filePath, data) => {
  mkdirp.sync(path.dirname(filePath));
  fs.writeFileSync(filePath, data);
});

const svgToAsset = _.curry((relativeToId, [relativePath, svg]) => ({
  id: relativeToId(relativePath),
  svgData: svgDataFor(svg),
  optimizedSvg: svg,
  relativePath
}));

const assetToViewerItem = _.curry((copypastaGen, strategy, asset) => {
  const { width, height } = svgSizeFor(asset.svgData.attrs);

  return {
    svg: asset.svgData,
    originalSvg: asset.originalSvg,
    width,
    height,
    fileName: path.basename(asset.relativePath),
    fileDir: path.dirname(asset.relativePath).replace('.', '/'),
    fileSize: `${stringSizeInKb(asset.originalSvg)} KB`,
    optimizedFileSize: `${stringSizeInKb(asset.optimizedSvg)} KB`,
    baseSize: _.isNull(height) ? 'unknown' : `${height}px`,
    fullBaseSize: `${width}x${height}px`,
    copypasta: copypastaGen(asset.id),
    strategy
  };
});

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
    const { idGen, stripPath, strategy, outputFile, copypastaGen } = this.options;
    const ui = this.ui;
    const outputFilePath = path.join(this.outputPath, outputFile);
    const inputPath = this.inputPaths[0];
    const originalPath = path.join(inputPath, '__original__');

    const isOriginal = (filePath) => filePath.indexOf(originalPath) !== -1;
    const toOriginalPath = _.partial(path.join, originalPath);
    const toRelative = _.partial(relativePathFor, _, inputPath);
    const relativeToId = _.partial(makeAssetId, _, stripPath, idGen);

    fp.pipe(
      filePathsOnly,
      fp.reject(isOriginal),
      fp.map((filePath) => [toRelative(filePath), readFile(filePath)]),
      fp.filter(([, svg]) => !!svg),
      fp.map(svgToAsset(relativeToId)),
      fp.tap((assets) => ui && validateAssets(assets, strategy, ui)),
      fp.forEach((asset) => (
        // eslint-disable-next-line no-param-reassign
        asset.originalSvg = readFile(toOriginalPath(asset.relativePath))
      )),
      fp.map(assetToViewerItem(copypastaGen, strategy)),
      JSON.stringify,
      saveToFile(outputFilePath)
    )(this.listFiles());
  }
}

module.exports = ViewerAssetsBuilder;
