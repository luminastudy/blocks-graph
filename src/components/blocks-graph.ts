import type { Block } from '../types/block.js';
import { GraphEngine } from '../core/graph-engine.js';
import type { GraphLayoutConfig } from '../core/graph-engine.js';
import { GraphRenderer } from '../core/renderer.js';
import { schemaV01Adaptor } from '../adaptors/v0.1/adaptor.js';

/**
 * Custom element for rendering block graphs
 *
 * @example
 * ```html
 * <blocks-graph
 *   language="en"
 *   show-prerequisites="true"
 *   show-parents="true">
 * </blocks-graph>
 * ```
 */
export class BlocksGraph extends HTMLElement {
  private engine: GraphEngine;
  private renderer: GraphRenderer;
  private blocks: Block[] = [];
  private selectedBlockId: string | null = null;
  private selectionLevel: number = 0; // 0=default, 1=graph shown, 2=graph+sub-blocks shown

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.engine = new GraphEngine();
    this.renderer = new GraphRenderer();
  }

  /**
   * Observed attributes for the custom element
   */
  static get observedAttributes(): string[] {
    return [
      'language',
      'show-prerequisites',
      'show-parents',
      'node-width',
      'node-height',
      'horizontal-spacing',
      'vertical-spacing',
    ];
  }

  /**
   * Called when the element is connected to the DOM
   */
  connectedCallback(): void {
    this.render();
  }

  /**
   * Called when an observed attribute changes
   */
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) {
      return;
    }

    switch (name) {
      case 'language':
        if (newValue === 'en' || newValue === 'he') {
          this.renderer.updateConfig({ language: newValue });
        }
        break;
      case 'show-prerequisites':
        this.renderer.updateConfig({ showPrerequisites: newValue === 'true' });
        break;
      case 'show-parents':
        this.renderer.updateConfig({ showParents: newValue === 'true' });
        break;
      case 'node-width':
      case 'node-height':
      case 'horizontal-spacing':
      case 'vertical-spacing':
        this.updateLayoutConfig();
        break;
    }

    this.render();
  }

  /**
   * Update layout configuration from attributes
   */
  private updateLayoutConfig(): void {
    const config: Partial<GraphLayoutConfig> = {};

    const nodeWidth = this.getAttribute('node-width');
    if (nodeWidth) {
      config.nodeWidth = Number.parseInt(nodeWidth, 10);
    }

    const nodeHeight = this.getAttribute('node-height');
    if (nodeHeight) {
      config.nodeHeight = Number.parseInt(nodeHeight, 10);
    }

    const horizontalSpacing = this.getAttribute('horizontal-spacing');
    if (horizontalSpacing) {
      config.horizontalSpacing = Number.parseInt(horizontalSpacing, 10);
    }

    const verticalSpacing = this.getAttribute('vertical-spacing');
    if (verticalSpacing) {
      config.verticalSpacing = Number.parseInt(verticalSpacing, 10);
    }

    this.engine = new GraphEngine(config);
  }

  /**
   * Set blocks data directly
   */
  setBlocks(blocks: Block[]): void {
    this.blocks = blocks;
    this.render();
  }

  /**
   * Load blocks from JSON string
   */
  loadFromJson(json: string, schemaVersion: 'v0.1' = 'v0.1'): void {
    if (schemaVersion === 'v0.1') {
      this.blocks = schemaV01Adaptor.adaptFromJson(json);
      this.render();
    }
    else {
      throw new Error(`Unsupported schema version: ${schemaVersion}`);
    }
  }

  /**
   * Load blocks from a URL
   */
  async loadFromUrl(url: string, schemaVersion: 'v0.1' = 'v0.1'): Promise<void> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch blocks: ${response.statusText}`);
      }
      const json = await response.text();
      this.loadFromJson(json, schemaVersion);
    }
    catch (error) {
      console.error('Error loading blocks from URL:', error);
      this.showError(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  /**
   * Handle block click events
   * Implements 3-state toggle: default -> graph -> graph+sub-blocks -> default
   */
  private handleBlockClick(blockId: string): void {
    if (this.selectedBlockId === blockId) {
      // Same block clicked - advance selection level
      this.selectionLevel++;
      if (this.selectionLevel > 2) {
        // Reset to default
        this.selectedBlockId = null;
        this.selectionLevel = 0;
      }
    } else {
      // Different block clicked - select it at level 1
      this.selectedBlockId = blockId;
      this.selectionLevel = 1;
    }

    // Dispatch custom event for block selection
    this.dispatchEvent(new CustomEvent('block-selected', {
      detail: {
        blockId: this.selectedBlockId,
        selectionLevel: this.selectionLevel
      },
    }));

    // Re-render with new selection
    this.render();
  }

  /**
   * Render the graph
   */
  private render(): void {
    // Clear previous content
    this.shadowRoot!.innerHTML = '';

    // Add styles
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
    this.shadowRoot!.appendChild(style);

    if (this.blocks.length === 0) {
      const message = document.createElement('div');
      message.textContent = 'No blocks to display. Use setBlocks(), loadFromJson(), or loadFromUrl() to add data.';
      message.style.padding = '1rem';
      message.style.fontFamily = 'system-ui, -apple-system, sans-serif';
      this.shadowRoot!.appendChild(message);
      return;
    }

    try {
      // Build the full graph first
      const fullGraph = this.engine.buildGraph(this.blocks);

      // Categorize blocks based on selection state
      const { visible, dimmed } = this.engine.categorizeBlocks(
        this.blocks,
        fullGraph,
        this.selectedBlockId,
        this.selectionLevel
      );

      // Filter blocks to only those that should be rendered (visible or dimmed)
      const blocksToRender = this.blocks.filter(block =>
        visible.has(block.id) || dimmed.has(block.id)
      );

      // Process the filtered blocks
      const { graph, positioned } = this.engine.process(blocksToRender);

      // Update renderer config with selection state
      this.renderer.updateConfig({
        selectedBlockId: this.selectedBlockId,
        visibleBlocks: visible,
        dimmedBlocks: dimmed,
      });

      // Render the graph
      const svg = this.renderer.render(graph, positioned);
      this.shadowRoot!.appendChild(svg);

      // Attach click event listeners to block elements
      const blockElements = svg.querySelectorAll('.block');
      blockElements.forEach((blockEl) => {
        const blockId = blockEl.getAttribute('data-id');
        if (blockId) {
          blockEl.addEventListener('click', () => {
            this.handleBlockClick(blockId);
          });
        }
      });

      // Dispatch custom event when render is complete
      this.dispatchEvent(new CustomEvent('blocks-rendered', {
        detail: { blockCount: blocksToRender.length },
      }));
    }
    catch (error) {
      console.error('Error rendering graph:', error);
      this.showError(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  /**
   * Show an error message
   */
  private showError(message: string): void {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = `Error: ${message}`;
    this.shadowRoot!.appendChild(errorDiv);
  }

  /**
   * Get current language
   */
  get language(): string {
    return this.getAttribute('language') ?? 'en';
  }

  /**
   * Set language
   */
  set language(value: string) {
    this.setAttribute('language', value);
  }

  /**
   * Get show-prerequisites setting
   */
  get showPrerequisites(): boolean {
    return this.getAttribute('show-prerequisites') !== 'false';
  }

  /**
   * Set show-prerequisites
   */
  set showPrerequisites(value: boolean) {
    this.setAttribute('show-prerequisites', String(value));
  }

  /**
   * Get show-parents setting
   */
  get showParents(): boolean {
    return this.getAttribute('show-parents') !== 'false';
  }

  /**
   * Set show-parents
   */
  set showParents(value: boolean) {
    this.setAttribute('show-parents', String(value));
  }
}

// Register the custom element
if (!customElements.get('blocks-graph')) {
  customElements.define('blocks-graph', BlocksGraph);
}
