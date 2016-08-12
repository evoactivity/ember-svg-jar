const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const CachingWriter = require('broccoli-caching-writer');
const mkdirp = require('mkdirp');
const svgDataFor = require('./utils/svg-data-for');
const { filePathsOnlyFor, idGenPathFor } = require('./utils/filepath');

/**
  SVG assets packer for `inline` strategy.
  It concatenates inputNode files into a single JSON file like:

  {
    'asset-1-id': { content: '<path>', attrs: { viewBox: '' } },
    'asset-2-id': { content: '<path>', attrs: { viewBox: '' } }
  }

  The file can optionally include ES6 module export.
*/
function InlinePacker(inputNode, options = {}) {
  if (!options.outputFile) {
    throw new Error('the outputFile option is required');
  }

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
  let assetsStore = this.buildAssetsStore(
    filePathsOnlyFor(this.listFiles()), this.inputPaths[0], this.options
  );

  this.saveAsJson(assetsStore, this.outputPath, this.options);
};

InlinePacker.prototype.buildAssetsStore = function(filePaths, inputPath, options) {
  let { stripPath, idGen, idGenOpts } = options;

  return _(filePaths)
    .map((filePath) => [
      idGen(idGenPathFor(filePath, inputPath, stripPath), idGenOpts),
      svgDataFor(fs.readFileSync(filePath, 'UTF-8'))
    ])
    .fromPairs()
    .value();
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
