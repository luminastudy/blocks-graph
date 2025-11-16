/**
 * Positioned block combining block data with layout information
 */

import type { Block } from './block.js'
import type { BlockPosition } from './block-position.js'

export interface PositionedBlock {
  block: Block
  position: BlockPosition
}
