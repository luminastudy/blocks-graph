import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createBlockSelectedEvent } from './create-block-selected-event.js'

describe('createBlockSelectedEvent', () => {
  beforeEach(() => {
    if (typeof CustomEvent === 'undefined') {
      vi.stubGlobal(
        'CustomEvent',
        class {
          detail: unknown
          constructor(_type: string, options: { detail: unknown }) {
            this.detail = options.detail
          }
        }
      )
    }
  })

  it('should create block-selected event with details', () => {
    const event = createBlockSelectedEvent('block-1', 1, ['root'])
    expect(event.detail.blockId).toBe('block-1')
    expect(event.detail.selectionLevel).toBe(1)
    expect(event.detail.navigationStack).toEqual(['root'])
  })

  it('should handle null blockId', () => {
    const event = createBlockSelectedEvent(null, 0, [])
    expect(event.detail.blockId).toBeNull()
    expect(event.detail.selectionLevel).toBe(0)
    expect(event.detail.navigationStack).toEqual([])
  })

  it('should clone navigation stack', () => {
    const stack = ['a', 'b', 'c']
    const event = createBlockSelectedEvent('block-1', 2, stack)
    expect(event.detail.navigationStack).toEqual(stack)
    expect(event.detail.navigationStack).not.toBe(stack)
  })
})
