import type { BlockGraph } from '../types/block-graph.js'

/**
 * Get parent block IDs for a given block (from prerequisite edges)
 */
export function getParentIds(blockId: string, graph: BlockGraph): string[] {
  const block = graph.blocks.get(blockId)
  if (!block) return []
  // Use prerequisites as the parent relationship for positioning
  return block.prerequisites
}
