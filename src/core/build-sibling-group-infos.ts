import type { BlockGraph } from '../types/block-graph.js'
import type { BlockPosition } from '../types/block-position.js'
import type { SiblingGroup } from './sibling-group.js'
import { calculateParentCentroid } from './calculate-parent-centroid.js'

/**
 * Build sibling group info with centroids for each group
 */
export function buildSiblingGroupInfos(
  siblingGroups: Map<string, string[]>,
  graph: BlockGraph,
  positions: Map<string, BlockPosition>,
  nodeSize: number,
  isVertical: boolean
): SiblingGroup[] {
  const groupInfos: SiblingGroup[] = []

  for (const [signature, siblings] of siblingGroups.entries()) {
    const firstSibling = siblings[0]
    if (firstSibling === undefined) continue

    const centroid = calculateParentCentroid(
      firstSibling,
      graph,
      positions,
      nodeSize,
      isVertical
    )

    groupInfos.push({
      centroid: centroid !== undefined ? centroid : 0,
      siblings,
      signature,
    })
  }

  return groupInfos.sort((a, b) => a.centroid - b.centroid)
}
