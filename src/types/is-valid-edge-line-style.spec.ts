import { describe, it, expect } from 'vitest'
import { isValidEdgeLineStyle } from './is-valid-edge-line-style.js'

describe('isValidEdgeLineStyle', () => {
  it('should return true for valid edge line styles', () => {
    expect(isValidEdgeLineStyle('straight')).toBe(true)
    expect(isValidEdgeLineStyle('dashed')).toBe(true)
    expect(isValidEdgeLineStyle('dotted')).toBe(true)
  })

  it('should return false for invalid edge line styles', () => {
    expect(isValidEdgeLineStyle('invalid')).toBe(false)
    expect(isValidEdgeLineStyle('solid')).toBe(false)
    expect(isValidEdgeLineStyle('')).toBe(false)
  })

  it('should return false for non-string values', () => {
    expect(isValidEdgeLineStyle(123 as unknown as string)).toBe(false)
    expect(isValidEdgeLineStyle(null as unknown as string)).toBe(false)
    expect(isValidEdgeLineStyle(undefined as unknown as string)).toBe(false)
  })
})
