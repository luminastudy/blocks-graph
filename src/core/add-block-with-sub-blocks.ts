import type { Block } from '../types/block.js';
import type { BlockGraph } from '../types/block-graph.js';

/**
 * Add a block and optionally its sub-blocks to a target set
 */
export function addBlockWithSubBlocks(
  blockId: string,
  graph: BlockGraph,
  targetSet: Set<string>,
  includeSubBlocks: boolean,
  getSubBlocks: (id: string, g: BlockGraph) => Block[]
): void {
  targetSet.add(blockId);
  if (includeSubBlocks) {
    for (const subBlock of getSubBlocks(blockId, graph)) {
      targetSet.add(subBlock.id);
    }
  }
}
