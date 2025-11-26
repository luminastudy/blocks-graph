/**
 * Event payload when a block is selected
 */
export interface BlockSelectedEvent {
  blockId: string | null
  selectionLevel: number
  navigationStack: string[]
}
