const path = require('path');
const _ = require('lodash');
const fp = require('lodash/fp');

function ensurePosix(filePath) {
  return path.sep !== '/' ? filePath.split(path.sep).join('/') : filePath;
}

function stripExtension(filePath) {
  return filePath.replace(/\.[^/.]+$/, '');
}

function filePathsOnlyFor(paths) {
  return _.uniq(paths).filter((filePath) => {
    let isDirectory = filePath.charAt(filePath.length - 1) === path.sep;
    return !isDirectory;
  });
}

function makeAssetId(relativePath, stripDirs, idGen) {
  return fp.pipe(
    ensurePosix,
    (idGenPath) => (stripDirs ? path.basename(idGenPath) : idGenPath),
    stripExtension,
    idGen
  )(relativePath);
}

function relativePathFor(filePath, inputPath) {
  return filePath.replace(`${inputPath}${path.sep}`, '');
}

module.exports = {
  ensurePosix,
  stripExtension,
  filePathsOnlyFor,
  makeAssetId,
  relativePathFor
};
