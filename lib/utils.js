'use strict';

var path = require('path');

function ensurePosix(filePath) {
  if (path.sep !== '/') {
    return filePath.split(path.sep).join('/');
  }
  return filePath;
}

function assetKeyFor(filePath, options) {
  var assetKey;

  if (options.strategy === 'inline') {
    assetKey = (options.trimPath ? path.basename(filePath) : filePath)
      .replace(/\.[^/.]+$/, '')  // remove extension
      .replace(/\./g, '-');
  }

  if (options.strategy === 'symbol') {
    assetKey = path.basename(filePath)
      .replace(/\.[^/.]+$/, '')  // remove extension
      .replace(/[\s]/g, '-');

    assetKey = '#' + options.prefix + assetKey;
  }

  return assetKey;
}

module.exports = {
  ensurePosix: ensurePosix,
  assetKeyFor: assetKeyFor
};
