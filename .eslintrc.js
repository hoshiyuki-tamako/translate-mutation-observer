module.exports = {
  env: {
    node: true,
  },
  extends: [
    'airbnb-base',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'no-restricted-syntax': 'off',
    'max-len': 'off',
    'class-methods-use-this': 'off',
    'no-unused-expressions': 'off',
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
};
