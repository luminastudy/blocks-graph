import { describe, it, expect } from 'vitest'
import { isRootSingleNode } from './is-root-single-node.js'
import type { BlockGraph } from '../types/block-graph.js'
import type { Block } from '../types/block.js'

describe('isRootSingleNode', () => {
  it('should return true for isolated root node', () => {
    const graph: BlockGraph = {
      blocks: new Map(),
      edges: [],
    }
    const getDirectPrerequisites = () => []
    const getDirectPostRequisites = () => []
    expect(
      isRootSingleNode(
        'a',
        graph,
        getDirectPrerequisites,
        getDirectPostRequisites
      )
    ).toBe(true)
  })

  it('should return false for root node with prerequisites', () => {
    const graph: BlockGraph = {
      blocks: new Map(),
      edges: [],
    }
    const block: Block = {
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
    const getDirectPrerequisites = () => [block]
    const getDirectPostRequisites = () => []
    expect(
      isRootSingleNode(
        'a',
        graph,
        getDirectPrerequisites,
        getDirectPostRequisites
      )
    ).toBe(false)
  })

  it('should return false for non-root node', () => {
    const graph: BlockGraph = {
      blocks: new Map(),
      edges: [{ from: 'b', to: 'a', type: 'prerequisite' }],
    }
    const getDirectPrerequisites = () => []
    const getDirectPostRequisites = () => []
    expect(
      isRootSingleNode(
        'a',
        graph,
        getDirectPrerequisites,
        getDirectPostRequisites
      )
    ).toBe(false)
  })
})
