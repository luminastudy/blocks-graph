import type { Block } from '../types/block.js';
import type { GraphEngine } from '../core/graph-engine.js';
import type { GraphRenderer } from '../core/renderer.js';

/**
 * Create and return a style element for the blocks graph
 */
export function createStyles(): HTMLStyleElement {
  const style = document.createElement('style');
  style.textContent = `
    :host {
      display: block;
      width: 100%;
      height: 100%;
      min-height: 400px;
    }

    svg {
      width: 100%;
      height: 100%;
    }

    .block {
      cursor: pointer;
      transition: opacity 0.2s;
    }

    .block:hover rect {
      filter: brightness(0.95);
    }

    .edge {
      pointer-events: none;
    }

    .error {
      color: #d32f2f;
      padding: 1rem;
      font-family: system-ui, -apple-system, sans-serif;
    }
  `;
  return style;
}

/**
 * Create and return an empty state message element
 */
export function createEmptyStateMessage(): HTMLDivElement {
  const message = document.createElement('div');
  message.textContent = 'No blocks to display. Use setBlocks(), loadFromJson(), or loadFromUrl() to add data.';
  message.style.padding = '1rem';
  message.style.fontFamily = 'system-ui, -apple-system, sans-serif';
  return message;
}

/**
 * Create and return an error message element
 */
export function createErrorMessage(errorMessage: string): HTMLDivElement {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error';
  errorDiv.textContent = `Error: ${errorMessage}`;
  return errorDiv;
}

/**
 * Attach click event listeners to block elements
 */
export function attachBlockClickListeners(
  svg: SVGElement,
  blockCount: number,
  handleBlockClick: (blockId: string) => void,
  dispatchEvent: (event: Event) => boolean
): void {
  const blockElements = svg.querySelectorAll('.block');
  blockElements.forEach((blockEl) => {
    const blockId = blockEl.getAttribute('data-id');
    if (blockId) {
      blockEl.addEventListener('click', () => {
        handleBlockClick(blockId);
      });
    }
  });

  // Dispatch custom event when render is complete
  dispatchEvent(new CustomEvent('blocks-rendered', {
    detail: { blockCount },
  }));
}

/**
 * Render the block graph with selection state
 */
export function renderGraph(
  blocks: Block[],
  engine: GraphEngine,
  renderer: GraphRenderer,
  selectedBlockId: string | null,
  selectionLevel: number
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

  // Update renderer config with selection state
  renderer.updateConfig({
    selectedBlockId,
    visibleBlocks: visible,
    dimmedBlocks: dimmed,
  });

  // Render the graph
  const svg = renderer.render(graph, positioned);

  return { svg, blockCount: blocksToRender.length };
}
