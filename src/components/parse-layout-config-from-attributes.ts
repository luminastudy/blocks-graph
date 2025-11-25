import type { GraphLayoutConfig } from '../core/graph-layout-config.js'
import { isValidOrientation } from '../types/is-valid-orientation.js'

/**
 * Parse layout configuration from HTML element attributes
 * @param element - HTML element with layout attributes
 * @returns Partial layout configuration
 */
export function parseLayoutConfigFromAttributes(
  element: HTMLElement
): Partial<GraphLayoutConfig> {
  const config: Partial<GraphLayoutConfig> = {}

  const nodeWidth = element.getAttribute('node-width')
  if (nodeWidth) {
    config.nodeWidth = Number.parseInt(nodeWidth, 10)
  }

  const nodeHeight = element.getAttribute('node-height')
  if (nodeHeight) {
    config.nodeHeight = Number.parseInt(nodeHeight, 10)
  }

  const horizontalSpacing = element.getAttribute('horizontal-spacing')
  if (horizontalSpacing) {
    config.horizontalSpacing = Number.parseInt(horizontalSpacing, 10)
  }

  const verticalSpacing = element.getAttribute('vertical-spacing')
  if (verticalSpacing) {
    config.verticalSpacing = Number.parseInt(verticalSpacing, 10)
  }

  const orientation = element.getAttribute('orientation')
  if (orientation && isValidOrientation(orientation)) {
    config.orientation = orientation
  } else if (orientation) {
    console.warn(
      `Invalid orientation "${orientation}". Using default "ttb". ` +
        `Valid values: ttb, ltr, rtl, btt`
    )
  }

  const maxNodesPerLevel = element.getAttribute('max-nodes-per-level')
  if (maxNodesPerLevel) {
    const parsed = Number.parseInt(maxNodesPerLevel, 10)
    if (!Number.isNaN(parsed) && parsed >= 1) {
      config.maxNodesPerLevel = parsed
    } else {
      console.warn(
        `Invalid max-nodes-per-level "${maxNodesPerLevel}". Must be a positive integer. Using default (unlimited).`
      )
    }
  }

  return config
}
