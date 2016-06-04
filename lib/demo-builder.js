'use strict';

var CachingWriter = require('broccoli-caching-writer');
var path = require('path');
var fs = require('fs');
var uniq = require('lodash.uniq');
var mkdirp = require('mkdirp');
var Handlebars = require('handlebars');

var demoTemplate = Handlebars.compile(
  fs.readFileSync(path.join(__dirname, 'demo.hbs'), 'utf8')
);

function ensurePosix(filePath) {
  if (path.sep !== '/') {
    return filePath.split(path.sep).join('/');
  }
  return filePath;
}

function DemoBuilder(inputNode, options) {
  if (!options || !options.outputFile) {
    throw new Error('the outputFile option is required');
  }

  CachingWriter.call(this, [inputNode], {
    name: 'DemoBuilder',
    annotation: options.annotation,
  });

  /**
    All options:
    - outputFile,
    - strategy,
    - symbolsPrefix
  */
  this.options = options;
}

DemoBuilder.prototype = Object.create(CachingWriter.prototype);
DemoBuilder.prototype.constructor = DemoBuilder;

DemoBuilder.prototype.build = function() {
  var demoContent = demoTemplate(this.getDemoContext());
  var outputFilePath = path.join(this.outputPath, this.options.outputFile);
  mkdirp.sync(path.dirname(outputFilePath));
  fs.writeFileSync(outputFilePath, demoContent);
};

DemoBuilder.prototype.getFilePaths = function() {
  var posixFilePaths = this.listFiles().map(ensurePosix);

  return uniq(posixFilePaths).filter(function(filePath) {
    // files returned from this.listFiles are directories if they end in /
    var isDirectory = filePath.charAt(filePath.length - 1) === '/';
    return !isDirectory;
  });
};

DemoBuilder.prototype.getDemoItemUsage = function(relativePath) {
  var svgName = relativePath.split('.')[0];

  if (this.options.strategy === 'symbol') {
    svgName = this.options.symbolsPrefix + path.basename(svgName);
  }

  return '{{svg-jar "' + svgName + '"}}';
};

DemoBuilder.prototype.getDemoContext = function() {
  var inputPath = this.inputPaths[0];
  var posixInputPath = ensurePosix(inputPath);
  var demoItems = [];
  var _this = this;

  this.getFilePaths().forEach(function(posixFilePath) {
    var relativePath = posixFilePath.replace(posixInputPath + '/', '');
    var filePath = path.join(inputPath, relativePath);

    demoItems.push({
      svg: fs.readFileSync(filePath, 'UTF-8'),
      usage: _this.getDemoItemUsage(relativePath)
    });
  });

  return { items: demoItems };
};

module.exports = DemoBuilder;
