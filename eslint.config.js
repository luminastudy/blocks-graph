import agentConfig from 'eslint-config-agent'
import publishablePackageJson from 'eslint-config-publishable-package-json'

// Map over agentConfig to remove the problematic import/resolver setting
const fixedAgentConfig = agentConfig.map(config => {
  if (config.settings?.['import/resolver']?.typescript) {
    return {
      ...config,
      settings: {
        ...config.settings,
        'import/resolver': {
          node: {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
          },
        },
      },
    }
  }
  return config
})

export default [
  {
    ignores: [
      'dist/**',
      'coverage/**',
      'node_modules/**',
      '*.config.js',
      '*.config.mjs',
      '*.spec.ts',
      '**/*.spec.ts',
      '**/*.spec.tsx',
      '**/*.stories.ts',
      '.storybook/**',
      'storybook-static/**',
      'build.mjs',
      '**/package.json',
      'src/wrappers/vue/**',
      'src/wrappers/angular/**',
      'examples/**/dist/**',
      'examples/**/node_modules/**',
    ],
  },
  ...fixedAgentConfig,
  publishablePackageJson,
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // Relax some overly strict rules for library code
      'default/no-hardcoded-urls': 'off', // SVG namespace URLs are fine
      // Library core files are legitimately longer than typical application code
      'max-lines': [
        'error',
        { max: 250, skipBlankLines: true, skipComments: true },
      ],
      // Project has comprehensive tests but not 1:1 spec files for every source file
      'ddd/require-spec-file': 'off',
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
      // Examples may need type assertions for framework interop (e.g., DOM events in Angular)
      'no-restricted-syntax': 'off',
      // Examples may use optional chaining for convenience
      'no-optional-chaining/no-optional-chaining': 'off',
    },
  },
]
