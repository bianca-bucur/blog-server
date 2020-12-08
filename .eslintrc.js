module.exports = {
  'env': {
    'node': true,
    'commonjs': true,
    'es6': true,
  },
  'extends': 'eslint:recommended',
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly',
  },
  'parserOptions': {
    'ecmaVersion': 2018,
  },
  'rules': {
    'indent': [
      'error',
      2,
    ],
    'linebreak-style': [
      'error',
      'unix',
    ],
    'quotes': [
      'error',
      'single',
    ],
    'semi': [
      'error',
      'always',
    ],
    'no-dupe-args': [
      'error',
    ],
    'no-dupe-keys': [
      'error',
    ],
    'no-duplicate-case': [
      'error',
    ],
    'no-duplicate-imports': [
      'error',
    ],
    'no-empty': [
      'error',
    ],
    'no-sparse-arrays': [
      'warn',
    ],
    'no-unreachable': [
      'error',
    ],
    'array-callback-return': [
      'error',
      {
        'allowImplicit': true,
      },
    ],
    'use-isnan': [
      'error',
    ],
    'curly': [
      'error',
      'multi-line',
    ],
    'default-case': [
      'error',
    ],
    'no-case-declarations': [
      'off',
    ],
    'eqeqeq': [
      'error',
    ],
    'no-eval': [
      'error',
    ],
    'no-empty-function': [
      'error',
    ],
    'no-undef': [
      'error',
    ],
    'no-unused-vars': [
      'warn',
    ],
    'global-require': [
      'error',
    ],
    'camelcase': [
      'warn',
    ],
    'comma-spacing': [
      'warn',
    ],
    'keyword-spacing': [
      'warn',
      {
        'before': true,
        'after': true,
      },
    ],
    'max-len': [
      'warn',
      {
        'code': 150,
      },
    ],
    'space-before-blocks': [
      'warn',
    ],
    'arrow-body-style': [
      'warn',
      'as-needed',
    ],
    'arrow-spacing': [
      'warn',
    ],
    'prefer-const': [
      'warn',
    ],
    'prefer-destructuring': [
      'error',
      {
        'array': false,
        'object': true,
      },
    ],
    'comma-dangle': [
      'warn',
      'always-multiline',
    ],
    'eol-last': [
      'error',
      'always',
    ],
  },
};
  
