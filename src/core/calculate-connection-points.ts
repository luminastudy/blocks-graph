import type { BlockPosition } from '../types/block-position.js'
import type { Orientation } from '../types/orientation.js'
import type { ConnectionPoints } from '../types/connection-points.js'

export function calculateConnectionPoints(
  fromPos: BlockPosition,
  toPos: BlockPosition,
  orientation: Orientation
): ConnectionPoints {
  switch (orientation) {
    case 'ttb':
      return {
        x1: fromPos.x + fromPos.width / 2,
        y1: fromPos.y + fromPos.height,
        x2: toPos.x + toPos.width / 2,
        y2: toPos.y,
      }
    case 'btt':
      return {
        x1: fromPos.x + fromPos.width / 2,
        y1: fromPos.y,
        x2: toPos.x + toPos.width / 2,
        y2: toPos.y + toPos.height,
      }
    case 'ltr':
      return {
        x1: fromPos.x + fromPos.width,
        y1: fromPos.y + fromPos.height / 2,
        x2: toPos.x,
        y2: toPos.y + toPos.height / 2,
      }
    case 'rtl':
      return {
        x1: fromPos.x,
        y1: fromPos.y + fromPos.height / 2,
        x2: toPos.x + toPos.width,
        y2: toPos.y + toPos.height / 2,
      }
  }
}
