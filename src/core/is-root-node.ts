import type { BlockGraph } from '../types/block-graph.js'

/**
 * Check if a block is a root node (has no incoming edges)
 */
export function isRootNode(blockId: string, graph: BlockGraph): boolean {
  return !graph.edges.some(edge => edge.to === blockId)
}
