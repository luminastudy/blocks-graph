/**
 * Default renderer configuration
 */

import type { RendererConfig } from './renderer-config.js'

export const DEFAULT_RENDERER_CONFIG: RendererConfig = {
  language: 'en',
  showPrerequisites: true,
  blockStyle: {
    fill: '#ffffff',
    stroke: '#333333',
    strokeWidth: 2,
    cornerRadius: 8,
  },
  textStyle: {
    fontSize: 14,
    fill: '#333333',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    maxLines: 3,
    lineHeight: 1.2,
    horizontalPadding: 10,
  },
  edgeStyle: {
    prerequisite: {
      stroke: '#4a90e2',
      strokeWidth: 2,
      lineStyle: 'straight',
    },
  },
}
