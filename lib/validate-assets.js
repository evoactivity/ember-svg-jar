'use strict';

const _ = require('lodash');
const consoleUI = require('./console-ui');

function checkForDuplicates(items) {
  let duplicateIds = _(items)
    .map('id')
    .countBy()
    .pickBy((value) => value > 1)
    .keys()
    .value();

  if (!duplicateIds.length) {
    return;
  }

  let invalidItems = _.flatMap(duplicateIds, (id) => _.filter(items, { id }));
  return ['Duplicate IDs found:']
    .concat(invalidItems.map(({ id, relativePath }) => `ID: "${id}" Relative Path: ${relativePath}`))
    .join('\n');
}

function validateViewBox(items) {
  let invalidItems = items.filter(({ asset }) => !asset.svg.includes('viewBox'));

  if (!invalidItems.length) {
    return;
  }

  return ['SVG files without viewBox found:']
    .concat(invalidItems.map(({ relativePath }) => `Relative Path: ${relativePath}`))
    .join('\n');
}

module.exports = function validateAssets(items, validationConfig = {}, strategy) {
  let validators = [];

  if (validationConfig.checkForDuplicates) {
    validators.push(checkForDuplicates);
  }

  if (validationConfig.validateViewBox) {
    validators.push(validateViewBox);
  }

  validators.forEach((validate) => {
    let message = validate(items);

    if (message) {
      consoleUI.warn(`${strategy} ${message}`);
    }
  });
};
