/**
 * Vue wrapper for @lumina-study/blocks-graph
 *
 * @example
 * ```vue
 * <template>
 *   <BlocksGraphVue
 *     :blocks="blocks"
 *     language="en"
 *     orientation="ttb"
 *     @block-selected="handleBlockSelected"
 *   />
 * </template>
 *
 * <script setup lang="ts">
 * import { BlocksGraphVue } from '@lumina-study/blocks-graph/vue';
 * import type { Block } from '@lumina-study/blocks-graph';
 *
 * const blocks: Block[] = [...];
 *
 * function handleBlockSelected(event) {
 *   console.log(event.blockId, event.selectionLevel);
 * }
 * </script>
 * ```
 */

export { BlocksGraphVue } from './BlocksGraphVue.js'
export type { BlocksRenderedEvent } from './blocks-rendered-event.js'
export type { BlockSelectedEvent } from './block-selected-event.js'

// Re-export core types that Vue users might need
export type { Block } from '../../types/block.js'
export type { BlockSchemaV01 } from '../../adaptors/v0.1/types.js'
export type { BlockTitle } from '../../adaptors/v0.1/block-title.js'
export type { EdgeLineStyle } from '../../types/edge-style.js'
