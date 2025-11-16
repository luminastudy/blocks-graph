/**
 * Supported graph orientation modes.
 *
 * Controls the directional flow of the graph layout:
 * - `ttb` (top-to-bottom): Parent nodes appear above child nodes. Levels progress downward along the y-axis. This is the default orientation.
 * - `ltr` (left-to-right): Parent nodes appear to the left of child nodes. Levels progress rightward along the x-axis. Ideal for timelines or process flows.
 * - `rtl` (right-to-left): Parent nodes appear to the right of child nodes. Levels progress leftward along the x-axis. Useful for RTL language contexts.
 * - `btt` (bottom-to-top): Parent nodes appear below child nodes. Levels progress upward along the y-axis. Inverted hierarchical layout.
 *
 * @example
 * ```typescript
 * import { GraphLayoutConfig } from './graph-layout-config.js';
 *
 * const config: GraphLayoutConfig = {
 *   nodeWidth: 200,
 *   nodeHeight: 80,
 *   horizontalSpacing: 80,
 *   verticalSpacing: 100,
 *   orientation: 'ltr' // Type-safe: only accepts 'ttb' | 'ltr' | 'rtl' | 'btt'
 * };
 * ```
 *
 * @example
 * ```html
 * <!-- Using as Web Component attribute -->
 * <blocks-graph orientation="ltr"></blocks-graph>
 * ```
 */
export type Orientation = 'ttb' | 'ltr' | 'rtl' | 'btt'
