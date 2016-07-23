const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const CachingWriter = require('broccoli-caching-writer');
const mkdirp = require('mkdirp');

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
  let viewerContent = JSON.stringify(this.getViewerModel());
  let outputFilePath = path.join(this.outputPath, this.options.outputFile);
  mkdirp.sync(path.dirname(outputFilePath));
  fs.writeFileSync(outputFilePath, viewerContent);
};

ViewerBuilder.prototype.getViewerModel = function() {
  let assets = this.listFiles().reduce(function(assets, filePath) {
    return assets.concat(JSON.parse(fs.readFileSync(filePath, 'UTF-8')));
  }, []);

  let searchKeys = ['fileName', 'fileDir'];

  let sortBy = [
    { name: 'File name', key: 'fileName' },
    { name: 'Base size', key: 'svg.height' }
  ];

  let arrangeBy = [
    { name: 'Directory', key: 'fileDir' },
    { name: 'Base size', key: 'baseSize' }
  ];

  let filterBy = [
    { name: 'Directory', key: 'fileDir' },
    { name: 'Base size', key: 'baseSize' }
  ];

  if (this.options.hasManyStrategies) {
    filterBy.push({ name: 'Base strategy', key: 'strategy' });
  }

  let details = [
    { name: 'File name', key: 'fileName' },
    { name: 'Directory', key: 'fileDir' },
    { name: 'File size', key: 'fileSize'},
    { name: 'Strategy', key: 'strategy' },
    { name: 'Base size', key: 'baseSize' }
  ];

  return {
    assets: assets,
    searchKeys: searchKeys,
    sortBy: sortBy,
    arrangeBy: arrangeBy,
    filters: filtersFor(assets, filterBy),
    details: details
  };
};

module.exports = ViewerBuilder;
