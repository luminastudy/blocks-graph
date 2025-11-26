/**
 * Create a block-selected CustomEvent
 */
export function createBlockSelectedEvent(
  blockId: string | null,
  selectionLevel: number,
  navigationStack: string[]
): CustomEvent {
  return new CustomEvent('block-selected', {
    detail: {
      blockId,
      selectionLevel,
      navigationStack: [...navigationStack],
    },
  })
}
