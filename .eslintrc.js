'use strict';

const eslintNodePlugin = require('eslint-plugin-node');

module.exports = {
  root: true,

  plugins: ['ember'],

  extends: ['airbnb-base', 'plugin:ember/recommended', './eslint-rules.js'],

  env: {
    browser: true,
    node: false,
    amd: true,
  },

  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
  },

  rules: {
    // add your custom rules here
  },

  overrides: [
    // for Ember node files
    {
      files: [
        'eslint-rules.js',
        '.eslintrc.js',
        '.template-lintrc.js',
        'index.js',
        'testem.js',
        'ember-cli-build.js',
        'config/**/*.js',
        'tests/dummy/config/**/*.js',
      ],

      excludedFiles: ['lib/**', 'app/**', 'addon/**', 'tests/dummy/app/**'],

      plugins: ['node'],

      env: {
        browser: false,
        node: true,
      },

      parserOptions: {
        sourceType: 'script',
        ecmaVersion: 2018,
      },

      rules: Object.assign({}, eslintNodePlugin.configs.recommended.rules, {
        'quote-props': 0,
      }),
    },
  ],
};
