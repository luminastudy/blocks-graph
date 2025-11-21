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
      'max-lines': ['error', { max: 500 }], // Increased to accommodate core rendering logic
      'max-lines-per-function': ['error', { max: 200 }], // Allow larger functions for complex rendering/wrapper logic
      'default/no-hardcoded-urls': 'off', // SVG namespace URLs are fine
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
