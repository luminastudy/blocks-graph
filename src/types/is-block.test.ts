import { describe, it, expect } from 'vitest'
import { isBlock } from './is-block.js'
import type { Block } from './block.js'

describe('isBlock', () => {
  it('should return true for valid Block objects', () => {
    const validBlock: Block = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      title: {
        he: 'מבוא למתמטיקה',
        en: 'Introduction to Mathematics',
      },
      prerequisites: [],
      parents: [],
    }

    expect(isBlock(validBlock)).toBe(true)
  })

  it('should return true for Block with additional properties', () => {
    const blockWithExtras = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      title: {
        he: 'מבוא למתמטיקה',
        en: 'Introduction to Mathematics',
      },
      prerequisites: [],
      parents: [],
      customProperty: 'value',
      anotherField: 123,
    }

    expect(isBlock(blockWithExtras)).toBe(true)
  })

  it('should return false for v0.1 schema format (he_text/en_text)', () => {
    const v01Block = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      title: {
        he_text: 'מבוא למתמטיקה',
        en_text: 'Introduction to Mathematics',
      },
      prerequisites: [],
      parents: [],
    }

    expect(isBlock(v01Block)).toBe(false)
  })

  it('should return false for null', () => {
    expect(isBlock(null)).toBe(false)
  })

  it('should return false for undefined', () => {
    expect(isBlock(undefined)).toBe(false)
  })

  it('should return false for non-object types', () => {
    expect(isBlock('string')).toBe(false)
    expect(isBlock(123)).toBe(false)
    expect(isBlock(true)).toBe(false)
    expect(isBlock([])).toBe(false)
  })

  it('should return false when id is missing', () => {
    const blockMissingId = {
      title: {
        he: 'מבוא למתמטיקה',
        en: 'Introduction to Mathematics',
      },
      prerequisites: [],
      parents: [],
    }

    expect(isBlock(blockMissingId)).toBe(false)
  })

  it('should return false when id is not a string', () => {
    const blockWithNumberId = {
      id: 123,
      title: {
        he: 'מבוא למתמטיקה',
        en: 'Introduction to Mathematics',
      },
      prerequisites: [],
      parents: [],
    }

    expect(isBlock(blockWithNumberId)).toBe(false)
  })

  it('should return false when title is missing', () => {
    const blockMissingTitle = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      prerequisites: [],
      parents: [],
    }

    expect(isBlock(blockMissingTitle)).toBe(false)
  })

  it('should return false when title is not an object', () => {
    const blockWithStringTitle = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      title: 'string title',
      prerequisites: [],
      parents: [],
    }

    expect(isBlock(blockWithStringTitle)).toBe(false)
  })

  it('should return false when title.he is missing', () => {
    const blockMissingHe = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      title: {
        en: 'Introduction to Mathematics',
      },
      prerequisites: [],
      parents: [],
    }

    expect(isBlock(blockMissingHe)).toBe(false)
  })

  it('should return false when title.en is missing', () => {
    const blockMissingEn = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      title: {
        he: 'מבוא למתמטיקה',
      },
      prerequisites: [],
      parents: [],
    }

    expect(isBlock(blockMissingEn)).toBe(false)
  })

  it('should return false when title.he is not a string', () => {
    const blockWithNumberHe = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      title: {
        he: 123,
        en: 'Introduction to Mathematics',
      },
      prerequisites: [],
      parents: [],
    }

    expect(isBlock(blockWithNumberHe)).toBe(false)
  })

  it('should return false when title.en is not a string', () => {
    const blockWithNumberEn = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      title: {
        he: 'מבוא למתמטיקה',
        en: 123,
      },
      prerequisites: [],
      parents: [],
    }

    expect(isBlock(blockWithNumberEn)).toBe(false)
  })

  it('should return false when prerequisites is missing', () => {
    const blockMissingPrerequisites = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      title: {
        he: 'מבוא למתמטיקה',
        en: 'Introduction to Mathematics',
      },
      parents: [],
    }

    expect(isBlock(blockMissingPrerequisites)).toBe(false)
  })

  it('should return false when prerequisites is not an array', () => {
    const blockWithStringPrerequisites = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      title: {
        he: 'מבוא למתמטיקה',
        en: 'Introduction to Mathematics',
      },
      prerequisites: 'not-an-array',
      parents: [],
    }

    expect(isBlock(blockWithStringPrerequisites)).toBe(false)
  })

  it('should return false when parents is missing', () => {
    const blockMissingParents = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      title: {
        he: 'מבוא למתמטיקה',
        en: 'Introduction to Mathematics',
      },
      prerequisites: [],
    }

    expect(isBlock(blockMissingParents)).toBe(false)
  })

  it('should return false when parents is not an array', () => {
    const blockWithStringParents = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      title: {
        he: 'מבוא למתמטיקה',
        en: 'Introduction to Mathematics',
      },
      prerequisites: [],
      parents: 'not-an-array',
    }

    expect(isBlock(blockWithStringParents)).toBe(false)
  })

  it('should return true for Block with filled arrays', () => {
    const blockWithRelationships: Block = {
      id: '550e8400-e29b-41d4-a716-446655440001',
      title: {
        he: 'אלגברה ליניארית',
        en: 'Linear Algebra',
      },
      prerequisites: ['550e8400-e29b-41d4-a716-446655440000'],
      parents: ['550e8400-e29b-41d4-a716-446655440000'],
    }

    expect(isBlock(blockWithRelationships)).toBe(true)
  })
})
