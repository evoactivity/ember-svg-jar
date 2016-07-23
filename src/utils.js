const path = require('path');
const _ = require('lodash');

function ensurePosix(filePath) {
  return path.sep !== '/' ? filePath.split(path.sep).join('/') : filePath;
}

function stripExtension(filePath) {
  return filePath.replace(/\.[^/.]+$/, '');
}

function checkForDuplicates(items, strategy, ui) {
  let duplicateIds = _
    .chain(items)
    .map('id')
    .countBy()
    .pickBy((value) => value > 1)
    .keys()
    .value();

  if (!duplicateIds.length) {
    return;
  }

  ui.write('\n');
  ui.writeWarnLine(
    `[ember-svg-jar] Duplicate IDs found for ${strategy.toUpperCase()} strategy!`
  );

  duplicateIds.forEach((id) => {
    _.filter(items, { id }).forEach((item) => (
      ui.writeWarnLine(`ID: "${item.id}" PATH: ${item.path}`, false, false)
    ));
  });
}

module.exports = {
  ensurePosix,
  stripExtension,
  checkForDuplicates
};
