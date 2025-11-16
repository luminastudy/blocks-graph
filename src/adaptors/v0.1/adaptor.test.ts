import { describe, expect, it } from 'vitest'
import { SchemaV01Adaptor } from './adaptor.js'
import type { BlockSchemaV01 } from './types.js'

describe('SchemaV01Adaptor', () => {
  const adaptor = new SchemaV01Adaptor()

  describe('adapt', () => {
    it('should convert a schema v0.1 block to internal format', () => {
      const schemaBlock: BlockSchemaV01 = {
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

    it('should handle empty arrays for prerequisites and parents', () => {
      const schemaBlock: BlockSchemaV01 = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        title: {
          he_text: 'מבוא',
          en_text: 'Introduction',
        },
        prerequisites: [],
        parents: [],
      }

      const result = adaptor.adapt(schemaBlock)

      expect(result.prerequisites).toEqual([])
      expect(result.parents).toEqual([])
    })

    it('should preserve additional properties', () => {
      const schemaBlock: BlockSchemaV01 = {
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
      const schemaBlocks: BlockSchemaV01[] = [
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
      expect(results[1]!.prerequisites).toEqual([
        '550e8400-e29b-41d4-a716-446655440001',
      ])
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

    it('should throw error for invalid JSON', () => {
      expect(() => adaptor.adaptFromJson('invalid json')).toThrow()
    })

    it('should throw error for invalid schema format', () => {
      const json = JSON.stringify({ invalid: 'data' })

      expect(() => adaptor.adaptFromJson(json)).toThrow(
        'Invalid block schema v0.1 format'
      )
    })
  })

  describe('validate', () => {
    it('should validate a valid block', () => {
      const block = {
        id: '550e8400-e29b-41d4-a716-446655440001',
        title: { he_text: 'א', en_text: 'A' },
        prerequisites: [],
        parents: [],
      }

      expect(SchemaV01Adaptor.validate(block)).toBe(true)
    })

    it('should validate an array of valid blocks', () => {
      const blocks = [
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
      ]

      expect(SchemaV01Adaptor.validate(blocks)).toBe(true)
    })

    it('should reject invalid blocks', () => {
      expect(SchemaV01Adaptor.validate({ invalid: 'data' })).toBe(false)
      expect(SchemaV01Adaptor.validate(null)).toBe(false)
      expect(SchemaV01Adaptor.validate(undefined)).toBe(false)
    })
  })
})
