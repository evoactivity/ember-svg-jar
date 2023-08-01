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
const path = require('path').posix;
const CachingWriter = require('broccoli-caching-writer');
const {
  readFile,
  svgDataFor,
  toPosixPath,
  saveToFile,
  relativePathFor,
} = require('./utils');

class InlinePacker extends CachingWriter {
  constructor(inputNode, opts) {
    super([inputNode], { name: 'InlinePacker' });
    this.options = opts;
  }

  build() {
    let inputPath = toPosixPath(this.inputPaths[0]);
    let outputPath = path.join(toPosixPath(this.outputPath), 'inlined');
    let { makeAssetID } = this.options;

    const assets = [];

    this.listFiles().forEach(_filePath => {
      const filePath = toPosixPath(_filePath);
      const relativePath = relativePathFor(filePath, inputPath);
      const jsName = makeAssetID(relativePath);
      const modulePath = path.join(outputPath, `${jsName}.js`);
      const svgData = svgDataFor(readFile(filePath));

      saveToFile(modulePath, `export default ${JSON.stringify(svgData)}`);

      assets.push(jsName);
    });

    // Generate index.js that contains methods to import each asset
    const contents = `import { importSync } from '@embroider/macros';
      const obj = {
        ${assets
          .map(asset => {
            const assetName = asset.replace(/'/g, "\\'");
            return `['${assetName}']: function() { return importSync('./${assetName}'); }`;
          })
          .join(',\n')}
      }; export default obj;`;

    saveToFile(path.join(outputPath, `index.js`), contents);
  }
}

module.exports = InlinePacker;
