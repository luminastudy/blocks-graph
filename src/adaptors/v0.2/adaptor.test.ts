import { describe, expect, it } from 'vitest'
import { SchemaV02Adaptor } from './adaptor.js'
import type { BlockSchemaV02 } from './types.js'
import { isLocalUuid } from './is-local-uuid.js'
import { isExternalReference } from './is-external-reference.js'
import { parseExternalReference } from './parse-external-reference.js'
import { getExternalReferenceUrl } from './get-external-reference-url.js'
import { getExternalReferenceLabel } from './get-external-reference-label.js'

describe('SchemaV02Adaptor', () => {
  const adaptor = new SchemaV02Adaptor()

  describe('adapt', () => {
    it('should convert a schema v0.2 block to internal format', () => {
      const schemaBlock: BlockSchemaV02 = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        title: {
          he_text: 'מבוא למתמטיקה',
          en_text: 'Introduction to Mathematics',
        },
        prerequisites: [],
        parents: [],
      }

      const result = adaptor.adapt(schemaBlock)

      expect(result).toEqual({
        id: '550e8400-e29b-41d4-a716-446655440000',
        title: {
          he: 'מבוא למתמטיקה',
          en: 'Introduction to Mathematics',
        },
        prerequisites: [],
        parents: [],
      })
    })

    it('should preserve external references in prerequisites and parents', () => {
      const schemaBlock: BlockSchemaV02 = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        title: {
          he_text: 'בלוק מתקדם',
          en_text: 'Advanced Block',
        },
        prerequisites: [
          '550e8400-e29b-41d4-a716-446655440001',
          'github:lumina-study/math-blocks#v1.0.0',
        ],
        parents: ['gitlab:myorg/foundations'],
      }

      const result = adaptor.adapt(schemaBlock)

      expect(result.prerequisites).toEqual([
        '550e8400-e29b-41d4-a716-446655440001',
        'github:lumina-study/math-blocks#v1.0.0',
      ])
      expect(result.parents).toEqual(['gitlab:myorg/foundations'])
    })

    it('should preserve additional properties', () => {
      const schemaBlock: BlockSchemaV02 = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        title: {
          he_text: 'מבוא',
          en_text: 'Introduction',
        },
        prerequisites: [],
        parents: [],
        customField: 'custom value',
        anotherField: 123,
      }

      const result = adaptor.adapt(schemaBlock)

      expect(result.customField).toBe('custom value')
      expect(result.anotherField).toBe(123)
    })
  })

  describe('adaptMany', () => {
    it('should convert multiple blocks', () => {
      const schemaBlocks: BlockSchemaV02[] = [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          title: { he_text: 'א', en_text: 'A' },
          prerequisites: [],
          parents: [],
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          title: { he_text: 'ב', en_text: 'B' },
          prerequisites: ['550e8400-e29b-41d4-a716-446655440001'],
          parents: [],
        },
      ]

      const results = adaptor.adaptMany(schemaBlocks)

      expect(results).toHaveLength(2)
      expect(results[0]!.id).toBe('550e8400-e29b-41d4-a716-446655440001')
      expect(results[1]!.id).toBe('550e8400-e29b-41d4-a716-446655440002')
    })

    it('should create placeholder blocks for external references', () => {
      const schemaBlocks: BlockSchemaV02[] = [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          title: { he_text: 'א', en_text: 'A' },
          prerequisites: ['github:lumina-study/foundations#v1.0.0'],
          parents: [],
        },
      ]

      const results = adaptor.adaptMany(schemaBlocks)

      // Should have original block + placeholder
      expect(results).toHaveLength(2)

      // Find the placeholder block
      const placeholder = results.find(
        b => b.id === 'github:lumina-study/foundations#v1.0.0'
      )
      expect(placeholder).toBeDefined()
      expect(placeholder!._external).toBe(true)
      expect(placeholder!._externalPlatform).toBe('github')
      expect(placeholder!._externalUrl).toBe(
        'https://github.com/lumina-study/foundations/tree/v1.0.0'
      )
      expect(placeholder!._externalOrg).toBe('lumina-study')
      expect(placeholder!._externalRepo).toBe('foundations')
      expect(placeholder!._externalGitRef).toBe('v1.0.0')
    })

    it('should deduplicate external references', () => {
      const schemaBlocks: BlockSchemaV02[] = [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          title: { he_text: 'א', en_text: 'A' },
          prerequisites: ['github:org/repo#v1.0.0'],
          parents: [],
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          title: { he_text: 'ב', en_text: 'B' },
          prerequisites: ['github:org/repo#v1.0.0'], // Same external ref
          parents: [],
        },
      ]

      const results = adaptor.adaptMany(schemaBlocks)

      // 2 original blocks + 1 deduplicated placeholder
      expect(results).toHaveLength(3)

      const placeholders = results.filter(b => b._external === true)
      expect(placeholders).toHaveLength(1)
    })

    it('should handle external references in both prerequisites and parents', () => {
      const schemaBlocks: BlockSchemaV02[] = [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          title: { he_text: 'א', en_text: 'A' },
          prerequisites: ['github:org/prereq-repo'],
          parents: ['gitlab:org/parent-repo'],
        },
      ]

      const results = adaptor.adaptMany(schemaBlocks)

      // 1 original + 2 placeholders
      expect(results).toHaveLength(3)

      const githubPlaceholder = results.find(
        b => b.id === 'github:org/prereq-repo'
      )
      const gitlabPlaceholder = results.find(
        b => b.id === 'gitlab:org/parent-repo'
      )

      expect(githubPlaceholder).toBeDefined()
      expect(githubPlaceholder!._externalPlatform).toBe('github')

      expect(gitlabPlaceholder).toBeDefined()
      expect(gitlabPlaceholder!._externalPlatform).toBe('gitlab')
    })

    it('should handle external references with block IDs', () => {
      const schemaBlocks: BlockSchemaV02[] = [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          title: { he_text: 'א', en_text: 'A' },
          prerequisites: [
            'github:org/repo/550e8400-e29b-41d4-a716-446655440099#v1.0.0',
          ],
          parents: [],
        },
      ]

      const results = adaptor.adaptMany(schemaBlocks)

      const placeholder = results.find(b => b._external === true)
      expect(placeholder).toBeDefined()
      expect(placeholder!._externalBlockId).toBe(
        '550e8400-e29b-41d4-a716-446655440099'
      )
    })
  })

  describe('adaptFromJson', () => {
    it('should parse and adapt a single block from JSON', () => {
      const json = JSON.stringify({
        id: '550e8400-e29b-41d4-a716-446655440000',
        title: { he_text: 'א', en_text: 'A' },
        prerequisites: [],
        parents: [],
      })

      const results = adaptor.adaptFromJson(json)

      expect(results).toHaveLength(1)
      expect(results[0]!.id).toBe('550e8400-e29b-41d4-a716-446655440000')
    })

    it('should parse and adapt an array of blocks from JSON', () => {
      const json = JSON.stringify([
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          title: { he_text: 'א', en_text: 'A' },
          prerequisites: [],
          parents: [],
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          title: { he_text: 'ב', en_text: 'B' },
          prerequisites: [],
          parents: [],
        },
      ])

      const results = adaptor.adaptFromJson(json)

      expect(results).toHaveLength(2)
    })

    it('should create placeholders for external refs in JSON', () => {
      const json = JSON.stringify({
        id: '550e8400-e29b-41d4-a716-446655440000',
        title: { he_text: 'א', en_text: 'A' },
        prerequisites: ['github:org/repo#main'],
        parents: [],
      })

      const results = adaptor.adaptFromJson(json)

      // 1 original + 1 placeholder
      expect(results).toHaveLength(2)
      expect(results.some(b => b._external === true)).toBe(true)
    })

    it('should throw error for invalid JSON', () => {
      expect(() => adaptor.adaptFromJson('invalid json')).toThrow()
    })

    it('should throw error for invalid schema format', () => {
      const json = JSON.stringify({ invalid: 'data' })

      expect(() => adaptor.adaptFromJson(json)).toThrow(
        'Invalid block schema v0.2 format'
      )
    })
  })

  describe('validate', () => {
    it('should validate a valid block with local UUIDs only', () => {
      const block = {
        id: '550e8400-e29b-41d4-a716-446655440001',
        title: { he_text: 'א', en_text: 'A' },
        prerequisites: ['550e8400-e29b-41d4-a716-446655440002'],
        parents: [],
      }

      expect(SchemaV02Adaptor.validate(block)).toBe(true)
    })

    it('should validate a valid block with external references', () => {
      const block = {
        id: '550e8400-e29b-41d4-a716-446655440001',
        title: { he_text: 'א', en_text: 'A' },
        prerequisites: [
          '550e8400-e29b-41d4-a716-446655440002',
          'github:org/repo#v1.0.0',
        ],
        parents: ['gitlab:myorg/myrepo'],
      }

      expect(SchemaV02Adaptor.validate(block)).toBe(true)
    })

    it('should validate an array of valid blocks', () => {
      const blocks = [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          title: { he_text: 'א', en_text: 'A' },
          prerequisites: ['github:org/repo'],
          parents: [],
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          title: { he_text: 'ב', en_text: 'B' },
          prerequisites: [],
          parents: [],
        },
      ]

      expect(SchemaV02Adaptor.validate(blocks)).toBe(true)
    })

    it('should reject invalid blocks', () => {
      expect(SchemaV02Adaptor.validate({ invalid: 'data' })).toBe(false)
      expect(SchemaV02Adaptor.validate(null)).toBe(false)
      expect(SchemaV02Adaptor.validate(undefined)).toBe(false)
    })
  })

  describe('extractExternalReferences', () => {
    it('should extract all unique external references', () => {
      const schemaBlocks: BlockSchemaV02[] = [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          title: { he_text: 'א', en_text: 'A' },
          prerequisites: ['github:org/repo1', 'github:org/repo2'],
          parents: ['gitlab:org/repo3'],
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          title: { he_text: 'ב', en_text: 'B' },
          prerequisites: ['github:org/repo1'], // Duplicate
          parents: [],
        },
      ]

      const refs = adaptor.extractExternalReferences(schemaBlocks)

      expect(refs).toHaveLength(3)
      expect(refs).toContain('github:org/repo1')
      expect(refs).toContain('github:org/repo2')
      expect(refs).toContain('gitlab:org/repo3')
    })

    it('should return empty array when no external references', () => {
      const schemaBlocks: BlockSchemaV02[] = [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          title: { he_text: 'א', en_text: 'A' },
          prerequisites: ['550e8400-e29b-41d4-a716-446655440002'],
          parents: [],
        },
      ]

      const refs = adaptor.extractExternalReferences(schemaBlocks)

      expect(refs).toHaveLength(0)
    })
  })
})

