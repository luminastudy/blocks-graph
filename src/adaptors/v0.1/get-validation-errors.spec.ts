import { describe, it, expect } from 'vitest'
import { getValidationErrors } from './get-validation-errors.js'
import { isBlockSchemaV01 } from './validators.js'

describe('getValidationErrors', () => {
  it('should return null when no validation errors', () => {
    const validBlock = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      title: { he_text: 'test', en_text: 'test' },
      prerequisites: [],
      parents: [],
    }
    isBlockSchemaV01(validBlock)
    expect(getValidationErrors()).toBeNull()
  })

  it('should return error text for invalid blocks', () => {
    const invalidBlock = { invalid: 'block' }
    isBlockSchemaV01(invalidBlock)
    const errors = getValidationErrors()
    expect(errors).toBeTruthy()
    expect(typeof errors).toBe('string')
  })
})
