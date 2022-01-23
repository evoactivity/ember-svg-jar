const fs = require('fs');
const path = require('path');
const { toPosixPath } = require('./utils');

const symbolsLoaderScript = fs.readFileSync(
  path.join(__dirname, '../symbols-loader.html'),
  'utf8'
);

module.exports = function prepareSymbolLoaderScript(
  rootURL,
  outputFile,
  isTestEnv
) {
  const symbolsUrl = path.join(rootURL, outputFile);
  const symbolsSelector = isTestEnv ? '#ember-testing' : 'body';

  return symbolsLoaderScript
    .replace('{{SYMBOLS_URL}}', toPosixPath(symbolsUrl))
    .replace('{{SYMBOLS_SELECTOR}}', symbolsSelector);
};
