'use strict';

/**
  Packages SVGs as ES modules for use with the inline strategy.
  Required options:
    makeAssetID

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
const CachingWriter = require('broccoli-caching-writer');
const {
  readFile, svgDataFor, toPosixPath, saveToFile, relativePathFor
} = require('./utils');


const templateOnlyComponent = `
import templateOnly from '@ember/component/template-only';
export default templateOnly();
`;

class InlinePacker extends CachingWriter {
  constructor(inputNode, opts) {
    super([inputNode], { name: 'InlinePacker' });
    this.options = opts;
  }

  build() {
    let inputPath = toPosixPath(this.inputPaths[0]);
    let outputPath = path.join(toPosixPath(this.outputPath), 'components');
    let { makeAssetID } = this.options;

    this.listFiles()
      .forEach((_filePath) => {
        let filePath = toPosixPath(_filePath);
        let relativePath = relativePathFor(filePath, inputPath);
        let modulePathJs = path.join(outputPath, `${makeAssetID(relativePath)}.js`);
        let svgData = svgDataFor(readFile(filePath));

        console.log("JS", modulePathJs)
        // console.log("HBS", modulePathHBS)

        saveToFile(modulePathJs, templateOnlyComponent);
        // saveToFile(modulePathHBS, `${readFile(filePath)}`);
      });
  }
}

module.exports = InlinePacker;