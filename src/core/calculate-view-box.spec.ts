import { describe, it, expect } from 'vitest'
import { calculateViewBox } from './calculate-view-box.js'
import type { PositionedBlock } from '../types/positioned-block.js'

describe('calculateViewBox', () => {
  it('should calculate view box for positioned blocks', () => {
    const blocks: PositionedBlock[] = [
      {
        id: 'a',
        title: 'A',
        position: { x: 0, y: 0, width: 100, height: 50 },
      },
    ]
    const viewBox = calculateViewBox(blocks)
    expect(viewBox.x).toBeLessThan(0)
    expect(viewBox.y).toBeLessThan(0)
    expect(viewBox.width).toBeGreaterThan(100)
    expect(viewBox.height).toBeGreaterThan(50)
  })

  it('should handle empty blocks array', () => {
    const viewBox = calculateViewBox([])
    expect(viewBox).toEqual({ x: 0, y: 0, width: 800, height: 600 })
  })

  it('should include padding around blocks', () => {
    const blocks: PositionedBlock[] = [
      {
        id: 'a',
        title: 'A',
        position: { x: 100, y: 100, width: 200, height: 100 },
      },
    ]
    const viewBox = calculateViewBox(blocks)
    expect(viewBox.x).toBe(60) // 100 - 40 (padding)
    expect(viewBox.y).toBe(60) // 100 - 40 (padding)
  })
})
