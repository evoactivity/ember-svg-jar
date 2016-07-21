'use strict';

var path = require('path');

function symbolIdGen(filePath, options) {
  var assetId = options.stripPath ? path.basename(filePath) : filePath;
  return options.prefix + assetId.replace(/[\s]/g, '-');
}

function symbolCopypastaGen(assetId) {
  return '{{svg-jar "#' + assetId + '"}}';
}

function inlineIdGen(filePath, options) {
  options = options || {};
  return options.stripPath ? path.basename(filePath) : filePath;
}

function inlineCopypastaGen(assetId) {
  return '{{svg-jar "' + assetId + '"}}';
}

module.exports = {
  symbolIdGen: symbolIdGen,
  symbolCopypastaGen: symbolCopypastaGen,
  inlineIdGen: inlineIdGen,
  inlineCopypastaGen: inlineCopypastaGen
};
