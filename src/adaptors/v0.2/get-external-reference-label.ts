import type { ParsedExternalReference } from './parsed-external-reference.js'

/**
 * Generate a display label for an external reference
 * Format: "org/repo" or "org/repo#ref" or "org/repo (block-id)"
 */
export function getExternalReferenceLabel(
  parsed: ParsedExternalReference
): string {
  let label = `${parsed.org}/${parsed.repo}`

  if (parsed.gitRef !== null) {
    label += `#${parsed.gitRef}`
  }

  if (parsed.blockId !== null) {
    // Show abbreviated block ID
    label += ` (${parsed.blockId.substring(0, 8)}...)`
  }

  return label
}
