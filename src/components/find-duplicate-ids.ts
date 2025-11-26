/**
 * Find duplicate IDs in an array of blocks
 * @returns Array of duplicate IDs, empty if no duplicates
 */
export function findDuplicateIds(blocks: Array<{ id: string }>): string[] {
  const seen = new Set<string>()
  const duplicates = new Set<string>()

  for (const block of blocks) {
    if (seen.has(block.id)) {
      duplicates.add(block.id)
    }
    seen.add(block.id)
  }

  return Array.from(duplicates)
}
