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
  └── output.js

  output.js can content:
  export default {
    'alarm': { content: '<path>', attrs: { viewBox: '' } },
    'cat': { content: '<path>', attrs: { viewBox: '' } }
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
    const options = opts || {};

    super([inputNode], {
      name: 'InlinePacker',
      annotation: options.annotation,
    });

    this.options = options;
  }

  build() {
    const inputPath = utils.toPosixPath(this.inputPaths[0]);
    const outputPath = utils.toPosixPath(this.outputPath);
    const filePaths = this.listFiles().map(utils.toPosixPath);

    const stripPath = this.options.stripPath;
    const idGen = this.options.idGen;

    const toRelativePath = _.partial(utils.relativePathFor, _, inputPath);
    const relativePathToId = _.partial(utils.makeAssetId, _, stripPath, idGen);
    const pathToId = fp.pipe(toRelativePath, relativePathToId);

    _.forEach(filePaths, (filePath) => {
      let assetId = pathToId(filePath);
      let modulePath = path.join(outputPath, 'inlined', `${assetId}.js`);
      let svgData = extractSvgData(filePath);
      let moduleContent = `export default ${JSON.stringify(svgData)}`;
      utils.saveToFile(modulePath, moduleContent);
    });
  }
}

module.exports = InlinePacker;
