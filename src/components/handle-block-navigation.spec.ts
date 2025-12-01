import { describe, it, expect } from 'vitest'
import { handleBlockNavigation } from './handle-block-navigation.js'
import type { Block } from '../types/block.js'
import type { BlockGraph } from '../types/block-graph.js'

describe('handleBlockNavigation', () => {
  const createBlock = (id: string, parents: string[] = []): Block => ({
    id,
    title: { he: `כותרת ${id}`, en: `Title ${id}` },
    prerequisites: [],
    parents,
  })

  const mockGetSubBlocks = (blockId: string): Block[] => {
    if (blockId === 'parent') {
      return [
        createBlock('child1', ['parent']),
        createBlock('child2', ['parent']),
      ]
    }
    return []
  }

  const mockBuildGraph = (blocks: Block[]): BlockGraph => ({
    blocks: new Map(blocks.map(b => [b.id, b])),
    edges: [],
    horizontalRelationships: undefined,
  })

  it('should not render for leaf block (no children)', () => {
    const blocks = [createBlock('leaf')]
    const result = handleBlockNavigation(
      'leaf',
      blocks,
      [],
      mockGetSubBlocks,
      mockBuildGraph
    )
    expect(result.shouldRender).toBe(false)
    expect(result.updatedStack).toEqual([])
  })

  it('should push to stack when clicking block with children', () => {
    const blocks = [createBlock('parent')]
    const result = handleBlockNavigation(
      'parent',
      blocks,
      [],
      mockGetSubBlocks,
      mockBuildGraph
    )
    expect(result.shouldRender).toBe(true)
    expect(result.updatedStack).toEqual(['parent'])
  })

  it('should pop from stack when clicking block on top of stack', () => {
    const blocks = [createBlock('parent')]
    const result = handleBlockNavigation(
      'parent',
      blocks,
      ['parent'],
      mockGetSubBlocks,
      mockBuildGraph
    )
    expect(result.shouldRender).toBe(true)
    expect(result.updatedStack).toEqual([])
  })

  it('should not render for non-existent block', () => {
    const blocks = [createBlock('existing')]
    const result = handleBlockNavigation(
      'non-existent',
      blocks,
      [],
      mockGetSubBlocks,
      mockBuildGraph
    )
    expect(result.shouldRender).toBe(false)
  })
})
