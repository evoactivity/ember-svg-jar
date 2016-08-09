module.exports = {
  root: true,
  extends: 'airbnb-base/legacy',

  env: {
    mocha: true
  },

  rules: {
    'func-names': 0,
    'no-unused-expressions': 0,
    'vars-on-top': 0,

    'space-before-function-paren': [2, {
      'anonymous': 'never',
      'named': 'never'
    }]
  }
};
