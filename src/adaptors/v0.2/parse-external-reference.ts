import type { ExternalPlatform } from './external-platform.js'
import type { ParsedExternalReference } from './parsed-external-reference.js'
import { isExternalReference } from './is-external-reference.js'

/**
 * UUID pattern for block IDs within external references
 */
const UUID_PATTERN =
  /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i

/**
 * Parse an external reference string into its components
 * Returns null if the reference is not a valid external reference
 *
 * Format: <platform>:<org>/<repo>[/<block-id>][#<ref>]
 */
export function parseExternalReference(
  ref: string
): ParsedExternalReference | null {
  if (!isExternalReference(ref)) {
    return null
  }

  // Extract platform
  const colonIndex = ref.indexOf(':')
  const platform = ref.slice(0, colonIndex)

  if (platform !== 'github' && platform !== 'gitlab') {
    return null
  }

  // Extract everything after platform:
  let remaining = ref.slice(colonIndex + 1)

  // Extract git ref if present (after #)
  let gitRef: string | null = null
  const hashIndex = remaining.indexOf('#')
  if (hashIndex !== -1) {
    gitRef = remaining.slice(hashIndex + 1)
    remaining = remaining.slice(0, hashIndex)
  }

  // Split by / to get org, repo, and optional blockId
  const parts = remaining.split('/')
  if (parts.length < 2) {
    return null
  }

  const org = parts[0]
  const repo = parts[1]

  if (org === undefined || repo === undefined || org === '' || repo === '') {
    return null
  }

  // Check for block ID (third part that matches UUID pattern)
  let blockId: string | null = null
  if (parts.length >= 3 && parts[2] !== undefined && parts[2] !== '') {
    const potentialBlockId = parts[2]
    if (UUID_PATTERN.test(potentialBlockId)) {
      blockId = potentialBlockId
    }
  }

  const typedPlatform: ExternalPlatform = platform

  return {
    platform: typedPlatform,
    org,
    repo,
    blockId,
    gitRef,
    raw: ref,
  }
}
