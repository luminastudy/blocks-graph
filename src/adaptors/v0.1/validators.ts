/**
 * Type guard to check if an object is a valid BlockSchemaV01
 * Uses JSON Schema validation from @lumina-study/block-schema
 */

import type { BlockSchemaV01 } from './types.js'
import { validateBlock } from './validator-setup.js'

export function isBlockSchemaV01(obj: unknown): obj is BlockSchemaV01 {
  return validateBlock(obj)
}
