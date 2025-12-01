import { describe, it, expect } from 'vitest'
import { calculateConnectionPoints } from './calculate-connection-points.js'
import type { BlockPosition } from '../types/block-position.js'

describe('calculateConnectionPoints', () => {
  const fromPos: BlockPosition = { x: 0, y: 0, width: 100, height: 50 }
  const toPos: BlockPosition = { x: 0, y: 100, width: 100, height: 50 }

  it('should calculate connection points for ttb orientation', () => {
    const result = calculateConnectionPoints(fromPos, toPos, 'ttb')
    expect(result.x1).toBe(50) // center of fromPos
    expect(result.y1).toBe(50) // bottom of fromPos
    expect(result.x2).toBe(50) // center of toPos
    expect(result.y2).toBe(100) // top of toPos
  })

  it('should calculate connection points for btt orientation', () => {
    const result = calculateConnectionPoints(fromPos, toPos, 'btt')
    expect(result.x1).toBe(50) // center of fromPos
    expect(result.y1).toBe(0) // top of fromPos
    expect(result.x2).toBe(50) // center of toPos
    expect(result.y2).toBe(150) // bottom of toPos
  })

  it('should calculate connection points for ltr orientation', () => {
    const result = calculateConnectionPoints(fromPos, toPos, 'ltr')
    expect(result.x1).toBe(100) // right of fromPos
    expect(result.y1).toBe(25) // center of fromPos
    expect(result.x2).toBe(0) // left of toPos
    expect(result.y2).toBe(125) // center of toPos
  })

  it('should calculate connection points for rtl orientation', () => {
    const result = calculateConnectionPoints(fromPos, toPos, 'rtl')
    expect(result.x1).toBe(0) // left of fromPos
    expect(result.y1).toBe(25) // center of fromPos
    expect(result.x2).toBe(100) // right of toPos
    expect(result.y2).toBe(125) // center of toPos
  })
})
