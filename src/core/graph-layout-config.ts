import type { Orientation } from '../types/orientation.js'

/**
 * Configuration for graph layout engine.
 *
 * Controls the positioning and spacing of blocks in the rendered graph.
 * Spacing behavior adapts based on the selected orientation.
 *
 * @example
 * ```typescript
 * import { GraphEngine } from './graph-engine.js';
 *
 * const engine = new GraphEngine({
 *   nodeWidth: 250,
 *   nodeHeight: 100,
 *   horizontalSpacing: 80,
 *   verticalSpacing: 120,
 *   orientation: 'ltr'
 * });
 * ```
 */
export interface GraphLayoutConfig {
  /** Width of each block node in pixels */
  nodeWidth: number

  /** Height of each block node in pixels */
  nodeHeight: number

  /**
   * Horizontal spacing between blocks in pixels.
   *
   * For vertical orientations (ttb, btt): spacing between sibling blocks at the same level.
   * For horizontal orientations (ltr, rtl): spacing between hierarchy levels.
   */
  horizontalSpacing: number

  /**
   * Vertical spacing between blocks in pixels.
   *
   * For vertical orientations (ttb, btt): spacing between hierarchy levels.
   * For horizontal orientations (ltr, rtl): spacing between sibling blocks at the same level.
   */
  verticalSpacing: number

  /**
   * Graph orientation controlling directional flow.
   *
   * - `ttb` (default): Top-to-bottom hierarchy
   * - `ltr`: Left-to-right flow
   * - `rtl`: Right-to-left flow
   * - `btt`: Bottom-to-top hierarchy
   *
   * When undefined, defaults to 'ttb' for backward compatibility.
   */
  orientation?: Orientation
}
