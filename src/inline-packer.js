const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const CachingWriter = require('broccoli-caching-writer');
const mkdirp = require('mkdirp');
const svgDataFor = require('./utils/svg-data-for');
const { filePathsOnlyFor, relativePathFor, makeAssetId } = require('./utils/general');

/**
  SVG assets packer for `inline` strategy.
  It concatenates inputNode files into a single JSON file like:

  {
    'asset-1-id': { content: '<path>', attrs: { viewBox: '' } },
    'asset-2-id': { content: '<path>', attrs: { viewBox: '' } }
  }

  The file can optionally include ES6 module export.

  Required options:
    idGen
    stripPath
    outputFile

  Optional:
    moduleExport
    annotation
*/
function InlinePacker(inputNode, options = {}) {
  CachingWriter.call(this, [inputNode], {
    name: 'InlinePacker',
    annotation: options.annotation,
  });

  this.options = _.defaults(options, {
    moduleExport: true
  });
}

InlinePacker.prototype = Object.create(CachingWriter.prototype);
InlinePacker.prototype.constructor = InlinePacker;

InlinePacker.prototype.build = function() {
  let { stripPath, idGen } = this.options;
  let inputPath = this.inputPaths[0];
  let idFor = _.partial(makeAssetId, _, stripPath, idGen);
  let assetsStore = _(filePathsOnlyFor(this.listFiles()))
    .map((filePath) => [
      idFor(relativePathFor(filePath, inputPath)),
      svgDataFor(fs.readFileSync(filePath, 'UTF-8'))
    ])
    .fromPairs()
    .value();

  this.saveAsJson(assetsStore, this.outputPath, this.options);
};

InlinePacker.prototype.saveAsJson = function(data, outputPath, options) {
  let { outputFile, moduleExport } = options;
  let outputFilePath = path.join(outputPath, outputFile);
  let jsonContent = JSON.stringify(data);

  if (moduleExport) {
    jsonContent = `export default ${jsonContent}`;
  }

  mkdirp.sync(path.dirname(outputFilePath));
  fs.writeFileSync(outputFilePath, jsonContent);
};

module.exports = InlinePacker;
