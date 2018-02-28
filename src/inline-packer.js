/* eslint-env node */
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
const {
  relativePathFor, makeAssetId, svgDataFor, readFile, saveToFile, toPosixPath
} = require('./utils');

const extractSvgData = fp.pipe(readFile, svgDataFor);

class InlinePacker extends CachingWriter {
  constructor(inputNode, options = {}) {
    super([inputNode], {
      name: 'InlinePacker',
      annotation: options.annotation,
    });

    this.options = options;
  }

  build() {
    const inputPath = toPosixPath(this.inputPaths[0]);
    const outputPath = toPosixPath(this.outputPath);
    const filePaths = this.listFiles().map(toPosixPath);

    const { stripPath, idGen } = this.options;


    const toRelativePath = _.partial(relativePathFor, _, inputPath);
    const relativePathToId = _.partial(makeAssetId, _, stripPath, idGen);
    const pathToId = fp.pipe(toRelativePath, relativePathToId);

    for (let filePath of filePaths) {
      let id = pathToId(filePath);
      let svgData = extractSvgData(filePath);
      let jsWrapped = `export default ${JSON.stringify(svgData)}`;
      saveToFile(path.join(outputPath, 'inlined', `${id}.js`), jsWrapped);
    }
  }
}

module.exports = InlinePacker;
