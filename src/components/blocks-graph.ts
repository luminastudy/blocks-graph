import type { Block } from '../types/block.js'
import { GraphEngine } from '../core/graph-engine.js'
import { GraphRenderer } from '../core/renderer.js'
import { schemaV01Adaptor } from '../adaptors/v0.1/instance.js'
import { schemaV02Adaptor } from '../adaptors/v0.2/instance.js'
import type { BlockSchemaV01 } from '../adaptors/v0.1/types.js'
import { UnsupportedSchemaVersionError } from '../errors/unsupported-schema-version-error.js'
import { DuplicateBlockIdError } from '../errors/duplicate-block-id-error.js'
import type { EdgeLineStyle } from '../types/edge-style.js'
import { isValidEdgeLineStyle } from '../types/is-valid-edge-line-style.js'
import { createStyles } from './create-styles.js'
import { createEmptyStateMessage } from './create-empty-state-message.js'
import { createErrorMessage } from './create-error-message.js'
import { attachBlockClickListeners } from './attach-block-click-listeners.js'
import { renderGraph } from './render-graph.js'
import { parseLayoutConfigFromAttributes } from './parse-layout-config-from-attributes.js'
import { isValidOrientation } from './is-valid-orientation.js'
import { findDuplicateIds } from './find-duplicate-ids.js'
import { createBlockSelectedEvent } from './create-block-selected-event.js'
import { parseMaxNodesPerLevel } from './parse-max-nodes-per-level.js'
import { detectAndConvertBlocks } from './detect-and-convert-blocks.js'
import { handleBlockNavigation } from './handle-block-navigation.js'
import { handleAttributeChange } from './handle-attribute-change.js'

/**
 * Custom element for rendering block graphs
 *
 * @example
 * ```html
 * <blocks-graph
 *   language="en"
 *   show-prerequisites="true">
 * </blocks-graph>
 * ```
 */
