import type { BlockGraph } from '../types/block-graph.js'
import { getParentIds } from './get-parent-ids.js'

/**
 * Generate a unique key for a block's prerequisite set for grouping siblings
 */
function getPrerequisiteSignature(blockId: string, graph: BlockGraph): string {
  const parentIds = getParentIds(blockId, graph)
  return [...parentIds].sort().join(',')
}

/**
 * Group blocks by their shared parent set (prerequisite signature)
 */
export function groupBlocksByParents(
  blockIds: string[],
  graph: BlockGraph
): Map<string, string[]> {
  const groups = new Map<string, string[]>()

  for (const blockId of blockIds) {
    const signature = getPrerequisiteSignature(blockId, graph)
    const group = groups.get(signature)
    if (group !== undefined) {
      group.push(blockId)
    } else {
      groups.set(signature, [blockId])
    }
  }

  return groups
}
