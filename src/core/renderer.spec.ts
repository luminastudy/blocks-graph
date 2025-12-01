import { describe, it, expect } from 'vitest'
import { GraphRenderer } from './renderer.js'
import type { BlockGraph } from '../types/block-graph.js'
import type { PositionedBlock } from '../types/positioned-block.js'

describe('renderer', () => {
  it('should export GraphRenderer', () => {
    expect(GraphRenderer).toBeDefined()
  })

  it('should create GraphRenderer instance', () => {
    const renderer = new GraphRenderer()
    expect(renderer).toBeDefined()
  })

  describe('external block icon rendering', () => {
    const createTestGraph = (): BlockGraph => ({
      blocks: [],
      edges: [],
    })

    const createPositionedBlock = (
      id: string,
      external?: boolean,
      platform?: string
    ): PositionedBlock => ({
      block: {
        id,
        title: { he: 'Test Block', en: 'Test Block' },
        prerequisites: [],
        parents: [],
        ...(external ? { _external: true, _externalPlatform: platform } : {}),
      },
      position: { x: 0, y: 0, width: 200, height: 80 },
    })

    it('renders GitHub icon for GitHub external blocks', () => {
      const renderer = new GraphRenderer()
      const graph = createTestGraph()
      const positioned = [
        createPositionedBlock('github:org/repo', true, 'github'),
      ]

      const svg = renderer.render(graph, positioned)
      const blockGroup = svg.querySelector('.block[data-id="github:org/repo"]')

      expect(blockGroup).not.toBeNull()
      expect(blockGroup?.getAttribute('data-external')).toBe('true')
      expect(blockGroup?.getAttribute('data-external-platform')).toBe('github')

      const icon = blockGroup?.querySelector('.external-icon')
      expect(icon).not.toBeNull()
      expect(icon?.classList.contains('external-icon-github')).toBe(true)

      const path = icon?.querySelector('path')
      expect(path?.getAttribute('fill')).toBe('#24292f')
    })

    it('renders GitLab icon for GitLab external blocks', () => {
      const renderer = new GraphRenderer()
      const graph = createTestGraph()
      const positioned = [
        createPositionedBlock('gitlab:org/repo', true, 'gitlab'),
      ]

      const svg = renderer.render(graph, positioned)
      const blockGroup = svg.querySelector('.block[data-id="gitlab:org/repo"]')

      expect(blockGroup).not.toBeNull()
      expect(blockGroup?.getAttribute('data-external')).toBe('true')
      expect(blockGroup?.getAttribute('data-external-platform')).toBe('gitlab')

      const icon = blockGroup?.querySelector('.external-icon')
      expect(icon).not.toBeNull()
      expect(icon?.classList.contains('external-icon-gitlab')).toBe(true)

      const path = icon?.querySelector('path')
      expect(path?.getAttribute('fill')).toBe('#fc6d26')
    })

    it('renders generic icon for unknown platform external blocks', () => {
      const renderer = new GraphRenderer()
      const graph = createTestGraph()
      const positioned = [
        createPositionedBlock('bitbucket:org/repo', true, 'bitbucket'),
      ]

      const svg = renderer.render(graph, positioned)
      const blockGroup = svg.querySelector(
        '.block[data-id="bitbucket:org/repo"]'
      )

      expect(blockGroup).not.toBeNull()
      expect(blockGroup?.getAttribute('data-external')).toBe('true')
      expect(blockGroup?.getAttribute('data-external-platform')).toBe(
        'bitbucket'
      )

      const icon = blockGroup?.querySelector('.external-icon')
      expect(icon).not.toBeNull()

      const path = icon?.querySelector('path')
      expect(path?.getAttribute('stroke')).toBe('#666')
    })

    it('does not render icon for non-external blocks', () => {
      const renderer = new GraphRenderer()
      const graph = createTestGraph()
      const positioned = [createPositionedBlock('regular-block-uuid')]

      const svg = renderer.render(graph, positioned)
      const blockGroup = svg.querySelector(
        '.block[data-id="regular-block-uuid"]'
      )

      expect(blockGroup).not.toBeNull()
      expect(blockGroup?.getAttribute('data-external')).toBeNull()

      const icon = blockGroup?.querySelector('.external-icon')
      expect(icon).toBeNull()
    })

    it('applies dimmed opacity to external icon when block is dimmed', () => {
      const renderer = new GraphRenderer({
        dimmedBlocks: new Set(['github:org/repo']),
      })
      const graph = createTestGraph()
      const positioned = [
        createPositionedBlock('github:org/repo', true, 'github'),
      ]

      const svg = renderer.render(graph, positioned)
      const icon = svg.querySelector('.external-icon')

      expect(icon).not.toBeNull()
      expect(icon?.getAttribute('opacity')).toBe('0.3')
    })

    it('includes tooltip title in external icon', () => {
      const renderer = new GraphRenderer()
      const graph = createTestGraph()
      const positioned = [
        createPositionedBlock('github:org/repo', true, 'github'),
      ]

      const svg = renderer.render(graph, positioned)
      const icon = svg.querySelector('.external-icon')
      const title = icon?.querySelector('title')

      expect(title).not.toBeNull()
      expect(title?.textContent).toContain('GitHub')
    })

    it('renders external icon without platform specified', () => {
      const renderer = new GraphRenderer()
      const graph = createTestGraph()
      const positioned: PositionedBlock[] = [
        {
          block: {
            id: 'external-no-platform',
            title: { he: 'External', en: 'External' },
            prerequisites: [],
            parents: [],
            _external: true,
          },
          position: { x: 0, y: 0, width: 200, height: 80 },
        },
      ]

      const svg = renderer.render(graph, positioned)
      const blockGroup = svg.querySelector(
        '.block[data-id="external-no-platform"]'
      )

      expect(blockGroup?.getAttribute('data-external')).toBe('true')
      expect(blockGroup?.getAttribute('data-external-platform')).toBeNull()

      const icon = blockGroup?.querySelector('.external-icon')
      expect(icon).not.toBeNull()
    })

    it('renders multiple blocks with mixed external status', () => {
      const renderer = new GraphRenderer()
      const graph = createTestGraph()
      const positioned = [
        createPositionedBlock('block-1'),
        createPositionedBlock('github:org/repo', true, 'github'),
        createPositionedBlock('block-2'),
        createPositionedBlock('gitlab:org/repo', true, 'gitlab'),
      ]

      const svg = renderer.render(graph, positioned)
      const blocks = svg.querySelectorAll('.block')
      const externalIcons = svg.querySelectorAll('.external-icon')

      expect(blocks.length).toBe(4)
      expect(externalIcons.length).toBe(2)
    })
  })
})
