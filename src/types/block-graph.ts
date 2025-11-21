/**
 * Complete graph structure with blocks and edges
 */

import type { HorizontalRelationships } from '../core/horizontal-relationships.js'
import type { Block } from './block.js'
import type { GraphEdge } from './graph-edge.js'

export interface BlockGraph {
  blocks: Map<string, Block>
  edges: GraphEdge[]
  /**
   * Optional pre-computed horizontal relationships for O(1) prerequisite/post-requisite lookups.
   * If present, provides efficient access to prerequisites and post-requisites.
   */
  horizontalRelationships?: HorizontalRelationships
}
