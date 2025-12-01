import { describe, it, expect } from 'vitest'
import { categorizeBlocks } from './categorize-blocks.js'
import type { Block } from '../types/block.js'
import type { BlockGraph } from '../types/block-graph.js'

describe('categorizeBlocks', () => {
  const createBlock = (id: string, parents: string[] = []): Block => ({
    id,
    title: { he: `כותרת ${id}`, en: `Title ${id}` },
    prerequisites: [],
    parents,
  })

  const createGraph = (blocks: Block[]): BlockGraph => ({
    blocks: new Map(blocks.map(b => [b.id, b])),
    edges: blocks
      .filter(b => b.parents.length > 0)
      .map(b => ({
        from: b.parents[0] || '',
        to: b.id,
        type: 'parent' as const,
      })),
    horizontalRelationships: undefined,
  })

  const mockGetSubBlocks = (blockId: string, graph: BlockGraph): Block[] => {
    const children: Block[] = []
    for (const edge of graph.edges) {
      if (edge.from === blockId && edge.type === 'parent') {
        const child = graph.blocks.get(edge.to)
        if (child) children.push(child)
      }
    }
    return children
  }

  it('should show root blocks when nothing is selected', () => {
    const blocks = [createBlock('root1'), createBlock('root2')]
    const graph = createGraph(blocks)
    const result = categorizeBlocks(blocks, graph, null, 0, mockGetSubBlocks)
    expect(result.visible.has('root1')).toBe(true)
    expect(result.visible.has('root2')).toBe(true)
    expect(result.dimmed.size).toBe(0)
  })

  it('should show selected block and its children', () => {
    const blocks = [
      createBlock('root'),
      createBlock('child1', ['root']),
      createBlock('child2', ['root']),
    ]
    const graph = createGraph(blocks)
    const result = categorizeBlocks(blocks, graph, 'root', 1, mockGetSubBlocks)
    expect(result.visible.has('root')).toBe(true)
    expect(result.visible.has('child1')).toBe(true)
    expect(result.visible.has('child2')).toBe(true)
  })
})
