// ESLint 9 (flat config) para JavaScript vanilla del navegador + Prettier
import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

export default [
  { ignores: ['node_modules/', 'BWL-Soft-Kit-Logo/'] },
  js.configs.recommended,
  {
    files: ['js/**/*.js'],
    languageOptions: { ecmaVersion: 2023, sourceType: 'script', globals: globals.browser },
    rules: {
      // Seguridad: nada de HTML crudo ni eval; los datos se pintan como texto
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-restricted-properties': [
        'error',
        { property: 'innerHTML', message: 'Usa textContent o nodos del DOM.' },
        { property: 'outerHTML', message: 'Usa textContent o nodos del DOM.' },
      ],
      'no-console': ['warn', { allow: ['error'] }],
      eqeqeq: ['error', 'always', { null: 'ignore' }],
    },
  },
  {
    files: ['eslint.config.js'],
    languageOptions: { sourceType: 'module', globals: globals.node },
  },
  prettier,
];
