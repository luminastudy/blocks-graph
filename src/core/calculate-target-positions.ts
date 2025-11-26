import type { SiblingGroup } from './sibling-group.js'
import { distributeSiblingsAroundCentroid } from './distribute-siblings-around-centroid.js'

/**
 * Calculate target positions for all blocks based on sibling groups
 */
export function calculateTargetPositions(
  groupInfos: SiblingGroup[],
  nodeSize: number,
  spacing: number
): Map<string, number> {
  const targetPositions = new Map<string, number>()

  for (const groupInfo of groupInfos) {
    const siblingPositions = distributeSiblingsAroundCentroid(
      groupInfo.siblings,
      groupInfo.centroid,
      nodeSize,
      spacing
    )

    for (const [blockId, pos] of siblingPositions.entries()) {
      targetPositions.set(blockId, pos)
    }
  }

  return targetPositions
}
