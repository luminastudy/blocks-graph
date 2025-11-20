import type { Orientation } from '../types/orientation.js'
import type { EdgeLineStyle } from '../types/edge-style.js'

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
  blockStyle: {
    fill: string
    stroke: string
    strokeWidth: number
    cornerRadius: number
  }
  textStyle: {
    fontSize: number
    fill: string
    fontFamily: string
    maxLines?: number
    lineHeight?: number
    horizontalPadding?: number
  }
  edgeStyle: {
    prerequisite: {
      stroke: string
      strokeWidth: number
      lineStyle: EdgeLineStyle
      dashArray?: string // Deprecated: Use lineStyle instead
    }
    parent: {
      stroke: string
      strokeWidth: number
      lineStyle: EdgeLineStyle
      dashArray?: string // Deprecated: Use lineStyle instead
    }
  }
}
