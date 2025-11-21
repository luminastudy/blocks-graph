import agentConfig from 'eslint-config-agent'
import publishablePackageJson from 'eslint-config-publishable-package-json'

export default [
  {
    ignores: [
      'dist/**',
      'coverage/**',
      'node_modules/**',
      '*.config.js',
      '*.config.mjs',
      '*.test.ts',
      '**/*.test.ts',
      '**/*.stories.ts',
      '.storybook/**',
      'storybook-static/**',
      'build.mjs',
      '**/package.json',
      'src/wrappers/vue/**',
      'src/wrappers/angular/**',
    ],
  },
  ...agentConfig,
  publishablePackageJson,
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // Relax some overly strict rules for library code
      'max-lines': ['error', { max: 350 }],
      'max-lines-per-function': ['error', { max: 200 }],
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
      'custom/jsx-classname-required': 'off', // Not needed for examples
    },
  },
  {
    files: ['examples/**/*.ts', 'examples/**/*.tsx'],
    rules: {
      // Examples can be longer and more illustrative
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      'error/no-generic-error': 'off',
      'error/require-custom-error': 'off',
    },
  },
]
