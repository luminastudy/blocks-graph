import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  OnInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core'
import type { Block } from '../../types/block.js'
import type { BlockSchemaV01 } from '../../adaptors/v0.1/types.js'
import type { BlocksGraph } from '../../components/blocks-graph.js'
import type { EdgeLineStyle } from '../../types/edge-style.js'
import type { BlocksRenderedEvent } from '../blocks-rendered-event.js'
import type { BlockSelectedEvent } from '../block-selected-event.js'
import { DEFAULT_CONFIG } from '../default-config.js'

// Import the web component to ensure it's registered
import '../../index.js'

/**
 * Angular wrapper component for the blocks-graph Web Component.
 * Provides a clean Angular API with @Input and @Output decorators.
 *
 * The `blocks` input accepts both internal Block[] format and v0.1 schema format.
 * Schema version is automatically detected - no need to specify it manually.
 *
 * @example
 * ```typescript
 * // In your module
 * import { BlocksGraphComponent } from '@lumina-study/blocks-graph/angular';
 * import type { Block } from '@lumina-study/blocks-graph';
 *
 * @NgModule({
 *   declarations: [AppComponent],
 *   imports: [BlocksGraphComponent],
 *   bootstrap: [AppComponent]
 * })
 * export class AppModule { }
 * ```
 *
 * @example
 * ```html
 * <!-- In your template -->
 * <blocks-graph-angular
 *   [blocks]="blocks"
 *   language="en"
 *   orientation="ttb"
 *   (blockSelected)="handleBlockSelected($event)"
 * ></blocks-graph-angular>
 * ```
 *
 * @example
 * ```typescript
 * // Blocks can be in internal format or v0.1 schema format (auto-detected)
 * const blocks: Block[] = [
 *   {
 *     id: 'uuid',
 *     title: { he: 'כותרת', en: 'Title' },
 *     prerequisites: [],
 *     parents: []
 *   }
 * ];
 * ```
 */
