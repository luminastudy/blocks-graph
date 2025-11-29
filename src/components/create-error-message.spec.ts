import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createErrorMessage } from './create-error-message.js'

describe('createErrorMessage', () => {
  beforeEach(() => {
    if (typeof document === 'undefined') {
      const createElement = vi.fn((tag: string) => ({
        className: '',
        textContent: '',
        tagName: tag.toUpperCase(),
      }))
      vi.stubGlobal('document', { createElement })
    }
  })

  it('should create error message element', () => {
    const element = createErrorMessage('Something went wrong')
    expect(element.className).toBe('error')
    expect(element.textContent).toBe('Error: Something went wrong')
  })

  it('should prefix message with Error:', () => {
    const element = createErrorMessage('Test error')
    expect(element.textContent).toContain('Error:')
    expect(element.textContent).toContain('Test error')
  })
})
