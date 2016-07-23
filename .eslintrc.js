module.exports = {
  extends: 'airbnb-base',

  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },

  rules: {
    'prefer-const': 0,
    'comma-dangle': 0,
    'prefer-arrow-callback': 0,
    'func-names': 0,
    'prefer-rest-params': 0,
    'no-underscore-dangle': 0,
    'array-callback-return': 0,
    'import/no-unresolved': 0,
    'consistent-return': 0,

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
