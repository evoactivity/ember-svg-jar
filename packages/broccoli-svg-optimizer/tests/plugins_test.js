'use strict';

// It's useful for svgo package upgrade to see breaking changes.

const fs = require('fs');
const path = require('path');
const EOL = require('os').EOL;
const SVGO = require('svgo');
const chai = require('chai');

const expect = chai.expect;
const regEOL = new RegExp(EOL, 'g');
const regFilename = /^(.*)\.(\d+)\.svg$/;

let fixturesDir = `${__dirname}/fixtures/plugins/all-active`;

function normalize(svg) {
  return svg.trim().replace(regEOL, '\n');
}

// Check if all SVGO plugins work as expected to get ready for breaking changes.
describe('plugins: all active tests', () => {
  fs.readdirSync(fixturesDir).forEach((svgFilename) => {
    let match = svgFilename.match(regFilename);

    if (!match) {
      return;
    }

    let pluginName = match[1];
    let testIndex = match[2];
    let fullFilepath = path.resolve(fixturesDir, svgFilename);

    it(`${pluginName}.${testIndex}`, (done) => {
      fs.readFile(fullFilepath, 'utf8', (err, data) => {
        let splitted = normalize(data).split(/\s*@@@\s*/);
        let originalSVG = splitted[0];
        let expectedSVG = splitted[1];
        let pluginParams = splitted[2];
        let pluginConfig = {};

        pluginConfig[pluginName] = (pluginParams) ? JSON.parse(pluginParams) : true;

        let svgo = new SVGO({
          full: true,
          plugins: [pluginConfig],
          js2svg: { pretty: true }
        });

        svgo.optimize(originalSVG, (result) => {
          expect(normalize(result.data)).to.equal(expectedSVG);
          done();
        });
      });
    });
  });
});

fixturesDir = `${__dirname}/fixtures/plugins/default-config`;

// Check if any default SVGO plugin settings are changed to get ready for breaking changes.
describe('plugins: default config test', () => {
  fs.readdirSync(fixturesDir).forEach((svgFilename) => {
    let match = svgFilename.match(regFilename);

    if (!match) {
      return;
    }

    let pluginName = match[1];
    let testIndex = match[2];
    let fullFilepath = path.resolve(fixturesDir, svgFilename);

    it(`${pluginName}.${testIndex}`, (done) => {
      fs.readFile(fullFilepath, 'utf8', (err, data) => {
        let splitted = normalize(data).split(/\s*@@@\s*/);
        let originalSVG = splitted[0];
        let expectedSVG = splitted[1];

        let svgo = new SVGO({
          full: true,
          js2svg: { pretty: true },
          plugins: []
        });

        svgo.optimize(originalSVG, (result) => {
          expect(normalize(result.data)).to.equal(expectedSVG);
          done();
        });
      });
    });
  });
});
