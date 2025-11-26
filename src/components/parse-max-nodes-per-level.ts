/**
 * Parse max-nodes-per-level attribute value to a number or undefined
 */
export function parseMaxNodesPerLevel(
  value: string | null
): number | undefined {
  if (!value) return undefined
  const parsed = Number.parseInt(value, 10)
  return !Number.isNaN(parsed) && parsed >= 1 ? parsed : undefined
}
