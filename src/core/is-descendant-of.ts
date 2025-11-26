import type { BlockGraph } from '../types/block-graph.js'

/**
 * Check if a block is a descendant of another block (child, grandchild, etc.)
 */
export function isDescendantOf(
  blockId: string,
  ancestorId: string,
  graph: BlockGraph,
  visited?: Set<string>
): boolean {
  const visitedSet = visited !== undefined ? visited : new Set<string>()
  if (visitedSet.has(blockId)) return false
  visitedSet.add(blockId)

  const block = graph.blocks.get(blockId)
  if (!block) return false
  if (block.parents.includes(ancestorId)) return true

  return block.parents.some(parentId =>
    isDescendantOf(parentId, ancestorId, graph, visitedSet)
  )
}
