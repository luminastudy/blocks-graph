import type { Block } from '../types/block.js'
import { GraphEngine } from '../core/graph-engine.js'
import { GraphRenderer } from '../core/renderer.js'
import { schemaV01Adaptor } from '../adaptors/v0.1/instance.js'
import { createStyles } from './create-styles.js'
import { createEmptyStateMessage } from './create-empty-state-message.js'
import { createErrorMessage } from './create-error-message.js'
import { attachBlockClickListeners } from './attach-block-click-listeners.js'
import { renderGraph } from './render-graph.js'
import { UnsupportedSchemaVersionError } from '../errors/unsupported-schema-version-error.js'
import { BlocksFetchError } from '../errors/blocks-fetch-error.js'
import { parseLayoutConfigFromAttributes } from './parse-layout-config-from-attributes.js'
import { isValidEdgeLineStyle } from '../types/is-valid-edge-line-style.js'
import { isValidOrientation } from './is-valid-orientation.js'
import type { EdgeLineStyle } from '../types/edge-style.js'

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
  private selectedBlockId: string | null
  private selectionLevel: number // 0=root view, 1=children view

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.engine = new GraphEngine()
    this.renderer = new GraphRenderer()
    this.blocks = []
    this.selectedBlockId = null
    this.selectionLevel = 0
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
      'parent-line-style',
    ]
  }

  /**
   * Called when the element is connected to the DOM
   */
  connectedCallback(): void {
    this.render()
  }

  /**
   * Called when an observed attribute changes
   */
  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ): void {
    if (oldValue === newValue) {
      return
    }

    switch (name) {
      case 'language':
        if (newValue === 'en' || newValue === 'he') {
          this.renderer.updateConfig({ language: newValue })
        }
        break
      case 'show-prerequisites':
        this.renderer.updateConfig({ showPrerequisites: newValue === 'true' })
        break
      case 'prerequisite-line-style':
        if (newValue && isValidEdgeLineStyle(newValue)) {
          this.renderer.updateConfig({
            edgeStyle: {
              ...this.renderer['config'].edgeStyle,
              prerequisite: {
                ...this.renderer['config'].edgeStyle.prerequisite,
                lineStyle: newValue,
              },
            },
          })
        }
        break
      case 'parent-line-style':
        if (newValue && isValidEdgeLineStyle(newValue)) {
          this.renderer.updateConfig({
            edgeStyle: {
              ...this.renderer['config'].edgeStyle,
              parent: {
                ...this.renderer['config'].edgeStyle.parent,
                lineStyle: newValue,
              },
            },
          })
        }
        break
      case 'node-width':
      case 'node-height':
      case 'horizontal-spacing':
      case 'vertical-spacing':
      case 'orientation':
        this.updateLayoutConfig()
        break
    }

    this.render()
  }

  /**
   * Update layout configuration from attributes
   */
  private updateLayoutConfig(): void {
    const config = parseLayoutConfigFromAttributes(this)
    this.engine = new GraphEngine(config)
  }

  /**
   * Set blocks data directly
   */
  setBlocks(blocks: Block[]): void {
    this.blocks = blocks
    this.render()
  }

  /**
   * Load blocks from JSON string
   */
  loadFromJson(json: string, schemaVersion: 'v0.1' = 'v0.1'): void {
    if (schemaVersion === 'v0.1') {
      this.blocks = schemaV01Adaptor.adaptFromJson(json)
      this.render()
    } else {
      throw new UnsupportedSchemaVersionError(schemaVersion)
    }
  }

  /**
   * Load blocks from a URL
   */
  async loadFromUrl(
    url: string,
    schemaVersion: 'v0.1' = 'v0.1'
  ): Promise<void> {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new BlocksFetchError(url, response.statusText)
      }
      const json = await response.text()
      this.loadFromJson(json, schemaVersion)
    } catch (error) {
      console.error('Error loading blocks from URL:', error)
      this.shadowRoot!.innerHTML = ''
      this.shadowRoot!.appendChild(createStyles())
      this.shadowRoot!.appendChild(
        createErrorMessage(
          error instanceof Error ? error.message : 'Unknown error'
        )
      )
    }
  }

  /**
   * Handle block click events
   * - Click block with children: Show selected block and its children
   * - Click same block again: Return to root view
   * - Click block without children: Only send event, don't change visualization
   */
  private handleBlockClick(blockId: string): void {
    const clickedBlock = this.blocks.find(b => b.id === blockId)
    if (!clickedBlock) return

    const graph = this.engine.buildGraph(this.blocks)
    const children = this.engine.getSubBlocks(blockId, graph)

    // If block has no children, only dispatch event without changing visualization
    if (children.length === 0) {
      this.dispatchEvent(
        new CustomEvent('block-selected', {
          detail: { blockId, selectionLevel: this.selectionLevel },
        })
      )
      return
    }

    // Block has children - toggle navigation state
    if (this.selectedBlockId === blockId) {
      this.selectedBlockId = null
      this.selectionLevel = 0
    } else {
      this.selectedBlockId = blockId
      this.selectionLevel = 1
    }

    this.dispatchEvent(
      new CustomEvent('block-selected', {
        detail: {
          blockId: this.selectedBlockId,
          selectionLevel: this.selectionLevel,
        },
      })
    )

    this.render()
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
      const orientation = isValidOrientation(orientationAttr) ? orientationAttr : undefined
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

  /**
   * Get current language
   */
  get language(): string {
    const langAttr = this.getAttribute('language')
    return langAttr !== null ? langAttr : 'en'
  }

  /**
   * Set language
   */
  set language(value: string) {
    this.setAttribute('language', value)
  }

  /**
   * Get show-prerequisites setting
   */
  get showPrerequisites(): boolean {
    return this.getAttribute('show-prerequisites') !== 'false'
  }

  /**
   * Set show-prerequisites
   */
  set showPrerequisites(value: boolean) {
    this.setAttribute('show-prerequisites', String(value))
  }

  /** Get/set graph orientation (ttb, ltr, rtl, btt) */
  get orientation(): string {
    const orientAttr = this.getAttribute('orientation')
    return orientAttr !== null ? orientAttr : 'ttb'
  }
  set orientation(value: string) {
    this.setAttribute('orientation', value)
  }

  /** Get/set prerequisite edge line style */
  get prerequisiteLineStyle(): EdgeLineStyle {
    const value = this.getAttribute('prerequisite-line-style')
    return value && isValidEdgeLineStyle(value) ? value : 'dashed'
  }
  set prerequisiteLineStyle(value: EdgeLineStyle) {
    this.setAttribute('prerequisite-line-style', value)
  }

  /** Get/set parent edge line style */
  get parentLineStyle(): EdgeLineStyle {
    const value = this.getAttribute('parent-line-style')
    return value && isValidEdgeLineStyle(value) ? value : 'straight'
  }
  set parentLineStyle(value: EdgeLineStyle) {
    this.setAttribute('parent-line-style', value)
  }
}

// Register the custom element
if (!customElements.get('blocks-graph')) {
  customElements.define('blocks-graph', BlocksGraph)
}
