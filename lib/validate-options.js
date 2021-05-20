'use strict';

const _ = require('lodash');
const consoleUI = require('./console-ui');

const VALID_STRATEGIES = ['inline', 'symbol'];

function formatMessage(message) {
  return `(options validation) ${message}`;
}

function validateStrategy({ strategy: strategyOpt }) {
  if (strategyOpt === undefined) {
    return;
  }

  let isInvalidType = !(_.isString(strategyOpt) || _.isArray(strategyOpt));

  if (isInvalidType) {
    return {
      message: '`strategy` option must be a string or an array.',
      isError: true
    };
  }

  let isInvalidValue = _
    .castArray(strategyOpt)
    .some((strategy) => VALID_STRATEGIES.indexOf(strategy) === -1);

  if (isInvalidValue) {
    let validOptions = VALID_STRATEGIES.join(', ');
    return {
      message: `Invalid strategy found. Valid options are ${validOptions}.`,
      isError: true
    };
  }
}

function validateOptionNames(customOpts, defaultOpts) {
  let invalidOptions = Object.keys(customOpts)
    .filter((key) => defaultOpts[key] === undefined)
    .join(', ');

  if (invalidOptions) {
    return { message: `Invalid options found: ${invalidOptions}` };
  }
}

module.exports = function validateOptions(defaultOpts, customOpts) {
  let validators = [
    validateOptionNames,
    validateStrategy
  ];

  validators.forEach((validate) => {
    let result = validate(customOpts, defaultOpts);

    if (!result) {
      return;
    }

    if (result.isError) {
      consoleUI.error(formatMessage(result.message));
    } else {
      consoleUI.warn(formatMessage(result.message));
    }
  });
};
