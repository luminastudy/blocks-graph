import type { Block } from '../types/block.js'
import type { BlockGraph } from '../types/block-graph.js'
import type { BlockPosition } from '../types/block-position.js'
import type { GraphEdge } from '../types/graph-edge.js'
import type { PositionedBlock } from '../types/positioned-block.js'
import type { GraphLayoutConfig } from './graph-layout-config.js'
import { DEFAULT_LAYOUT_CONFIG } from './default-layout-config.js'
import { HorizontalRelationships } from './horizontal-relationships.js'
import { addBlockWithSubBlocks } from './add-block-with-sub-blocks.js'

/**
 * Graph engine responsible for building and laying out the block graph
 */
export class GraphEngine {
  private config: GraphLayoutConfig

  constructor(config: Partial<GraphLayoutConfig> = {}) {
    this.config = { ...DEFAULT_LAYOUT_CONFIG, ...config }
  }

  buildGraph(blocks: Block[]): BlockGraph {
    const blockMap = new Map<string, Block>()
    const edges: GraphEdge[] = []

    for (const block of blocks) {
      blockMap.set(block.id, block)
    }

    for (const block of blocks) {
      for (const prereqId of block.prerequisites) {
        edges.push({ from: prereqId, to: block.id, type: 'prerequisite' })
      }
      for (const parentId of block.parents) {
        edges.push({ from: parentId, to: block.id, type: 'parent' })
      }
    }

    // Build horizontal relationships for efficient O(1) prerequisite/post-requisite lookups
    const horizontalRelationships = HorizontalRelationships.fromBlocks(blocks)

    return { blocks: blockMap, edges, horizontalRelationships }
  }

  /**
   * Calculate depth levels for all blocks in the graph
   */
  private calculateLevels(graph: BlockGraph): Map<string, number> {
    const visited = new Set<string>()
    const levels = new Map<string, number>()

    const calculateLevel = (blockId: string, level = 0): void => {
      if (visited.has(blockId)) return
      visited.add(blockId)
      const currentLevelValue = levels.get(blockId)
      const currentLevel = currentLevelValue !== undefined ? currentLevelValue : 0
      levels.set(blockId, Math.max(currentLevel, level))

      const children = graph.edges
        .filter(edge => edge.from === blockId)
        .map(edge => edge.to)
      for (const childId of children) {
        calculateLevel(childId, level + 1)
      }
    }

    const rootBlocks = Array.from(graph.blocks.keys()).filter(
      blockId => !graph.edges.some(edge => edge.to === blockId)
    )
    const roots =
      rootBlocks.length > 0 ? rootBlocks : Array.from(graph.blocks.keys())

    for (const rootId of roots) {
      calculateLevel(rootId)
    }

    return levels
  }

  layoutGraph(graph: BlockGraph): PositionedBlock[] {
    const levels = this.calculateLevels(graph)
    const blocksByLevel = new Map<number, string[]>()

    for (const [blockId, level] of levels.entries()) {
      const blocksAtLevelValue = blocksByLevel.get(level)
      const blocksAtLevel = blocksAtLevelValue !== undefined ? blocksAtLevelValue : []
      blocksAtLevel.push(blockId)
      blocksByLevel.set(level, blocksAtLevel)
    }

    const orientationValue = this.config.orientation
    const orientation = orientationValue !== undefined ? orientationValue : 'ttb'

    // Determine axis and direction
    const isVertical = orientation === 'ttb' || orientation === 'btt'
    const isReversed = orientation === 'btt' || orientation === 'rtl'

    // Calculate max level for reversed orientations
    const maxLevel = isReversed
      ? Math.max(...Array.from(blocksByLevel.keys()))
      : 0

    const positions = new Map<string, BlockPosition>()

    for (const [level, blockIds] of blocksByLevel.entries()) {
      // Calculate level position based on orientation
      const adjustedLevel = isReversed ? maxLevel - level : level

      if (isVertical) {
        // TTB or BTT: levels progress along y-axis
        const y =
          adjustedLevel * (this.config.nodeHeight + this.config.verticalSpacing)
        blockIds.forEach((blockId, index) => {
          positions.set(blockId, {
            x: index * (this.config.nodeWidth + this.config.horizontalSpacing),
            y,
            width: this.config.nodeWidth,
            height: this.config.nodeHeight,
          })
        })
      } else {
        // LTR or RTL: levels progress along x-axis
        const x =
          adjustedLevel *
          (this.config.nodeWidth + this.config.horizontalSpacing)
        blockIds.forEach((blockId, index) => {
          positions.set(blockId, {
            x,
            y: index * (this.config.nodeHeight + this.config.verticalSpacing),
            width: this.config.nodeWidth,
            height: this.config.nodeHeight,
          })
        })
      }
    }

    const positionedBlocks: PositionedBlock[] = []
    for (const [blockId, block] of graph.blocks.entries()) {
      const position = positions.get(blockId)
      if (position) {
        positionedBlocks.push({ block, position })
      }
    }

    return positionedBlocks
  }

  process(blocks: Block[]): {
    graph: BlockGraph
    positioned: PositionedBlock[]
  } {
    const graph = this.buildGraph(blocks)
    const positioned = this.layoutGraph(graph)
    return { graph, positioned }
  }

  isSubBlock(block: Block): boolean {
    return block.parents.length > 0
  }

  getDirectPrerequisites(blockId: string, graph: BlockGraph): Block[] {
    const block = graph.blocks.get(blockId)
    if (!block) {
      return []
    }
    return block.prerequisites
      .map(id => graph.blocks.get(id))
      .filter((b): b is Block => b !== undefined)
  }

