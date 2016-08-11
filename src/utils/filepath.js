const path = require('path');
const _ = require('lodash');

function ensurePosix(filePath) {
  return path.sep !== '/' ? filePath.split(path.sep).join('/') : filePath;
}

function stripExtension(filePath) {
  return filePath.replace(/\.[^/.]+$/, '');
}

function idGenPathFor(filePath, inputPath, stripPath) {
  let relativePath = ensurePosix(
    filePath.replace(`${inputPath}${path.sep}`, '')
  );

  return stripExtension(stripPath ? path.basename(relativePath) : relativePath);
}

function filePathsOnlyFor(paths) {
  return _.uniq(paths).filter((filePath) => {
    let isDirectory = filePath.charAt(filePath.length - 1) === path.sep;
    return !isDirectory;
  });
}

module.exports = {
  ensurePosix,
  stripExtension,
  idGenPathFor,
  filePathsOnlyFor
};
