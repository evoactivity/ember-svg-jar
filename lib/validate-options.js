'use strict';

const _ = require('lodash');

const VALID_STRATEGIES = ['inline', 'symbol'];

function validateStrategy(options) {
  const strategyOpt = options.strategy;

  if (!(_.isString(strategyOpt) || _.isArray(strategyOpt))) {
    return 'Invalid strategy value. It must be a string or an array.';
  }

  const isInvalid = _
    .castArray(strategyOpt)
    .some((strategy) => VALID_STRATEGIES.indexOf(strategy) === -1);

  if (isInvalid) {
    const validOptions = VALID_STRATEGIES.join(', ');
    return `Invalid strategy found. Valid options are ${validOptions}.`;
  }
}

module.exports = function validateOptions(options) {
  const validators = [
    validateStrategy
  ];

  validators.forEach((validate) => {
    const error = validate(options);

    if (error) {
      throw new Error(`ember-svg-jar: ${error}`);
    }
  });
};
