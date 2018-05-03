'use strict';

/**
  Packages SVGs as ES modules for use with the inline strategy.

  Required options:
    idGen
    stripPath

  Optional options:
    annotation

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
const _ = require('lodash');
const fp = require('lodash/fp');
const CachingWriter = require('broccoli-caching-writer');
const utils = require('./utils');

const extractSvgData = fp.pipe(utils.readFile, utils.svgDataFor);

class InlinePacker extends CachingWriter {
  constructor(inputNode, opts) {
    let options = opts || {};

    super([inputNode], {
      name: 'InlinePacker',
      annotation: options.annotation
    });

    this.options = options;
  }

  build() {
    let inputPath = utils.toPosixPath(this.inputPaths[0]);
    let outputPath = utils.toPosixPath(this.outputPath);
    let modulesPath = path.join(outputPath, 'inlined');
    let filePaths = this.listFiles().map(utils.toPosixPath);

    let { stripPath, idGen } = this.options;

    let toRelativePath = _.partial(utils.relativePathFor, _, inputPath);
    let relativePathToId = _.partial(utils.makeAssetId, _, stripPath, idGen);
    let pathToId = fp.pipe(toRelativePath, relativePathToId);

    _.forEach(filePaths, (filePath) => {
      let assetId = pathToId(filePath);
      let modulePath = path.join(modulesPath, `${assetId}.js`);
      let svgData = extractSvgData(filePath);
      let moduleContent = `export default ${JSON.stringify(svgData)}`;
      utils.saveToFile(modulePath, moduleContent);
    });
  }
}

module.exports = InlinePacker;
