const path = require('path');
const _ = require('lodash');

function ensurePosix(filePath) {
  if (path.sep !== '/') {
    return filePath.split(path.sep).join('/');
  }
  return filePath;
}

function stripExtension(filePath) {
  return filePath.replace(/\.[^/.]+$/, '');
}

function checkForDuplicates(items, strategy, ui) {
  let duplicateIds = _
    .chain(items)
    .map('id')
    .countBy()
    .pickBy(function(value) { return value > 1; })
    .keys()
    .value();

  if (!duplicateIds.length) {
    return;
  }

  ui.writeWarnLine(
    '[ember-svg-jar] Duplicate IDs found for ' + strategy.toUpperCase() + ' strategy!'
  );

  duplicateIds.forEach(function(id) {
    _.filter(items, { id: id }).forEach(function(item) {
      ui.writeWarnLine('ID: "' + item.id + '" PATH: ' + item.path, false, false);
    });
  });

  ui.write('\n');
}

module.exports = {
  ensurePosix: ensurePosix,
  stripExtension: stripExtension,
  checkForDuplicates: checkForDuplicates
};
