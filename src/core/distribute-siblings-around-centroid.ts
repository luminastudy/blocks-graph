/**
 * Distribute siblings symmetrically around their parent's centroid
 */
export function distributeSiblingsAroundCentroid(
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
