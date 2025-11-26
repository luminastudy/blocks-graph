import type { PositionedBlock } from '../types/positioned-block.js'

interface ViewBox {
  x: number
  y: number
  width: number
  height: number
}

/**
 * Calculate the bounding box of all positioned blocks
 */
export function calculateViewBox(positioned: PositionedBlock[]): ViewBox {
  if (positioned.length === 0) {
    return { x: 0, y: 0, width: 800, height: 600 }
  }

  let minX = Number.POSITIVE_INFINITY
  let minY = Number.POSITIVE_INFINITY
  let maxX = Number.NEGATIVE_INFINITY
  let maxY = Number.NEGATIVE_INFINITY

  for (const { position } of positioned) {
    minX = Math.min(minX, position.x)
    minY = Math.min(minY, position.y)
    maxX = Math.max(maxX, position.x + position.width)
    maxY = Math.max(maxY, position.y + position.height)
  }

  const padding = 40
  return {
    x: minX - padding,
    y: minY - padding,
    width: maxX - minX + 2 * padding,
    height: maxY - minY + 2 * padding,
  }
}
