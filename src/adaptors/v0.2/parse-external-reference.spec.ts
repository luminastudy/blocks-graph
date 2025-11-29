import { describe, it, expect } from 'vitest'
import { parseExternalReference } from './parse-external-reference.js'

describe('parseExternalReference', () => {
  it('should parse basic github reference', () => {
    const result = parseExternalReference('github:org/repo')
    expect(result).toEqual({
      platform: 'github',
      org: 'org',
      repo: 'repo',
      blockId: null,
      gitRef: null,
      raw: 'github:org/repo',
    })
  })

  it('should parse github reference with git ref', () => {
    const result = parseExternalReference('github:org/repo#main')
    expect(result).toEqual({
      platform: 'github',
      org: 'org',
      repo: 'repo',
      blockId: null,
      gitRef: 'main',
      raw: 'github:org/repo#main',
    })
  })

  it('should parse github reference with block ID', () => {
    const result = parseExternalReference(
      'github:org/repo/550e8400-e29b-41d4-a716-446655440000'
    )
    expect(result).toEqual({
      platform: 'github',
      org: 'org',
      repo: 'repo',
      blockId: '550e8400-e29b-41d4-a716-446655440000',
      gitRef: null,
      raw: 'github:org/repo/550e8400-e29b-41d4-a716-446655440000',
    })
  })

  it('should parse gitlab reference', () => {
    const result = parseExternalReference('gitlab:org/repo')
    expect(result).toEqual({
      platform: 'gitlab',
      org: 'org',
      repo: 'repo',
      blockId: null,
      gitRef: null,
      raw: 'gitlab:org/repo',
    })
  })

  it('should return null for invalid references', () => {
    expect(parseExternalReference('invalid')).toBeNull()
    expect(parseExternalReference('github:')).toBeNull()
    expect(parseExternalReference('github:org')).toBeNull()
  })
})
