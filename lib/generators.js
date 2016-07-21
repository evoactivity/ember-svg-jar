'use strict';

var path = require('path');

function symbolIDGen(filePath, options) {
  var assetID = options.stripPath ? path.basename(filePath) : filePath;
  return options.prefix + assetID.replace(/[\s]/g, '-');
}

function symbolCopypastaGen(assetID) {
  return '{{svg-jar "#' + assetID + '"}}';
}

function inlineIDGen(filePath, options) {
  options = options || {};
  return options.stripPath ? path.basename(filePath) : filePath;
}

function inlineCopypastaGen(assetID) {
  return '{{svg-jar "' + assetID + '"}}';
}

module.exports = {
  symbolIDGen: symbolIDGen,
  symbolCopypastaGen: symbolCopypastaGen,
  inlineIDGen: inlineIDGen,
  inlineCopypastaGen: inlineCopypastaGen
};
