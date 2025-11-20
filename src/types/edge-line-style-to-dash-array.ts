import type { EdgeLineStyle } from './edge-style.js'

/**
 * Converts EdgeLineStyle to SVG stroke-dasharray value
 */
export function edgeLineStyleToDashArray(
  style: EdgeLineStyle
): string | undefined {
  switch (style) {
    case 'straight':
      return undefined // Solid line, no dash array
    case 'dashed':
      return '8 4' // 8px dash, 4px gap
    case 'dotted':
      return '2 3' // 2px dot, 3px gap
  }
}
