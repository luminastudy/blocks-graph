import type { Block } from '../types/block.js'
import type { BlockSchemaV01 } from '../adaptors/v0.1/types.js'
import type { EdgeLineStyle } from '../types/edge-style.js'
import type { Orientation } from '../types/orientation.js'

/**
 * Base configuration options shared by all framework wrappers.
 * This interface defines the common props/inputs that all wrappers expose.
 */
export interface BlocksGraphBaseConfig {
  // Data props
  /** Array of blocks in internal format or v0.1 schema format (auto-detected) */
  blocks?: Block[] | BlockSchemaV01[]
  /** URL to load blocks from (always uses v0.1 schema) */
  jsonUrl?: string

  // Configuration props
  /** Language to display block titles */
  language?: 'en' | 'he'
  /** Graph orientation direction */
  orientation?: Orientation
  /** Show prerequisite relationships */
  showPrerequisites?: boolean

  // Layout props
  /** Width of each block node in pixels */
  nodeWidth?: number
  /** Height of each block node in pixels */
  nodeHeight?: number
  /** Horizontal spacing between nodes */
  horizontalSpacing?: number
  /** Vertical spacing between levels */
  verticalSpacing?: number
  /** Maximum nodes per level before wrapping to grid */
  maxNodesPerLevel?: number

  // Edge style props
  /** Line style for prerequisite edges */
  prerequisiteLineStyle?: EdgeLineStyle
}
