/**
 * Render the block graph with selection state
 */

import type { Block } from '../types/block.js';
import type { GraphEngine } from '../core/graph-engine.js';
import type { GraphRenderer } from '../core/renderer.js';

export function renderGraph(
  blocks: Block[],
  engine: GraphEngine,
  renderer: GraphRenderer,
  selectedBlockId: string | null,
  selectionLevel: number,
  orientation?: string
): { svg: SVGElement; blockCount: number } {
  // Build the full graph first
  const fullGraph = engine.buildGraph(blocks);

  // Categorize blocks based on selection state
  const { visible, dimmed } = engine.categorizeBlocks(
    blocks,
    fullGraph,
    selectedBlockId,
    selectionLevel
  );

  // Filter blocks to only those that should be rendered (visible or dimmed)
  const blocksToRender = blocks.filter(block =>
    visible.has(block.id) || dimmed.has(block.id)
  );

  // Process the filtered blocks
  const { graph, positioned } = engine.process(blocksToRender);

  // Update renderer config with selection state and orientation
  renderer.updateConfig({
    selectedBlockId,
    visibleBlocks: visible,
    dimmedBlocks: dimmed,
    orientation: orientation as 'ttb' | 'ltr' | 'rtl' | 'btt' | undefined,
  });

  // Render the graph
  const svg = renderer.render(graph, positioned);

  return { svg, blockCount: blocksToRender.length };
}
