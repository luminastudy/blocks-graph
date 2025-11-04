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

  /**
   * Check if a block is a sub-block (has parents)
   */
  isSubBlock(block: Block): boolean {
    return block.parents.length > 0;
  }

  /**
   * Check if a block is a root node (has no incoming edges)
   */
  isRootNode(blockId: string, graph: BlockGraph): boolean {
    // Check if any edge points TO this block
    const hasIncomingEdges = graph.edges.some(edge => edge.to === blockId);
    return !hasIncomingEdges;
  }

  /**
   * Get direct prerequisites of a block
   */
  getDirectPrerequisites(blockId: string, graph: BlockGraph): Block[] {
    const block = graph.blocks.get(blockId);
    if (!block) {
      return [];
    }

    return block.prerequisites
      .map(prereqId => graph.blocks.get(prereqId))
      .filter((b): b is Block => b !== undefined);
  }

  /**
   * Get direct post-requisites (dependents) of a block
   */
  getDirectPostRequisites(blockId: string, graph: BlockGraph): Block[] {
    const dependents: Block[] = [];

    for (const edge of graph.edges) {
      if (edge.from !== blockId || edge.type !== 'prerequisite') {
        continue;
      }
      const dependent = graph.blocks.get(edge.to);
      if (dependent) {
        dependents.push(dependent);
      }
    }

    return dependents;
  }

  /**
   * Get sub-blocks (children) of a block
   */
  getSubBlocks(blockId: string, graph: BlockGraph): Block[] {
    const subBlocks: Block[] = [];

    for (const edge of graph.edges) {
      if (edge.from !== blockId || edge.type !== 'parent') {
        continue;
      }
      const subBlock = graph.blocks.get(edge.to);
      if (subBlock) {
        subBlocks.push(subBlock);
      }
    }

    return subBlocks;
  }

  /**
   * Get all related blocks for a selected block
   * Includes direct prerequisites, post-requisites, and optionally their sub-blocks
   */
  getRelatedBlocks(blockId: string, graph: BlockGraph, includeSubBlocks: boolean): Set<string> {
    const relatedIds = new Set<string>();

    // Add the selected block itself
    relatedIds.add(blockId);

    // Get direct prerequisites
    const prerequisites = this.getDirectPrerequisites(blockId, graph);
    for (const prereq of prerequisites) {
      relatedIds.add(prereq.id);

      // Add sub-blocks of prerequisites if requested
      if (includeSubBlocks) {
        const subBlocks = this.getSubBlocks(prereq.id, graph);
        for (const subBlock of subBlocks) {
          relatedIds.add(subBlock.id);
        }
      }
    }

    // Get direct post-requisites
    const postRequisites = this.getDirectPostRequisites(blockId, graph);
    for (const postReq of postRequisites) {
      relatedIds.add(postReq.id);

      // Add sub-blocks of post-requisites if requested
      if (includeSubBlocks) {
        const subBlocks = this.getSubBlocks(postReq.id, graph);
        for (const subBlock of subBlocks) {
          relatedIds.add(subBlock.id);
        }
      }
    }

    // If the selected block itself has sub-blocks and we're including them
    if (includeSubBlocks) {
      const subBlocks = this.getSubBlocks(blockId, graph);
      for (const subBlock of subBlocks) {
        relatedIds.add(subBlock.id);
      }
    }

    return relatedIds;
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

    // If nothing is selected, show all non-sub-blocks normally
    // EXCEPT: root single nodes (blocks that are roots AND have no prerequisites/post-requisites)
    // For those root single nodes, show their sub-blocks instead
    if (!selectedBlockId || selectionLevel === 0) {
      for (const block of blocks) {
        if (!this.isSubBlock(block)) {
          // Check if this block is a root node
          const isRoot = this.isRootNode(block.id, graph);

          if (isRoot) {
            // Check if this root block is a single node
            const prerequisites = this.getDirectPrerequisites(block.id, graph);
            const postRequisites = this.getDirectPostRequisites(block.id, graph);
            const isSingleNode = prerequisites.length === 0 && postRequisites.length === 0;

            if (isSingleNode) {
              // If it's a root single node, show its sub-blocks instead
              const subBlocks = this.getSubBlocks(block.id, graph);
              if (subBlocks.length > 0) {
                // Has sub-blocks - don't show the parent, show the children
                for (const subBlock of subBlocks) {
                  visible.add(subBlock.id);
                }
              } else {
                // No sub-blocks - show the single node itself
                visible.add(block.id);
              }
            } else {
              // Root but not a single node - show it normally
              visible.add(block.id);
            }
          } else {
            // Not a root node - show it normally
            visible.add(block.id);
          }
        }
      }
      return { visible, dimmed };
    }

    // Determine which blocks to show based on selection level
    let includeSubBlocks = selectionLevel >= 2;

    // Check if selected block is a root node AND a "single node" (no prerequisites or post-requisites)
    const isRoot = this.isRootNode(selectedBlockId, graph);
    const prerequisites = this.getDirectPrerequisites(selectedBlockId, graph);
    const postRequisites = this.getDirectPostRequisites(selectedBlockId, graph);
    const isSingleNode = prerequisites.length === 0 && postRequisites.length === 0;
    const isRootSingleNode = isRoot && isSingleNode;

    // If it's a root single node, automatically show sub-blocks instead of just the single block
    if (isRootSingleNode && selectionLevel === 1) {
      includeSubBlocks = true;
    }

    const relatedIds = this.getRelatedBlocks(selectedBlockId, graph, includeSubBlocks);

    // If it's a root single node with sub-blocks, don't show the parent block itself
    // Only show its sub-blocks
    if (isRootSingleNode && includeSubBlocks) {
      const subBlocks = this.getSubBlocks(selectedBlockId, graph);
      if (subBlocks.length > 0) {
        relatedIds.delete(selectedBlockId);
      }
    }

    // Categorize all blocks
    for (const block of blocks) {
      if (relatedIds.has(block.id)) {
        // This block is related to the selection
        visible.add(block.id);
      } else if (!this.isSubBlock(block)) {
        // This is an unrelated non-sub-block - dim it
        dimmed.add(block.id);
      }
      // Sub-blocks that aren't related are simply not shown
    }

    return { visible, dimmed };
  }
}
