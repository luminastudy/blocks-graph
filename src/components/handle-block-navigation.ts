import type { Block } from '../types/block.js'
import type { BlockGraph } from '../types/block-graph.js'
import type { NavigationResult } from '../types/navigation-result.js'

/**
 * Handle block click events for hierarchical navigation
 * - Click leaf block (no children): Return stack unchanged, don't render
 * - Click block on top of stack: Pop from stack (go up one level)
 * - Click block with children: Push to stack (drill down)
 */
export function handleBlockNavigation(
  blockId: string,
  blocks: Block[],
  navigationStack: string[],
  getSubBlocks: (blockId: string, graph: BlockGraph) => Block[],
  buildGraph: (blocks: Block[]) => BlockGraph
): NavigationResult {
  const clickedBlock = blocks.find(b => b.id === blockId)
  if (!clickedBlock) {
    return { shouldRender: false, updatedStack: navigationStack }
  }

  const graph = buildGraph(blocks)
  const children = getSubBlocks(blockId, graph)

  // If block has no children, don't modify navigation
  if (children.length === 0) {
    return { shouldRender: false, updatedStack: navigationStack }
  }

  // Block has children - check if it's on top of stack
  const updatedStack = [...navigationStack]
  const selectedBlockId =
    updatedStack.length > 0 ? updatedStack[updatedStack.length - 1] : null

  if (selectedBlockId === blockId) {
    updatedStack.pop()
  } else {
    updatedStack.push(blockId)
  }

  return { shouldRender: true, updatedStack }
}
