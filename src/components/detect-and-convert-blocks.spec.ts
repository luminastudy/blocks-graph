import { describe, it, expect } from 'vitest'
import { detectAndConvertBlocks } from './detect-and-convert-blocks.js'
import { InvalidBlockSchemaError } from '../errors/invalid-block-schema-error.js'

describe('detectAndConvertBlocks', () => {
  it('should convert v0.1 schema blocks to internal format', () => {
    const v01Blocks = [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        title: { he_text: 'כותרת', en_text: 'Title' },
        prerequisites: [],
        parents: [],
      },
    ]
    const result = detectAndConvertBlocks(v01Blocks)
    expect(result).toHaveLength(1)
    expect(result[0]?.title).toHaveProperty('he')
    expect(result[0]?.title).toHaveProperty('en')
  })

  it('should return internal format blocks unchanged', () => {
    const internalBlocks = [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        title: { he: 'כותרת', en: 'Title' },
        prerequisites: [],
        parents: [],
      },
    ]
    const result = detectAndConvertBlocks(internalBlocks)
    expect(result).toEqual(internalBlocks)
  })

  it('should throw error for mixed block formats', () => {
    const mixedBlocks = [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        title: { he_text: 'כותרת', en_text: 'Title' },
        prerequisites: [],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        title: { he: 'כותרת', en: 'Title' },
        prerequisites: [],
        parents: [],
      },
    ]
    expect(() => detectAndConvertBlocks(mixedBlocks)).toThrow(
      InvalidBlockSchemaError
    )
  })

  it('should throw error for unknown format', () => {
    const unknownBlocks = [{ id: '123', name: 'unknown' }]
    expect(() =>
      detectAndConvertBlocks(
        unknownBlocks as Parameters<typeof detectAndConvertBlocks>[0]
      )
    ).toThrow(InvalidBlockSchemaError)
  })
})
