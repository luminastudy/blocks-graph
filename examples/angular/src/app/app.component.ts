import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import {
  BlocksGraphComponent,
  type Block,
  type BlockSchemaV01,
  type BlockSelectedEvent,
  type BlocksRenderedEvent,
} from '@luminastudy/blocks-graph/angular'

/**
 * Angular Example Using the BlocksGraphComponent Wrapper
 *
 * This demonstrates the recommended approach for Angular apps.
 * No ViewChild needed - just use @Input/@Output decorators!
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, BlocksGraphComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  // State management
  blocks: BlockSchemaV01[] | null = null
  language: 'en' | 'he' = 'en'
  orientation: 'ttb' | 'ltr' | 'rtl' | 'btt' = 'ttb'
  showPrerequisites = true
  showParents = true
  status = 'Loading data...'
  selectedBlock: string | null = null

  /**
   * Load data on component init
   * The wrapper handles converting data and passing it to the Web Component
   */
  async ngOnInit() {
    try {
      const response = await fetch(
        'https://raw.githubusercontent.com/luminastudy/the-open-university-combinatorics/refs/heads/main/lumina.json'
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Data from API is in v0.1 schema format (he_text/en_text)
      // We'll pass it to blocksV01 input which handles conversion automatically
      this.blocks = data
      this.status = `Loaded ${data.length} blocks successfully`
    } catch (error) {
      console.error('Error loading data:', error)
      this.status = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }

  /**
   * Event handlers
   */
  handleBlocksRendered(event: BlocksRenderedEvent) {
    console.log('Blocks rendered:', event)
    this.status = `Rendered ${event.blockCount} blocks`
  }

  handleBlockSelected(event: BlockSelectedEvent) {
    console.log('Block selected:', event)
    if (event.blockId) {
      this.selectedBlock = event.blockId
      const levelText =
        event.selectionLevel === 0
          ? 'default view'
          : event.selectionLevel === 1
            ? 'showing graph'
            : 'showing graph + sub-blocks'
      this.status = `Selected block - ${levelText}`
    } else {
      this.selectedBlock = null
      this.status = 'Selection cleared'
    }
  }
}
