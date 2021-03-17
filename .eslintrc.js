'use strict';

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true
    }
  },
  plugins: [
    'ember'
  ],
  extends: [
    'airbnb-base',
    'eslint:recommended',
    'plugin:ember/recommended',
    './eslint-rules.js'
  ],
  env: {
    browser: true,
    node: false,
    amd: true,
  },
  rules: {},
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

      env: {
        browser: false,
        node: true,
      },
      plugins: ['node'],
      extends: ['plugin:node/recommended']
    }
  ]
};
