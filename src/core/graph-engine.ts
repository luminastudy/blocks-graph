import type { Block, BlockGraph, BlockPosition, GraphEdge, PositionedBlock } from '../types/block.js';

/**
 * Configuration for graph layout
 */
export interface GraphLayoutConfig {
  nodeWidth: number;
  nodeHeight: number;
  horizontalSpacing: number;
  verticalSpacing: number;
}

/**
 * Default layout configuration
 */
const DEFAULT_LAYOUT_CONFIG: GraphLayoutConfig = {
  nodeWidth: 200,
  nodeHeight: 80,
  horizontalSpacing: 80,
  verticalSpacing: 100,
};

/**
 * Graph engine responsible for building and laying out the block graph
 */
export class GraphEngine {
  private config: GraphLayoutConfig;

  constructor(config: Partial<GraphLayoutConfig> = {}) {
    this.config = { ...DEFAULT_LAYOUT_CONFIG, ...config };
  }

  /**
   * Build a graph structure from blocks
   */
  buildGraph(blocks: Block[]): BlockGraph {
    const blockMap = new Map<string, Block>();
    const edges: GraphEdge[] = [];

    // Add all blocks to the map
    for (const block of blocks) {
      blockMap.set(block.id, block);
    }

    // Build edges from relationships
    for (const block of blocks) {
      // Add prerequisite edges
      for (const prereqId of block.prerequisites) {
        edges.push({
          from: prereqId,
          to: block.id,
          type: 'prerequisite',
        });
      }

      // Add parent edges
      for (const parentId of block.parents) {
        edges.push({
          from: parentId,
          to: block.id,
          type: 'parent',
        });
      }
    }

    return { blocks: blockMap, edges };
  }

  /**
   * Calculate positions for all blocks using a simple hierarchical layout
   */
  layoutGraph(graph: BlockGraph): PositionedBlock[] {
    const positions = new Map<string, BlockPosition>();
    const visited = new Set<string>();
    const levels = new Map<string, number>();

    // Calculate levels (depth in the graph)
    const calculateLevel = (blockId: string, level = 0): void => {
      if (visited.has(blockId)) {
        return;
      }

      visited.add(blockId);
      const currentLevel = levels.get(blockId) ?? 0;
      levels.set(blockId, Math.max(currentLevel, level));

      // Find children (blocks that have this block as prerequisite or parent)
      const children = graph.edges
        .filter(edge => edge.from === blockId)
        .map(edge => edge.to);

      for (const childId of children) {
        calculateLevel(childId, level + 1);
      }
    };

    // Find root blocks (blocks with no incoming edges)
    const rootBlocks = Array.from(graph.blocks.keys()).filter((blockId) => {
      return !graph.edges.some(edge => edge.to === blockId);
    });

    // If no root blocks, use all blocks as roots
    const roots = rootBlocks.length > 0 ? rootBlocks : Array.from(graph.blocks.keys());

    // Calculate levels starting from roots
    for (const rootId of roots) {
      calculateLevel(rootId);
    }

    // Group blocks by level
    const blocksByLevel = new Map<number, string[]>();
    for (const [blockId, level] of levels.entries()) {
      const blocksAtLevel = blocksByLevel.get(level) ?? [];
      blocksAtLevel.push(blockId);
      blocksByLevel.set(level, blocksAtLevel);
    }

    // Position blocks
    for (const [level, blockIds] of blocksByLevel.entries()) {
      const y = level * (this.config.nodeHeight + this.config.verticalSpacing);

      blockIds.forEach((blockId, index) => {
        const x = index * (this.config.nodeWidth + this.config.horizontalSpacing);

        positions.set(blockId, {
          x,
          y,
          width: this.config.nodeWidth,
          height: this.config.nodeHeight,
        });
      });
    }

    // Build positioned blocks
    const positionedBlocks: PositionedBlock[] = [];
    for (const [blockId, block] of graph.blocks.entries()) {
      const position = positions.get(blockId);
      if (position) {
        positionedBlocks.push({ block, position });
      }
    }

    return positionedBlocks;
  }

  /**
   * Process blocks end-to-end: build graph and calculate layout
   */
  process(blocks: Block[]): { graph: BlockGraph; positioned: PositionedBlock[] } {
    const graph = this.buildGraph(blocks);
    const positioned = this.layoutGraph(graph);
    return { graph, positioned };
  }
}
