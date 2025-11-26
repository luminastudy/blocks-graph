import type { ParsedExternalReference } from './parsed-external-reference.js'

/**
 * Generate a URL for an external reference
 */
export function getExternalReferenceUrl(
  parsed: ParsedExternalReference
): string {
  const baseUrl =
    parsed.platform === 'github'
      ? `https://github.com/${parsed.org}/${parsed.repo}`
      : `https://gitlab.com/${parsed.org}/${parsed.repo}`

  // If there's a git ref, append it as a tree/tag reference
  if (parsed.gitRef !== null) {
    return `${baseUrl}/tree/${parsed.gitRef}`
  }

  return baseUrl
}
