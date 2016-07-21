'use strict';

var path = require('path');

function ensurePosix(filePath) {
  if (path.sep !== '/') {
    return filePath.split(path.sep).join('/');
  }
  return filePath;
}

function stripExtension(filePath) {
  return filePath.replace(/\.[^/.]+$/, '');
}

module.exports = {
  ensurePosix: ensurePosix,
  stripExtension: stripExtension
};
