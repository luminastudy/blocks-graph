import type { BlockPosition } from '../types/block-position.js'

/**
 * Resolve overlaps between blocks at the same level by shifting them apart (horizontal)
 */
export function resolveHorizontalOverlaps(
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
