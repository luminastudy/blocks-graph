import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
// Import the web component registration
import '@lumina-study/blocks-graph'
import type { BlocksGraph } from '@lumina-study/blocks-graph'

interface BlockSchemaV01 {
  id: string
  title: { he_text: string; en_text: string }
  prerequisites: string[]
  parents: string[]
}

interface BlocksRenderedDetail {
  blockCount: number
}

interface BlockSelectedDetail {
  blockId: string | null
  selectionLevel: number
  navigationStack: string[]
}

/**
 * Angular Example Using the Web Component Directly
 *
 * This demonstrates using the <blocks-graph> web component with
 * CUSTOM_ELEMENTS_SCHEMA and ViewChild for direct access.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('graphElement') graphElement?: ElementRef<BlocksGraph>

  // State management
  blocks: BlockSchemaV01[] | null
  language: 'en' | 'he'
  orientation: 'ttb' | 'ltr' | 'rtl' | 'btt'
  showPrerequisites: boolean
  status: string
  selectedBlock: string | null

  constructor() {
    this.blocks = null
    this.language = 'en'
    this.orientation = 'ttb'
    this.showPrerequisites = true
    this.status = 'Loading data...'
    this.selectedBlock = null
  }

  ngOnInit() {
    this.loadData()
  }

  ngAfterViewInit() {
    this.setupEventListeners()
  }

  private async loadData() {
    try {
      const response = await fetch(
        'https://raw.githubusercontent.com/luminastudy/the-open-university-combinatorics/refs/heads/main/lumina.json'
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      this.blocks = data
      this.status = `Loaded ${data.length} blocks successfully`

      // Load blocks into the web component after data is ready
      setTimeout(() => this.updateGraph(), 0)
    } catch (error) {
      console.error('Error loading data:', error)
      this.status = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }

  private setupEventListeners() {
    if (!this.graphElement) return
    const element = this.graphElement.nativeElement
    if (!element) return

    element.addEventListener('blocks-rendered', (event: Event) => {
      const customEvent = event as CustomEvent<BlocksRenderedDetail>
      console.log('Blocks rendered:', customEvent.detail)
      this.status = `Rendered ${customEvent.detail.blockCount} blocks`
    })

    element.addEventListener('block-selected', (event: Event) => {
      const customEvent = event as CustomEvent<BlockSelectedDetail>
      console.log('Block selected:', customEvent.detail)
      if (customEvent.detail.blockId) {
        this.selectedBlock = customEvent.detail.blockId
        const levelText =
          customEvent.detail.selectionLevel === 0
            ? 'default view'
            : customEvent.detail.selectionLevel === 1
              ? 'showing graph'
              : 'showing graph + sub-blocks'
        this.status = `Selected block - ${levelText}`
      } else {
        this.selectedBlock = null
        this.status = 'Selection cleared'
      }
    })
  }

  updateGraph() {
    if (!this.graphElement) return
    const element = this.graphElement.nativeElement
    if (!element || !this.blocks) return

    // Set attributes
    element.setAttribute('language', this.language)
    element.setAttribute('orientation', this.orientation)
    element.setAttribute('show-prerequisites', String(this.showPrerequisites))

    // Load blocks
    element.loadFromJson(JSON.stringify(this.blocks), 'v0.1')
  }

  onLanguageChange() {
    this.updateGraph()
  }

  onOrientationChange() {
    this.updateGraph()
  }

  onShowPrerequisitesChange() {
    this.updateGraph()
  }
}
