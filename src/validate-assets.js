const _ = require('lodash');

function checkForDuplicates(assets) {
  let duplicateIds = _(assets)
    .map('id')
    .countBy()
    .pickBy((value) => value > 1)
    .keys()
    .value();

  if (!duplicateIds.length) {
    return;
  }

  let invalidAssets = _.flatMap(duplicateIds, (id) => _.filter(assets, { id }));
  return ['Duplicate IDs found:']
    .concat(invalidAssets.map((asset) => `ID: "${asset.id}" Path: ${asset.relativePath}`))
    .join('\n');
}

function validateViewBox(assets) {
  let invalidAssets = _.filter(assets, (asset) => (
    _.isUndefined(asset.svgData.attrs.viewBox)
  ));

  if (!invalidAssets.length) {
    return;
  }

  return ['SVG files without viewBox found:']
    .concat(invalidAssets.map((asset) => `Path: ${asset.relativePath}`))
    .join('\n');
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
