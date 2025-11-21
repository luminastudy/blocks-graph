import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Extract environment variables upfront
const env = process.env
const basePath =
  env['VITE_BASE_PATH'] !== undefined ? env['VITE_BASE_PATH'] : '/'

export default defineConfig({
  plugins: [react()],
  // Base path for GitHub Pages deployment
  // Set via environment variable or default to '/' for local development
  base: basePath,
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
  },
})
