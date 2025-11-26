/**
 * Type guard to check if an object is a valid BlockSchemaV02
 * Uses JSON Schema validation from @lumina-study/block-schema
 */

import type { BlockSchemaV02 } from './types.js'
import { validateBlock } from './validator-setup.js'

export function isBlockSchemaV02(obj: unknown): obj is BlockSchemaV02 {
  return validateBlock(obj)
}
