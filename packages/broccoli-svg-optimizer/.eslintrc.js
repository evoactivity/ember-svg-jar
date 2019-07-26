module.exports = {
  plugins: [
    'node'
  ],

  extends: [
    'airbnb-base',
    'plugin:node/recommended'
  ],

  env: {
    browser: false,
    node: true
  },

  parserOptions: {
    sourceType: 'script',
    ecmaVersion: 2018
  },

  rules: {
    'comma-dangle': 'off',
    'class-methods-use-this': 'off',
    'no-param-reassign': 'off',
    'prefer-const': 'off',
    'arrow-parens': ['error', 'always'],
    'arrow-body-style': 'off',

    'no-irregular-whitespace': ['error', {
      'skipStrings': true,
      'skipComments': true
    }],

    'space-before-function-paren': ['error', {
      'anonymous': 'never',
      'named': 'never'
    }]
  }
};
