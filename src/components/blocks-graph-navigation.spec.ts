import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { BlocksGraph } from './blocks-graph.js'
import type { Block } from '../types/block.js'

// Mock canvas context for jsdom
const mockCanvas = {
  getContext: vi.fn().mockReturnValue({
    measureText: vi.fn().mockReturnValue({ width: 100 }),
  }),
}

global.document.createElement = new Proxy(document.createElement, {
  apply(target, thisArg, args) {
    const element = Reflect.apply(target, thisArg, args)
    if (args[0] === 'canvas') {
      Object.assign(element, mockCanvas)
    }
    return element
  },
})

// Helper to simulate click on SVG elements
function clickElement(element: Element | null): void {
  if (element) {
    element.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  }
}

describe('BlocksGraph - Hierarchical Navigation', () => {
  let element: BlocksGraph
  let eventSpy: ReturnType<typeof vi.fn>

  beforeEach(() => {
    element = new BlocksGraph()
    document.body.appendChild(element)
    eventSpy = vi.fn()
  })

  afterEach(() => {
    document.body.removeChild(element)
  })

  describe('Initial State - Auto-drill-down with single root', () => {
    it('should auto-drill to show children when single root has children', () => {
      const blocks: Block[] = [
        {
          id: 'A',
          title: { he: 'A', en: 'A' },
          prerequisites: [],
          parents: [],
        },
        {
          id: 'B',
          title: { he: 'B', en: 'B' },
          prerequisites: [],
          parents: ['A'],
        },
        {
          id: 'C',
          title: { he: 'C', en: 'C' },
          prerequisites: [],
          parents: ['A'],
        },
      ]

      element.setBlocks(blocks)

      // Should show B and C (children of A), not A itself
      const svg = element.shadowRoot?.querySelector('svg')
      expect(svg).toBeTruthy()

      const renderedBlocks = svg?.querySelectorAll('.block')
      expect(renderedBlocks?.length).toBe(2) // B and C, not A

      const blockIds = Array.from(renderedBlocks || []).map(el =>
        el.getAttribute('data-id')
      )
      expect(blockIds).toContain('B')
      expect(blockIds).toContain('C')
      expect(blockIds).not.toContain('A')
    })

    it('should show all roots when multiple roots exist', () => {
      const blocks: Block[] = [
        {
          id: 'A',
          title: { he: 'A', en: 'A' },
          prerequisites: [],
          parents: [],
        },
        {
          id: 'X',
          title: { he: 'X', en: 'X' },
          prerequisites: [],
          parents: [],
        },
      ]

      element.setBlocks(blocks)

      const svg = element.shadowRoot?.querySelector('svg')
      const renderedBlocks = svg?.querySelectorAll('.block')
      expect(renderedBlocks?.length).toBe(2)

      const blockIds = Array.from(renderedBlocks || []).map(el =>
        el.getAttribute('data-id')
      )
      expect(blockIds).toContain('A')
      expect(blockIds).toContain('X')
    })
  })

  describe('Click Navigation - Drill Down', () => {
    it('should drill down when clicking block with children', () => {
      const blocks: Block[] = [
        {
          id: 'A',
          title: { he: 'A', en: 'A' },
          prerequisites: [],
          parents: [],
        },
        {
          id: 'B',
          title: { he: 'B', en: 'B' },
          prerequisites: [],
          parents: ['A'],
        },
        {
          id: 'C',
          title: { he: 'C', en: 'C' },
          prerequisites: [],
          parents: ['B'],
        },
      ]

      element.setBlocks(blocks)
      element.addEventListener('block-selected', eventSpy)

      // Initial: Shows B (auto-drilled from A)
      let svg = element.shadowRoot?.querySelector('svg')
      let blockIds = Array.from(svg?.querySelectorAll('.block') || []).map(el =>
        el.getAttribute('data-id')
      )
      expect(blockIds).toEqual(['B'])

      // Click B - should drill down to show B + C
      const blockB = svg?.querySelector('[data-id="B"]')
      clickElement(blockB)

      // After click: Should show B (highlighted) and C
      svg = element.shadowRoot?.querySelector('svg')
      blockIds = Array.from(svg?.querySelectorAll('.block') || []).map(el =>
        el.getAttribute('data-id')
      )
      expect(blockIds).toContain('B')
      expect(blockIds).toContain('C')

      // Event should be fired with navigation stack info
      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            blockId: 'B',
            navigationStack: ['B'],
          }),
        })
      )
    })

    it('should support multi-level drill down', () => {
      const blocks: Block[] = [
        {
          id: 'A',
          title: { he: 'A', en: 'A' },
          prerequisites: [],
          parents: [],
        },
        {
          id: 'B',
          title: { he: 'B', en: 'B' },
          prerequisites: [],
          parents: ['A'],
        },
        {
          id: 'C',
          title: { he: 'C', en: 'C' },
          prerequisites: [],
          parents: ['B'],
        },
        {
          id: 'D',
          title: { he: 'D', en: 'D' },
          prerequisites: [],
          parents: ['C'],
        },
      ]

      element.setBlocks(blocks)
      element.addEventListener('block-selected', eventSpy)

      // Click B to drill to B+C
      let svg = element.shadowRoot?.querySelector('svg')
      clickElement(svg?.querySelector('[data-id="B"]'))

      expect(eventSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            navigationStack: ['B'],
          }),
        })
      )

      // Click C to drill to C+D
      svg = element.shadowRoot?.querySelector('svg')
      clickElement(svg?.querySelector('[data-id="C"]'))

      expect(eventSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            navigationStack: ['B', 'C'],
          }),
        })
      )

      // Verify D is now visible
      svg = element.shadowRoot?.querySelector('svg')
      const blockIds = Array.from(svg?.querySelectorAll('.block') || []).map(
        el => el.getAttribute('data-id')
      )
      expect(blockIds).toContain('C')
      expect(blockIds).toContain('D')
    })
  })

  describe('Click Navigation - Go Up', () => {
    it('should go up one level when clicking top of stack', () => {
      const blocks: Block[] = [
        {
          id: 'A',
          title: { he: 'A', en: 'A' },
          prerequisites: [],
          parents: [],
        },
        {
          id: 'B',
          title: { he: 'B', en: 'B' },
          prerequisites: [],
          parents: ['A'],
        },
        {
          id: 'C',
          title: { he: 'C', en: 'C' },
          prerequisites: [],
          parents: ['B'],
        },
      ]

      element.setBlocks(blocks)
      element.addEventListener('block-selected', eventSpy)

      // Drill down: Click B
      let svg = element.shadowRoot?.querySelector('svg')
      clickElement(svg?.querySelector('[data-id="B"]'))

      // Now showing B + C, stack is ['B']
      expect(eventSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            navigationStack: ['B'],
          }),
        })
      )

      // Click B again - should pop stack and return to B only
      svg = element.shadowRoot?.querySelector('svg')
      clickElement(svg?.querySelector('[data-id="B"]'))

      // Stack should be empty, showing just B
      expect(eventSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            navigationStack: [],
          }),
        })
      )

      svg = element.shadowRoot?.querySelector('svg')
      const blockIds = Array.from(svg?.querySelectorAll('.block') || []).map(
        el => el.getAttribute('data-id')
      )
      expect(blockIds).toEqual(['B']) // Back to auto-drilled view
    })

    it('should support multi-level going up', () => {
      const blocks: Block[] = [
        {
          id: 'A',
          title: { he: 'A', en: 'A' },
          prerequisites: [],
          parents: [],
        },
        {
          id: 'B',
          title: { he: 'B', en: 'B' },
          prerequisites: [],
          parents: ['A'],
        },
        {
          id: 'C',
          title: { he: 'C', en: 'C' },
          prerequisites: [],
          parents: ['B'],
        },
        {
          id: 'D',
          title: { he: 'D', en: 'D' },
          prerequisites: [],
          parents: ['C'],
        },
      ]

      element.setBlocks(blocks)
      element.addEventListener('block-selected', eventSpy)

      // Drill down to stack ['B', 'C']
      let svg = element.shadowRoot?.querySelector('svg')
      clickElement(svg?.querySelector('[data-id="B"]'))
      svg = element.shadowRoot?.querySelector('svg')
      clickElement(svg?.querySelector('[data-id="C"]'))

      expect(eventSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            navigationStack: ['B', 'C'],
          }),
        })
      )

      // Click C to go back to ['B']
      svg = element.shadowRoot?.querySelector('svg')
      clickElement(svg?.querySelector('[data-id="C"]'))

      expect(eventSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            navigationStack: ['B'],
          }),
        })
      )

      // Click B to go back to []
      svg = element.shadowRoot?.querySelector('svg')
      clickElement(svg?.querySelector('[data-id="B"]'))

      expect(eventSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            navigationStack: [],
          }),
        })
      )
    })
  })

  describe('Click Navigation - Leaf Nodes', () => {
    it('should fire event but not change view when clicking leaf block', () => {
      const blocks: Block[] = [
        {
          id: 'A',
          title: { he: 'A', en: 'A' },
          prerequisites: [],
          parents: [],
        },
        {
          id: 'B',
          title: { he: 'B', en: 'B' },
          prerequisites: [],
          parents: ['A'],
        },
        {
          id: 'C',
          title: { he: 'C', en: 'C' },
          prerequisites: [],
          parents: ['B'],
        },
      ]

      element.setBlocks(blocks)
      element.addEventListener('block-selected', eventSpy)

      // Drill down to show B + C
      let svg = element.shadowRoot?.querySelector('svg')
      clickElement(svg?.querySelector('[data-id="B"]'))

      eventSpy.mockClear()

      // Click C (leaf node) - should fire event but not change view
      svg = element.shadowRoot?.querySelector('svg')
      clickElement(svg?.querySelector('[data-id="C"]'))

      // Event should be fired
      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            blockId: 'C',
            navigationStack: ['B'], // Stack unchanged
          }),
        })
      )

      // View should still show B + C (unchanged)
      svg = element.shadowRoot?.querySelector('svg')
      const blockIds = Array.from(svg?.querySelectorAll('.block') || []).map(
        el => el.getAttribute('data-id')
      )
      expect(blockIds).toContain('B')
      expect(blockIds).toContain('C')
    })
  })

  describe('Backward Compatibility', () => {
    it('should include deprecated selectionLevel in events', () => {
      const blocks: Block[] = [
        {
          id: 'A',
          title: { he: 'A', en: 'A' },
          prerequisites: [],
          parents: [],
        },
        {
          id: 'B',
          title: { he: 'B', en: 'B' },
          prerequisites: [],
          parents: ['A'],
        },
        {
          id: 'C',
          title: { he: 'C', en: 'C' },
          prerequisites: [],
          parents: ['B'],
        },
      ]

      element.setBlocks(blocks)
      element.addEventListener('block-selected', eventSpy)

      // Initial: Shows B (auto-drilled from A)
      // Click B to drill down to B+C
      const svg = element.shadowRoot?.querySelector('svg')
      clickElement(svg?.querySelector('[data-id="B"]'))

      // After clicking B: selectionLevel should be 1 (stack has ['B'])
      expect(eventSpy).toHaveBeenCalled()
      const event = eventSpy.mock.calls[0]?.[0] as CustomEvent
      expect(event.detail.selectionLevel).toBe(1)
      expect(event.detail.navigationStack).toEqual(['B'])
    })

    it('should compute selectedBlockId from navigation stack', () => {
      const blocks: Block[] = [
        {
          id: 'A',
          title: { he: 'A', en: 'A' },
          prerequisites: [],
          parents: [],
        },
        {
          id: 'B',
          title: { he: 'B', en: 'B' },
          prerequisites: [],
          parents: ['A'],
        },
        {
          id: 'C',
          title: { he: 'C', en: 'C' },
          prerequisites: [],
          parents: ['B'],
        },
        {
          id: 'D',
          title: { he: 'D', en: 'D' },
          prerequisites: [],
          parents: ['C'],
        },
      ]

      element.setBlocks(blocks)
      element.addEventListener('block-selected', eventSpy)

      // Drill to B (initial view shows B, click B to drill to B+C)
      let svg = element.shadowRoot?.querySelector('svg')
      clickElement(svg?.querySelector('[data-id="B"]'))

      expect(eventSpy).toHaveBeenCalled()
      let event = eventSpy.mock.calls[
        eventSpy.mock.calls.length - 1
      ]?.[0] as CustomEvent
      expect(event.detail.blockId).toBe('B') // Top of stack
      expect(event.detail.navigationStack).toEqual(['B'])

      // Drill to C (click C to drill to C+D)
      svg = element.shadowRoot?.querySelector('svg')
      clickElement(svg?.querySelector('[data-id="C"]'))

      expect(eventSpy).toHaveBeenCalledTimes(2)
      event = eventSpy.mock.calls[
        eventSpy.mock.calls.length - 1
      ]?.[0] as CustomEvent
      expect(event.detail.blockId).toBe('C') // New top of stack
      expect(event.detail.navigationStack).toEqual(['B', 'C'])
    })
  })
})
