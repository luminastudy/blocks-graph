import { describe, expect, it } from 'vitest'
import { GraphEngine } from './graph-engine.js'
import type { Block } from '../types/block.js'

describe('GraphEngine', () => {
  const engine = new GraphEngine()

  describe('buildGraph', () => {
    it('should build a graph from blocks', () => {
      const blocks: Block[] = [
        {
          id: '1',
          title: { he: 'א', en: 'A' },
          prerequisites: [],
          parents: [],
        },
        {
          id: '2',
          title: { he: 'ב', en: 'B' },
          prerequisites: ['1'],
          parents: [],
        },
      ]

      const graph = engine.buildGraph(blocks)

      expect(graph.blocks.size).toBe(2)
      expect(graph.blocks.get('1')).toBeDefined()
      expect(graph.blocks.get('2')).toBeDefined()
      expect(graph.edges).toHaveLength(1)
      expect(graph.edges[0]).toEqual({
        from: '1',
        to: '2',
        type: 'prerequisite',
      })
    })

    it('should create parent edges', () => {
      const blocks: Block[] = [
        {
          id: '1',
          title: { he: 'א', en: 'A' },
          prerequisites: [],
          parents: [],
        },
        {
          id: '2',
          title: { he: 'ב', en: 'B' },
          prerequisites: [],
          parents: ['1'],
        },
      ]

      const graph = engine.buildGraph(blocks)

      expect(graph.edges).toHaveLength(1)
      expect(graph.edges[0]).toEqual({
        from: '1',
        to: '2',
        type: 'parent',
      })
    })

    it('should create both prerequisite and parent edges', () => {
      const blocks: Block[] = [
        {
          id: '1',
          title: { he: 'א', en: 'A' },
          prerequisites: [],
          parents: [],
        },
        {
          id: '2',
          title: { he: 'ב', en: 'B' },
          prerequisites: ['1'],
          parents: ['1'],
        },
      ]

      const graph = engine.buildGraph(blocks)

      expect(graph.edges).toHaveLength(2)
      expect(graph.edges.filter(e => e.type === 'prerequisite')).toHaveLength(1)
      expect(graph.edges.filter(e => e.type === 'parent')).toHaveLength(1)
    })

    it('should handle empty blocks array', () => {
      const graph = engine.buildGraph([])

      expect(graph.blocks.size).toBe(0)
      expect(graph.edges).toHaveLength(0)
    })
  })

  describe('layoutGraph', () => {
    it('should calculate positions for blocks', () => {
      const blocks: Block[] = [
        {
          id: '1',
          title: { he: 'א', en: 'A' },
          prerequisites: [],
          parents: [],
        },
        {
          id: '2',
          title: { he: 'ב', en: 'B' },
          prerequisites: ['1'],
          parents: [],
        },
      ]

      const graph = engine.buildGraph(blocks)
      const positioned = engine.layoutGraph(graph)

      expect(positioned).toHaveLength(2)

      for (const item of positioned) {
        expect(item.position.x).toBeGreaterThanOrEqual(0)
        expect(item.position.y).toBeGreaterThanOrEqual(0)
        expect(item.position.width).toBeGreaterThan(0)
        expect(item.position.height).toBeGreaterThan(0)
      }
    })

    it('should place child blocks at higher y positions', () => {
      const blocks: Block[] = [
        {
          id: '1',
          title: { he: 'א', en: 'A' },
          prerequisites: [],
          parents: [],
        },
        {
          id: '2',
          title: { he: 'ב', en: 'B' },
          prerequisites: ['1'],
          parents: [],
        },
      ]

      const graph = engine.buildGraph(blocks)
      const positioned = engine.layoutGraph(graph)

      const block1Pos = positioned.find(p => p.block.id === '1')!.position
      const block2Pos = positioned.find(p => p.block.id === '2')!.position

      expect(block1Pos).toBeDefined()
      expect(block2Pos).toBeDefined()
      expect(block2Pos!.y).toBeGreaterThan(block1Pos!.y)
    })
  })

  describe('process', () => {
    it('should process blocks end-to-end', () => {
      const blocks: Block[] = [
        {
          id: '1',
          title: { he: 'א', en: 'A' },
          prerequisites: [],
          parents: [],
        },
        {
          id: '2',
          title: { he: 'ב', en: 'B' },
          prerequisites: ['1'],
          parents: [],
        },
      ]

      const result = engine.process(blocks)

      expect(result.graph.blocks.size).toBe(2)
      expect(result.positioned).toHaveLength(2)
    })
  })

  describe('custom layout config', () => {
    it('should use custom node dimensions', () => {
      const customEngine = new GraphEngine({
        nodeWidth: 300,
        nodeHeight: 100,
      })

      const blocks: Block[] = [
        {
          id: '1',
          title: { he: 'א', en: 'A' },
          prerequisites: [],
          parents: [],
        },
      ]

      const { positioned } = customEngine.process(blocks)

      expect(positioned[0]!.position.width).toBe(300)
      expect(positioned[0]!.position.height).toBe(100)
    })
  })

  describe('orientation-based layout', () => {
    const blocks: Block[] = [
      {
        id: '1',
        title: { he: 'א', en: 'A' },
        prerequisites: [],
        parents: [],
      },
      {
        id: '2',
        title: { he: 'ב', en: 'B' },
        prerequisites: ['1'],
        parents: [],
      },
      {
        id: '3',
        title: { he: 'ג', en: 'C' },
        prerequisites: ['1'],
        parents: [],
      },
    ]

    describe('TTB (top-to-bottom) orientation', () => {
      it('should lay out blocks vertically with downward progression', () => {
        const engine = new GraphEngine({ orientation: 'ttb' })
        const graph = engine.buildGraph(blocks)
        const positioned = engine.layoutGraph(graph)

        const block1 = positioned.find(p => p.block.id === '1')!
        const block2 = positioned.find(p => p.block.id === '2')!

        // Parent should be above child (smaller y value)
        expect(block1.position.y).toBeLessThan(block2.position.y)

        // Siblings should be at the same y level
        const block3 = positioned.find(p => p.block.id === '3')!
        expect(block2.position.y).toBe(block3.position.y)

        // Siblings should differ in x position (horizontal spacing)
        expect(block2.position.x).not.toBe(block3.position.x)
      })

      it('should apply vertical spacing between levels', () => {
        const verticalSpacing = 100
        const nodeHeight = 80
        const engine = new GraphEngine({
          orientation: 'ttb',
          verticalSpacing,
          nodeHeight,
        })
        const graph = engine.buildGraph(blocks)
        const positioned = engine.layoutGraph(graph)

        const block1 = positioned.find(p => p.block.id === '1')!
        const block2 = positioned.find(p => p.block.id === '2')!

        // Y difference should be nodeHeight + verticalSpacing
        expect(block2.position.y - block1.position.y).toBe(
          nodeHeight + verticalSpacing
        )
      })
    })

    describe('BTT (bottom-to-top) orientation', () => {
      it('should lay out blocks vertically with upward progression', () => {
        const engine = new GraphEngine({ orientation: 'btt' })
        const graph = engine.buildGraph(blocks)
        const positioned = engine.layoutGraph(graph)

        const block1 = positioned.find(p => p.block.id === '1')!
        const block2 = positioned.find(p => p.block.id === '2')!

        // Parent should be below child (larger y value for reversed orientation)
        expect(block1.position.y).toBeGreaterThan(block2.position.y)

        // Siblings should be at the same y level
        const block3 = positioned.find(p => p.block.id === '3')!
        expect(block2.position.y).toBe(block3.position.y)
      })
    })

    describe('LTR (left-to-right) orientation', () => {
      it('should lay out blocks horizontally with rightward progression', () => {
        const engine = new GraphEngine({ orientation: 'ltr' })
        const graph = engine.buildGraph(blocks)
        const positioned = engine.layoutGraph(graph)

        const block1 = positioned.find(p => p.block.id === '1')!
        const block2 = positioned.find(p => p.block.id === '2')!

        // Parent should be to the left of child (smaller x value)
        expect(block1.position.x).toBeLessThan(block2.position.x)

        // Siblings should be at the same x level
        const block3 = positioned.find(p => p.block.id === '3')!
        expect(block2.position.x).toBe(block3.position.x)

        // Siblings should differ in y position (vertical spacing)
        expect(block2.position.y).not.toBe(block3.position.y)
      })

      it('should apply horizontal spacing between levels', () => {
        const horizontalSpacing = 80
        const nodeWidth = 200
        const engine = new GraphEngine({
          orientation: 'ltr',
          horizontalSpacing,
          nodeWidth,
        })
        const graph = engine.buildGraph(blocks)
        const positioned = engine.layoutGraph(graph)

        const block1 = positioned.find(p => p.block.id === '1')!
        const block2 = positioned.find(p => p.block.id === '2')!

        // X difference should be nodeWidth + horizontalSpacing
        expect(block2.position.x - block1.position.x).toBe(
          nodeWidth + horizontalSpacing
        )
      })
    })

    describe('RTL (right-to-left) orientation', () => {
      it('should lay out blocks horizontally with leftward progression', () => {
        const engine = new GraphEngine({ orientation: 'rtl' })
        const graph = engine.buildGraph(blocks)
        const positioned = engine.layoutGraph(graph)

        const block1 = positioned.find(p => p.block.id === '1')!
        const block2 = positioned.find(p => p.block.id === '2')!

        // Parent should be to the right of child (larger x value for reversed orientation)
        expect(block1.position.x).toBeGreaterThan(block2.position.x)

        // Siblings should be at the same x level
        const block3 = positioned.find(p => p.block.id === '3')!
        expect(block2.position.x).toBe(block3.position.x)
      })
    })

    describe('default orientation', () => {
      it('should default to TTB when orientation is not specified', () => {
        const engine = new GraphEngine({})
        const graph = engine.buildGraph(blocks)
        const positioned = engine.layoutGraph(graph)

        const block1 = positioned.find(p => p.block.id === '1')!
        const block2 = positioned.find(p => p.block.id === '2')!

        // Should behave like TTB (parent above child)
        expect(block1.position.y).toBeLessThan(block2.position.y)
      })
    })

    describe('spacing parameter adaptation', () => {
      it('should use vertical spacing for level separation in TTB/BTT', () => {
        const verticalSpacing = 150
        const engine = new GraphEngine({
          orientation: 'ttb',
          verticalSpacing,
          nodeHeight: 80,
        })

        const graph = engine.buildGraph(blocks)
        const positioned = engine.layoutGraph(graph)

        const block1 = positioned.find(p => p.block.id === '1')!
        const block2 = positioned.find(p => p.block.id === '2')!

        expect(block2.position.y - block1.position.y).toBe(80 + verticalSpacing)
      })

      it('should use horizontal spacing for level separation in LTR/RTL', () => {
        const horizontalSpacing = 120
        const engine = new GraphEngine({
          orientation: 'ltr',
          horizontalSpacing,
          nodeWidth: 200,
        })

        const graph = engine.buildGraph(blocks)
        const positioned = engine.layoutGraph(graph)

        const block1 = positioned.find(p => p.block.id === '1')!
        const block2 = positioned.find(p => p.block.id === '2')!

        expect(block2.position.x - block1.position.x).toBe(
          200 + horizontalSpacing
        )
      })
    })
  })

  describe('categorizeBlocks', () => {
    it('should show only root blocks at level 0 (no selection)', () => {
      const blocks: Block[] = [
        {
          id: 'root1',
          title: { he: 'שורש 1', en: 'Root 1' },
          prerequisites: [],
          parents: [],
        },
        {
          id: 'root2',
          title: { he: 'שורש 2', en: 'Root 2' },
          prerequisites: [],
          parents: [],
        },
        {
          id: 'child1',
          title: { he: 'ילד 1', en: 'Child 1' },
          prerequisites: [],
          parents: ['root1'],
        },
      ]

      const graph = engine.buildGraph(blocks)
      const { visible, dimmed } = engine.categorizeBlocks(
        blocks,
        graph,
        null,
        0
      )

      // Should show only root blocks (blocks with no parents)
      expect(visible.has('root1')).toBe(true)
      expect(visible.has('root2')).toBe(true)
      expect(visible.has('child1')).toBe(false)
      expect(dimmed.has('child1')).toBe(false)
    })

    it('should show selected parent and its children at level 1', () => {
      const blocks: Block[] = [
        {
          id: 'parent',
          title: { he: 'הורה', en: 'Parent' },
          prerequisites: [],
          parents: [],
        },
        {
          id: 'child1',
          title: { he: 'ילד 1', en: 'Child 1' },
          prerequisites: [],
          parents: ['parent'],
        },
        {
          id: 'child2',
          title: { he: 'ילד 2', en: 'Child 2' },
          prerequisites: [],
          parents: ['parent'],
        },
      ]

      const graph = engine.buildGraph(blocks)
      const { visible, dimmed } = engine.categorizeBlocks(
        blocks,
        graph,
        'parent',
        1
      )

      // Should show parent and its children
      expect(visible.has('parent')).toBe(true)
      expect(visible.has('child1')).toBe(true)
      expect(visible.has('child2')).toBe(true)
    })

    it('should dim other root blocks when a block is selected', () => {
      const blocks: Block[] = [
        {
          id: 'root1',
          title: { he: 'שורש 1', en: 'Root 1' },
          prerequisites: [],
          parents: [],
        },
        {
          id: 'root2',
          title: { he: 'שורש 2', en: 'Root 2' },
          prerequisites: [],
          parents: [],
        },
        {
          id: 'child1',
          title: { he: 'ילד 1', en: 'Child 1' },
          prerequisites: [],
          parents: ['root1'],
        },
      ]

      const graph = engine.buildGraph(blocks)
      const { visible, dimmed } = engine.categorizeBlocks(
        blocks,
        graph,
        'root1',
        1
      )

      // Should show selected root and its children
      expect(visible.has('root1')).toBe(true)
      expect(visible.has('child1')).toBe(true)
      // Other root blocks should be dimmed
      expect(dimmed.has('root2')).toBe(true)
    })

    it('should show selected block even if it has no children', () => {
      const blocks: Block[] = [
        {
          id: 'root1',
          title: { he: 'שורש 1', en: 'Root 1' },
          prerequisites: [],
          parents: [],
        },
        {
          id: 'root2',
          title: { he: 'שורש 2', en: 'Root 2' },
          prerequisites: [],
          parents: [],
        },
      ]

      const graph = engine.buildGraph(blocks)
      const { visible, dimmed } = engine.categorizeBlocks(
        blocks,
        graph,
        'root1',
        1
      )

      // Should show selected root even if it has no children
      expect(visible.has('root1')).toBe(true)
      expect(dimmed.has('root2')).toBe(true)
    })

    it('should handle nested hierarchies correctly', () => {
      const blocks: Block[] = [
        {
          id: 'root',
          title: { he: 'שורש', en: 'Root' },
          prerequisites: [],
          parents: [],
        },
        {
          id: 'child1',
          title: { he: 'ילד 1', en: 'Child 1' },
          prerequisites: [],
          parents: ['root'],
        },
        {
          id: 'grandchild1',
          title: { he: 'נכד 1', en: 'Grandchild 1' },
          prerequisites: [],
          parents: ['child1'],
        },
      ]

      const graph = engine.buildGraph(blocks)

      // Select child1 - should show child1 and grandchild1
      const { visible, dimmed } = engine.categorizeBlocks(
        blocks,
        graph,
        'child1',
        1
      )

      expect(visible.has('child1')).toBe(true)
      expect(visible.has('grandchild1')).toBe(true)
      // Root should NOT be dimmed (single root with descendants - stays hidden)
      expect(visible.has('root')).toBe(false)
      expect(dimmed.has('root')).toBe(false)
    })

    it('should auto-skip single root and show its children', () => {
      const blocks: Block[] = [
        {
          id: 'single-root',
          title: { he: 'שורש יחיד', en: 'Single Root' },
          prerequisites: [],
          parents: [],
        },
        {
          id: 'child1',
          title: { he: 'ילד 1', en: 'Child 1' },
          prerequisites: [],
          parents: ['single-root'],
        },
        {
          id: 'child2',
          title: { he: 'ילד 2', en: 'Child 2' },
          prerequisites: [],
          parents: ['single-root'],
        },
      ]

      const graph = engine.buildGraph(blocks)
      const { visible, dimmed } = engine.categorizeBlocks(
        blocks,
        graph,
        null,
        0
      )

      // Single root should be skipped, children should be shown
      expect(visible.has('single-root')).toBe(false)
      expect(visible.has('child1')).toBe(true)
      expect(visible.has('child2')).toBe(true)
    })

    it('should show single root if it has no children', () => {
      const blocks: Block[] = [
        {
          id: 'single-root',
          title: { he: 'שורש יחיד', en: 'Single Root' },
          prerequisites: [],
          parents: [],
        },
      ]

      const graph = engine.buildGraph(blocks)
      const { visible, dimmed } = engine.categorizeBlocks(
        blocks,
        graph,
        null,
        0
      )

      // Single root with no children should be shown
      expect(visible.has('single-root')).toBe(true)
    })

    it('should keep single root hidden when viewing its direct child', () => {
      const blocks: Block[] = [
        {
          id: 'single-root',
          title: { he: 'שורש יחיד', en: 'Single Root' },
          prerequisites: [],
          parents: [],
        },
        {
          id: 'child1',
          title: { he: 'ילד 1', en: 'Child 1' },
          prerequisites: [],
          parents: ['single-root'],
        },
        {
          id: 'child2',
          title: { he: 'ילד 2', en: 'Child 2' },
          prerequisites: [],
          parents: ['single-root'],
        },
        {
          id: 'grandchild1',
          title: { he: 'נכד 1', en: 'Grandchild 1' },
          prerequisites: [],
          parents: ['child1'],
        },
      ]

      const graph = engine.buildGraph(blocks)

      // Click on child1 - should show child1 and its children
      // but NOT show the single root (not even dimmed)
      const { visible, dimmed } = engine.categorizeBlocks(
        blocks,
        graph,
        'child1',
        1
      )

      expect(visible.has('child1')).toBe(true)
      expect(visible.has('grandchild1')).toBe(true)
      // Single root should NOT be visible or dimmed
      expect(visible.has('single-root')).toBe(false)
      expect(dimmed.has('single-root')).toBe(false)
    })

    it('should keep single root hidden when viewing its grandchild', () => {
      const blocks: Block[] = [
        {
          id: 'single-root',
          title: { he: 'שורש יחיד', en: 'Single Root' },
          prerequisites: [],
          parents: [],
        },
        {
          id: 'child1',
          title: { he: 'ילד 1', en: 'Child 1' },
          prerequisites: [],
          parents: ['single-root'],
        },
        {
          id: 'grandchild1',
          title: { he: 'נכד 1', en: 'Grandchild 1' },
          prerequisites: [],
          parents: ['child1'],
        },
        {
          id: 'great-grandchild1',
          title: { he: 'נין 1', en: 'Great-grandchild 1' },
          prerequisites: [],
          parents: ['grandchild1'],
        },
      ]

      const graph = engine.buildGraph(blocks)

      // Click on grandchild1 (descendant of single root)
      // The single root should remain hidden
      const { visible, dimmed } = engine.categorizeBlocks(
        blocks,
        graph,
        'grandchild1',
        1
      )

      expect(visible.has('grandchild1')).toBe(true)
      expect(visible.has('great-grandchild1')).toBe(true)
      // Single root should NOT be visible or dimmed
      expect(visible.has('single-root')).toBe(false)
      expect(dimmed.has('single-root')).toBe(false)
    })

    it('should only auto-skip the root node, not recursively', () => {
      const blocks: Block[] = [
        {
          id: 'root',
          title: { he: 'שורש', en: 'Root' },
          prerequisites: [],
          parents: [],
        },
        {
          id: 'middle',
          title: { he: 'אמצע', en: 'Middle' },
          prerequisites: [],
          parents: ['root'],
        },
        {
          id: 'grandchild1',
          title: { he: 'נכד 1', en: 'Grandchild 1' },
          prerequisites: [],
          parents: ['middle'],
        },
        {
          id: 'grandchild2',
          title: { he: 'נכד 2', en: 'Grandchild 2' },
          prerequisites: [],
          parents: ['middle'],
        },
      ]

      const graph = engine.buildGraph(blocks)
      const { visible, dimmed } = engine.categorizeBlocks(
        blocks,
        graph,
        null,
        0
      )

      // Should skip root, show middle (even though it's also single)
      expect(visible.has('root')).toBe(false)
      expect(visible.has('middle')).toBe(true)
      expect(visible.has('grandchild1')).toBe(false)
      expect(visible.has('grandchild2')).toBe(false)
    })

    it('should not auto-skip when multiple root blocks exist', () => {
      const blocks: Block[] = [
        {
          id: 'root1',
          title: { he: 'שורש 1', en: 'Root 1' },
          prerequisites: [],
          parents: [],
        },
        {
          id: 'root2',
          title: { he: 'שורש 2', en: 'Root 2' },
          prerequisites: [],
          parents: [],
        },
        {
          id: 'child1',
          title: { he: 'ילד 1', en: 'Child 1' },
          prerequisites: [],
          parents: ['root1'],
        },
      ]

      const graph = engine.buildGraph(blocks)
      const { visible, dimmed } = engine.categorizeBlocks(
        blocks,
        graph,
        null,
        0
      )

      // Multiple roots - should show all roots, no auto-skip
      expect(visible.has('root1')).toBe(true)
      expect(visible.has('root2')).toBe(true)
      expect(visible.has('child1')).toBe(false)
    })
  })
})
