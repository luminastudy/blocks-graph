import type { Block } from '../types/block.js';
import type { BlockGraph } from '../types/block-graph.js';
import type { BlockPosition } from '../types/block-position.js';
import type { GraphEdge } from '../types/graph-edge.js';
import type { PositionedBlock } from '../types/positioned-block.js';
import type { GraphLayoutConfig } from './graph-layout-config.js';
import { DEFAULT_LAYOUT_CONFIG } from './default-layout-config.js';
import { HorizontalRelationships } from './horizontal-relationships.js';

/**
 * Graph engine responsible for building and laying out the block graph
 */
export class GraphEngine {
  private config: GraphLayoutConfig;

  constructor(config: Partial<GraphLayoutConfig> = {}) {
    this.config = { ...DEFAULT_LAYOUT_CONFIG, ...config };
  }

  buildGraph(blocks: Block[]): BlockGraph {
    const blockMap = new Map<string, Block>();
    const edges: GraphEdge[] = [];

    for (const block of blocks) {
      blockMap.set(block.id, block);
    }

    for (const block of blocks) {
      for (const prereqId of block.prerequisites) {
        edges.push({ from: prereqId, to: block.id, type: 'prerequisite' });
      }
      for (const parentId of block.parents) {
        edges.push({ from: parentId, to: block.id, type: 'parent' });
      }
    }

    // Build horizontal relationships for efficient O(1) prerequisite/post-requisite lookups
    const horizontalRelationships = HorizontalRelationships.fromBlocks(blocks);

    return { blocks: blockMap, edges, horizontalRelationships };
  }

  /**
   * Calculate depth levels for all blocks in the graph
   */
  private calculateLevels(graph: BlockGraph): Map<string, number> {
    const visited = new Set<string>();
    const levels = new Map<string, number>();

    const calculateLevel = (blockId: string, level = 0): void => {
      if (visited.has(blockId)) return;
      visited.add(blockId);
      const currentLevel = levels.get(blockId) ?? 0;
      levels.set(blockId, Math.max(currentLevel, level));

      const children = graph.edges.filter(edge => edge.from === blockId).map(edge => edge.to);
      for (const childId of children) {
        calculateLevel(childId, level + 1);
      }
    };

    const rootBlocks = Array.from(graph.blocks.keys()).filter(
      blockId => !graph.edges.some(edge => edge.to === blockId)
    );
    const roots = rootBlocks.length > 0 ? rootBlocks : Array.from(graph.blocks.keys());

    for (const rootId of roots) {
      calculateLevel(rootId);
    }

    return levels;
  }

  layoutGraph(graph: BlockGraph): PositionedBlock[] {
    const levels = this.calculateLevels(graph);
    const blocksByLevel = new Map<number, string[]>();

    for (const [blockId, level] of levels.entries()) {
      const blocksAtLevel = blocksByLevel.get(level) ?? [];
      blocksAtLevel.push(blockId);
      blocksByLevel.set(level, blocksAtLevel);
    }

    const positions = new Map<string, BlockPosition>();
    for (const [level, blockIds] of blocksByLevel.entries()) {
      const y = level * (this.config.nodeHeight + this.config.verticalSpacing);
      blockIds.forEach((blockId, index) => {
        positions.set(blockId, {
          x: index * (this.config.nodeWidth + this.config.horizontalSpacing),
          y,
          width: this.config.nodeWidth,
          height: this.config.nodeHeight,
        });
      });
    }

    const positionedBlocks: PositionedBlock[] = [];
    for (const [blockId, block] of graph.blocks.entries()) {
      const position = positions.get(blockId);
      if (position) {
        positionedBlocks.push({ block, position });
      }
    }

    return positionedBlocks;
  }

  process(blocks: Block[]): { graph: BlockGraph; positioned: PositionedBlock[] } {
    const graph = this.buildGraph(blocks);
    const positioned = this.layoutGraph(graph);
    return { graph, positioned };
  }

  isSubBlock(block: Block): boolean {
    return block.parents.length > 0;
  }

  isRootNode(blockId: string, graph: BlockGraph): boolean {
    return !graph.edges.some(edge => edge.to === blockId);
  }

  getDirectPrerequisites(blockId: string, graph: BlockGraph): Block[] {
    const block = graph.blocks.get(blockId);
    if (!block) {
      return [];
    }
    return block.prerequisites.map(id => graph.blocks.get(id)).filter((b): b is Block => b !== undefined);
  }