export class BlocksGraph extends HTMLElement {
  private engine: GraphEngine
  private renderer: GraphRenderer
  private blocks: Block[]
  private navigationStack: string[] // Hierarchical drill-down path

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.engine = new GraphEngine()
    this.renderer = new GraphRenderer()
    this.blocks = []
    this.navigationStack = []
  }

  /**
   * Get selected block ID (top of navigation stack) for backward compatibility
   */
  private get selectedBlockId(): string | null {
    return this.navigationStack.length > 0
      ? this.navigationStack[this.navigationStack.length - 1] || null
      : null
  }

  /**
   * Get selection level for backward compatibility
   * 0 = root view (empty stack), 1 = drilled down (non-empty stack)
   */
  private get selectionLevel(): number {
    return this.navigationStack.length > 0 ? 1 : 0
  }

  /**
   * Observed attributes for the custom element
   */
  static get observedAttributes(): string[] {
    return [
      'language',
      'show-prerequisites',
      'node-width',
      'node-height',
      'horizontal-spacing',
      'vertical-spacing',
      'orientation',
      'prerequisite-line-style',
      'max-nodes-per-level',
    ]
  }

  /**
   * Called when the element is connected to the DOM
   */
  connectedCallback(): void {
    this.render()
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ): void {
    if (oldValue === newValue) return
    const result = handleAttributeChange(name, newValue, this.renderer)
    if (result === 'layout-updated') this.updateLayoutConfig()
    this.render()
  }

  /**
   * Update layout configuration from attributes
   */
  private updateLayoutConfig(): void {
    const config = parseLayoutConfigFromAttributes(this)
    this.engine = new GraphEngine(config)
  }

  /** Set blocks data - accepts Block[] or v0.1 schema format (auto-detected) */
  setBlocks(blocks: Block[] | BlockSchemaV01[]): void {
    // Handle empty array
    if (blocks.length === 0) {
      this.blocks = []
      this.render()
      return
    }

    // Check for duplicate IDs
    const duplicateIds = findDuplicateIds(blocks)
    if (duplicateIds.length > 0) {
      throw new DuplicateBlockIdError(duplicateIds)
    }

    this.blocks = detectAndConvertBlocks(blocks)
    this.render()
  }

  /**
   * Load blocks from JSON string
   */
  loadFromJson(json: string, schemaVersion?: 'v0.1' | 'v0.2'): void {
    const version = schemaVersion !== undefined ? schemaVersion : 'v0.1'
    if (version === 'v0.1') {
      this.blocks = schemaV01Adaptor.adaptFromJson(json)
      this.render()
    } else if (version === 'v0.2') {
      this.blocks = schemaV02Adaptor.adaptFromJson(json)
      this.render()
    } else {
      throw new UnsupportedSchemaVersionError(version)
    }
  }

  private handleBlockClick(blockId: string): void {
    const result = handleBlockNavigation(
      blockId,
      this.blocks,
      this.navigationStack,
      this.engine.getSubBlocks.bind(this.engine),
      this.engine.buildGraph.bind(this.engine)
    )

    this.navigationStack = result.updatedStack

    // For leaf nodes (no render), dispatch with clicked blockId; otherwise use selectedBlockId
    const eventBlockId = result.shouldRender ? this.selectedBlockId : blockId
    this.dispatchEvent(
      createBlockSelectedEvent(
        eventBlockId,
        this.selectionLevel,
        this.navigationStack
      )
    )

    if (result.shouldRender) {
      this.render()
    }
  }

  /**
   * Render the graph
   */
  private render(): void {
    // Clear previous content
    this.shadowRoot!.innerHTML = ''

    // Add styles
    this.shadowRoot!.appendChild(createStyles())

    if (this.blocks.length === 0) {
      this.shadowRoot!.appendChild(createEmptyStateMessage())
      return
    }

    try {
      const orientationAttr = this.getAttribute('orientation')
      const orientation = isValidOrientation(orientationAttr)
        ? orientationAttr
        : undefined
      const { svg, blockCount } = renderGraph(
        this.blocks,
        this.engine,
        this.renderer,
        this.selectedBlockId,
        this.selectionLevel,
        orientation
      )
      this.shadowRoot!.appendChild(svg)
      attachBlockClickListeners(
        svg,
        blockCount,
        blockId => this.handleBlockClick(blockId),
        event => this.dispatchEvent(event)
      )
    } catch (error) {
      console.error('Error rendering graph:', error)
      this.shadowRoot!.appendChild(
        createErrorMessage(
          error instanceof Error ? error.message : 'Unknown error'
        )
      )
    }
  }

  get language(): string {
    const attr = this.getAttribute('language')
    return attr !== null ? attr : 'en'
  }
  set language(value: string) {
    this.setAttribute('language', value)
  }
  get showPrerequisites(): boolean {
    return this.getAttribute('show-prerequisites') !== 'false'
  }
  set showPrerequisites(value: boolean) {
    this.setAttribute('show-prerequisites', String(value))
  }
  get orientation(): string {
    const attr = this.getAttribute('orientation')
    return attr !== null ? attr : 'ttb'
  }
  set orientation(value: string) {
    this.setAttribute('orientation', value)
  }
  get prerequisiteLineStyle(): EdgeLineStyle {
    const v = this.getAttribute('prerequisite-line-style')
    return v && isValidEdgeLineStyle(v) ? v : 'dashed'
  }
  set prerequisiteLineStyle(value: EdgeLineStyle) {
    this.setAttribute('prerequisite-line-style', value)
  }
  get maxNodesPerLevel(): number | undefined {
    return parseMaxNodesPerLevel(this.getAttribute('max-nodes-per-level'))
  }
  set maxNodesPerLevel(value: number | undefined) {
    if (value === undefined) this.removeAttribute('max-nodes-per-level')
    else this.setAttribute('max-nodes-per-level', String(value))
  }
}

// Register the custom element
if (!customElements.get('blocks-graph')) {
  customElements.define('blocks-graph', BlocksGraph)
}
