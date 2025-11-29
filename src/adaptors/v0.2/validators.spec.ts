import { describe, it, expect } from 'vitest'
import { isBlockSchemaV02 } from './validators.js'

describe('isBlockSchemaV02', () => {
  it('should return true for valid block schema', () => {
    const validBlock = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      title: { he_text: 'Hebrew', en_text: 'English' },
      prerequisites: [],
      parents: [],
    }
    expect(isBlockSchemaV02(validBlock)).toBe(true)
  })

  it('should return false for invalid block schema', () => {
    expect(isBlockSchemaV02({})).toBe(false)
    expect(isBlockSchemaV02(null)).toBe(false)
    expect(isBlockSchemaV02('string')).toBe(false)
  })

  it('should return false for block missing required fields', () => {
    const invalidBlock = {
      id: '550e8400-e29b-41d4-a716-446655440000',
    }
    expect(isBlockSchemaV02(invalidBlock)).toBe(false)
  })
})
