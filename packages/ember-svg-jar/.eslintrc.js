'use strict';

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true,
    },
  },
  plugins: ['ember', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended',
    'plugin:prettier/recommended',
  ],
  env: {
    browser: true,
    node: false,
    amd: true,
  },
  rules: {
    'prettier/prettier': 'error',
  },
  overrides: [
    // for Ember node files
    {
      files: [
        './.eslintrc.js',
        './.prettierrc.js',
        './.template-lintrc.js',
        './index.js',
        './testem.js',
        './ember-cli-build.js',
        './config/**/*.js',
        './tests/dummy/config/**/*.js',
      ],
      env: {
        browser: false,
        node: true,
      },
      plugins: ['node'],
      extends: ['plugin:node/recommended'],
    },
    // node-tests
    {
      files: './node-tests/**/*.js',
      env: {
        browser: false,
        node: true,
        mocha: true,
      },
      parserOptions: {
        sourceType: 'script',
        ecmaVersion: 2018,
      },
      rules: {
        'no-param-reassign': 0,
        'object-shorthand': 0,
        'no-unused-expressions': 'off',
      },
    },
    // lib
    {
      files: './lib/**/*.js',
      plugins: ['node'],
      extends: ['plugin:node/recommended'],
      rules: {
        'node/no-unpublished-require': 'off',
        'no-shadow': 'off',
      },
      env: {
        browser: false,
        node: true,
      },
      parserOptions: {
        sourceType: 'script',
        ecmaVersion: 2015,
      },
    },
    {
      // Ember Test files:
      files: ['tests/**/*-test.{js,ts}'],
      extends: ['plugin:qunit/recommended'],
    },
  ],
};
