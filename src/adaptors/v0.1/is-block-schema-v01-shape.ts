import type { BlockSchemaV01 } from './types.js'

/**
 * Lightweight type guard to check if an object has the v0.1 schema shape
 * Does NOT perform full JSON Schema validation (use isBlockSchemaV01 for that)
 * This is used for auto-detection in setBlocks()
 */
export function isBlockSchemaV01Shape(obj: unknown): obj is BlockSchemaV01 {
  if (typeof obj !== 'object' || obj === null) {
    return false
  }

  // Check required properties without type assertion
  if (!('id' in obj) || typeof obj.id !== 'string') {
    return false
  }

  // Check title structure (v0.1 format uses 'he_text' and 'en_text')
  if (
    !('title' in obj) ||
    typeof obj.title !== 'object' ||
    obj.title === null ||
    Array.isArray(obj.title)
  ) {
    return false
  }

  const title = obj.title
  if (
    !('he_text' in title) ||
    !('en_text' in title) ||
    typeof title.he_text !== 'string' ||
    typeof title.en_text !== 'string'
  ) {
    return false
  }

  // Check prerequisites and parents are arrays
  if (!('prerequisites' in obj) || !Array.isArray(obj.prerequisites)) {
    return false
  }
  if (!('parents' in obj) || !Array.isArray(obj.parents)) {
    return false
  }

  return true
}
