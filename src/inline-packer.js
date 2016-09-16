/**
  Concatenates input node files into a single ES6 module that will be
  used as the assets store for the inline strategy.

  Required options:
    idGen
    stripPath
    outputFile

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
const path = require('path');
const _ = require('lodash');
const fp = require('lodash/fp');
const CachingWriter = require('broccoli-caching-writer');
const {
  filePathsOnly, relativePathFor, makeAssetId, svgDataFor, readFile, saveToFile
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
    const { stripPath, idGen, outputFile } = this.options;
    const inputPath = this.inputPaths[0];
    const outputFilePath = path.join(this.outputPath, outputFile);

    const toRelativePath = _.partial(relativePathFor, _, inputPath);
    const relativePathToId = _.partial(makeAssetId, _, stripPath, idGen);
    const pathToId = fp.pipe(toRelativePath, relativePathToId);

    fp.pipe(
      filePathsOnly,
      fp.map((filePath) => [pathToId(filePath), extractSvgData(filePath)]),
      _.fromPairs,
      JSON.stringify,
      (json) => `export default ${json}`,
      saveToFile(outputFilePath)
    )(this.listFiles());
  }
}

module.exports = InlinePacker;
