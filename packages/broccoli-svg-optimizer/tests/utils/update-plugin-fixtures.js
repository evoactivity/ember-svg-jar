/* Run the script after svgo package upgrade */

'use strict';

const fs = require('fs');
const path = require('path');
const { EOL } = require('os');
const fp = require('lodash/fp');
const SVGO = require('svgo');

const svgo = new SVGO({
  full: true,
  plugins: [],
  js2svg: { pretty: true }
});

const fixturesDir = `${__dirname}/../fixtures/plugins/default-config`;
const regEOL = new RegExp(EOL, 'g');

function normalize(svg) {
  return svg.trim().replace(regEOL, '\n');
}

function optimize(originalSVG, filepath) {
  return new Promise((resolve, reject) => {
    svgo.optimize(originalSVG, (result) => {
      if (result.error) {
        reject(result.error);
      } else {
        resolve([filepath, originalSVG, result.data]);
      }
    });
  });
}

const filenameToOptimizedSVGPromise = fp.pipe(
  (filename) => path.resolve(fixturesDir, filename),
  (filepath) => [filepath, fs.readFileSync(filepath, 'utf8')],
  ([filepath, content]) => [filepath, normalize(content).split(/\s*@@@\s*/)[0]],
  ([filepath, originalSVG]) => optimize(originalSVG, filepath)
);

let optimizedSVGPromises = fp.pipe(
  fs.readdirSync,
  fp.filter((filename) => filename.includes('.svg')),
  fp.map(filenameToOptimizedSVGPromise)
)(fixturesDir);

Promise.all(optimizedSVGPromises).then((svgDataItems) => {
  svgDataItems.forEach(([filepath, originalSVG, optimizedSVG]) => {
    let fileContent = fp.pipe(
      fp.map((svg) => normalize(svg)),
      fp.join('\n@@@\n')
    )([originalSVG, optimizedSVG]);

    fs.writeFileSync(filepath, fileContent);
  });
});
