/**
 * Event emitted when a block is selected
 */
export interface BlockSelectedEvent {
  blockId: string | null
  selectionLevel: number
}
