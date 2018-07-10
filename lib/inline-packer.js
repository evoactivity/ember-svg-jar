'use strict';

/**
  Packages SVGs as ES modules for use with the inline strategy.

  Required options:
    assetIdFor

  Examples of input and output:

  Input node:
  ├── alarm.svg
  └── cat.svg

  Output node:
  inlined
  ├── alarm.js
  └── cat.js

  alarm.js can content:
  export default {
    content: '<path>', attrs: { viewBox: '' }
  }
*/
const path = require('path-posix');
const fp = require('lodash/fp');
const CachingWriter = require('broccoli-caching-writer');
const utils = require('./utils');

const extractSvgData = fp.pipe(utils.readFile, utils.svgDataFor);

class InlinePacker extends CachingWriter {
  constructor(inputNode, opts) {
    super([inputNode], { name: 'InlinePacker' });
    this.options = opts;
  }

  build() {
    let inputPath = utils.toPosixPath(this.inputPaths[0]);
    let outputPath = path.join(utils.toPosixPath(this.outputPath), 'inlined');
    let { assetIdFor } = this.options;

    this.listFiles()
      .map(utils.toPosixPath)
      .forEach((filePath) => {
        let assetId = assetIdFor(filePath, inputPath);
        let modulePath = path.join(outputPath, `${assetId}.js`);
        let svgData = extractSvgData(filePath);
        let moduleContent = `export default ${JSON.stringify(svgData)}`;
        utils.saveToFile(modulePath, moduleContent);
      });
  }
}

module.exports = InlinePacker;
