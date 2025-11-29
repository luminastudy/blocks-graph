import { describe, it, expect, vi, beforeEach } from 'vitest'
import { attachBlockClickListeners } from './attach-block-click-listeners.js'

describe('attachBlockClickListeners', () => {
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

  it('should attach click listeners to blocks', () => {
    const svg = {
      querySelectorAll: vi.fn(() => []),
    } as unknown as SVGElement
    const handleBlockClick = vi.fn()
    const dispatchEvent = vi.fn()

    attachBlockClickListeners(svg, 5, handleBlockClick, dispatchEvent)

    expect(svg.querySelectorAll).toHaveBeenCalledWith('.block')
    expect(dispatchEvent).toHaveBeenCalled()
  })

  it('should dispatch blocks-rendered event with count', () => {
    const svg = {
      querySelectorAll: vi.fn(() => []),
    } as unknown as SVGElement
    const handleBlockClick = vi.fn()
    const dispatchEvent = vi.fn()

    attachBlockClickListeners(svg, 10, handleBlockClick, dispatchEvent)

    const event = dispatchEvent.mock.calls[0][0] as CustomEvent
    expect(event.detail.blockCount).toBe(10)
  })
})
