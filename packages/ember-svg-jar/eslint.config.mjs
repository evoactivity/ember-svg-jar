import js from '@eslint/js';
import ember from 'eslint-plugin-ember/recommended';
import n from 'eslint-plugin-n';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import qunit from 'eslint-plugin-qunit';
import globals from 'globals';

// Files that run in Node with CommonJS.
const nodeFiles = [
  '.template-lintrc.js',
  'index.js',
  'testem.js',
  'ember-cli-build.js',
  'config/**/*.js',
  'tests/dummy/config/**/*.js',
];

const allNodeFiles = [
  ...nodeFiles,
  'lib/**/*.js',
  'node-tests/**/*.js',
  'eslint.config.mjs',
];

export default [
  {
    ignores: [
      'blueprints/*/files/',
      'vendor/',
      'public/',
      'dist/',
      'tmp/',
      'coverage/',
      '.*/',
      '.node_modules.ember-try/',
      '**/*.d.ts',
    ],
  },
  js.configs.recommended,
  ember.configs.base,
  prettierRecommended,
  {
    // ESLint 7 did not report these, and some are in test files.
    linterOptions: {
      reportUnusedDisableDirectives: 'off',
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      // ESLint 7 did not check caught errors by default.
      'no-unused-vars': ['error', { caughtErrors: 'none' }],
    },
  },
  {
    ignores: allNodeFiles,
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.amd,
      },
    },
  },
  {
    ...n.configs['flat/recommended-script'],
    files: nodeFiles,
    languageOptions: {
      sourceType: 'script',
      globals: globals.node,
    },
  },
  {
    files: ['node-tests/**/*.js'],
    languageOptions: {
      sourceType: 'script',
      ecmaVersion: 2018,
      globals: {
        ...globals.node,
        ...globals.mocha,
      },
    },
    rules: {
      'no-param-reassign': 'off',
      'object-shorthand': 'off',
      'no-unused-expressions': 'off',
    },
  },
  {
    ...n.configs['flat/recommended-script'],
    files: ['lib/**/*.js'],
    languageOptions: {
      sourceType: 'script',
      ecmaVersion: 2015,
      // lib/ requires the crypto module instead of using the global.
      globals: { ...globals.node, crypto: 'off' },
    },
    rules: {
      ...n.configs['flat/recommended-script'].rules,
      'n/no-unpublished-require': 'off',
      'no-shadow': 'off',
    },
  },
  {
    ...qunit.configs.recommended,
    files: ['tests/**/*-test.js'],
    // The qunit config lists plugins by name; flat config needs the object.
    plugins: { qunit },
  },
  {
    ...n.configs['flat/recommended-module'],
    files: ['eslint.config.mjs'],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      ...n.configs['flat/recommended-module'].rules,
      // The config file only runs in development.
      'n/no-unpublished-import': 'off',
    },
  },
];
