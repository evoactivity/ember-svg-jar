'use strict';

module.exports = {
  plugins: [
    'node'
  ],

  extends: [
    'airbnb-base',
    'plugin:node/recommended',
    '../eslint-rules.js'
  ],

  rules: {
    'node/no-unpublished-require': 'off'
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
