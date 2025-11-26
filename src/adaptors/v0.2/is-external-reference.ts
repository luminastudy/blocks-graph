/**
 * Check if a reference string is an external reference
 * External references start with "github:" or "gitlab:"
 */
export function isExternalReference(ref: string): boolean {
  // Simple prefix check first for performance
  if (!ref.startsWith('github:') && !ref.startsWith('gitlab:')) {
    return false
  }

  // Validate basic structure: platform:org/repo
  const colonIndex = ref.indexOf(':')
  const afterColon = ref.slice(colonIndex + 1)

  // Must have at least one slash separating org/repo
  const slashIndex = afterColon.indexOf('/')
  if (slashIndex === -1 || slashIndex === 0) {
    return false
  }

  // Check that org and repo parts exist and are non-empty
  const org = afterColon.slice(0, slashIndex)
  const rest = afterColon.slice(slashIndex + 1)

  if (org.length === 0 || rest.length === 0) {
    return false
  }

  // Extract repo (before any / or #)
  let repo = rest
  const nextSlash = rest.indexOf('/')
  const hashIndex = rest.indexOf('#')

  if (nextSlash !== -1) {
    repo = rest.slice(0, nextSlash)
  } else if (hashIndex !== -1) {
    repo = rest.slice(0, hashIndex)
  }

  return repo.length > 0
}
