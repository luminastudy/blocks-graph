import { describe, it, expect } from 'vitest'
import { getExternalReferenceLabel } from './get-external-reference-label.js'
import type { ParsedExternalReference } from './parsed-external-reference.js'

describe('getExternalReferenceLabel', () => {
  it('should format basic org/repo', () => {
    const parsed: ParsedExternalReference = {
      platform: 'github',
      org: 'myorg',
      repo: 'myrepo',
      gitRef: null,
      blockId: null,
    }
    expect(getExternalReferenceLabel(parsed)).toBe('myorg/myrepo')
  })

  it('should include git ref when present', () => {
    const parsed: ParsedExternalReference = {
      platform: 'github',
      org: 'myorg',
      repo: 'myrepo',
      gitRef: 'main',
      blockId: null,
    }
    expect(getExternalReferenceLabel(parsed)).toBe('myorg/myrepo#main')
  })

  it('should include abbreviated block ID when present', () => {
    const parsed: ParsedExternalReference = {
      platform: 'github',
      org: 'myorg',
      repo: 'myrepo',
      gitRef: null,
      blockId: '550e8400-e29b-41d4-a716-446655440000',
    }
    expect(getExternalReferenceLabel(parsed)).toBe('myorg/myrepo (550e8400...)')
  })

  it('should include both git ref and block ID', () => {
    const parsed: ParsedExternalReference = {
      platform: 'gitlab',
      org: 'myorg',
      repo: 'myrepo',
      gitRef: 'develop',
      blockId: '550e8400-e29b-41d4-a716-446655440000',
    }
    expect(getExternalReferenceLabel(parsed)).toBe(
      'myorg/myrepo#develop (550e8400...)'
    )
  })
})
