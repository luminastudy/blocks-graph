/**
 * Create and return an empty state message element
 */
export function createEmptyStateMessage(): HTMLDivElement {
  const message = document.createElement('div')
  message.textContent =
    'No blocks to display. Use setBlocks(), loadFromJson(), or loadFromUrl() to add data.'
  message.style.padding = '1rem'
  message.style.fontFamily = 'system-ui, -apple-system, sans-serif'
  return message
}
