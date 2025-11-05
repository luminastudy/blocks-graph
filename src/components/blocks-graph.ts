import type { Block } from '../types/block.js';
import { GraphEngine } from '../core/graph-engine.js';
import type { GraphLayoutConfig } from '../core/graph-layout-config.js';
import { GraphRenderer } from '../core/renderer.js';
import { schemaV01Adaptor } from '../adaptors/v0.1/instance.js';
import { createStyles } from './create-styles.js';
import { createEmptyStateMessage } from './create-empty-state-message.js';
import { createErrorMessage } from './create-error-message.js';
import { attachBlockClickListeners } from './attach-block-click-listeners.js';
import { renderGraph } from './render-graph.js';
import { UnsupportedSchemaVersionError, BlocksFetchError } from '../errors.js';

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
      throw new UnsupportedSchemaVersionError(schemaVersion);
    }
  }

  /**
   * Load blocks from a URL
   */
  async loadFromUrl(url: string, schemaVersion: 'v0.1' = 'v0.1'): Promise<void> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new BlocksFetchError(url, response.statusText);
      }
      const json = await response.text();
      this.loadFromJson(json, schemaVersion);
    }
    catch (error) {
      console.error('Error loading blocks from URL:', error);
      this.shadowRoot!.innerHTML = '';
      this.shadowRoot!.appendChild(createStyles());
      this.shadowRoot!.appendChild(
        createErrorMessage(error instanceof Error ? error.message : 'Unknown error')
      );
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
    this.shadowRoot!.appendChild(createStyles());

    if (this.blocks.length === 0) {
      this.shadowRoot!.appendChild(createEmptyStateMessage());
      return;
    }

    try {
      const { svg, blockCount } = renderGraph(
        this.blocks,
        this.engine,
        this.renderer,
        this.selectedBlockId,
        this.selectionLevel
      );
      this.shadowRoot!.appendChild(svg);
      attachBlockClickListeners(
        svg,
        blockCount,
        (blockId) => this.handleBlockClick(blockId),
        (event) => this.dispatchEvent(event)
      );
    }
    catch (error) {
      console.error('Error rendering graph:', error);
      this.shadowRoot!.appendChild(
        createErrorMessage(error instanceof Error ? error.message : 'Unknown error')
      );
    }
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
