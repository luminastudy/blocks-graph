import type { Block } from '../types/block.js'
import type { BlockGraph } from '../types/block-graph.js'
import type { CategorizedBlocks } from '../types/categorized-blocks.js'
import { isDescendantOf } from './is-descendant-of.js'

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
export function categorizeBlocks(
  blocks: Block[],
  graph: BlockGraph,
  selectedBlockId: string | null,
  selectionLevel: number,
  getSubBlocks: (blockId: string, graph: BlockGraph) => Block[]
): CategorizedBlocks {
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
        const children = getSubBlocks(singleRoot.id, graph)

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
  const children = getSubBlocks(selectedBlockId, graph)
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
    isDescendantOf(selectedBlockId, rootBlocks[0].id, graph)

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
