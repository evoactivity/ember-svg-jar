module.exports = {
  plugins: [
    'node'
  ],

  extends: [
    'airbnb-base',
    'plugin:node/recommended',
    '../eslint-rules.js'
  ],

  env: {
    browser: false,
    node: true
  },

  parserOptions: {
    sourceType: 'script',
    ecmaVersion: 2015
  }
};
