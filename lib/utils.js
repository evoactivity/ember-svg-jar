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

function svgDataFor(svgContent, options = { xmlMode: true }) {
  let $svg = cheerio.load(svgContent, options)('svg');
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

function generateComponentName(
  identifier
) {
  let id = identifier.replace(/_\s*$/, '')
    .replace(/\./g, '')
    .trim();
  const dashCase = id.replace(/^([A-Z])|[\s_](\w)/g, function(match, p1, p2) {
    if (p2) return `-${p2}`;
    return p1;
  }).toLowerCase();

  const pascalCase = dashCase
    .replace(/(\w)(\w*)/g, function(_, g1, g2) {
      return `${g1.toUpperCase()}${g2.toLowerCase()}`;
    })
    .replace(/\//g, '::')
    .replace(/-/g, '');

  return {
    original: id,
    dashCase,
    pascalCase
  };
}

module.exports = {
  makeIDForPath,
  relativePathFor,
  svgDataFor,
  readFile,
  saveToFile,
  toPosixPath,
  generateComponentName
};
