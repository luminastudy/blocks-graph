import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createEmptyStateMessage } from './create-empty-state-message.js'

describe('createEmptyStateMessage', () => {
  beforeEach(() => {
    if (typeof document === 'undefined') {
      const createElement = vi.fn((tag: string) => ({
        textContent: '',
        style: {},
        tagName: tag.toUpperCase(),
      }))
      vi.stubGlobal('document', { createElement })
    }
  })

  it('should create empty state message element', () => {
    const element = createEmptyStateMessage()
    expect(element.textContent).toContain('No blocks to display')
  })

  it('should mention setBlocks and loadFromJson', () => {
    const element = createEmptyStateMessage()
    expect(element.textContent).toContain('setBlocks()')
    expect(element.textContent).toContain('loadFromJson()')
  })
})
