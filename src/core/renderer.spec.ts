import { describe, it, expect } from 'vitest'
import { GraphRenderer } from './renderer.js'

describe('renderer', () => {
  it('should export GraphRenderer', () => {
    expect(GraphRenderer).toBeDefined()
  })

  it('should create GraphRenderer instance', () => {
    const renderer = new GraphRenderer()
    expect(renderer).toBeDefined()
  })
})
