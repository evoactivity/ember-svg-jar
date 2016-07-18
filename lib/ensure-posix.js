'use strict';

var path = require('path');

function ensurePosix(filePath) {
  if (path.sep !== '/') {
    return filePath.split(path.sep).join('/');
  }
  return filePath;
}

module.exports = ensurePosix;
