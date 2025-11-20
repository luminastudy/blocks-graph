import type { EdgeLineStyle } from './edge-style.js'

/**
 * Validates if a string is a valid EdgeLineStyle
 */
export function isValidEdgeLineStyle(value: string): value is EdgeLineStyle {
  return value === 'straight' || value === 'dashed' || value === 'dotted'
}
