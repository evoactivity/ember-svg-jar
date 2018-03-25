module.exports = {
  root: true,

  plugins: [
    'ember'
  ],

  extends: [
    'airbnb-base',
    'plugin:ember/recommended',
    './eslint-rules.js'
  ],

  env: {
    browser: true,
    node: false,
    amd: true
  },

  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },

  rules: {
    // add your custom rules here
  },

  overrides: [
    // for Ember node files
    {
      files: [
        'eslint-rules.js',
        'index.js',
        'testem.js',
        'ember-cli-build.js',
        'config/**/*.js',
        'tests/dummy/config/**/*.js'
      ],

      excludedFiles: [
        'lib/**',
        'app/**',
        'addon/**',
        'tests/dummy/app/**'
      ],

      plugins: [
        'node'
      ],

      env: {
        browser: false,
        node: true
      },

      parserOptions: {
        sourceType: 'script',
        ecmaVersion: 2015
      },

      rules: Object.assign({}, require('eslint-plugin-node').configs.recommended.rules, {
        'quote-props': 0
      })
    }
  ]
};
