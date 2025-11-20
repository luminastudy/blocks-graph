/**
 * React wrapper for @lumina-study/blocks-graph
 *
 * @example
 * ```tsx
 * import { BlocksGraphReact } from '@lumina-study/blocks-graph/react';
 *
 * function App() {
 *   const blocks = [...];
 *
 *   return (
 *     <BlocksGraphReact
 *       blocks={blocks}
 *       language="en"
 *       orientation="ttb"
 *     />
 *   );
 * }
 * ```
 */

export { BlocksGraphReact, type BlocksGraphProps } from './BlocksGraphReact.js'

// Re-export core types that React users might need
export type { Block } from '../../types/block.js'
export type { BlockSchemaV01 } from '../../adaptors/v0.1/types.js'
export type { BlockTitle } from '../../adaptors/v0.1/block-title.js'
export type { EdgeLineStyle } from '../../types/edge-style.js'
