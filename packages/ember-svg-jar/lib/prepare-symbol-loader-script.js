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

  // QUnit copies #qunit-fixture, which holds #ember-testing, after the page
  // load event and restores that copy before each test. Tests load the
  // symbols synchronously so they are in the copy, instead of arriving
  // mid-run and being removed at the next test.
  const symbolsAsync = isTestEnv ? 'false' : 'true';

  return symbolsLoaderScript
    .replace('{{SYMBOLS_URL}}', toPosixPath(symbolsUrl))
    .replace('{{SYMBOLS_ASYNC}}', symbolsAsync)
    .replaceAll('{{SYMBOLS_SELECTOR}}', symbolsSelector);
};
