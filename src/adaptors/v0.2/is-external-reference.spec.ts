import { describe, it, expect } from 'vitest'
import { isExternalReference } from './is-external-reference.js'

describe('isExternalReference', () => {
  it('should return true for valid github references', () => {
    expect(isExternalReference('github:org/repo')).toBe(true)
    expect(isExternalReference('github:org/repo#main')).toBe(true)
    expect(isExternalReference('github:org/repo/path/to/file')).toBe(true)
  })

  it('should return true for valid gitlab references', () => {
    expect(isExternalReference('gitlab:org/repo')).toBe(true)
    expect(isExternalReference('gitlab:org/repo#main')).toBe(true)
    expect(isExternalReference('gitlab:org/repo/path/to/file')).toBe(true)
  })

  it('should return false for invalid references', () => {
    expect(isExternalReference('github:')).toBe(false)
    expect(isExternalReference('github:/')).toBe(false)
    expect(isExternalReference('github:/repo')).toBe(false)
    expect(isExternalReference('github:org')).toBe(false)
    expect(isExternalReference('github:org/')).toBe(false)
  })

  it('should return false for non-external references', () => {
    expect(isExternalReference('local-uuid')).toBe(false)
    expect(isExternalReference('http://example.com')).toBe(false)
    expect(isExternalReference('just-a-string')).toBe(false)
  })
})
