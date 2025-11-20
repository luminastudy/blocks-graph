import { describe, it, expect } from 'vitest'
import { isValidEdgeLineStyle } from './is-valid-edge-line-style.js'
import { edgeLineStyleToDashArray } from './edge-line-style-to-dash-array.js'
import type { EdgeLineStyle } from './edge-style.js'

describe('EdgeLineStyle', () => {
  describe('isValidEdgeLineStyle', () => {
    it('should return true for valid edge line styles', () => {
      expect(isValidEdgeLineStyle('straight')).toBe(true)
      expect(isValidEdgeLineStyle('dashed')).toBe(true)
      expect(isValidEdgeLineStyle('dotted')).toBe(true)
    })

    it('should return false for invalid edge line styles', () => {
      expect(isValidEdgeLineStyle('solid')).toBe(false)
      expect(isValidEdgeLineStyle('curved')).toBe(false)
      expect(isValidEdgeLineStyle('')).toBe(false)
      expect(isValidEdgeLineStyle('DASHED')).toBe(false)
    })
  })

  describe('edgeLineStyleToDashArray', () => {
    it('should return undefined for straight style', () => {
      expect(edgeLineStyleToDashArray('straight')).toBeUndefined()
    })

    it('should return dash pattern for dashed style', () => {
      expect(edgeLineStyleToDashArray('dashed')).toBe('8 4')
    })

    it('should return dot pattern for dotted style', () => {
      expect(edgeLineStyleToDashArray('dotted')).toBe('2 3')
    })

    it('should handle all valid edge line styles', () => {
      const styles: EdgeLineStyle[] = ['straight', 'dashed', 'dotted']
      for (const style of styles) {
        const result = edgeLineStyleToDashArray(style)
        expect(typeof result === 'string' || result === undefined).toBe(true)
      }
    })
  })
})
