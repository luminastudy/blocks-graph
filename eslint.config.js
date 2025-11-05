import config from 'eslint-config-agent';

export default [
  ...config,
  {
    ignores: ['dist', 'coverage', 'node_modules', '*.config.js', '*.test.ts', '*.mjs', '.storybook', '*.stories.ts', 'storybook-static'],
  },
  {
    rules: {
      // Relax some overly strict rules for library code
      'max-lines': ['error', { max: 300 }],
      'default/no-default-params': 'off',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSEnumDeclaration',
          message: 'Enums are not allowed. Use const objects instead.',
        },
      ],
      'default/no-hardcoded-urls': 'off', // SVG namespace URLs are fine
      'error/no-generic-error': 'warn',
      'error/require-custom-error': 'warn',
      'guard-clauses/prefer-guard-at-function-start': 'warn',
    },
  },
];
