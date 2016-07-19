'use strict';

var _ = require('lodash');

var ERROR_PREFIX = 'ember-svg-jar: ';
var VALID_STRATEGIES = ['inline', 'symbol'];

function validateStrategy(options) {
  var strategy = options.strategy;

  if (!(_.isString(strategy) || _.isArray(strategy))) {
    return 'Invalid strategy value. It must be a string or an array.';
  }

  var isInvalid = _.castArray(strategy).some(function(strategy) {
    return VALID_STRATEGIES.indexOf(strategy) === -1;
  });

  if (isInvalid) {
    return (
      'Invalid strategy found. Valid options are ' +
      VALID_STRATEGIES.join(', ') +
      '.'
    );
  }
}

function validateOptions(options) {
  var validators = [
    validateStrategy
  ];

  validators.forEach(function(validate) {
    var error = validate(options);

    if (error) {
      throw new Error(ERROR_PREFIX + error);
    }
  });
}

module.exports = validateOptions;
