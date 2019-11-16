module.exports = {
  root: true,
  extends: ['react-app', 'airbnb'],
  plugins: ['react'],

  env: {
    browser: true,
    node: false,
  },

  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    impliedStrict: true,
  },

  rules: {
    'global-require': 'off',
    'react/jsx-curly-newline': 'off',
    'react/forbid-prop-types': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'prefer-arrow-callback': 'off',
    'consistent-return': 'warn',
    'object-curly-newline': 'warn',
    'no-shadow': 'warn',
    'no-use-before-define': 'warn',
    'no-param-reassign': 'off',
    'no-multiple-empty-lines': ['error', { "max": 1 }],
    'import/no-extraneous-dependencies': 'warn',
    'import/prefer-default-export': 'off',
    'react/jsx-filename-extension': 'off',
    'react/prop-types': 'error',
    'react/jsx-no-bind': 'warn',
    'react/no-danger': 'off',
    'react/jsx-max-props-per-line': ['error', { when: 'always', maximum: 3 }],
    'jsx-a11y/label-has-associated-control': ['error', { assert: 'either' }],
    'jsx-a11y/label-has-for': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': [
      'error',
      {
        handlers: [
          'onClick',
          'onError',
          'onLoad',
          'onMouseDown',
          'onMouseUp',
          'onKeyPress',
          'onKeyUp',
        ]
      },
    ],
  },

  overrides: [
    // Node files
    {
      files: ['.eslintrc.js'],

      env: {
        browser: false,
        node: true,
      },

      parserOptions: {
        sourceType: 'script'
      },
    },

    // Tests
    {
      files: ['src/**/*.test.js'],

      env: {
        browser: true,
        jest: true,
        node: false,
      },
    },
  ],
};
