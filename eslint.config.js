import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    files: ['client/js/**/*.js', 'server/**/*.js'],
    rules: {
      'no-var': 'error',
      'eqeqeq': ['error', 'always'],
      'prefer-const': 'error',
      'no-unused-vars': 'error',
      'no-console': 'off',
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        fetch: 'readonly',
        window: 'readonly',
        document: 'readonly',
        AudioContext: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
      },
    },
  },
];
