module.exports = {
  root: true,
  parser: 'babel-eslint',
  plugins: ['node', 'prettier'],
  extends: ['plugin:node/recommended', 'plugin:prettier/recommended'],
  env: {
    browser: false,
    node: true,
  },
  parserOptions: {
    sourceType: 'script',
    ecmaVersion: 2018,
  },
  rules: {
    'prettier/prettier': 'error',
  },
};
