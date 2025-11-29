import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createStyles } from './create-styles.js'

describe('createStyles', () => {
  beforeEach(() => {
    if (typeof document === 'undefined') {
      const createElement = vi.fn((tag: string) => ({
        textContent: '',
        tagName: tag.toUpperCase(),
      }))
      vi.stubGlobal('document', { createElement })
    }
  })

  it('should create style element', () => {
    const element = createStyles()
    expect(element.tagName).toBe('STYLE')
  })

  it('should include host styles', () => {
    const element = createStyles()
    expect(element.textContent).toContain(':host')
  })

  it('should include block styles', () => {
    const element = createStyles()
    expect(element.textContent).toContain('.block')
  })

  it('should include error styles', () => {
    const element = createStyles()
    expect(element.textContent).toContain('.error')
  })
})
