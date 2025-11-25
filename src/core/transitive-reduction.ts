import type { GraphEdge } from '../types/graph-edge.js'

/**
 * Performs transitive reduction on prerequisite edges.
 *
 * Removes redundant edges where a direct edge A→C exists but there's also
 * an indirect path A→B→C (or longer). The direct edge A→C is considered
 * transitive and should be hidden for clearer visualization.
 *
 * Example:
 * - Given: A→B, B→C, A→C (direct)
 * - Result: A→B, B→C (A→C is removed as transitive)
 *
 * @param edges - All edges in the graph
 * @returns Array of edges with transitive prerequisite edges removed
 */
export function removeTransitiveEdges(edges: GraphEdge[]): GraphEdge[] {
  // Separate prerequisite and parent edges
  const prerequisiteEdges = edges.filter(e => e.type === 'prerequisite')
  const parentEdges = edges.filter(e => e.type === 'parent')

  // Build adjacency map for prerequisite edges only
  const adjacency = new Map<string, Set<string>>()
  for (const edge of prerequisiteEdges) {
    const targets = adjacency.get(edge.from)
    if (targets) {
      targets.add(edge.to)
    } else {
      adjacency.set(edge.from, new Set([edge.to]))
    }
  }

  /**
   * Check if there's a path from 'from' to 'to' that goes through at least one intermediate node
   * Uses BFS to find paths, avoiding the direct edge
   */
  function hasIndirectPath(from: string, to: string): boolean {
    const visited = new Set<string>()
    const queue: string[] = []

    // Start with direct neighbors of 'from'
    const directNeighbors = adjacency.get(from)
    if (!directNeighbors) return false

    // Initialize queue with all direct neighbors except 'to'
    for (const neighbor of directNeighbors) {
      if (neighbor !== to) {
        queue.push(neighbor)
        visited.add(neighbor)
      }
    }

    // BFS to find if any path leads to 'to'
    while (queue.length > 0) {
      const current = queue.shift()
      if (current === undefined) continue

      // Found an indirect path!
      if (current === to) {
        return true
      }

      const neighbors = adjacency.get(current)
      if (neighbors) {
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor)
            queue.push(neighbor)
          }
        }
      }
    }

    return false
  }

  // Filter out transitive prerequisite edges
  const nonTransitivePrerequisites = prerequisiteEdges.filter(edge => {
    // Check if this edge is transitive (redundant)
    return !hasIndirectPath(edge.from, edge.to)
  })

  // Return non-transitive prerequisites + all parent edges
  return [...nonTransitivePrerequisites, ...parentEdges]
}
