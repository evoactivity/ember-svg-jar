'use strict';

module.exports = {
  extends: [
    'airbnb-base',
    '../eslint-rules.js'
  ],

  env: {
    browser: false,
    node: true,
    mocha: true
  },

  parserOptions: {
    sourceType: 'script',
    ecmaVersion: 2018
  },

  rules: {
    'no-param-reassign': 0,
    'object-shorthand': 0,
    'no-unused-expressions': 'off'
  }
};
