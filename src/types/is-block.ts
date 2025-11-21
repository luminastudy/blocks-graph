/**
 * Type guard to check if an object is a valid internal Block
 * Uses JSON Schema validation via AJV for accuracy and maintainability
 */

import type { Block } from './block.js'
import { validateInternalBlock } from './block-validator-setup.js'

export function isBlock(obj: unknown): obj is Block {
  return validateInternalBlock(obj)
}
