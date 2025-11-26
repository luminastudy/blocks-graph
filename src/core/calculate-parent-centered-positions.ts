import type { BlockGraph } from '../types/block-graph.js'
import type { BlockPosition } from '../types/block-position.js'
import type { GraphLayoutConfig } from './graph-layout-config.js'
import { calculateBlockPosition } from './calculate-block-position.js'

/**
 * Get parent block IDs for a given block (from prerequisite edges)
 */
function getParentIds(blockId: string, graph: BlockGraph): string[] {
  const block = graph.blocks.get(blockId)
  if (!block) return []
  // Use prerequisites as the parent relationship for positioning
  return block.prerequisites
}

/**
 * Calculate the center position for a block based on its parents' positions.
 * If no parents have positions yet, returns undefined.
 */
function calculateParentCentroid(
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

/**
 * Resolve overlaps between blocks at the same level by shifting them apart
 */
function resolveOverlaps(
  blockIds: string[],
  positions: Map<string, BlockPosition>,
  nodeWidth: number,
  spacing: number
): void {
  // Sort blocks by their current X position
  const sortedBlocks = [...blockIds].sort((a, b) => {
    const posA = positions.get(a)
    const posB = positions.get(b)
    if (!posA || !posB) return 0
    return posA.x - posB.x
  })

  // Shift blocks to resolve overlaps
  for (let i = 1; i < sortedBlocks.length; i++) {
    const prevId = sortedBlocks.at(i - 1)
    const currId = sortedBlocks.at(i)
    if (!prevId || !currId) continue

    const prevPos = positions.get(prevId)
    const currPos = positions.get(currId)
    if (!prevPos || !currPos) continue

    const minX = prevPos.x + nodeWidth + spacing
    if (currPos.x < minX) {
      currPos.x = minX
    }
  }
}

/**
 * Resolve vertical overlaps for horizontal layouts
 */
function resolveVerticalOverlaps(
  blockIds: string[],
  positions: Map<string, BlockPosition>,
  nodeHeight: number,
  spacing: number
): void {
  // Sort blocks by their current Y position
  const sortedBlocks = [...blockIds].sort((a, b) => {
    const posA = positions.get(a)
    const posB = positions.get(b)
    if (!posA || !posB) return 0
    return posA.y - posB.y
  })

  // Shift blocks to resolve overlaps
  for (let i = 1; i < sortedBlocks.length; i++) {
    const prevId = sortedBlocks.at(i - 1)
    const currId = sortedBlocks.at(i)
    if (!prevId || !currId) continue

    const prevPos = positions.get(prevId)
    const currPos = positions.get(currId)
    if (!prevPos || !currPos) continue

    const minY = prevPos.y + nodeHeight + spacing
    if (currPos.y < minY) {
      currPos.y = minY
    }
  }
}

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
function groupBlocksByParents(
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

/**
 * Distribute siblings symmetrically around their parent's centroid
 */
function distributeSiblingsAroundCentroid(
  siblings: string[],
  centroid: number,
  nodeSize: number,
  spacing: number
): Map<string, number> {
  const positions = new Map<string, number>()
  const count = siblings.length

  if (count === 0) return positions

  // Calculate total width of all siblings with spacing
  const totalWidth = count * nodeSize + (count - 1) * spacing

  // Start position so that the group is centered on the centroid
  const startPos = centroid - totalWidth / 2

  for (let i = 0; i < count; i++) {
    const sibling = siblings.at(i)
    if (sibling !== undefined) {
      positions.set(sibling, startPos + i * (nodeSize + spacing))
    }
  }

  return positions
}

interface SiblingGroup {
  centroid: number
  siblings: string[]
  signature: string
}

/**
 * Build sibling group info with centroids for each group
 */
function buildSiblingGroupInfos(
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

/**
 * Calculate target positions for all blocks based on sibling groups
 */
function calculateTargetPositions(
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

/**
 * Assign block positions from target positions map
 */
function assignBlockPositions(
  sortedBlockIds: string[],
  targetPositions: Map<string, number>,
  positions: Map<string, BlockPosition>,
  levelOffset: number,
  isVertical: boolean,
  config: GraphLayoutConfig
): void {
  const { nodeWidth, nodeHeight } = config

  for (const blockId of sortedBlockIds) {
    const targetPosValue = targetPositions.get(blockId)
    const targetPos = targetPosValue !== undefined ? targetPosValue : 0

    if (isVertical) {
      positions.set(blockId, {
        x: targetPos,
        y: levelOffset,
        width: nodeWidth,
        height: nodeHeight,
      })
    } else {
      positions.set(blockId, {
        x: levelOffset,
        y: targetPos,
        width: nodeWidth,
        height: nodeHeight,
      })
    }
  }
}

/**
 * Position blocks at a level using parent-centered layout with symmetric sibling distribution
 */
function positionLevelWithParentCentering(
  blockIds: string[],
  graph: BlockGraph,
  positions: Map<string, BlockPosition>,
  levelOffset: number,
  nodeSize: number,
  isVertical: boolean,
  config: GraphLayoutConfig
): void {
  const { nodeWidth, nodeHeight, horizontalSpacing, verticalSpacing } = config
  const spacing = isVertical ? horizontalSpacing : verticalSpacing

  // Group blocks by their shared parent set and build group info
  const siblingGroups = groupBlocksByParents(blockIds, graph)
  const groupInfos = buildSiblingGroupInfos(
    siblingGroups,
    graph,
    positions,
    nodeSize,
    isVertical
  )

  // Calculate target positions with symmetric distribution
  const targetPositions = calculateTargetPositions(
    groupInfos,
    nodeSize,
    spacing
  )

  // Sort blocks by target position and assign positions
  const sortedBlockIds = [...blockIds].sort((a, b) => {
    const posA = targetPositions.get(a)
    const posB = targetPositions.get(b)
    return (posA !== undefined ? posA : 0) - (posB !== undefined ? posB : 0)
  })

  assignBlockPositions(
    sortedBlockIds,
    targetPositions,
    positions,
    levelOffset,
    isVertical,
    config
  )

  // Resolve overlaps between different sibling groups
  if (isVertical) {
    resolveOverlaps(sortedBlockIds, positions, nodeWidth, horizontalSpacing)
  } else {
    resolveVerticalOverlaps(
      sortedBlockIds,
      positions,
      nodeHeight,
      verticalSpacing
    )
  }
}

/**
 * Calculate parent-centered positions for all blocks in the graph.
 * Children are positioned centered under the average position of their prerequisites.
 * Falls back to grid-based positioning for root levels (using calculateBlockPosition).
 */
export function calculateParentCenteredPositions(
  graph: BlockGraph,
  blocksByLevel: Map<number, string[]>,
  levelOffsets: Map<number, number>,
  isVertical: boolean,
  isReversed: boolean,
  maxLevel: number,
  config: GraphLayoutConfig
): Map<string, BlockPosition> {
  const positions = new Map<string, BlockPosition>()
  const nodeSize = isVertical ? config.nodeWidth : config.nodeHeight

  // Get sorted level numbers (ascending for processing root to leaf)
  const levelNumbers = Array.from(blocksByLevel.keys()).sort((a, b) => a - b)

  // Process levels from root to leaf
  for (const level of levelNumbers) {
    const blockIds = blocksByLevel.get(level)
    if (!blockIds) continue

    const adjustedLevel = isReversed ? maxLevel - level : level
    const levelOffsetValue = levelOffsets.get(adjustedLevel)
    const levelOffset = levelOffsetValue !== undefined ? levelOffsetValue : 0

    // Check if any block at this level has parents with known positions
    const hasParentPositions = blockIds.some(id => {
      const parentIds = getParentIds(id, graph)
      return parentIds.some(pid => positions.has(pid))
    })

    if (!hasParentPositions) {
      // Use standard grid-based layout for root level
      blockIds.forEach((blockId, index) => {
        const position = calculateBlockPosition(
          index,
          levelOffset,
          blockIds.length,
          isVertical,
          isReversed,
          config
        )
        positions.set(blockId, position)
      })
    } else {
      // Parent-centered layout for levels with positioned parents
      positionLevelWithParentCentering(
        blockIds,
        graph,
        positions,
        levelOffset,
        nodeSize,
        isVertical,
        config
      )
    }
  }

  return positions
}
