import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // Treat blocks-graph as a custom element
          isCustomElement: tag => tag === 'blocks-graph',
        },
      },
    }),
  ],
})
