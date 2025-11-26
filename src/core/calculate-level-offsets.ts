import type { GraphLayoutConfig } from './graph-layout-config.js'

/**
 * Calculate level offsets considering grid wrapping
 */
export function calculateLevelOffsets(
  blocksByLevel: Map<number, string[]>,
  isVertical: boolean,
  isReversed: boolean,
  maxLevel: number,
  config: GraphLayoutConfig
): Map<number, number> {
  const levelOffsets = new Map<number, number>()
  const maxNodesPerLevel = config.maxNodesPerLevel
  let currentOffset = 0

  // For reversed orientations, we need to iterate levels in reverse order
  // so that cumulative offsets build correctly (later levels appear first visually)
  const sortedLevels = Array.from(blocksByLevel.entries()).sort((a, b) =>
    isReversed ? b[0] - a[0] : a[0] - b[0]
  )

  for (const [level, blockIds] of sortedLevels) {
    const adjustedLevel = isReversed ? maxLevel - level : level
    levelOffsets.set(adjustedLevel, currentOffset)

    // Calculate this level's dimension based on wrapping
    let levelDimension: number

    if (
      maxNodesPerLevel !== undefined &&
      maxNodesPerLevel > 0 &&
      blockIds.length > maxNodesPerLevel
    ) {
      // Grid wrapping occurs
      if (isVertical) {
        const numRows = Math.ceil(blockIds.length / maxNodesPerLevel)
        levelDimension =
          numRows * config.nodeHeight + (numRows - 1) * config.verticalSpacing
      } else {
        const numCols = Math.ceil(blockIds.length / maxNodesPerLevel)
        levelDimension =
          numCols * config.nodeWidth + (numCols - 1) * config.horizontalSpacing
      }
    } else {
      // No wrapping - single row or column
      levelDimension = isVertical ? config.nodeHeight : config.nodeWidth
    }

    // Update offset for next level
    const spacing = isVertical
      ? config.verticalSpacing
      : config.horizontalSpacing
    currentOffset += levelDimension + spacing
  }

  return levelOffsets
}
