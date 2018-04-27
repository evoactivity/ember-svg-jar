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
    ecmaVersion: 2015
  },

  rules: {
    'comma-dangle': 'off',
    'class-methods-use-this': 'off',
    'no-param-reassign': 'off',
    'prefer-const': 'off',
    'prefer-destructuring': 'off',
    'arrow-parens': ['error', 'always'],

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
