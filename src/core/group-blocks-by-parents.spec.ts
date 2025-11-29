import { describe, it, expect } from 'vitest'
import { groupBlocksByParents } from './group-blocks-by-parents.js'
import type { BlockGraph } from '../types/block-graph.js'
import type { Block } from '../types/block.js'

describe('groupBlocksByParents', () => {
  it('should group blocks by their parent sets', () => {
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
      prerequisites: ['a'],
      parents: [],
      x: 0,
      y: 0,
      width: 100,
      height: 50,
      level: 1,
    }
    const blockC: Block = {
      id: 'c',
      title: 'C',
      prerequisites: ['a'],
      parents: [],
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
        ['c', blockC],
      ]),
      edges: [],
    }
    const result = groupBlocksByParents(['b', 'c'], graph)
    expect(result.size).toBe(1)
    const group = Array.from(result.values())[0]
    expect(group).toContain('b')
    expect(group).toContain('c')
  })

  it('should handle empty array', () => {
    const graph: BlockGraph = {
      blocks: new Map(),
      edges: [],
    }
    const result = groupBlocksByParents([], graph)
    expect(result.size).toBe(0)
  })
})