@Component({
  selector: 'blocks-graph-angular',
  standalone: true,
  template:
    '<blocks-graph #graphElement [class]="className" [style]="style"></blocks-graph>',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BlocksGraphComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('graphElement', { static: true })
  private graphElement?: ElementRef<BlocksGraph>

  // Data inputs
  /** Array of blocks in internal format or v0.1 schema format (auto-detected) */
  @Input() blocks?: Block[] | BlockSchemaV01[]
  @Input() jsonUrl?: string
  /**
   * @deprecated Schema version is now auto-detected. This input is ignored.
   */
  @Input() schemaVersion: 'v0.1' | 'internal' = 'v0.1'

  // Configuration inputs
  @Input() language: 'en' | 'he' = DEFAULT_CONFIG.language
  @Input() orientation: 'ttb' | 'ltr' | 'rtl' | 'btt' =
    DEFAULT_CONFIG.orientation
  @Input() showPrerequisites = DEFAULT_CONFIG.showPrerequisites
  @Input() nodeWidth?: number
  @Input() nodeHeight?: number
  @Input() horizontalSpacing?: number
  @Input() verticalSpacing?: number
  @Input() maxNodesPerLevel?: number

  // Edge style inputs
  @Input() prerequisiteLineStyle: EdgeLineStyle =
    DEFAULT_CONFIG.prerequisiteLineStyle

  // Standard inputs
  @Input() className?: string
  @Input() style?: Record<string, string>

  // Event outputs
  @Output() blocksRendered = new EventEmitter<BlocksRenderedEvent>()
  @Output() blockSelected = new EventEmitter<BlockSelectedEvent>()

  private blocksRenderedListener?: EventListener
  private blockSelectedListener?: EventListener

  ngOnInit(): void {
    this.setupEventListeners()
    this.loadInitialData()
  }

  ngOnChanges(changes: SimpleChanges): void {
    const element = this.getElement()
    if (!element) return

    // Handle data changes
    if (
      (changes['blocks'] && !changes['blocks'].firstChange) ||
      (changes['schemaVersion'] && !changes['schemaVersion'].firstChange)
    ) {
      if (this.blocks) {
        this.loadBlocks(element, this.blocks)
      }
    }

    // Handle configuration changes
    if (changes['language']) {
      element.language = this.language
    }

    if (changes['orientation']) {
      element.orientation = this.orientation
    }

    if (changes['showPrerequisites']) {
      element.showPrerequisites = this.showPrerequisites
    }

    // Handle layout changes
    if (changes['nodeWidth']) {
      if (this.nodeWidth !== undefined) {
        element.setAttribute('node-width', String(this.nodeWidth))
      }
    }

    if (changes['nodeHeight']) {
      if (this.nodeHeight !== undefined) {
        element.setAttribute('node-height', String(this.nodeHeight))
      }
    }

    if (changes['horizontalSpacing']) {
      if (this.horizontalSpacing !== undefined) {
        element.setAttribute(
          'horizontal-spacing',
          String(this.horizontalSpacing)
        )
      }
    }

    if (changes['verticalSpacing']) {
      if (this.verticalSpacing !== undefined) {
        element.setAttribute('vertical-spacing', String(this.verticalSpacing))
      }
    }

    if (changes['maxNodesPerLevel']) {
      if (this.maxNodesPerLevel !== undefined) {
        element.setAttribute(
          'max-nodes-per-level',
          String(this.maxNodesPerLevel)
        )
      }
    }

    // Handle edge style changes
    if (changes['prerequisiteLineStyle']) {
      element.prerequisiteLineStyle = this.prerequisiteLineStyle
    }
  }

  ngOnDestroy(): void {
    this.removeEventListeners()
  }

  private getElement(): BlocksGraph | null {
    return this.graphElement?.nativeElement ?? null
  }

  private loadBlocks(
    element: BlocksGraph,
    blocks: Block[] | BlockSchemaV01[]
  ): void {
    // Auto-detection handled by BlocksGraph.setBlocks()
    element.setBlocks(blocks)
  }

  private setupEventListeners(): void {
    const element = this.getElement()
    if (!element) return

    this.blocksRenderedListener = (event: Event) => {
      const customEvent = event as CustomEvent<BlocksRenderedEvent>
      this.blocksRendered.emit(customEvent.detail)
    }

    this.blockSelectedListener = (event: Event) => {
      const customEvent = event as CustomEvent<BlockSelectedEvent>
      this.blockSelected.emit(customEvent.detail)
    }

    element.addEventListener('blocks-rendered', this.blocksRenderedListener)
    element.addEventListener('block-selected', this.blockSelectedListener)
  }

  private removeEventListeners(): void {
    const element = this.getElement()
    if (!element) return

    if (this.blocksRenderedListener) {
      element.removeEventListener(
        'blocks-rendered',
        this.blocksRenderedListener
      )
    }

    if (this.blockSelectedListener) {
      element.removeEventListener('block-selected', this.blockSelectedListener)
    }
  }

  private loadInitialData(): void {
    const element = this.getElement()
    if (!element) return

    // Apply initial configuration
    element.language = this.language
    element.orientation = this.orientation
    element.showPrerequisites = this.showPrerequisites
    element.prerequisiteLineStyle = this.prerequisiteLineStyle

    // Apply layout config if provided
    if (this.nodeWidth !== undefined) {
      element.setAttribute('node-width', String(this.nodeWidth))
    }
    if (this.nodeHeight !== undefined) {
      element.setAttribute('node-height', String(this.nodeHeight))
    }
    if (this.horizontalSpacing !== undefined) {
      element.setAttribute('horizontal-spacing', String(this.horizontalSpacing))
    }
    if (this.verticalSpacing !== undefined) {
      element.setAttribute('vertical-spacing', String(this.verticalSpacing))
    }
    if (this.maxNodesPerLevel !== undefined) {
      element.setAttribute('max-nodes-per-level', String(this.maxNodesPerLevel))
    }

    // Load data
    if (this.blocks) {
      this.loadBlocks(element, this.blocks)
    }
  }
}
