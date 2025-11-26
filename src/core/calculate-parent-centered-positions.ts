import type { BlockGraph } from '../types/block-graph.js'
import type { BlockPosition } from '../types/block-position.js'
import type { GraphLayoutConfig } from './graph-layout-config.js'
import { calculateBlockPosition } from './calculate-block-position.js'
import { resolveHorizontalOverlaps } from './resolve-horizontal-overlaps.js'
import { resolveVerticalOverlaps } from './resolve-vertical-overlaps.js'
import { getParentIds } from './get-parent-ids.js'
import { groupBlocksByParents } from './group-blocks-by-parents.js'
import { buildSiblingGroupInfos } from './build-sibling-group-infos.js'
import { calculateTargetPositions } from './calculate-target-positions.js'

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
    resolveHorizontalOverlaps(
      sortedBlockIds,
      positions,
      nodeWidth,
      horizontalSpacing
    )
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
