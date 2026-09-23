import n from 'eslint-plugin-n';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

export default [
  {
    ignores: ['build/', '**/node_modules/'],
  },
  n.configs['flat/recommended-script'],
  prettierRecommended,
  {
    languageOptions: {
      ecmaVersion: 2018,
      sourceType: 'script',
      globals: globals.node,
    },
  },
  {
    files: ['tests/**/*.js'],
    languageOptions: {
      globals: globals.mocha,
    },
  },
];
