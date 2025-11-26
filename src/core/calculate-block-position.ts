import type { BlockPosition } from '../types/block-position.js'
import type { GraphLayoutConfig } from './graph-layout-config.js'

/**
 * Calculate position for a single block considering grid wrapping
 *
 * @param blockIndex - Index of the block within its level
 * @param levelOffset - Offset for this level (x for horizontal, y for vertical)
 * @param totalBlocksInLevel - Total number of blocks at this level
 * @param isVertical - Whether orientation is vertical (ttb/btt)
 * @param isReversed - Whether orientation is reversed (rtl/btt)
 * @param config - Layout configuration
 */
export function calculateBlockPosition(
  blockIndex: number,
  levelOffset: number,
  totalBlocksInLevel: number,
  isVertical: boolean,
  isReversed: boolean,
  config: GraphLayoutConfig
): BlockPosition {
  const maxNodesPerLevel = config.maxNodesPerLevel

  if (
    maxNodesPerLevel !== undefined &&
    maxNodesPerLevel > 0 &&
    totalBlocksInLevel > maxNodesPerLevel
  ) {
    // Grid wrapping
    if (isVertical) {
      const row = Math.floor(blockIndex / maxNodesPerLevel)
      const col = blockIndex % maxNodesPerLevel
      return {
        x: col * (config.nodeWidth + config.horizontalSpacing),
        y: levelOffset + row * (config.nodeHeight + config.verticalSpacing),
        width: config.nodeWidth,
        height: config.nodeHeight,
      }
    } else {
      // Horizontal orientation with grid wrapping
      const col = Math.floor(blockIndex / maxNodesPerLevel)
      const row = blockIndex % maxNodesPerLevel
      const totalCols = Math.ceil(totalBlocksInLevel / maxNodesPerLevel)

      // For RTL, reverse the column order so Block 1-4 is in the rightmost column
      const adjustedCol = isReversed ? totalCols - 1 - col : col

      return {
        x:
          levelOffset +
          adjustedCol * (config.nodeWidth + config.horizontalSpacing),
        y: row * (config.nodeHeight + config.verticalSpacing),
        width: config.nodeWidth,
        height: config.nodeHeight,
      }
    }
  } else {
    // No wrapping - single row or column
    if (isVertical) {
      return {
        x: blockIndex * (config.nodeWidth + config.horizontalSpacing),
        y: levelOffset,
        width: config.nodeWidth,
        height: config.nodeHeight,
      }
    } else {
      return {
        x: levelOffset,
        y: blockIndex * (config.nodeHeight + config.verticalSpacing),
        width: config.nodeWidth,
        height: config.nodeHeight,
      }
    }
  }
}
