const _ = require('lodash');

function checkForDuplicates(assets) {
  let messages = [];
  let duplicateIds = _
    .chain(assets)
    .map('id')
    .countBy()
    .pickBy((value) => value > 1)
    .keys()
    .value();

  if (!duplicateIds.length) {
    return;
  }

  messages.push('Duplicate IDs found:');
  duplicateIds.forEach((id) => {
    _.filter(assets, { id }).forEach((asset) => (
      messages.push(`ID: "${asset.id}" Path: ${asset.path}`)
    ));
  });

  return messages.join('\n');
}

function validateViewBox(assets) {
  let messages = [];
  let invalidAssets = _.filter(assets, (asset) => _.isUndefined(asset.viewBox));

  if (!invalidAssets.length) {
    return;
  }

  messages.push('SVG files without viewBox found:');
  invalidAssets.forEach((asset) => (
    messages.push(`Path: ${asset.path}`)
  ));

  return messages.join('\n');
}

module.exports = function validateAssets(assets, strategy, ui) {
  let validators = [
    checkForDuplicates,
    validateViewBox
  ];

  validators.forEach((validate) => {
    let message = validate(assets);

    if (message) {
      ui.write('\n');
      ui.writeWarnLine(`[ember-svg-jar][${strategy}] ${message}`);
    }
  });
};
