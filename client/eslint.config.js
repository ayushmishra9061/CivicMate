export default [
  {
    ignores: ['dist', 'coverage']
  },
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true }
      },
      globals: {
        document: 'readonly',
        localStorage: 'readonly',
        navigator: 'readonly',
        window: 'readonly',
        FormData: 'readonly',
        React: 'readonly',
        describe: 'readonly',
        expect: 'readonly',
        it: 'readonly',
        import: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': 'off'
    }
  }
];
