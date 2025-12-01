import { describe, it, expect, vi } from 'vitest'
import { handleAttributeChange } from './handle-attribute-change.js'

describe('handleAttributeChange', () => {
  const createMockRenderer = () => ({
    updateConfig: vi.fn(),
    config: {
      edgeStyle: {
        prerequisite: { lineStyle: 'solid' },
      },
    },
  })

  it('should update language config for valid language values', () => {
    const renderer = createMockRenderer()
    const result = handleAttributeChange(
      'language',
      'he',
      renderer as Parameters<typeof handleAttributeChange>[2]
    )
    expect(result).toBe('renderer-updated')
    expect(renderer.updateConfig).toHaveBeenCalledWith({ language: 'he' })
  })

  it('should update show-prerequisites config', () => {
    const renderer = createMockRenderer()
    const result = handleAttributeChange(
      'show-prerequisites',
      'true',
      renderer as Parameters<typeof handleAttributeChange>[2]
    )
    expect(result).toBe('renderer-updated')
    expect(renderer.updateConfig).toHaveBeenCalledWith({
      showPrerequisites: true,
    })
  })

  it('should return layout-updated for layout attributes', () => {
    const renderer = createMockRenderer()
    const result = handleAttributeChange(
      'node-width',
      '100',
      renderer as Parameters<typeof handleAttributeChange>[2]
    )
    expect(result).toBe('layout-updated')
    expect(renderer.updateConfig).not.toHaveBeenCalled()
  })

  it('should return none for unknown attributes', () => {
    const renderer = createMockRenderer()
    const result = handleAttributeChange(
      'unknown-attribute',
      'value',
      renderer as Parameters<typeof handleAttributeChange>[2]
    )
    expect(result).toBe('none')
  })
})
