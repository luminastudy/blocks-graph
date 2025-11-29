import { describe, it, expect } from 'vitest'
import { getExternalReferenceUrl } from './get-external-reference-url.js'
import type { ParsedExternalReference } from './parsed-external-reference.js'

describe('getExternalReferenceUrl', () => {
  it('should generate GitHub URL without git ref', () => {
    const parsed: ParsedExternalReference = {
      platform: 'github',
      org: 'myorg',
      repo: 'myrepo',
      gitRef: null,
      blockId: null,
    }
    expect(getExternalReferenceUrl(parsed)).toBe(
      'https://github.com/myorg/myrepo'
    )
  })

  it('should generate GitHub URL with git ref', () => {
    const parsed: ParsedExternalReference = {
      platform: 'github',
      org: 'myorg',
      repo: 'myrepo',
      gitRef: 'main',
      blockId: null,
    }
    expect(getExternalReferenceUrl(parsed)).toBe(
      'https://github.com/myorg/myrepo/tree/main'
    )
  })

  it('should generate GitLab URL without git ref', () => {
    const parsed: ParsedExternalReference = {
      platform: 'gitlab',
      org: 'myorg',
      repo: 'myrepo',
      gitRef: null,
      blockId: null,
    }
    expect(getExternalReferenceUrl(parsed)).toBe(
      'https://gitlab.com/myorg/myrepo'
    )
  })

  it('should generate GitLab URL with git ref', () => {
    const parsed: ParsedExternalReference = {
      platform: 'gitlab',
      org: 'myorg',
      repo: 'myrepo',
      gitRef: 'develop',
      blockId: null,
    }
    expect(getExternalReferenceUrl(parsed)).toBe(
      'https://gitlab.com/myorg/myrepo/tree/develop'
    )
  })
})
