import { describe, it, expect } from 'vitest'
import type { Orientation } from './orientation.js'
import { isValidOrientation } from './is-valid-orientation.js'

describe('Orientation type', () => {
  it('should accept valid orientation values', () => {
    const ttb: Orientation = 'ttb'
    const ltr: Orientation = 'ltr'
    const rtl: Orientation = 'rtl'
    const btt: Orientation = 'btt'

    expect(ttb).toBe('ttb')
    expect(ltr).toBe('ltr')
    expect(rtl).toBe('rtl')
    expect(btt).toBe('btt')
  })

  it('should provide type checking for orientation values', () => {
    const validOrientations: Orientation[] = ['ttb', 'ltr', 'rtl', 'btt']

    expect(validOrientations).toHaveLength(4)
    expect(validOrientations).toContain('ttb')
    expect(validOrientations).toContain('ltr')
    expect(validOrientations).toContain('rtl')
    expect(validOrientations).toContain('btt')
  })

  it('should validate orientation with type guard', () => {
    expect(isValidOrientation('ttb')).toBe(true)
    expect(isValidOrientation('ltr')).toBe(true)
    expect(isValidOrientation('rtl')).toBe(true)
    expect(isValidOrientation('btt')).toBe(true)
    expect(isValidOrientation('invalid')).toBe(false)
    expect(isValidOrientation('diagonal')).toBe(false)
    expect(isValidOrientation('')).toBe(false)
    expect(isValidOrientation(null)).toBe(false)
    expect(isValidOrientation(undefined)).toBe(false)
    expect(isValidOrientation(123)).toBe(false)
  })
})