  /**
   * Gets direct post-requisites using HorizontalRelationships for O(1) lookup.
   * Uses pre-computed relationships if available, otherwise builds them on-demand.
   */
  getDirectPostRequisites(blockId: string, graph: BlockGraph): Block[] {
    // Use pre-computed relationships if available (O(1)), otherwise build on-demand
    const relationships = graph.horizontalRelationships !== undefined
      ? graph.horizontalRelationships
      : HorizontalRelationships.fromGraph(graph)
    const postreqIds = relationships.getPostrequisites(blockId)
    const dependents: Block[] = []

    for (const id of postreqIds) {
      const dependent = graph.blocks.get(id)
      if (dependent) {
        dependents.push(dependent)
      }
    }

    return dependents
  }

  getSubBlocks(blockId: string, graph: BlockGraph): Block[] {
    const subBlocks: Block[] = []
    for (const edge of graph.edges) {
      if (edge.from !== blockId || edge.type !== 'parent') continue
      const subBlock = graph.blocks.get(edge.to)
      if (subBlock) subBlocks.push(subBlock)
    }
    return subBlocks
  }

  /**
   * Check if a block is a descendant of another block (child, grandchild, etc.)
   */
  private isDescendantOf(
    blockId: string,
    ancestorId: string,
    graph: BlockGraph,
    visited: Set<string> = new Set()
  ): boolean {
    if (visited.has(blockId)) return false
    visited.add(blockId)

    const block = graph.blocks.get(blockId)
    if (!block) return false
    if (block.parents.includes(ancestorId)) return true

    return block.parents.some(parentId =>
      this.isDescendantOf(parentId, ancestorId, graph, visited)
    )
  }

  getRelatedBlocks(
    blockId: string,
    graph: BlockGraph,
    includeSubBlocks: boolean
  ): Set<string> {
    const relatedIds = new Set<string>()
    relatedIds.add(blockId)

    const prerequisites = this.getDirectPrerequisites(blockId, graph)
    for (const prereq of prerequisites) {
      addBlockWithSubBlocks(
        prereq.id,
        graph,
        relatedIds,
        includeSubBlocks,
        this.getSubBlocks.bind(this)
      )
    }

    const postRequisites = this.getDirectPostRequisites(blockId, graph)
    for (const postReq of postRequisites) {
      addBlockWithSubBlocks(
        postReq.id,
        graph,
        relatedIds,
        includeSubBlocks,
        this.getSubBlocks.bind(this)
      )
    }

    if (includeSubBlocks) {
      const subBlocks = this.getSubBlocks(blockId, graph)
      for (const subBlock of subBlocks) {
        relatedIds.add(subBlock.id)
      }
    }

    return relatedIds
  }

  /**
   * Categorize blocks based on selection state
   * Returns which blocks should be visible vs dimmed
   *
   * Drill-down navigation with auto-skip:
   * - No selection: Show only root blocks (blocks with no parents)
   *   - If only 1 root block exists and it has children, skip it and show its children (one level only)
   * - Block selected: Show only the selected block and its direct children
   *   - If viewing a descendant of the single auto-skipped root, keep the root hidden (not even dimmed)
   *   - Other root blocks are dimmed for context
   */
  categorizeBlocks(
    blocks: Block[],
    graph: BlockGraph,
    selectedBlockId: string | null,
    selectionLevel: number
  ): { visible: Set<string>; dimmed: Set<string> } {
    const visible = new Set<string>()
    const dimmed = new Set<string>()

    // If nothing is selected, show root blocks with auto-drill-down
    if (!selectedBlockId || selectionLevel === 0) {
      // Find all root blocks
      const rootBlocks = blocks.filter(block => block.parents.length === 0)

      // Auto-drill-down: if there's only 1 root block, skip it and show its children
      if (rootBlocks.length === 1) {
        const singleRoot = rootBlocks[0]
        if (singleRoot) {
          const children = this.getSubBlocks(singleRoot.id, graph)

          // If the single root has children, skip it and show the children
          if (children.length > 0) {
            for (const child of children) {
              visible.add(child.id)
            }
            return { visible, dimmed }
          }
        }
      }

      // Show all root blocks (multiple roots or single root with no children)
      for (const block of rootBlocks) {
        visible.add(block.id)
      }

      return { visible, dimmed }
    }

    // Block is selected: show the selected block and its children
    visible.add(selectedBlockId)

    // Get children (sub-blocks) of the selected block
    const children = this.getSubBlocks(selectedBlockId, graph)
    for (const child of children) {
      visible.add(child.id)
    }

    // Find all root blocks
    const rootBlocks = blocks.filter(block => block.parents.length === 0)

    // Check if we're viewing a descendant of the single auto-skipped root
    // If so, keep the root hidden (not even dimmed) to maintain clean navigation
    const isInSingleRootSubtree =
      rootBlocks.length === 1 &&
      rootBlocks[0] &&
      this.isDescendantOf(selectedBlockId, rootBlocks[0].id, graph)

    // All other root blocks should be dimmed (for context)
    // Exception: Don't show the single auto-skipped root when viewing its descendants
    for (const block of blocks) {
      if (!visible.has(block.id) && block.parents.length === 0) {
        // Skip dimming if this is the single root and we're viewing its descendant
        if (
          isInSingleRootSubtree &&
          rootBlocks[0] &&
          block.id === rootBlocks[0].id
        ) {
          continue
        }
        dimmed.add(block.id)
      }
    }

    return { visible, dimmed }
  }
}
