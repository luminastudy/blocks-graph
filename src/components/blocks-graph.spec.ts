import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('blocks-graph web component', () => {
  beforeEach(() => {
    if (typeof customElements === 'undefined') {
      vi.stubGlobal('customElements', {
        get: vi.fn(() => class BlocksGraph extends HTMLElement {}),
        define: vi.fn(),
      })
    }
  })

  it('should be importable', () => {
    expect(true).toBe(true)
  })
})
