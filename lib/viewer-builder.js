'use strict';

var CachingWriter = require('broccoli-caching-writer');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var mkdirp = require('mkdirp');

function filtersFor(assets, filters) {
  return filters.map(function(filter) {
    return {
      name: filter.name,
      key: filter.key,
      items: _
        .chain(assets)
        .map(filter.key)
        .without(undefined)
        .countBy()
        .toPairs()
        .map(function(pair) {
          return { name: pair[0], count: pair[1] };
        })
        .sortBy('name')
        .value()
    };
  });
}

function ViewerBuilder(inputNode, options) {
  if (!options || !options.outputFile) {
    throw new Error('the outputFile option is required');
  }

  CachingWriter.call(this, [inputNode], {
    name: 'ViewerBuilder',
    annotation: options.annotation,
  });

  this.options = options;
}

ViewerBuilder.prototype = Object.create(CachingWriter.prototype);
ViewerBuilder.prototype.constructor = ViewerBuilder;

ViewerBuilder.prototype.build = function() {
  var viewerContent = JSON.stringify(this.getViewerModel());
  var outputFilePath = path.join(this.outputPath, this.options.outputFile);
  mkdirp.sync(path.dirname(outputFilePath));
  fs.writeFileSync(outputFilePath, viewerContent);
};

ViewerBuilder.prototype.getViewerModel = function() {
  var viewerAssets = this.listFiles().reduce(function(assets, filePath) {
    return assets.concat(JSON.parse(fs.readFileSync(filePath, 'UTF-8')));
  }, []);

  return {
    sortBy: [
      { name: 'File name', key: 'fileName' },
      { name: 'Base size', key: 'baseSize' }
    ],

    arrangeBy: [
      { name: 'Directory', key: 'fileDir' },
      { name: 'Base size', key: 'baseSize' }
    ],

    searchKeys: ['fileName', 'fileDir'],

    filters: filtersFor(viewerAssets, [
      { name: 'Directory', key: 'fileDir' },
      { name: 'Base size', key: 'baseSize' }
    ]),

    details: [
      { name: 'File name', key: 'fileName' },
      { name: 'Directory', key: 'fileDir' },
      { name: 'Base size', key: 'baseSize' }
    ],

    assets: viewerAssets
  };
};

module.exports = ViewerBuilder;
