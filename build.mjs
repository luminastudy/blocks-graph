#!/usr/bin/env node
import { build } from 'esbuild';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

// Build ESM bundle
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
});

console.log('✓ ESM bundle created');
