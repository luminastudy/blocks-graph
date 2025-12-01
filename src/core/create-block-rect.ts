import type { BlockPosition } from '../types/block-position.js'
import type { BlockStyle } from '../types/block-style.js'

export function createBlockRect(
  position: BlockPosition,
  isSelected: boolean,
  opacity: string,
  blockStyle: BlockStyle
): SVGRectElement {
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
  rect.setAttribute('x', String(position.x))
  rect.setAttribute('y', String(position.y))
  rect.setAttribute('width', String(position.width))
  rect.setAttribute('height', String(position.height))
  rect.setAttribute('fill', blockStyle.fill)
  if (isSelected) {
    rect.setAttribute('stroke', '#4a90e2')
    rect.setAttribute('stroke-width', String(blockStyle.strokeWidth + 2))
    rect.setAttribute('filter', 'drop-shadow(0 0 8px rgba(74, 144, 226, 0.5))')
  } else {
    rect.setAttribute('stroke', blockStyle.stroke)
    rect.setAttribute('stroke-width', String(blockStyle.strokeWidth))
  }
  rect.setAttribute('rx', String(blockStyle.cornerRadius))
  rect.setAttribute('opacity', opacity)
  return rect
}
