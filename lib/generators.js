'use strict';

var path = require('path');

function symbolIDGen(filePath, options) {
  return options.prefix + path.basename(filePath)
    .replace(/\.[^/.]+$/, '')
    .replace(/[\s]/g, '-');
}

function symbolCopypastaGen(assetID) {
  return '{{svg-jar "#' + assetID + '"}}';
}

function inlineIDGen(filePath) {
  return filePath
    .replace(/\.[^/.]+$/, '')
    .replace(/\./g, '-');
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
