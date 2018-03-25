'use strict';

/**
  Concatenates SVG files into a single JSON file.
  It's only used to generate input files for the ViewerBuilder.

  Required options:
    idGen
    idGenOpts
    copypastaGen
    stripPath
    strategy
    hasOptimizer
    outputFile

  Optional options:
    ui
    annotation

  Examples of input and output:

  Input node:
  ├── __optimized__
  │   ├── alarm.svg
  │   └── ...
  ├── alarm.svg
  └── ...

  Output node:
  └── outputFile.json

  outputFile.json can content:
  [
    {
      "svg": {
        "content": "<path />",
        "attrs": {
          "width": "20",
          "height": "20",
          "viewBox": "0 0 20 20"
        }
      },
      "originalSvg": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\"><path /></svg>",
      "width": 20,
      "height": 20,
      "fileName": "alarm.svg",
      "fileDir": "/",
      "fileSize": "1.16 KB",
      "optimizedFileSize": "0.62 KB",
      "baseSize": "20px",
      "fullBaseSize": "20x20px",
      "copypasta": "{{svg-jar \"alarm\"}}",
      "strategy": "inline"
    },

    { ... }
  ]
*/
const path = require('path-posix');
const _ = require('lodash');
const fp = require('lodash/fp');
const CachingWriter = require('broccoli-caching-writer');
const validateAssets = require('./validate-assets');
const utils = require('./utils');

function svgSizeFor(svgAttrs) {
  const viewBoxData = (svgAttrs.viewBox || '').split(/\s+/);
  const vbWidth = viewBoxData[2];
  const vgHeight = viewBoxData[3];

  return {
    width: parseFloat(svgAttrs.width || vbWidth) || null,
    height: parseFloat(svgAttrs.height || vgHeight) || null
  };
}

function stringSizeInKb(string) {
  const bytes = Buffer.byteLength(string, 'utf8');
  return parseFloat((bytes / 1024).toFixed(2));
}

const addOptimizedSvg = _.curry((hasOptimizer, toOptimizedPath, pathAndSvgPair) => {
  // eslint-disable-next-line comma-spacing
  const relativePath = pathAndSvgPair[0];
  const optimizedPath = toOptimizedPath(relativePath);

  return hasOptimizer
    ? pathAndSvgPair.concat(utils.readFile(optimizedPath))
    : pathAndSvgPair;
});

const svgToAsset = _.curry(
  (relativeToId, options) => {
    const relativePath = options[0];
    const originalSvg = options[1];
    const optimizedSvg = options[2];

    return {
      id: relativeToId(relativePath),
      svgData: utils.svgDataFor(optimizedSvg || originalSvg),
      originalSvg,
      optimizedSvg,
      relativePath
    };
  }
);

const assetToViewerItem = _.curry((copypastaGen, strategy, asset) => {
  const svgSize = svgSizeFor(asset.svgData.attrs);
  const fileSize = `${stringSizeInKb(asset.originalSvg)} KB`;
  const optimizedSvg = asset.optimizedSvg;
  const optimizedFileSize = optimizedSvg ? `${stringSizeInKb(optimizedSvg)} KB` : fileSize;

  return {
    svg: asset.svgData,
    originalSvg: asset.originalSvg,
    width: svgSize.width,
    height: svgSize.height,
    fileName: path.basename(asset.relativePath),
    fileDir: path.dirname(asset.relativePath).replace('.', '/'),
    fileSize,
    optimizedFileSize,
    baseSize: _.isNull(svgSize.height) ? 'unknown' : `${svgSize.height}px`,
    fullBaseSize: `${svgSize.width}x${svgSize.height}px`,
    copypasta: copypastaGen(asset.id),
    strategy
  };
});

class ViewerAssetsBuilder extends CachingWriter {
  constructor(inputNode, opts) {
    const options = opts || {};

    super([inputNode], {
      name: 'ViewerAssetsBuilder',
      annotation: options.annotation,
    });

    this.options = options;
  }

  build() {
    const idGen = this.options.idGen;
    const idGenOpts = this.options.idGenOpts;
    const copypastaGen = this.options.copypastaGen;
    const stripPath = this.options.stripPath;
    const strategy = this.options.strategy;
    const hasOptimizer = this.options.hasOptimizer;
    const outputFile = this.options.outputFile;
    const ui = this.options.ui;

    const inputPath = utils.toPosixPath(this.inputPaths[0]);
    const outputPath = utils.toPosixPath(this.outputPath);
    const filePaths = this.listFiles().map(utils.toPosixPath);

    const outputFilePath = path.join(outputPath, outputFile);
    const optimizedPath = path.join(inputPath, '__optimized__');

    const isOptimizedPath = (filePath) => filePath.indexOf(optimizedPath) !== -1;
    const toOptimizedPath = _.partial(path.join, optimizedPath);
    const toRelative = _.partial(utils.relativePathFor, _, inputPath);
    const idGenWithOpts = _.partial(idGen, _, idGenOpts);
    const relativeToId = _.partial(utils.makeAssetId, _, stripPath, idGenWithOpts);

    /**
      The flow:
      [anySvgPath]
      [originalOnlySvgPath]
      [ [relativePath, originalSvg] ]
      [ [relativePath, originalSvg, maybeOptimizedSvg] ]
      [assetObj]
      [viewerItem]
      jsonString
    */
    fp.pipe(
      fp.reject(isOptimizedPath),
      fp.map(filePath => [toRelative(filePath), utils.readFile(filePath)]),
      fp.filter((relativePathOriginalSvg) => !!relativePathOriginalSvg[1]),
      fp.map(addOptimizedSvg(hasOptimizer, toOptimizedPath)),
      fp.map(svgToAsset(relativeToId)),
      fp.tap(assets => ui && validateAssets(assets, strategy, ui)),
      fp.map(assetToViewerItem(copypastaGen, strategy)),
      JSON.stringify,
      utils.saveToFile(outputFilePath)
    )(filePaths);
  }
}

module.exports = ViewerAssetsBuilder;
