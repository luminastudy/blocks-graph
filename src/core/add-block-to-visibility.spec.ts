import { describe, it, expect } from 'vitest'
import { addBlockToVisibility } from './add-block-to-visibility.js'
import type { BlockGraph } from '../types/block-graph.js'

describe('addBlockToVisibility', () => {
  it('should add block to visibility set', () => {
    const visibility = new Set<string>()
    const graph: BlockGraph = {
      blocks: new Map(),
      edges: [],
    }
    const getSubBlocks = () => []
    const checkIsRootSingleNode = () => false

    addBlockToVisibility(
      'block-1',
      graph,
      visibility,
      getSubBlocks,
      checkIsRootSingleNode
    )
    expect(visibility.has('block-1')).toBe(true)
  })

  it('should not add duplicate blocks', () => {
    const visibility = new Set<string>(['block-1'])
    const graph: BlockGraph = {
      blocks: new Map(),
      edges: [],
    }
    const getSubBlocks = () => []
    const checkIsRootSingleNode = () => false

    addBlockToVisibility(
      'block-1',
      graph,
      visibility,
      getSubBlocks,
      checkIsRootSingleNode
    )
    expect(visibility.size).toBe(1)
  })

  it('should add sub-blocks for root single nodes', () => {
    const visibility = new Set<string>()
    const graph: BlockGraph = {
      blocks: new Map(),
      edges: [],
    }
    const getSubBlocks = () => [
      {
        id: 'sub-1',
        title: 'Sub 1',
        prerequisites: [],
        parents: [],
        x: 0,
        y: 0,
        width: 100,
        height: 50,
        level: 0,
      },
      {
        id: 'sub-2',
        title: 'Sub 2',
        prerequisites: [],
        parents: [],
        x: 0,
        y: 0,
        width: 100,
        height: 50,
        level: 0,
      },
    ]
    const checkIsRootSingleNode = () => true

    addBlockToVisibility(
      'block-1',
      graph,
      visibility,
      getSubBlocks,
      checkIsRootSingleNode
    )
    expect(visibility.has('sub-1')).toBe(true)
    expect(visibility.has('sub-2')).toBe(true)
    expect(visibility.has('block-1')).toBe(false)
  })
})
