/**
 * Complete graph structure with blocks and edges
 */

import type { Block } from './block.js';
import type { GraphEdge } from './graph-edge.js';

export interface BlockGraph {
  blocks: Map<string, Block>;
  edges: GraphEdge[];
}
