import { describe, it, expect } from 'vitest'
import { findDuplicateIds } from './find-duplicate-ids.js'

describe('findDuplicateIds', () => {
  it('should return empty array when no duplicates', () => {
    const blocks = [{ id: 'a' }, { id: 'b' }, { id: 'c' }]
    expect(findDuplicateIds(blocks)).toEqual([])
  })

  it('should find duplicate IDs', () => {
    const blocks = [{ id: 'a' }, { id: 'b' }, { id: 'a' }, { id: 'c' }]
    expect(findDuplicateIds(blocks)).toEqual(['a'])
  })

  it('should find multiple duplicates', () => {
    const blocks = [
      { id: 'a' },
      { id: 'b' },
      { id: 'a' },
      { id: 'b' },
      { id: 'c' },
    ]
    const duplicates = findDuplicateIds(blocks)
    expect(duplicates).toContain('a')
    expect(duplicates).toContain('b')
    expect(duplicates.length).toBe(2)
  })

  it('should handle empty array', () => {
    expect(findDuplicateIds([])).toEqual([])
  })

  it('should handle single element', () => {
    expect(findDuplicateIds([{ id: 'a' }])).toEqual([])
  })
})
