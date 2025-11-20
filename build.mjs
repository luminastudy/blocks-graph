#!/usr/bin/env node
/* global console */
import { build } from 'esbuild'

// Build main ESM bundle
await build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
  outfile: 'dist/index.js',
  sourcemap: true,
  external: [],
  loader: {
    '.json': 'json',
  },
  logLevel: 'info',
})

console.log('✓ ESM bundle created')

// Build React wrapper bundle
await build({
  entryPoints: ['src/wrappers/react/index.ts'],
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
  outfile: 'dist/wrappers/react/index.js',
  sourcemap: true,
  external: ['react', 'react-dom'],
  jsx: 'automatic',
  loader: {
    '.json': 'json',
  },
  logLevel: 'info',
})

console.log('✓ React wrapper bundle created')

// Build Vue wrapper bundle
await build({
  entryPoints: ['src/wrappers/vue/index.ts'],
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
  outfile: 'dist/wrappers/vue/index.js',
  sourcemap: true,
  external: ['vue'],
  jsx: 'automatic',
  loader: {
    '.json': 'json',
  },
  logLevel: 'info',
})

console.log('✓ Vue wrapper bundle created')

// Build Angular wrapper bundle
await build({
  entryPoints: ['src/wrappers/angular/index.ts'],
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
  outfile: 'dist/wrappers/angular/index.js',
  sourcemap: true,
  external: ['@angular/core', '@angular/common'],
  jsx: 'automatic',
  loader: {
    '.json': 'json',
  },
  logLevel: 'info',
})

console.log('✓ Angular wrapper bundle created')
