import { describe, it, expect } from 'vitest'
import { isValidOrientation } from './is-valid-orientation.js'

describe('isValidOrientation', () => {
  it('should return true for valid orientation values', () => {
    expect(isValidOrientation('ttb')).toBe(true)
    expect(isValidOrientation('ltr')).toBe(true)
    expect(isValidOrientation('rtl')).toBe(true)
    expect(isValidOrientation('btt')).toBe(true)
  })

  it('should return false for invalid orientation values', () => {
    expect(isValidOrientation('invalid')).toBe(false)
    expect(isValidOrientation('top')).toBe(false)
    expect(isValidOrientation('')).toBe(false)
  })

  it('should return false for null', () => {
    expect(isValidOrientation(null)).toBe(false)
  })
})
