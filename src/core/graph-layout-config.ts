import type { Orientation } from '../types/orientation.js';

/**
 * Configuration for graph layout
 */
export interface GraphLayoutConfig {
  nodeWidth: number;
  nodeHeight: number;
  horizontalSpacing: number;
  verticalSpacing: number;
  orientation?: Orientation;
}
