const path = require('path');

function symbolIdGen(filePath, options = {}) {
  let assetId = (options.stripPath ? path.basename(filePath) : filePath)
    .replace(/[\s]/g, '-');
  return `${options.prefix}${assetId}`;
}

function symbolCopypastaGen(assetId) {
  return `{{svg-jar "#${assetId}"}}`;
}

function inlineIdGen(filePath, options = {}) {
  return options.stripPath ? path.basename(filePath) : filePath;
}

function inlineCopypastaGen(assetId) {
  return `{{svg-jar "${assetId}"}}`;
}

module.exports = {
  symbolIdGen,
  symbolCopypastaGen,
  inlineIdGen,
  inlineCopypastaGen
};
