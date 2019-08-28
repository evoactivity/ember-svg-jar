'use strict';

/**
  Concatenates SVG files into a single JSON file.
  It's only used to generate input files for the ViewerBuilder.

  Required options:
    makeAssetID
    copypastaGen
    strategy

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

function getGridSize(svgAttrs) {
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

function toViewerItem(relativePath, svgContent, opts) {
  let svgData = svgDataFor(svgContent);
  let { width, height } = getGridSize(svgData.attrs);
  let { makeAssetID, copypastaGen, strategy } = opts;
  let assetID = makeAssetID(relativePath);
  let fileName = path.basename(relativePath);
  let fileDir = path.dirname(relativePath).replace('.', 'unknown');

  return {
    id: `${fileDir}-${fileName}`,
    svg: svgContent,
    gridWidth: width,
    gridHeight: height,
    fileName,
    fileDir,
    fileSize: stringSizeInKb(svgContent),
    helper: copypastaGen(assetID),
    strategy
  };
}

class ViewerAssetsBuilder extends CachingWriter {
  constructor(inputNode, opts) {
    let options = opts || {};
    super([inputNode], { name: 'ViewerAssetsBuilder' });
    this.options = options;
  }

  build() {
    let inputPath = toPosixPath(this.inputPaths[0]);
    let outputPath = toPosixPath(this.outputPath);
    let outputFilePath = path.join(outputPath, `${this.options.strategy}.json`);
    let filePaths = this.listFiles().map(toPosixPath);

    let viewerItems = filePaths.map((filePath) => {
      let relativePath = relativePathFor(filePath, inputPath);
      let svgContent = readFile(filePath);

      return toViewerItem(relativePath, svgContent, this.options);
    });

    saveToFile(outputFilePath, JSON.stringify(viewerItems));
  }
}

module.exports = ViewerAssetsBuilder;
