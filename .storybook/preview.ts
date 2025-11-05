import type { Preview } from '@storybook/web-components';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    actions: { argTypesRegex: '^on[A-Z].*' },
    a11y: {
      // Accessibility addon configuration
      element: '#storybook-root',
      config: {
        rules: [
          {
            // Custom rules can be added here
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
    },
  },
};

export default preview;
