/**
 * Advanced graph algorithms for HorizontalRelationships
 * @internal
 */

/**
 * Computes all prerequisites of a block, including transitive ones.
 * Uses DFS with memoization for efficiency.
 */
function computeAllPrerequisites(
  blockId: string,
  prerequisites: Map<string, Set<string>>,
  cache: Map<string, Set<string>>
): ReadonlySet<string> {
  // Check cache first
  const cached = cache.get(blockId);
  if (cached) {
    return cached;
  }

  const allPrereqs = new Set<string>();
  const visited = new Set<string>();

  const dfs = (currentId: string): void => {
    if (visited.has(currentId)) return;
    visited.add(currentId);

    const directPrereqs = prerequisites.get(currentId);
    if (!directPrereqs) return;

    for (const prereqId of directPrereqs) {
      allPrereqs.add(prereqId);
      dfs(prereqId);
    }
  };

  dfs(blockId);

  // Cache the result
  cache.set(blockId, allPrereqs);

  return allPrereqs;
}

/**
 * Computes all post-requisites of a block, including transitive ones.
 * Uses DFS with memoization for efficiency.
 */
function computeAllPostrequisites(
  blockId: string,
  postrequisites: Map<string, Set<string>>,
  cache: Map<string, Set<string>>
): ReadonlySet<string> {
  // Check cache first
  const cached = cache.get(blockId);
  if (cached) {
    return cached;
  }

  const allPostreqs = new Set<string>();
  const visited = new Set<string>();

  const dfs = (currentId: string): void => {
    if (visited.has(currentId)) return;
    visited.add(currentId);

    const directPostreqs = postrequisites.get(currentId);
    if (!directPostreqs) return;

    for (const postreqId of directPostreqs) {
      allPostreqs.add(postreqId);
      dfs(postreqId);
    }
  };

  dfs(blockId);

  // Cache the result
  cache.set(blockId, allPostreqs);

  return allPostreqs;
}

/**
 * Detects cycles in the prerequisite graph using DFS with cycle tracking.
 * Returns all cycles found, or null if no cycles exist.
 */
function detectCyclesInGraph(
  _prerequisites: Map<string, Set<string>>,
  postrequisites: Map<string, Set<string>>,
  getAllBlocksSet: () => Iterable<string>
): string[][] | null {
  const colors = new Map<string, 'white' | 'gray' | 'black'>();
  const parent = new Map<string, string>();
  const cycles: string[][] = [];

  // Initialize all blocks as unvisited (white)
  for (const blockId of getAllBlocksSet()) {
    colors.set(blockId, 'white');
  }

  const dfs = (blockId: string): boolean => {
    colors.set(blockId, 'gray'); // Mark as being processed

    const postreqs = postrequisites.get(blockId);
    if (postreqs) {
      for (const postreqId of postreqs) {
        const color = colors.get(postreqId);

        if (color === 'gray') {
          // Found a back edge - cycle detected
          const cycle: string[] = [postreqId];
          let current: string | null = blockId;

          while (current && current !== postreqId) {
            cycle.unshift(current);
            current = parent.get(current) ?? null;
          }

          cycle.unshift(postreqId); // Complete the cycle
          cycles.push(cycle);
          return true;
        }
        if (color === 'white') {
          parent.set(postreqId, blockId);
          if (dfs(postreqId)) {
            return true;
          }
        }
      }
    }

    colors.set(blockId, 'black'); // Mark as fully processed
    return false;
  };

  // Run DFS from each unvisited block
  for (const blockId of getAllBlocksSet()) {
    if (colors.get(blockId) !== 'white') {
      continue;
    }
    dfs(blockId);
  }

  return cycles.length > 0 ? cycles : null;
}

/**
 * Computes a topological ordering of blocks using Kahn's algorithm.
 * Returns the ordering or null if a cycle is detected.
 */
function computeTopologicalOrder(
  prerequisites: Map<string, Set<string>>,
  postrequisites: Map<string, Set<string>>,
  getAllBlocksSet: () => Iterable<string>
): string[] | null {
  // Calculate in-degrees
  const inDegree = new Map<string, number>();
  for (const blockId of getAllBlocksSet()) {
    const prereqs = prerequisites.get(blockId);
    inDegree.set(blockId, prereqs ? prereqs.size : 0);
  }

  // Queue of blocks with no prerequisites
  const queue: string[] = [];
  for (const [blockId, degree] of inDegree.entries()) {
    if (degree !== 0) {
      continue;
    }
    queue.push(blockId);
  }

  const order: string[] = [];

  while (queue.length > 0) {
    const blockId = queue.shift();
    if (!blockId) continue;

    order.push(blockId);

    // Reduce in-degree of dependent blocks
    const postreqs = postrequisites.get(blockId);
    if (postreqs) {
      for (const postreqId of postreqs) {
        const degree = inDegree.get(postreqId);
        if (degree === undefined) continue;

        const newDegree = degree - 1;
        inDegree.set(postreqId, newDegree);

        if (newDegree === 0) {
          queue.push(postreqId);
        }
      }
    }
  }

  // Check if all blocks were processed (no cycles)
  if (order.length !== inDegree.size) {
    return null; // Cycle detected
  }

  return order;
}

/**
 * Exported algorithms object for single-export compliance
 */
export const HorizontalRelationshipsAlgorithms = {
  computeAllPrerequisites,
  computeAllPostrequisites,
  detectCyclesInGraph,
  computeTopologicalOrder,
};
