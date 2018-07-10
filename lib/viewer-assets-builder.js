'use strict';

/**
  Concatenates SVG files into a single JSON file.
  It's only used to generate input files for the ViewerBuilder.

  Required options:
    assetIdFor
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
const _ = require('lodash');
const fp = require('lodash/fp');
const CachingWriter = require('broccoli-caching-writer');
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

function toViewerItem([relativePath, svgContent], opts) {
  let svgData = utils.svgDataFor(svgContent);
  let svgSize = svgSizeFor(svgData.attrs);
  let {
    assetIdFor,
    copypastaGen,
    strategy
  } = opts;

  return {
    svg: svgData,
    width: svgSize.width,
    height: svgSize.height,
    fileName: path.basename(relativePath),
    fileDir: path.dirname(relativePath).replace('.', '/'),
    fileSize: `${stringSizeInKb(svgContent)} KB`,
    baseSize: _.isNull(svgSize.height) ? 'unknown' : `${svgSize.height}px`,
    fullBaseSize: `${svgSize.width}x${svgSize.height}px`,
    copypasta: copypastaGen(assetIdFor(relativePath)),
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
    let inputPath = utils.toPosixPath(this.inputPaths[0]);
    let relativePathFor = _.partial(utils.relativePathFor, _, inputPath);
    let outputPath = utils.toPosixPath(this.outputPath);
    let outputFilePath = path.join(outputPath, `${this.options.strategy}.json`);
    let filePaths = this.listFiles().map(utils.toPosixPath);

    fp.pipe(
      fp.map((filePath) => [relativePathFor(filePath), utils.readFile(filePath)]),
      fp.map((fileData) => toViewerItem(fileData, this.options)),
      JSON.stringify,
      utils.saveToFile(outputFilePath)
    )(filePaths);
  }
}

module.exports = ViewerAssetsBuilder;
