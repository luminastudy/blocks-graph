import type { Block } from '../types/block.js'
import { isBlock } from '../types/is-block.js'
import { GraphEngine } from '../core/graph-engine.js'
import { GraphRenderer } from '../core/renderer.js'
import { schemaV01Adaptor } from '../adaptors/v0.1/instance.js'
import type { BlockSchemaV01 } from '../adaptors/v0.1/types.js'
import { isBlockSchemaV01 } from '../adaptors/v0.1/validators.js'
import { InvalidBlockSchemaError } from '../errors/invalid-block-schema-error.js'
import { UnsupportedSchemaVersionError } from '../errors/unsupported-schema-version-error.js'
import { DuplicateBlockIdError } from '../errors/duplicate-block-id-error.js'
import { isValidEdgeLineStyle } from '../types/is-valid-edge-line-style.js'
import type { EdgeLineStyle } from '../types/edge-style.js'
import { createStyles } from './create-styles.js'
import { createEmptyStateMessage } from './create-empty-state-message.js'
import { createErrorMessage } from './create-error-message.js'
import { attachBlockClickListeners } from './attach-block-click-listeners.js'
import { renderGraph } from './render-graph.js'
import { parseLayoutConfigFromAttributes } from './parse-layout-config-from-attributes.js'
import { isValidOrientation } from './is-valid-orientation.js'

/**
 * Find duplicate IDs in an array of blocks
 * @returns Array of duplicate IDs, empty if no duplicates
 */
function findDuplicateIds(blocks: Array<{ id: string }>): string[] {
  const seen = new Set<string>()
  const duplicates = new Set<string>()

  for (const block of blocks) {
    if (seen.has(block.id)) {
      duplicates.add(block.id)
    }
    seen.add(block.id)
  }

  return Array.from(duplicates)
}

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
   * Set blocks data - accepts both internal Block[] format and external schemas
   * Automatically detects schema version and converts to internal format
   *
   * @param blocks - Array of blocks in internal format or v0.1 schema format
   * @throws {InvalidBlockSchemaError} If blocks array contains invalid or mixed formats
   * @throws {DuplicateBlockIdError} If blocks array contains duplicate IDs
   *
   * @example
   * ```typescript
   * // Internal format
   * graph.setBlocks([{
   *   id: 'uuid',
   *   title: { he: 'כותרת', en: 'Title' },
   *   prerequisites: [],
   *   parents: []
   * }])
   *
   * // v0.1 schema format (auto-detected)
   * graph.setBlocks([{
   *   id: 'uuid',
   *   title: { he_text: 'כותרת', en_text: 'Title' },
   *   prerequisites: [],
   *   parents: []
   * }])
   * ```
   */
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

    // Auto-detect format based on first block
    const firstBlock = blocks[0]

    if (isBlockSchemaV01(firstBlock)) {
      // v0.1 schema format - convert to internal format
      // Validate all blocks are v0.1 format
      const allValid = blocks.every(isBlockSchemaV01)
      if (!allValid) {
        throw new InvalidBlockSchemaError(
          'Mixed block formats detected. All blocks must be in the same format.'
        )
      }
      this.blocks = schemaV01Adaptor.adaptMany(blocks.filter(isBlockSchemaV01))
    } else if (isBlock(firstBlock)) {
      // Internal format - use directly
      // Validate all blocks are internal format
      const allValid = blocks.every(isBlock)
      if (!allValid) {
        throw new InvalidBlockSchemaError(
          'Mixed block formats detected. All blocks must be in the same format.'
        )
      }
      this.blocks = blocks.filter(isBlock)
    } else {
      // Unknown format
      throw new InvalidBlockSchemaError(
        'Unable to detect block schema format. Blocks must be in internal format or v0.1 schema format.'
      )
    }

    this.render()
  }

  /**
   * Load blocks from JSON string
   */
  loadFromJson(json: string, schemaVersion?: 'v0.1'): void {
    const version = schemaVersion !== undefined ? schemaVersion : 'v0.1'
    if (version === 'v0.1') {
      this.blocks = schemaV01Adaptor.adaptFromJson(json)
      this.render()
    } else {
      throw new UnsupportedSchemaVersionError(version)
    }
  }

  /**
   * Handle block click events - Hierarchical Navigation
   * - Click leaf block (no children): Fire event only, don't modify navigation
   * - Click block on top of stack: Pop from stack (go up one level)
   * - Click block with children: Push to stack (drill down)
   */
  private handleBlockClick(blockId: string): void {
    const clickedBlock = this.blocks.find(b => b.id === blockId)
    if (!clickedBlock) return

    const graph = this.engine.buildGraph(this.blocks)
    const children = this.engine.getSubBlocks(blockId, graph)

    // If block has no children, only dispatch event without changing navigation
    if (children.length === 0) {
      this.dispatchEvent(
        new CustomEvent('block-selected', {
          detail: {
            blockId,
            selectionLevel: this.selectionLevel,
            navigationStack: [...this.navigationStack],
          },
        })
      )
      return
    }

    // Block has children - check if it's on top of stack
    const isTopOfStack = this.selectedBlockId === blockId

    if (isTopOfStack) {
      // Pop from stack (go up one level)
      this.navigationStack.pop()
    } else {
      // Push to stack (drill down)
      this.navigationStack.push(blockId)
    }

    this.dispatchEvent(
      new CustomEvent('block-selected', {
        detail: {
          blockId: this.selectedBlockId,
          selectionLevel: this.selectionLevel,
          navigationStack: [...this.navigationStack],
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
