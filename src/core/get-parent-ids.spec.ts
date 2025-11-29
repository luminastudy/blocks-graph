import { describe, it, expect } from 'vitest'
import { getParentIds } from './get-parent-ids.js'
import type { BlockGraph } from '../types/block-graph.js'
import type { Block } from '../types/block.js'

describe('getParentIds', () => {
  it('should return prerequisites as parent IDs', () => {
    const block: Block = {
      id: 'a',
      title: 'Block A',
      prerequisites: ['b', 'c'],
      parents: [],
      x: 0,
      y: 0,
      width: 100,
      height: 50,
      level: 0,
    }
    const graph: BlockGraph = {
      blocks: new Map([['a', block]]),
      edges: [],
    }
    expect(getParentIds('a', graph)).toEqual(['b', 'c'])
  })

  it('should return empty array for non-existent block', () => {
    const graph: BlockGraph = {
      blocks: new Map(),
      edges: [],
    }
    expect(getParentIds('nonexistent', graph)).toEqual([])
  })

  it('should return empty array for block with no prerequisites', () => {
    const block: Block = {
      id: 'a',
      title: 'Block A',
      prerequisites: [],
      parents: [],
      x: 0,
      y: 0,
      width: 100,
      height: 50,
      level: 0,
    }
    const graph: BlockGraph = {
      blocks: new Map([['a', block]]),
      edges: [],
    }
    expect(getParentIds('a', graph)).toEqual([])
  })
})
