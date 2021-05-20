'use strict';

const fs = require('fs');
const mkdirp = require('mkdirp');
const cheerio = require('cheerio');
const path = require('path-posix');
const osPathSep = require('path').sep;
const _ = require('lodash');
const fp = require('lodash/fp');

const isPosixOS = osPathSep === '/';

function toPosixPath(filePath) {
  return !isPosixOS ? filePath.split(osPathSep).join('/') : filePath;
}

function stripExtension(filePath) {
  return filePath.replace(/\.[^/.]+$/, '');
}

function relativePathFor(filePath, inputPath) {
  return filePath.replace(`${inputPath}${path.sep}`, '');
}

function makeIDForPath(relativePath, { idGen, stripPath, prefix }) {
  return fp.pipe(
    (relative) => (stripPath ? path.basename(relative) : relative),
    stripExtension,
    (normalizedPath) => idGen(normalizedPath, { prefix })
  )(relativePath);
}

function svgDataFor(svgContent) {
  let $svg = cheerio.load(svgContent, { xmlMode: true })('svg');

  return {
    content: $svg.html(),
    attrs: $svg.attr()
  };
}

const readFile = _.partial(fs.readFileSync, _, 'UTF-8');

function saveToFile(filePath, fileContents) {
  mkdirp.sync(path.dirname(filePath));
  fs.writeFileSync(filePath, fileContents);
}

module.exports = {
  makeIDForPath,
  relativePathFor,
  svgDataFor,
  readFile,
  saveToFile,
  toPosixPath
};
