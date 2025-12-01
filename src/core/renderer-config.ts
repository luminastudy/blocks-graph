import type { Orientation } from '../types/orientation.js'
import type { EdgeLineStyle } from '../types/edge-style.js'
import type { BlockStyle } from '../types/block-style.js'
import type { TextStyle } from './text-style.js'

/**
 * Renderer configuration
 */
export interface RendererConfig {
  language: 'en' | 'he'
  showPrerequisites: boolean
  orientation?: Orientation
  selectedBlockId?: string | null
  visibleBlocks?: Set<string>
  dimmedBlocks?: Set<string>
  blockStyle: BlockStyle
  textStyle: TextStyle
  edgeStyle: {
    prerequisite: {
      stroke: string
      strokeWidth: number
      lineStyle: EdgeLineStyle
      dashArray?: string // Deprecated: Use lineStyle instead
    }
  }
}