  /**
   * Gets direct post-requisites using HorizontalRelationships for O(1) lookup.
   * Uses pre-computed relationships if available, otherwise builds them on-demand.
   */
  getDirectPostRequisites(blockId: string, graph: BlockGraph): Block[] {
    // Use pre-computed relationships if available (O(1)), otherwise build on-demand
    const relationships = graph.horizontalRelationships ?? HorizontalRelationships.fromGraph(graph);
    const postreqIds = relationships.getPostrequisites(blockId);
    const dependents: Block[] = [];

    for (const id of postreqIds) {
      const dependent = graph.blocks.get(id);
      if (dependent) {
        dependents.push(dependent);
      }
    }

    return dependents;
  }

  getSubBlocks(blockId: string, graph: BlockGraph): Block[] {
    const subBlocks: Block[] = [];
    for (const edge of graph.edges) {
      if (edge.from !== blockId || edge.type !== 'parent') continue;
      const subBlock = graph.blocks.get(edge.to);
      if (subBlock) subBlocks.push(subBlock);
    }
    return subBlocks;
  }

  private addBlockWithSubBlocks(blockId: string, graph: BlockGraph, targetSet: Set<string>, includeSubBlocks: boolean): void {
    targetSet.add(blockId);
    if (includeSubBlocks) {
      for (const subBlock of this.getSubBlocks(blockId, graph)) {
        targetSet.add(subBlock.id);
      }
    }
  }

  getRelatedBlocks(blockId: string, graph: BlockGraph, includeSubBlocks: boolean): Set<string> {
    const relatedIds = new Set<string>();
    relatedIds.add(blockId);

    const prerequisites = this.getDirectPrerequisites(blockId, graph);
    for (const prereq of prerequisites) {
      this.addBlockWithSubBlocks(prereq.id, graph, relatedIds, includeSubBlocks);
    }

    const postRequisites = this.getDirectPostRequisites(blockId, graph);
    for (const postReq of postRequisites) {
      this.addBlockWithSubBlocks(postReq.id, graph, relatedIds, includeSubBlocks);
    }

    if (includeSubBlocks) {
      const subBlocks = this.getSubBlocks(blockId, graph);
      for (const subBlock of subBlocks) {
        relatedIds.add(subBlock.id);
      }
    }

    return relatedIds;
  }

  /**
   * Check if a block is a root single node (root with no prerequisites/post-requisites)
   */
  private isRootSingleNode(blockId: string, graph: BlockGraph): boolean {
    const isRoot = this.isRootNode(blockId, graph);
    if (!isRoot) return false;

    const prerequisites = this.getDirectPrerequisites(blockId, graph);
    const postRequisites = this.getDirectPostRequisites(blockId, graph);
    return prerequisites.length === 0 && postRequisites.length === 0;
  }

  /**
   * Add block or its sub-blocks to visibility set based on root single node logic
   */
  private addBlockToVisibility(blockId: string, graph: BlockGraph, visible: Set<string>): void {
    if (this.isRootSingleNode(blockId, graph)) {
      const subBlocks = this.getSubBlocks(blockId, graph);
      if (subBlocks.length > 0) {
        for (const subBlock of subBlocks) {
          visible.add(subBlock.id);
        }
      } else {
        visible.add(blockId);
      }
    } else {
      visible.add(blockId);
    }
  }

  /**
   * Categorize blocks based on selection state
   * Returns which blocks should be visible vs dimmed
   */
  categorizeBlocks(
    blocks: Block[],
    graph: BlockGraph,
    selectedBlockId: string | null,
    selectionLevel: number
  ): { visible: Set<string>; dimmed: Set<string> } {
    const visible = new Set<string>();
    const dimmed = new Set<string>();

    // If nothing is selected, show all non-sub-blocks (with root single node logic)
    if (!selectedBlockId || selectionLevel === 0) {
      for (const block of blocks) {
        if (this.isSubBlock(block)) {
          continue;
        }
        this.addBlockToVisibility(block.id, graph, visible);
      }
      return { visible, dimmed };
    }

    // Determine which blocks to show based on selection level
    let includeSubBlocks = selectionLevel >= 2;
    const isRootSingleNode = this.isRootSingleNode(selectedBlockId, graph);

    // If it's a root single node, automatically show sub-blocks
    if (isRootSingleNode && selectionLevel === 1) {
      includeSubBlocks = true;
    }

    const relatedIds = this.getRelatedBlocks(selectedBlockId, graph, includeSubBlocks);

    // When showing sub-blocks, hide the parent block if it has any sub-blocks
    if (includeSubBlocks) {
      const subBlocks = this.getSubBlocks(selectedBlockId, graph);
      if (subBlocks.length > 0) {
        relatedIds.delete(selectedBlockId);
      }
    }

    // Categorize all blocks
    for (const block of blocks) {
      if (relatedIds.has(block.id)) {
        visible.add(block.id);
      } else if (!this.isSubBlock(block)) {
        dimmed.add(block.id);
      }
    }

    return { visible, dimmed };
  }
}
