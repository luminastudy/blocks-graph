import { describe, it, expect, beforeEach } from 'vitest'
import { BlocksGraph } from './blocks-graph.js'
import type { Block } from '../types/block.js'
import type { BlockSchemaV01 } from '../adaptors/v0.1/types.js'
import { DuplicateBlockIdError } from '../errors/duplicate-block-id-error.js'

describe('BlocksGraph - Auto-detection', () => {
  let element: BlocksGraph

  beforeEach(() => {
    element = new BlocksGraph()
    document.body.appendChild(element)
  })

  describe('setBlocks with internal format', () => {
    it('should accept and render internal Block[] format', () => {
      const internalBlocks: Block[] = [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          title: {
            he: 'מבוא למתמטיקה',
            en: 'Introduction to Mathematics',
          },
          prerequisites: [],
          parents: [],
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          title: {
            he: 'אלגברה ליניארית',
            en: 'Linear Algebra',
          },
          prerequisites: ['550e8400-e29b-41d4-a716-446655440000'],
          parents: ['550e8400-e29b-41d4-a716-446655440000'],
        },
      ]

      expect(() => element.setBlocks(internalBlocks)).not.toThrow()
    })

    it('should preserve internal format blocks unchanged', () => {
      const internalBlocks: Block[] = [
        {
          id: 'test-id',
          title: { he: 'כותרת', en: 'Title' },
          prerequisites: ['prereq-1'],
          parents: ['parent-1'],
          customField: 'custom-value',
        },
      ]

      element.setBlocks(internalBlocks)

      // Access private field for testing
      const storedBlocks = (element as unknown as { blocks: Block[] }).blocks
      expect(storedBlocks).toEqual(internalBlocks)
      expect(storedBlocks[0]?.customField).toBe('custom-value')
    })
  })

  describe('setBlocks with v0.1 schema format', () => {
    it('should accept and convert v0.1 BlockSchemaV01[] format', () => {
      const v01Blocks: BlockSchemaV01[] = [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          title: {
            he_text: 'מבוא למתמטיקה',
            en_text: 'Introduction to Mathematics',
          },
          prerequisites: [],
          parents: [],
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          title: {
            he_text: 'אלגברה ליניארית',
            en_text: 'Linear Algebra',
          },
          prerequisites: ['550e8400-e29b-41d4-a716-446655440000'],
          parents: ['550e8400-e29b-41d4-a716-446655440000'],
        },
      ]

      expect(() => element.setBlocks(v01Blocks)).not.toThrow()
    })

    it('should convert v0.1 format to internal format', () => {
      const v01Blocks: BlockSchemaV01[] = [
        {
          id: '550e8400-e29b-41d4-a716-446655440010',
          title: {
            he_text: 'כותרת',
            en_text: 'Title',
          },
          prerequisites: ['550e8400-e29b-41d4-a716-446655440011'],
          parents: ['550e8400-e29b-41d4-a716-446655440012'],
        },
      ]

      element.setBlocks(v01Blocks)

      // Access private field for testing
      const storedBlocks = (element as unknown as { blocks: Block[] }).blocks
      expect(storedBlocks[0]?.title).toEqual({
        he: 'כותרת',
        en: 'Title',
      })
    })

    it('should preserve extra properties from v0.1 format', () => {
      const v01Blocks = [
        {
          id: '550e8400-e29b-41d4-a716-446655440020',
          title: {
            he_text: 'כותרת',
            en_text: 'Title',
          },
          prerequisites: [],
          parents: [],
          customField: 'custom-value',
          metadata: { key: 'value' },
        },
      ] as BlockSchemaV01[]

      element.setBlocks(v01Blocks)

      const storedBlocks = (element as unknown as { blocks: Block[] }).blocks
      expect(storedBlocks[0]?.customField).toBe('custom-value')
      expect(storedBlocks[0]?.metadata).toEqual({ key: 'value' })
    })
  })

  describe('setBlocks with empty array', () => {
    it('should handle empty array gracefully', () => {
      expect(() => element.setBlocks([])).not.toThrow()

      const storedBlocks = (element as unknown as { blocks: Block[] }).blocks
      expect(storedBlocks).toEqual([])
    })
  })

  describe('setBlocks error handling', () => {
    it('should throw error for mixed format arrays', () => {
      const mixedBlocks = [
        {
          id: 'block-1',
          title: { he: 'כותרת', en: 'Title' }, // Internal format
          prerequisites: [],
          parents: [],
        },
        {
          id: 'block-2',
          title: { he_text: 'כותרת', en_text: 'Title' }, // v0.1 format
          prerequisites: [],
          parents: [],
        },
      ] as (Block | BlockSchemaV01)[]

      expect(() => element.setBlocks(mixedBlocks)).toThrow(
        'Mixed block formats detected'
      )
    })

    it('should throw error for invalid block format', () => {
      const invalidBlocks = [
        {
          id: 'test',
          // Missing title entirely
          prerequisites: [],
          parents: [],
        },
      ] as Block[]

      expect(() => element.setBlocks(invalidBlocks)).toThrow(
        'Unable to detect block schema format'
      )
    })

    it('should throw error for blocks with wrong title structure', () => {
      const invalidBlocks = [
        {
          id: 'test',
          title: 'string title', // Wrong type
          prerequisites: [],
          parents: [],
        },
      ] as unknown as Block[]

      expect(() => element.setBlocks(invalidBlocks)).toThrow()
    })
  })

  describe('setBlocks with multiple blocks', () => {
    it('should handle large arrays of internal format blocks', () => {
      const largeBlockArray: Block[] = Array.from({ length: 100 }, (_, i) => ({
        id: `block-${i}`,
        title: {
          he: `כותרת ${i}`,
          en: `Title ${i}`,
        },
        prerequisites: i > 0 ? [`block-${i - 1}`] : [],
        parents: i > 0 ? [`block-${i - 1}`] : [],
      }))

      expect(() => element.setBlocks(largeBlockArray)).not.toThrow()

      const storedBlocks = (element as unknown as { blocks: Block[] }).blocks
      expect(storedBlocks).toHaveLength(100)
    })

    it('should handle large arrays of v0.1 format blocks', () => {
      const largeV01Array: BlockSchemaV01[] = Array.from(
        { length: 100 },
        (_, i) => {
          // Generate valid UUIDs with sequential increments for testing
          const currentId = `550e8400-e29b-41d4-a716-4466554400${String(i).padStart(2, '0')}`
          const prevId =
            i > 0
              ? `550e8400-e29b-41d4-a716-4466554400${String(i - 1).padStart(2, '0')}`
              : null

          return {
            id: currentId,
            title: {
              he_text: `כותרת ${i}`,
              en_text: `Title ${i}`,
            },
            prerequisites: prevId ? [prevId] : [],
            parents: prevId ? [prevId] : [],
          }
        }
      )

      expect(() => element.setBlocks(largeV01Array)).not.toThrow()

      const storedBlocks = (element as unknown as { blocks: Block[] }).blocks
      expect(storedBlocks).toHaveLength(100)
      // Verify conversion happened
      expect(storedBlocks[0]?.title).toHaveProperty('he')
      expect(storedBlocks[0]?.title).toHaveProperty('en')
      expect(storedBlocks[0]?.title).not.toHaveProperty('he_text')
      expect(storedBlocks[0]?.title).not.toHaveProperty('en_text')
    })
  })

  describe('setBlocks consistency', () => {
    it('should detect all blocks as internal format when all are valid', () => {
      const allInternal: Block[] = [
        {
          id: 'block-1',
          title: { he: 'כותרת 1', en: 'Title 1' },
          prerequisites: [],
          parents: [],
        },
        {
          id: 'block-2',
          title: { he: 'כותרת 2', en: 'Title 2' },
          prerequisites: [],
          parents: [],
        },
        {
          id: 'block-3',
          title: { he: 'כותרת 3', en: 'Title 3' },
          prerequisites: [],
          parents: [],
        },
      ]

      expect(() => element.setBlocks(allInternal)).not.toThrow()
    })

    it('should detect all blocks as v0.1 format when all are valid', () => {
      const allV01: BlockSchemaV01[] = [
        {
          id: '550e8400-e29b-41d4-a716-446655440100',
          title: { he_text: 'כותרת 1', en_text: 'Title 1' },
          prerequisites: [],
          parents: [],
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440101',
          title: { he_text: 'כותרת 2', en_text: 'Title 2' },
          prerequisites: [],
          parents: [],
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440102',
          title: { he_text: 'כותרת 3', en_text: 'Title 3' },
          prerequisites: [],
          parents: [],
        },
      ]

      expect(() => element.setBlocks(allV01)).not.toThrow()
    })

    it('should reject array with second block in different format', () => {
      const inconsistent = [
        {
          id: '550e8400-e29b-41d4-a716-446655440110',
          title: { he: 'כותרת 1', en: 'Title 1' }, // Internal
          prerequisites: [],
          parents: [],
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440111',
          title: { he_text: 'כותרת 2', en_text: 'Title 2' }, // v0.1
          prerequisites: [],
          parents: [],
        },
      ] as (Block | BlockSchemaV01)[]

      expect(() => element.setBlocks(inconsistent)).toThrow()
    })
  })

  describe('setBlocks duplicate ID detection', () => {
    it('should throw DuplicateBlockIdError when blocks have duplicate IDs', () => {
      const blocksWithDuplicates: Block[] = [
        {
          id: 'duplicate-id',
          title: { he: 'כותרת 1', en: 'Title 1' },
          prerequisites: [],
          parents: [],
        },
        {
          id: 'duplicate-id',
          title: { he: 'כותרת 2', en: 'Title 2' },
          prerequisites: [],
          parents: [],
        },
      ]

      expect(() => element.setBlocks(blocksWithDuplicates)).toThrow(
        DuplicateBlockIdError
      )
    })

    it('should include duplicate IDs in the error message', () => {
      const blocksWithDuplicates: Block[] = [
        {
          id: 'dup-1',
          title: { he: 'כותרת 1', en: 'Title 1' },
          prerequisites: [],
          parents: [],
        },
        {
          id: 'dup-1',
          title: { he: 'כותרת 2', en: 'Title 2' },
          prerequisites: [],
          parents: [],
        },
      ]

      expect(() => element.setBlocks(blocksWithDuplicates)).toThrow('dup-1')
    })

    it('should detect multiple duplicate IDs', () => {
      const blocksWithMultipleDuplicates: Block[] = [
        {
          id: 'dup-a',
          title: { he: 'כותרת 1', en: 'Title 1' },
          prerequisites: [],
          parents: [],
        },
        {
          id: 'dup-b',
          title: { he: 'כותרת 2', en: 'Title 2' },
          prerequisites: [],
          parents: [],
        },
        {
          id: 'dup-a',
          title: { he: 'כותרת 3', en: 'Title 3' },
          prerequisites: [],
          parents: [],
        },
        {
          id: 'dup-b',
          title: { he: 'כותרת 4', en: 'Title 4' },
          prerequisites: [],
          parents: [],
        },
      ]

      try {
        element.setBlocks(blocksWithMultipleDuplicates)
        expect.fail('Expected DuplicateBlockIdError to be thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(DuplicateBlockIdError)
        const dupError = error as DuplicateBlockIdError
        expect(dupError.duplicateIds).toContain('dup-a')
        expect(dupError.duplicateIds).toContain('dup-b')
      }
    })

    it('should detect duplicate IDs in v0.1 schema format', () => {
      const v01BlocksWithDuplicates: BlockSchemaV01[] = [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          title: { he_text: 'כותרת 1', en_text: 'Title 1' },
          prerequisites: [],
          parents: [],
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          title: { he_text: 'כותרת 2', en_text: 'Title 2' },
          prerequisites: [],
          parents: [],
        },
      ]

      expect(() => element.setBlocks(v01BlocksWithDuplicates)).toThrow(
        DuplicateBlockIdError
      )
    })

    it('should allow blocks with unique IDs', () => {
      const uniqueBlocks: Block[] = [
        {
          id: 'unique-1',
          title: { he: 'כותרת 1', en: 'Title 1' },
          prerequisites: [],
          parents: [],
        },
        {
          id: 'unique-2',
          title: { he: 'כותרת 2', en: 'Title 2' },
          prerequisites: [],
          parents: [],
        },
        {
          id: 'unique-3',
          title: { he: 'כותרת 3', en: 'Title 3' },
          prerequisites: [],
          parents: [],
        },
      ]

      expect(() => element.setBlocks(uniqueBlocks)).not.toThrow()
    })

    it('should detect duplicate when same ID appears more than twice', () => {
      const blocksWithTriplicate: Block[] = [
        {
          id: 'triple-id',
          title: { he: 'כותרת 1', en: 'Title 1' },
          prerequisites: [],
          parents: [],
        },
        {
          id: 'triple-id',
          title: { he: 'כותרת 2', en: 'Title 2' },
          prerequisites: [],
          parents: [],
        },
        {
          id: 'triple-id',
          title: { he: 'כותרת 3', en: 'Title 3' },
          prerequisites: [],
          parents: [],
        },
      ]

      try {
        element.setBlocks(blocksWithTriplicate)
        expect.fail('Expected DuplicateBlockIdError to be thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(DuplicateBlockIdError)
        const dupError = error as DuplicateBlockIdError
        // Should only report the ID once even if it appears 3 times
        expect(dupError.duplicateIds).toHaveLength(1)
        expect(dupError.duplicateIds[0]).toBe('triple-id')
      }
    })
  })
})
