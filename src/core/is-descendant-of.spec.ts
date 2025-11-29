import { describe, it, expect } from 'vitest'
import { isDescendantOf } from './is-descendant-of.js'
import type { BlockGraph } from '../types/block-graph.js'
import type { Block } from '../types/block.js'

describe('isDescendantOf', () => {
  it('should return true for direct child', () => {
    const blockA: Block = {
      id: 'a',
      title: 'A',
      prerequisites: [],
      parents: [],
      x: 0,
      y: 0,
      width: 100,
      height: 50,
      level: 0,
    }
    const blockB: Block = {
      id: 'b',
      title: 'B',
      prerequisites: [],
      parents: ['a'],
      x: 0,
      y: 0,
      width: 100,
      height: 50,
      level: 1,
    }
    const graph: BlockGraph = {
      blocks: new Map([
        ['a', blockA],
        ['b', blockB],
      ]),
      edges: [],
    }
    expect(isDescendantOf('b', 'a', graph)).toBe(true)
  })

  it('should return false for non-descendant', () => {
    const blockA: Block = {
      id: 'a',
      title: 'A',
      prerequisites: [],
      parents: [],
      x: 0,
      y: 0,
      width: 100,
      height: 50,
      level: 0,
    }
    const graph: BlockGraph = {
      blocks: new Map([['a', blockA]]),
      edges: [],
    }
    expect(isDescendantOf('a', 'b', graph)).toBe(false)
  })

  it('should return false for non-existent block', () => {
    const graph: BlockGraph = {
      blocks: new Map(),
      edges: [],
    }
    expect(isDescendantOf('nonexistent', 'a', graph)).toBe(false)
  })
})
