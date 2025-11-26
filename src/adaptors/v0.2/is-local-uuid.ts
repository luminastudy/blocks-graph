/**
 * UUID pattern (lowercase hex)
 * Using a simple pattern that avoids ReDoS vulnerabilities
 */
const UUID_PATTERN =
  /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i

/**
 * Check if a reference string is a local UUID
 */
export function isLocalUuid(ref: string): boolean {
  return UUID_PATTERN.test(ref)
}
