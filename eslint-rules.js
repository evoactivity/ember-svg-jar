'use strict';

module.exports = {
  rules: {
    'prefer-const': 0,
    'comma-dangle': 0,
    'prefer-arrow-callback': 0,
    'func-names': 0,
    'prefer-rest-params': 0,
    'no-underscore-dangle': 0,
    'array-callback-return': 0,
    'consistent-return': 0,
    'prefer-destructuring': 0,
    'function-paren-newline': 0,
    'import/no-unresolved': 0,
    'import/no-extraneous-dependencies': 0,
    'import/extensions': 0,
    'import/no-dynamic-require': 0,

    'arrow-parens': ['error', 'always'],

    'no-irregular-whitespace': [2, {
      'skipStrings': true,
      'skipComments': true
    }],

    'space-before-function-paren': [2, {
      'anonymous': 'never',
      'named': 'never'
    }],

    'generator-star-spacing': [2, {
      'before': false,
      'after': true
    }]
  }
};
