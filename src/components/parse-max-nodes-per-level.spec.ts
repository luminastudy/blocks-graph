import { describe, it, expect } from 'vitest'
import { parseMaxNodesPerLevel } from './parse-max-nodes-per-level.js'

describe('parseMaxNodesPerLevel', () => {
  it('should return undefined for null', () => {
    expect(parseMaxNodesPerLevel(null)).toBeUndefined()
  })

  it('should return undefined for empty string', () => {
    expect(parseMaxNodesPerLevel('')).toBeUndefined()
  })

  it('should parse valid positive numbers', () => {
    expect(parseMaxNodesPerLevel('5')).toBe(5)
    expect(parseMaxNodesPerLevel('100')).toBe(100)
    expect(parseMaxNodesPerLevel('1')).toBe(1)
  })

  it('should return undefined for zero', () => {
    expect(parseMaxNodesPerLevel('0')).toBeUndefined()
  })

  it('should return undefined for negative numbers', () => {
    expect(parseMaxNodesPerLevel('-1')).toBeUndefined()
    expect(parseMaxNodesPerLevel('-10')).toBeUndefined()
  })

  it('should return undefined for invalid strings', () => {
    expect(parseMaxNodesPerLevel('abc')).toBeUndefined()
  })

  it('should parse decimal numbers as integers', () => {
    // parseInt('12.5', 10) returns 12
    expect(parseMaxNodesPerLevel('12.5')).toBe(12)
  })
})
