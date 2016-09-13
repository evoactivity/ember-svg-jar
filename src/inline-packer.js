/**
  SVG assets packer for `inline` strategy.
  It concatenates inputNode files into a single JSON file like:

  {
    'asset-1-id': { content: '<path>', attrs: { viewBox: '' } },
    'asset-2-id': { content: '<path>', attrs: { viewBox: '' } }
  }

  The result file can optionally include ES6 module export.

  Required options:
    idGen
    stripPath
    outputFile

  Optional:
    moduleExport
    annotation
*/
const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const CachingWriter = require('broccoli-caching-writer');
const mkdirp = require('mkdirp');
const {
  filePathsOnlyFor, relativePathFor, makeAssetId, svgDataFor
} = require('./utils');

function toJson(data, hasModuleExport) {
  let json = JSON.stringify(data);
  return hasModuleExport ? `export default ${json}` : json;
}

function saveToFile(data, directory, filename) {
  let outputFilePath = path.join(directory, filename);
  mkdirp.sync(path.dirname(outputFilePath));
  fs.writeFileSync(outputFilePath, data);
}

class InlinePacker extends CachingWriter {
  constructor(inputNode, options = {}) {
    super([inputNode], {
      name: 'InlinePacker',
      annotation: options.annotation,
    });

    this.options = _.defaults(options, {
      moduleExport: true
    });
  }

  build() {
    let { stripPath, idGen, outputFile, moduleExport } = this.options;
    let inputPath = this.inputPaths[0];
    let pathToAssetId = _.partial(makeAssetId, _, stripPath, idGen);

    let assetsStore = _(filePathsOnlyFor(this.listFiles()))
      .map((filePath) => [
        pathToAssetId(relativePathFor(filePath, inputPath)),
        svgDataFor(fs.readFileSync(filePath, 'UTF-8'))
      ])
      .fromPairs()
      .value();

    let assetsStoreJson = toJson(assetsStore, moduleExport);
    saveToFile(assetsStoreJson, this.outputPath, outputFile);
  }
}

module.exports = InlinePacker;
