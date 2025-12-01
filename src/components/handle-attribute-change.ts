import type { GraphRenderer } from '../core/renderer.js'
import type { AttributeChangeResult } from '../types/attribute-change-result.js'
import { isValidEdgeLineStyle } from '../types/is-valid-edge-line-style.js'

const LAYOUT_ATTRIBUTES = new Set([
  'node-width',
  'node-height',
  'horizontal-spacing',
  'vertical-spacing',
  'orientation',
  'max-nodes-per-level',
])

export function handleAttributeChange(
  name: string,
  newValue: string | null,
  renderer: GraphRenderer
): AttributeChangeResult {
  if (name === 'language') {
    if (newValue === 'en' || newValue === 'he') {
      renderer.updateConfig({ language: newValue })
    }
    return 'renderer-updated'
  }
  if (name === 'show-prerequisites') {
    renderer.updateConfig({ showPrerequisites: newValue === 'true' })
    return 'renderer-updated'
  }
  if (name === 'prerequisite-line-style') {
    if (newValue && isValidEdgeLineStyle(newValue)) {
      renderer.updateConfig({
        edgeStyle: {
          ...renderer['config'].edgeStyle,
          prerequisite: {
            ...renderer['config'].edgeStyle.prerequisite,
            lineStyle: newValue,
          },
        },
      })
    }
    return 'renderer-updated'
  }
  if (LAYOUT_ATTRIBUTES.has(name)) {
    return 'layout-updated'
  }
  return 'none'
}
