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
 * Position blocks at a level using parent-centered layout
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
  const targetPositions = new Map<string, number>()

  for (const blockId of blockIds) {
    const parentCentroid = calculateParentCentroid(
      blockId,
      graph,
      positions,
      nodeSize,
      isVertical
    )

    if (parentCentroid !== undefined) {
      targetPositions.set(blockId, parentCentroid - nodeSize / 2)
    } else {
      targetPositions.set(blockId, 0)
    }
  }

  // Sort blocks by their target position for consistent ordering
  const sortedBlockIds = [...blockIds].sort((a, b) => {
    const posAValue = targetPositions.get(a)
    const posBValue = targetPositions.get(b)
    const posA = posAValue !== undefined ? posAValue : 0
    const posB = posBValue !== undefined ? posBValue : 0
    return posA - posB
  })

  // Assign positions
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

  // Resolve overlaps
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
