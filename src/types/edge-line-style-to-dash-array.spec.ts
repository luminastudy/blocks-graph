import { describe, it, expect } from 'vitest'
import { edgeLineStyleToDashArray } from './edge-line-style-to-dash-array.js'

describe('edgeLineStyleToDashArray', () => {
  it('should return undefined for straight line style', () => {
    expect(edgeLineStyleToDashArray('straight')).toBeUndefined()
  })

  it('should return correct dash array for dashed style', () => {
    expect(edgeLineStyleToDashArray('dashed')).toBe('8 4')
  })

  it('should return correct dash array for dotted style', () => {
    expect(edgeLineStyleToDashArray('dotted')).toBe('2 3')
  })
})
