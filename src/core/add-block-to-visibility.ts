import type { Block } from '../types/block.js';
import type { BlockGraph } from '../types/block-graph.js';

/**
 * Add block or its sub-blocks to visibility set based on root single node logic
 */
export function addBlockToVisibility(
  blockId: string,
  graph: BlockGraph,
  visible: Set<string>,
  getSubBlocks: (id: string, g: BlockGraph) => Block[],
  checkIsRootSingleNode: (id: string, g: BlockGraph) => boolean
): void {
  if (checkIsRootSingleNode(blockId, graph)) {
    const subBlocks = getSubBlocks(blockId, graph);
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
