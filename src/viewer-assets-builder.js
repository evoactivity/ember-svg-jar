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
const path = require('path');
const _ = require('lodash');
const fp = require('lodash/fp');
const CachingWriter = require('broccoli-caching-writer');
const validateAssets = require('./validate-assets');
const {
  filePathsOnly, relativePathFor, makeAssetId, svgDataFor, readFile, saveToFile
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

const addOptimizedSvg = _.curry((hasOptimizer, toOptimizedPath, pathAndSvgPair) => {
  // eslint-disable-next-line comma-spacing
  const [relativePath,] = pathAndSvgPair;
  const optimizedPath = toOptimizedPath(relativePath);

  return hasOptimizer
    ? pathAndSvgPair.concat(readFile(optimizedPath))
    : pathAndSvgPair;
});

const svgToAsset = _.curry(
  (relativeToId, [relativePath, originalSvg, optimizedSvg]) => ({
    id: relativeToId(relativePath),
    svgData: svgDataFor(optimizedSvg || originalSvg),
    originalSvg,
    optimizedSvg,
    relativePath
  })
);

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

    this.options = options;
  }

  build() {
    const {
      idGen,
      idGenOpts,
      copypastaGen,
      stripPath,
      strategy,
      hasOptimizer,
      outputFile,
      ui
    } = this.options;
    const outputFilePath = path.join(this.outputPath, outputFile);
    const inputPath = this.inputPaths[0];
    const optimizedPath = path.join(inputPath, '__optimized__');

    const isOptimizedPath = (filePath) => filePath.indexOf(optimizedPath) !== -1;
    const toOptimizedPath = _.partial(path.join, optimizedPath);
    const toRelative = _.partial(relativePathFor, _, inputPath);
    const idGenWithOpts = _.partial(idGen, _, idGenOpts);
    const relativeToId = _.partial(makeAssetId, _, stripPath, idGenWithOpts);

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
      filePathsOnly,
      fp.reject(isOptimizedPath),
      fp.map(filePath => [toRelative(filePath), readFile(filePath)]),
      fp.filter(([, originalSvg]) => !!originalSvg),
      fp.map(addOptimizedSvg(hasOptimizer, toOptimizedPath)),
      fp.map(svgToAsset(relativeToId)),
      fp.tap(assets => ui && validateAssets(assets, strategy, ui)),
      fp.map(assetToViewerItem(copypastaGen, strategy)),
      JSON.stringify,
      saveToFile(outputFilePath)
    )(this.listFiles());
  }
}

module.exports = ViewerAssetsBuilder;
