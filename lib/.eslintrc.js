'use strict';

module.exports = {
  plugins: [
    'node'
  ],

  extends: [
    'plugin:node/recommended',
  ],

  rules: {
    'node/no-unpublished-require': 'off',
    'no-shadow': 'off'
  },

  env: {
    browser: false,
    node: true
  },

  parserOptions: {
    sourceType: 'script',
    ecmaVersion: 2015
  }
};
