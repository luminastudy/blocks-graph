import type { Block } from '../types/block.js';
import type { BlockGraph } from '../types/block-graph.js';
import { isRootNode } from './is-root-node.js';

/**
 * Check if a block is a root single node (root with no prerequisites/post-requisites)
 */
export function isRootSingleNode(
  blockId: string,
  graph: BlockGraph,
  getDirectPrerequisites: (id: string, g: BlockGraph) => Block[],
  getDirectPostRequisites: (id: string, g: BlockGraph) => Block[]
): boolean {
  const isRoot = isRootNode(blockId, graph);
  if (!isRoot) return false;

  const prerequisites = getDirectPrerequisites(blockId, graph);
  const postRequisites = getDirectPostRequisites(blockId, graph);
  return prerequisites.length === 0 && postRequisites.length === 0;
}
