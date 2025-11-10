import { defineConfig } from 'vite';

export default defineConfig({
  // Ensure JSON imports work (used by the component for schemas)
  json: {
    stringify: false,
  },
  // Align with main build configuration
  esbuild: {
    target: 'es2022',
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['ajv', 'ajv-formats'],
  },
  // Disable auto-opening browser (useful for CI and visual testing)
  server: {
    open: false,
  },
});
