'use strict';

/**
  Concatenates SVG files into a single JSON file.
  It's only used to generate input files for the ViewerBuilder.

  Required options:
    makeAssetID
    copypastaGen
    strategy
    validationConfig

  Examples of input and output:

  Input node:
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
      "width": 20,
      "height": 20,
      "fileName": "alarm.svg",
      "fileDir": "/",
      "fileSize": "1.16 KB",
      "baseSize": "20px",
      "fullBaseSize": "20x20px",
      "copypasta": "{{svg-jar \"alarm\"}}",
      "strategy": "inline"
    },

    { ... }
  ]
*/
const path = require('path-posix');
const CachingWriter = require('broccoli-caching-writer');
const {
  toPosixPath, readFile, saveToFile, relativePathFor, svgDataFor
} = require('./utils');
const validateAssets = require('./validate-assets');

function getGridSize(svgContent) {
  let { attrs: svgAttrs = {} } = svgDataFor(svgContent);
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
  constructor(inputNode, opts) {
    let options = opts || {};
    super([inputNode], { name: 'ViewerAssetsBuilder' });
    this.options = options;
  }

  build() {
    let {
      makeAssetID, copypastaGen, validationConfig, strategy
    } = this.options;
    let inputPath = toPosixPath(this.inputPaths[0]);
    let outputPath = toPosixPath(this.outputPath);
    let outputFilePath = path.join(outputPath, `${strategy}.json`);

    let filePaths = this.listFiles().map((fullPath) => {
      const filePath = toPosixPath(fullPath);

      return {
        filePath,
        relativePath: relativePathFor(fullPath, inputPath)
      };
    });

    let viewerAssets = filePaths.map(({ filePath, relativePath }, index) => {
      let svgContent = readFile(filePath);
      let { width, height } = getGridSize(svgContent);

      return {
        id: `${index}-${strategy}`,
        svg: svgContent,
        gridWidth: width,
        gridHeight: height,
        fileName: path.basename(relativePath),
        fileDir: path.dirname(relativePath).replace('.', '/root'),
        fileSize: stringSizeInKb(svgContent),
        helper: copypastaGen(makeAssetID(relativePath)),
        strategy
      };
    });

    let itemsToValidate = filePaths.map(({ filePath, relativePath }, index) => (
      {
        filePath,
        relativePath,
        id: makeAssetID(relativePath),
        asset: viewerAssets[index],
      }
    ));

    validateAssets(itemsToValidate, validationConfig, strategy);

    saveToFile(outputFilePath, JSON.stringify(viewerAssets));
  }
}

module.exports = ViewerAssetsBuilder;
