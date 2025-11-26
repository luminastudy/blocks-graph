#!/usr/bin/env node
/* global console */
/**
 * Updates Vue and Angular wrapper .d.ts files to use shared config imports.
 *
 * Since Vue and Angular wrappers are excluded from TypeScript compilation
 * (to avoid requiring vue/@angular/core as deps), their type declarations
 * need to be updated manually after the main build.
 */

import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, '..', 'dist', 'wrappers')

// Vue wrapper index.d.ts
const vueIndexDts = `export { BlocksGraphVue } from './BlocksGraphVue.js';
export type { Block } from '../../types/block.js';
export type { BlockSchemaV01 } from '../../adaptors/v0.1/types.js';
export type { BlockTitle } from '../../adaptors/v0.1/block-title.js';
export type { EdgeLineStyle } from '../../types/edge-style.js';
export type { BlocksGraphBaseConfig } from '../blocks-graph-base-config.js';
export type { BlocksRenderedEvent } from '../blocks-rendered-event.js';
export type { BlockSelectedEvent } from '../block-selected-event.js';
`

// Angular wrapper index.d.ts
const angularIndexDts = `export { BlocksGraphComponent } from './blocks-graph.component.js';
export type { Block } from '../../types/block.js';
export type { BlockSchemaV01 } from '../../adaptors/v0.1/types.js';
export type { BlockTitle } from '../../adaptors/v0.1/block-title.js';
export type { EdgeLineStyle } from '../../types/edge-style.js';
export type { BlocksGraphBaseConfig } from '../blocks-graph-base-config.js';
export type { BlocksRenderedEvent } from '../blocks-rendered-event.js';
export type { BlockSelectedEvent } from '../block-selected-event.js';
`

writeFileSync(join(distDir, 'vue', 'index.d.ts'), vueIndexDts)
writeFileSync(join(distDir, 'angular', 'index.d.ts'), angularIndexDts)

console.log('✓ Updated Vue and Angular wrapper type declarations')
