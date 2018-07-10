'use strict';

module.exports = {
  rules: {
    'comma-dangle': 'off',
    'prefer-arrow-callback': 'off',
    'func-names': 'off',
    'prefer-rest-params': 'off',
    'no-underscore-dangle': 'off',
    'array-callback-return': 'off',
    'consistent-return': 'off',
    'function-paren-newline': 'off',
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/extensions': 'off',
    'import/no-dynamic-require': 'off',
    'prefer-const': 'off',
    'arrow-body-style': 'off',

    'arrow-parens': ['error', 'always'],

    'no-irregular-whitespace': ['error', {
      'skipStrings': true,
      'skipComments': true
    }],

    'space-before-function-paren': ['error', {
      'anonymous': 'never',
      'named': 'never'
    }],

    'generator-star-spacing': ['error', {
      'before': false,
      'after': true
    }]
  }
};
