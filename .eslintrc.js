module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    // 'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', 'database/**/*.ts', '**/*.spec.ts', 'libs'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-throw-literal': 'error',
    eqeqeq: ['error', 'always'],
    // 'max-lines-per-function': ["error", { 'max': 50, 'skipComments': true, 'skipBlankLines': true }],
    // 'max-lines': ['error', {'max': 400, 'skipBlankLines': true, 'skipComments': true}],
    // 'max-depth': ['error', 3],
    // 'max-params': ['error', 3]
  },
}
