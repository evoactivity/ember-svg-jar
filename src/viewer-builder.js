const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const CachingWriter = require('broccoli-caching-writer');
const mkdirp = require('mkdirp');

function filtersFor(assets, filters) {
  return filters.map((filter) => (
    {
      name: filter.name,
      key: filter.key,
      items: _
        .chain(assets)
        .map(filter.key)
        .without(undefined)
        .countBy()
        .toPairs()
        .map(([name, count]) => ({ name, count }))
        .sortBy('name')
        .value()
    }
  ));
}

function ViewerBuilder(inputNode, options = {}) {
  if (!options.outputFile) {
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
  let assets = this.listFiles().reduce((items, filePath) => (
    items.concat(JSON.parse(fs.readFileSync(filePath, 'UTF-8')))
  ), []);

  let details = [
    { name: 'File name', key: 'fileName' },
    { name: 'Directory', key: 'fileDir' },
    { name: 'File size', key: 'fileSize' },
    { name: 'Strategy', key: 'strategy' },
    { name: 'Base size', key: 'baseSize' }
  ];

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

  return {
    assets,
    details,
    searchKeys,
    sortBy,
    arrangeBy,
    filters: filtersFor(assets, filterBy)
  };
};

module.exports = ViewerBuilder;
