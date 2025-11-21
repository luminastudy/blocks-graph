import type { Block } from './block.js'

/**
 * Type guard to check if an object is a valid internal Block
 * Distinguishes internal format from external schemas like v0.1
 */
export function isBlock(obj: unknown): obj is Block {
  if (typeof obj !== 'object' || obj === null) {
    return false
  }

  // Check required properties without type assertion
  if (!('id' in obj) || typeof obj.id !== 'string') {
    return false
  }

  // Check title structure (internal format uses 'he' and 'en', not 'he_text' and 'en_text')
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
    !('he' in title) ||
    !('en' in title) ||
    typeof title.he !== 'string' ||
    typeof title.en !== 'string'
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
