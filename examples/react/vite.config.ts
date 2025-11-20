import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Base path for GitHub Pages deployment
  // Set via environment variable or default to '/' for local development
  base: process.env.VITE_BASE_PATH || '/',
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
  },
})
