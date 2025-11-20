/**
 * Angular wrapper for @lumina-study/blocks-graph
 *
 * @example
 * ```typescript
 * // In your component or module
 * import { BlocksGraphComponent } from '@lumina-study/blocks-graph/angular';
 * import type { Block } from '@lumina-study/blocks-graph';
 *
 * @Component({
 *   selector: 'app-root',
 *   standalone: true,
 *   imports: [BlocksGraphComponent],
 *   template: `
 *     <blocks-graph-angular
 *       [blocks]="blocks"
 *       language="en"
 *       orientation="ttb"
 *       (blockSelected)="handleBlockSelected($event)"
 *     ></blocks-graph-angular>
 *   `
 * })
 * export class AppComponent {
 *   blocks: Block[] = [...];
 *
 *   handleBlockSelected(event: BlockSelectedEvent) {
 *     console.log(event.blockId, event.selectionLevel);
 *   }
 * }
 * ```
 */

export { BlocksGraphComponent } from './blocks-graph.component.js'
export type { BlocksRenderedEvent } from './blocks-rendered-event.js'
export type { BlockSelectedEvent } from './block-selected-event.js'

// Re-export core types that Angular users might need
export type { Block } from '../../types/block.js'
export type { BlockSchemaV01 } from '../../adaptors/v0.1/types.js'
export type { BlockTitle } from '../../adaptors/v0.1/block-title.js'
export type { EdgeLineStyle } from '../../types/edge-style.js'
