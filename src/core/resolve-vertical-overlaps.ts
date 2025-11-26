import type { BlockPosition } from '../types/block-position.js'

/**
 * Resolve vertical overlaps for horizontal layouts
 */
export function resolveVerticalOverlaps(
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
