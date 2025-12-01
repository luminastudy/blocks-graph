import type { BlockPosition } from '../types/block-position.js'

/**
 * Icon size for external block indicators
 */
const ICON_SIZE = 14

/**
 * Padding from the top-right corner
 */
const ICON_PADDING = 6

/**
 * Creates an external link icon SVG element for blocks that reference external repositories
 * The icon is positioned in the top-right corner of the block
 *
 * @param position - The block's position
 * @param platform - The external platform ('github' | 'gitlab')
 * @param opacity - Opacity value for the icon
 * @returns SVG group element containing the external icon
 */
export function createExternalIcon(
  position: BlockPosition,
  platform: string,
  opacity: string
): SVGGElement {
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  group.setAttribute('class', `external-icon external-icon-${platform}`)
  group.setAttribute('opacity', opacity)

  // Position in top-right corner
  const iconX = position.x + position.width - ICON_SIZE - ICON_PADDING
  const iconY = position.y + ICON_PADDING

  if (platform === 'github') {
    // GitHub icon (simplified octocat/logo)
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    // GitHub mark SVG path (scaled to 14x14)
    path.setAttribute(
      'd',
      `M${iconX + 7} ${iconY}C${iconX + 3.13} ${iconY} ${iconX} ${iconY + 3.13} ${iconX} ${iconY + 7}c0 3.1 2.01 5.73 4.79 6.66.35.06.48-.15.48-.34v-1.18c-1.95.42-2.36-.94-2.36-.94-.32-.81-.78-1.02-.78-1.02-.64-.44.05-.43.05-.43.7.05 1.07.72 1.07.72.63 1.08 1.65.77 2.05.59.06-.46.24-.77.44-.95-1.56-.18-3.2-.78-3.2-3.47 0-.77.28-1.4.72-1.89-.07-.18-.31-.89.07-1.86 0 0 .59-.19 1.93.72a6.7 6.7 0 0 1 1.75-.24c.6 0 1.19.08 1.75.24 1.34-.91 1.93-.72 1.93-.72.38.97.14 1.68.07 1.86.45.49.72 1.12.72 1.89 0 2.7-1.64 3.29-3.21 3.47.25.22.48.65.48 1.31v1.94c0 .19.13.41.49.34C${iconX + 11.99} ${iconY + 12.73} ${iconX + 14} ${iconY + 10.1} ${iconX + 14} ${iconY + 7}c0-3.87-3.13-7-7-7z`
    )
    path.setAttribute('fill', '#24292f')
    group.appendChild(path)
  } else if (platform === 'gitlab') {
    // GitLab icon (simplified fox logo)
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    // GitLab tanuki SVG path (scaled to 14x14)
    path.setAttribute(
      'd',
      `M${iconX + 7} ${iconY + 13.5}l2.1-6.5h-4.2l2.1 6.5zm0 0L${iconX + 2.1} ${iconY + 7}h2.8L${iconX + 7} ${iconY + 13.5}zm0 0l2.1-6.5h2.8L${iconX + 7} ${iconY + 13.5}zm-4.9-6.5l-.7 2.2c-.06.2 0 .42.17.54L${iconX + 7} ${iconY + 13.5}L${iconX + 2.1} ${iconY + 7}h0zm9.8 0l.7 2.2c.06.2 0 .42-.17.54L${iconX + 7} ${iconY + 13.5}l4.9-6.5h0zM${iconX + 4.9} ${iconY + 7}l.8-2.5c.05-.16.27-.16.32 0l.8 2.5h-1.9zm4.2 0l.8-2.5c.05-.16.27-.16.32 0l.8 2.5h-1.9z`
    )
    path.setAttribute('fill', '#fc6d26')
    group.appendChild(path)
  } else {
    // Generic external link icon for unknown platforms
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    // External link icon (arrow pointing out of box)
    path.setAttribute(
      'd',
      `M${iconX + 10} ${iconY + 1}h3v3m0-3L${iconX + 7} ${iconY + 7}m-1-6H${iconX + 2}a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V${iconY + 8}`
    )
    path.setAttribute('fill', 'none')
    path.setAttribute('stroke', '#666')
    path.setAttribute('stroke-width', '1.5')
    path.setAttribute('stroke-linecap', 'round')
    path.setAttribute('stroke-linejoin', 'round')
    group.appendChild(path)
  }

  // Add tooltip
  const title = document.createElementNS('http://www.w3.org/2000/svg', 'title')
  title.textContent =
    platform === 'github'
      ? 'External block from GitHub'
      : platform === 'gitlab'
        ? 'External block from GitLab'
        : 'External block'
  group.appendChild(title)

  return group
}
