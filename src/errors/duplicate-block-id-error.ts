/**
 * Error thrown when duplicate block IDs are detected
 */
export class DuplicateBlockIdError extends Error {
  constructor(public readonly duplicateIds: string[]) {
    const idList = duplicateIds.join(', ')
    super(`Duplicate block IDs detected: ${idList}`)
    this.name = 'DuplicateBlockIdError'
  }
}
