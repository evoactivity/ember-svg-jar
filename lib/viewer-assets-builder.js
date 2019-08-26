'use strict';

/**
  Concatenates SVG files into a single JSON file.
  It's only used to generate input files for the ViewerBuilder.

  Required options:
    idGen
    idGenOpts
    copypastaGen
    stripPath
    validations
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

const addOptimizedSvg = _.curry((hasOptimizer, toOptimizedPath, pathAndSvgPair) => {
  let relativePath = pathAndSvgPair[0];
  let optimizedPath = toOptimizedPath(relativePath);

  return hasOptimizer
    ? pathAndSvgPair.concat(utils.readFile(optimizedPath))
    : pathAndSvgPair;
});

const svgToAsset = _.curry(
  (relativeToId, [relativePath, originalSvg, optimizedSvg]) => (
    {
      id: relativeToId(relativePath),
      svgData: utils.svgDataFor(optimizedSvg || originalSvg),
      originalSvg,
      optimizedSvg,
      relativePath
    }
  )
);

const assetToViewerItem = _.curry((copypastaGen, strategy, asset) => {
  let svgSize = svgSizeFor(asset.svgData.attrs);
  let fileSize = `${stringSizeInKb(asset.originalSvg)} KB`;
  let { optimizedSvg } = asset;
  let optimizedFileSize = optimizedSvg ? `${stringSizeInKb(optimizedSvg)} KB` : fileSize;

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
    let options = opts || {};

    super([inputNode], {
      name: 'ViewerAssetsBuilder',
      annotation: options.annotation
    });

    this.options = options;
  }

  build() {
    let {
      idGen,
      idGenOpts,
      copypastaGen,
      stripPath,
      strategy,
      hasOptimizer,
      outputFile,
      validations
    } = this.options;

    let inputPath = utils.toPosixPath(this.inputPaths[0]);
    let outputPath = utils.toPosixPath(this.outputPath);
    let filePaths = this.listFiles().map(utils.toPosixPath);

    let outputFilePath = path.join(outputPath, outputFile);
    let optimizedPath = path.join(inputPath, '__optimized__');

    let isOptimizedPath = (filePath) => filePath.indexOf(optimizedPath) !== -1;
    let toOptimizedPath = _.partial(path.join, optimizedPath);
    let toRelative = _.partial(utils.relativePathFor, _, inputPath);
    let idGenWithOpts = _.partial(idGen, _, idGenOpts);
    let relativeToId = _.partial(utils.makeAssetId, _, stripPath, idGenWithOpts);

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
      fp.map((filePath) => [toRelative(filePath), utils.readFile(filePath)]),
      fp.filter(([, originalSvg]) => !!originalSvg),
      fp.map(addOptimizedSvg(hasOptimizer, toOptimizedPath)),
      fp.map(svgToAsset(relativeToId)),
      fp.tap((assets) => validations && validateAssets(assets, validations, strategy)),
      fp.map(assetToViewerItem(copypastaGen, strategy)),
      JSON.stringify,
      (content) => utils.saveToFile(outputFilePath, content)
    )(filePaths);
  }
}

module.exports = ViewerAssetsBuilder;
