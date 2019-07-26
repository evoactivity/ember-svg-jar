// It's useful for svgo package upgrade to see breaking changes.

'use strict';

/* eslint-disable-next-line node/no-unsupported-features/node-builtins */
const fs = require('fs').promises;
const path = require('path');
const { EOL } = require('os');
const SVGO = require('svgo');
const chai = require('chai');

const { expect } = chai;

const regEOL = new RegExp(EOL, 'g');
const regFilename = /^(.*)\.(\d+)\.svg$/;

function normalize(data) {
  return data.trim().replace(regEOL, '\n');
}

// Check if all SVGO plugins work as expected to find breaking changes.
describe('plugins tests', async () => {
  const fixturesDir = `${__dirname}/fixtures/plugins`;
  const svgPaths = await fs.readdir(fixturesDir);

  svgPaths.forEach((svgPath) => {
    let fullFilepath = path.resolve(fixturesDir, svgPath);
    let [, pluginName, testIndex] = svgPath.match(regFilename) || [];

    if (!pluginName) {
      return;
    }

    it(`${pluginName}.${testIndex}`, async () => {
      const fileContent = await fs.readFile(fullFilepath, { encoding: 'utf8' });
      let [originalSVG, expectedSVG, pluginParams] = normalize(fileContent).split(/\s*@@@\s*/);
      let pluginConfig = {};

      pluginConfig[pluginName] = (pluginParams) ? JSON.parse(pluginParams) : true;

      let svgo = new SVGO({
        full: true,
        plugins: [pluginConfig],
        js2svg: { pretty: true }
      });

      let { data: actualSVG } = await svgo.optimize(originalSVG, { path: fullFilepath });
      expect(normalize(actualSVG)).to.equal(expectedSVG);
    });
  });
});
