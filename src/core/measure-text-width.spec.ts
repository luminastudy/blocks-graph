import { describe, it, expect, beforeEach, vi } from 'vitest'
import { measureTextWidth } from './measure-text-width.js'

describe('measureTextWidth', () => {
  beforeEach(() => {
    // Setup document mock for Node.js environment
    if (typeof document === 'undefined') {
      vi.stubGlobal('document', {
        createElement: vi.fn(() => ({
          getContext: vi.fn(() => ({
            measureText: vi.fn((text: string) => ({ width: text.length * 10 })),
            font: '',
          })),
        })),
      })
    }
  })

  it('should measure text width', () => {
    const width = measureTextWidth('Hello', 16, 'Arial')
    expect(width).toBeGreaterThan(0)
  })

  it('should return larger width for longer text', () => {
    const shortWidth = measureTextWidth('Hi', 16, 'Arial')
    const longWidth = measureTextWidth('Hello World', 16, 'Arial')
    expect(longWidth).toBeGreaterThan(shortWidth)
  })

  it('should handle empty string', () => {
    const width = measureTextWidth('', 16, 'Arial')
    expect(width).toBeGreaterThanOrEqual(0)
  })
})