describe('block-reference utilities', () => {
  describe('isLocalUuid', () => {
    it('should return true for valid UUIDs', () => {
      expect(isLocalUuid('550e8400-e29b-41d4-a716-446655440000')).toBe(true)
      expect(isLocalUuid('ABC12345-6789-1234-5678-123456789ABC')).toBe(true)
    })

    it('should return false for external references', () => {
      expect(isLocalUuid('github:org/repo')).toBe(false)
      expect(isLocalUuid('gitlab:org/repo#v1.0.0')).toBe(false)
    })

    it('should return false for invalid strings', () => {
      expect(isLocalUuid('not-a-uuid')).toBe(false)
      expect(isLocalUuid('')).toBe(false)
    })
  })

  describe('isExternalReference', () => {
    it('should return true for GitHub references', () => {
      expect(isExternalReference('github:org/repo')).toBe(true)
      expect(isExternalReference('github:lumina-study/blocks#v1.0.0')).toBe(
        true
      )
      expect(
        isExternalReference(
          'github:org/repo/550e8400-e29b-41d4-a716-446655440000'
        )
      ).toBe(true)
    })

    it('should return true for GitLab references', () => {
      expect(isExternalReference('gitlab:org/repo')).toBe(true)
      expect(isExternalReference('gitlab:myorg/myrepo#main')).toBe(true)
    })

    it('should return false for local UUIDs', () => {
      expect(isExternalReference('550e8400-e29b-41d4-a716-446655440000')).toBe(
        false
      )
    })

    it('should return false for invalid references', () => {
      expect(isExternalReference('bitbucket:org/repo')).toBe(false)
      expect(isExternalReference('github:')).toBe(false)
      expect(isExternalReference('')).toBe(false)
    })
  })

  describe('parseExternalReference', () => {
    it('should parse simple GitHub reference', () => {
      const result = parseExternalReference('github:lumina-study/blocks')

      expect(result).toEqual({
        platform: 'github',
        org: 'lumina-study',
        repo: 'blocks',
        blockId: null,
        gitRef: null,
        raw: 'github:lumina-study/blocks',
      })
    })

    it('should parse GitHub reference with git ref', () => {
      const result = parseExternalReference('github:org/repo#v1.0.0')

      expect(result).toEqual({
        platform: 'github',
        org: 'org',
        repo: 'repo',
        blockId: null,
        gitRef: 'v1.0.0',
        raw: 'github:org/repo#v1.0.0',
      })
    })

    it('should parse GitHub reference with block ID', () => {
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

    it('should parse full GitHub reference with block ID and git ref', () => {
      const result = parseExternalReference(
        'github:org/repo/550e8400-e29b-41d4-a716-446655440000#v2.0.0'
      )

      expect(result).toEqual({
        platform: 'github',
        org: 'org',
        repo: 'repo',
        blockId: '550e8400-e29b-41d4-a716-446655440000',
        gitRef: 'v2.0.0',
        raw: 'github:org/repo/550e8400-e29b-41d4-a716-446655440000#v2.0.0',
      })
    })

    it('should parse GitLab reference', () => {
      const result = parseExternalReference('gitlab:myorg/myrepo#main')

      expect(result).toEqual({
        platform: 'gitlab',
        org: 'myorg',
        repo: 'myrepo',
        blockId: null,
        gitRef: 'main',
        raw: 'gitlab:myorg/myrepo#main',
      })
    })

    it('should return null for invalid references', () => {
      expect(parseExternalReference('not-a-reference')).toBeNull()
      expect(
        parseExternalReference('550e8400-e29b-41d4-a716-446655440000')
      ).toBeNull()
    })
  })

  describe('getExternalReferenceUrl', () => {
    it('should generate GitHub URL without ref', () => {
      const parsed = parseExternalReference('github:lumina-study/blocks')!
      expect(getExternalReferenceUrl(parsed)).toBe(
        'https://github.com/lumina-study/blocks'
      )
    })

    it('should generate GitHub URL with ref', () => {
      const parsed = parseExternalReference('github:org/repo#v1.0.0')!
      expect(getExternalReferenceUrl(parsed)).toBe(
        'https://github.com/org/repo/tree/v1.0.0'
      )
    })

    it('should generate GitLab URL', () => {
      const parsed = parseExternalReference('gitlab:myorg/myrepo')!
      expect(getExternalReferenceUrl(parsed)).toBe(
        'https://gitlab.com/myorg/myrepo'
      )
    })
  })

  describe('getExternalReferenceLabel', () => {
    it('should generate simple label', () => {
      const parsed = parseExternalReference('github:org/repo')!
      expect(getExternalReferenceLabel(parsed)).toBe('org/repo')
    })

    it('should include git ref in label', () => {
      const parsed = parseExternalReference('github:org/repo#v1.0.0')!
      expect(getExternalReferenceLabel(parsed)).toBe('org/repo#v1.0.0')
    })

    it('should include abbreviated block ID in label', () => {
      const parsed = parseExternalReference(
        'github:org/repo/550e8400-e29b-41d4-a716-446655440000'
      )!
      expect(getExternalReferenceLabel(parsed)).toBe('org/repo (550e8400...)')
    })

    it('should include both ref and block ID in label', () => {
      const parsed = parseExternalReference(
        'github:org/repo/550e8400-e29b-41d4-a716-446655440000#v1.0.0'
      )!
      expect(getExternalReferenceLabel(parsed)).toBe(
        'org/repo#v1.0.0 (550e8400...)'
      )
    })
  })
})
