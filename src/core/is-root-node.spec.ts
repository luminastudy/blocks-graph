import { describe, it, expect } from 'vitest'
import { isRootNode } from './is-root-node.js'
import type { BlockGraph } from '../types/block-graph.js'

describe('isRootNode', () => {
  it('should return true for block with no incoming edges', () => {
    const graph: BlockGraph = {
      blocks: new Map(),
      edges: [{ from: 'a', to: 'b', type: 'prerequisite' }],
    }
    expect(isRootNode('a', graph)).toBe(true)
  })

  it('should return false for block with incoming edges', () => {
    const graph: BlockGraph = {
      blocks: new Map(),
      edges: [{ from: 'a', to: 'b', type: 'prerequisite' }],
    }
    expect(isRootNode('b', graph)).toBe(false)
  })

  it('should return true for isolated block', () => {
    const graph: BlockGraph = {
      blocks: new Map(),
      edges: [],
    }
    expect(isRootNode('a', graph)).toBe(true)
  })
})
