import { describe, it, expect } from 'vitest'
import { isLocalUuid } from './is-local-uuid.js'

describe('isLocalUuid', () => {
  it('should return true for valid UUIDs', () => {
    expect(isLocalUuid('550e8400-e29b-41d4-a716-446655440000')).toBe(true)
    expect(isLocalUuid('6ba7b810-9dad-11d1-80b4-00c04fd430c8')).toBe(true)
    expect(isLocalUuid('AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE')).toBe(true)
  })

  it('should return false for invalid UUIDs', () => {
    expect(isLocalUuid('not-a-uuid')).toBe(false)
    expect(isLocalUuid('550e8400-e29b-41d4-a716')).toBe(false)
    expect(isLocalUuid('550e8400-e29b-41d4-a716-446655440000-extra')).toBe(
      false
    )
    expect(isLocalUuid('')).toBe(false)
  })

  it('should return false for malformed UUIDs', () => {
    expect(isLocalUuid('550e8400e29b41d4a716446655440000')).toBe(false)
    expect(isLocalUuid('550e8400-e29b-41d4-a716-44665544000g')).toBe(false)
  })
})
