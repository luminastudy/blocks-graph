import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createBlockRect } from './create-block-rect.js'
import type { BlockPosition } from '../types/block-position.js'

describe('createBlockRect', () => {
  const position: BlockPosition = { x: 10, y: 20, width: 100, height: 50 }
  const blockStyle = {
    fill: '#ffffff',
    stroke: '#000000',
    strokeWidth: 2,
    cornerRadius: 4,
  }

  beforeEach(() => {
    // Mock document.createElementNS
    vi.stubGlobal('document', {
      createElementNS: vi.fn(() => ({
        setAttribute: vi.fn(),
      })),
    })
  })

  it('should create a rect element with correct attributes', () => {
    const rect = createBlockRect(position, false, '1', blockStyle)
    expect(document.createElementNS).toHaveBeenCalledWith(
      'http://www.w3.org/2000/svg',
      'rect'
    )
    expect(rect.setAttribute).toHaveBeenCalledWith('x', '10')
    expect(rect.setAttribute).toHaveBeenCalledWith('y', '20')
    expect(rect.setAttribute).toHaveBeenCalledWith('width', '100')
    expect(rect.setAttribute).toHaveBeenCalledWith('height', '50')
  })

  it('should apply selected styling when isSelected is true', () => {
    const rect = createBlockRect(position, true, '1', blockStyle)
    expect(rect.setAttribute).toHaveBeenCalledWith('stroke', '#4a90e2')
  })

  it('should apply normal styling when isSelected is false', () => {
    const rect = createBlockRect(position, false, '1', blockStyle)
    expect(rect.setAttribute).toHaveBeenCalledWith('stroke', '#000000')
  })

  it('should set opacity correctly', () => {
    const rect = createBlockRect(position, false, '0.5', blockStyle)
    expect(rect.setAttribute).toHaveBeenCalledWith('opacity', '0.5')
  })
})
