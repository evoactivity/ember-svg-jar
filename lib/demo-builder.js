'use strict';

var CachingWriter = require('broccoli-caching-writer');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var mkdirp = require('mkdirp');
var cheerio = require('cheerio');
var utils = require('./utils');
var ensurePosix = utils.ensurePosix;
var assetKeyFor = utils.assetKeyFor;

function svgDataFor(svgString) {
  var $svg = cheerio.load(svgString, { xmlMode: true })('svg');
  var viewBox = $svg.attr('viewBox');
  var viewBoxValues = viewBox.split(/\s+/);

  return {
    content: $svg.html(),
    viewBox: viewBox,
    width: $svg.attr('width') || viewBoxValues[2],
    height: $svg.attr('height') || viewBoxValues[3]
  };
}

function filterItemsFor(assets, key) {
  return _
    .chain(assets)
    .map(key)
    .without(undefined)
    .countBy()
    .toPairs()
    .map(function(pair) {
      return { name: pair[0], count: pair[1] };
    })
    .sortBy('name')
    .value();
}

function filtersFor(assets, filters) {
  return filters.map(function(filter) {
    return {
      name: filter.name,
      key: filter.key,
      items: filterItemsFor(assets, filter.key)
    };
  });
}

/**
  All options:
  - outputFile
  - strategy
  - symbolsPrefix
  - trimPath
*/
function DemoBuilder(inputNode, options) {
  if (!options || !options.outputFile) {
    throw new Error('the outputFile option is required');
  }

  CachingWriter.call(this, [inputNode], {
    name: 'DemoBuilder',
    annotation: options.annotation,
  });

  this.options = options;
}

DemoBuilder.prototype = Object.create(CachingWriter.prototype);
DemoBuilder.prototype.constructor = DemoBuilder;

DemoBuilder.prototype.build = function() {
  var demoContent = JSON.stringify(this.getDemoModel());
  var outputFilePath = path.join(this.outputPath, this.options.outputFile);
  mkdirp.sync(path.dirname(outputFilePath));
  fs.writeFileSync(outputFilePath, demoContent);
};

DemoBuilder.prototype.getFilePaths = function() {
  var posixFilePaths = this.listFiles().map(ensurePosix);

  return _.uniq(posixFilePaths).filter(function(filePath) {
    // files returned from this.listFiles are directories if they end in /
    var isDirectory = filePath.charAt(filePath.length - 1) === '/';
    return !isDirectory;
  });
};

DemoBuilder.prototype.getDemoModel = function() {
  var inputPath = this.inputPaths[0];
  var posixInputPath = ensurePosix(inputPath);
  var demoAssets = [];
  var strategy = this.options.strategy;
  var symbolsPrefix = this.options.symbolsPrefix;
  var trimPath = this.options.trimPath;

  this.getFilePaths().forEach(function(posixFilePath) {
    var relativePath = posixFilePath.replace(posixInputPath + '/', '');
    var filePath = path.join(inputPath, relativePath);
    var svgString = fs.readFileSync(filePath, 'UTF-8');
    var fileName = path.basename(relativePath);
    var fileDir = '/' + relativePath.replace(fileName, '');
    var svgData = svgDataFor(svgString);
    var assetKey = assetKeyFor(relativePath, {
      strategy: strategy,
      prefix: symbolsPrefix,
      trimPath: trimPath
    });

    demoAssets.push({
      svg: svgData,
      copypasta: '{{svg-jar "' + assetKey + '"}}',
      fileName: fileName,
      fileDir: fileDir,
      baseSize: svgData.height + 'px'
    });
  });

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

    filters: filtersFor(demoAssets, [
      { name: 'Directory', key: 'fileDir' },
      { name: 'Base size', key: 'baseSize' }
    ]),

    details: [
      { name: 'File name', key: 'fileName' },
      { name: 'Directory', key: 'fileDir' },
      { name: 'Base size', key: 'baseSize' }
    ],

    assets: demoAssets
  };
};

module.exports = DemoBuilder;
