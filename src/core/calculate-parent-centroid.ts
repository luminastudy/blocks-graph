import type { BlockGraph } from '../types/block-graph.js'
import type { BlockPosition } from '../types/block-position.js'
import { getParentIds } from './get-parent-ids.js'

/**
 * Calculate the center position for a block based on its parents' positions.
 * If no parents have positions yet, returns undefined.
 */
export function calculateParentCentroid(
  blockId: string,
  graph: BlockGraph,
  positions: Map<string, BlockPosition>,
  nodeSize: number,
  isVertical: boolean
): number | undefined {
  const parentIds = getParentIds(blockId, graph)
  if (parentIds.length === 0) return undefined

  const parentCenters: number[] = []
  for (const parentId of parentIds) {
    const parentPos = positions.get(parentId)
    if (parentPos) {
      if (isVertical) {
        parentCenters.push(parentPos.x + nodeSize / 2)
      } else {
        parentCenters.push(parentPos.y + nodeSize / 2)
      }
    }
  }

  if (parentCenters.length === 0) return undefined

  // Return the average center position of all parents
  const sum = parentCenters.reduce((a, b) => a + b, 0)
  return sum / parentCenters.length
}
