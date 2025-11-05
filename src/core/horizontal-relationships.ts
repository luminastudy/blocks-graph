import type { Block } from '../types/block.js';
import type { BlockGraph } from '../types/block-graph.js';

/**
 * Manages horizontal relationships (prerequisites and post-requisites) between blocks.
 *
 * This class provides efficient O(1) lookups for both prerequisites and post-requisites
 * by maintaining bidirectional maps. It also supports advanced graph operations like
 * transitive closure, cycle detection, and topological sorting.
 *
 * @example
 * ```ts
 * const relationships = HorizontalRelationships.fromBlocks(blocks);
 * const prereqs = relationships.getPrerequisites('block-1');
 * const postreqs = relationships.getPostrequisites('block-1');
 * ```
 */
export class HorizontalRelationships {
  /**
   * Maps each block ID to the set of its direct prerequisites.
   * If A→B (A is prerequisite of B), then prerequisites.get(B) contains A.
   */
  private readonly prerequisites: Map<string, Set<string>>;

  /**
   * Maps each block ID to the set of blocks that have it as a prerequisite.
   * If A→B (A is prerequisite of B), then postrequisites.get(A) contains B.
   */
  private readonly postrequisites: Map<string, Set<string>>;

  /**
   * Memoization cache for transitive prerequisites to avoid recomputation.
   */
  private readonly transitivePrereqsCache: Map<string, Set<string>>;

  /**
   * Memoization cache for transitive post-requisites to avoid recomputation.
   */
  private readonly transitivePostreqsCache: Map<string, Set<string>>;

  constructor() {
    this.prerequisites = new Map();
    this.postrequisites = new Map();
    this.transitivePrereqsCache = new Map();
    this.transitivePostreqsCache = new Map();
  }

  /**
   * Creates a HorizontalRelationships instance from an array of blocks.
   * Extracts prerequisite relationships from each block's prerequisites array.
   *
   * @param blocks - Array of blocks with prerequisite information
   * @returns A new HorizontalRelationships instance
   */
  static fromBlocks(blocks: Block[]): HorizontalRelationships {
    const relationships = new HorizontalRelationships();

    for (const block of blocks) {
      // Ensure block exists in the graph (even if it has no relationships)
      relationships.ensureBlockExists(block.id);

      // Add all prerequisite relationships
      for (const prereqId of block.prerequisites) {
        relationships.addRelationship(prereqId, block.id);
      }
    }

    return relationships;
  }

  /**
   * Creates a HorizontalRelationships instance from a BlockGraph.
   * Only processes edges of type 'prerequisite'.
   *
   * @param graph - The block graph containing edges
   * @returns A new HorizontalRelationships instance
   */
  static fromGraph(graph: BlockGraph): HorizontalRelationships {
    const relationships = new HorizontalRelationships();

    // Ensure all blocks are registered
    for (const blockId of graph.blocks.keys()) {
      relationships.ensureBlockExists(blockId);
    }

    // Add prerequisite edges
    for (const edge of graph.edges) {
      if (edge.type !== 'prerequisite') {
        continue;
      }
      relationships.addRelationship(edge.from, edge.to);
    }

    return relationships;
  }

  /**
   * Ensures a block exists in the internal maps.
   * This is called automatically when adding relationships.
   */
  private ensureBlockExists(blockId: string): void {
    if (!this.prerequisites.has(blockId)) {
      this.prerequisites.set(blockId, new Set());
    }
    if (!this.postrequisites.has(blockId)) {
      this.postrequisites.set(blockId, new Set());
    }
  }

  /**
   * Adds a prerequisite relationship from one block to another.
   * Maintains bidirectional consistency between prerequisites and postrequisites maps.
   *
   * @param from - The prerequisite block ID (must come before)
   * @param to - The dependent block ID (comes after)
   * @throws Error if attempting to create a self-loop
   *
   * @example
   * ```ts
   * relationships.addRelationship('calculus-1', 'calculus-2');
   * // calculus-1 is now a prerequisite of calculus-2
   * ```
   */
  addRelationship(from: string, to: string): void {
    // Prevent self-loops
    if (from === to) {
      throw new Error(`Cannot add self-loop: block ${from} cannot be its own prerequisite`);
    }

    this.ensureBlockExists(from);
    this.ensureBlockExists(to);

    // Add to both maps for bidirectional lookup
    this.prerequisites.get(to)!.add(from);
    this.postrequisites.get(from)!.add(to);

    // Invalidate caches since graph structure changed
    this.clearCaches();
  }

  /**
   * Removes a prerequisite relationship between two blocks.
   *
   * @param from - The prerequisite block ID
   * @param to - The dependent block ID
   */
  removeRelationship(from: string, to: string): void {
    const toPrereqs = this.prerequisites.get(to);
    if (toPrereqs) {
      toPrereqs.delete(from);
    }
    const fromPostreqs = this.postrequisites.get(from);
    if (fromPostreqs) {
      fromPostreqs.delete(to);
    }

    // Invalidate caches since graph structure changed
    this.clearCaches();
  }

  /**
   * Removes a block and all its relationships from the graph.
   *
   * @param blockId - The block ID to remove
   */
  removeBlock(blockId: string): void {
    // Remove all incoming edges (prerequisites pointing to this block)
    const prereqs = this.prerequisites.get(blockId);
    if (prereqs) {
      for (const prereqId of prereqs) {
        const prereqPostreqs = this.postrequisites.get(prereqId);
        if (prereqPostreqs) {
          prereqPostreqs.delete(blockId);
        }
      }
    }

    // Remove all outgoing edges (postrequisites this block points to)
    const postreqs = this.postrequisites.get(blockId);
    if (postreqs) {
      for (const postreqId of postreqs) {
        const postreqPrereqs = this.prerequisites.get(postreqId);
        if (postreqPrereqs) {
          postreqPrereqs.delete(blockId);
        }
      }
    }

    // Remove the block itself
    this.prerequisites.delete(blockId);
    this.postrequisites.delete(blockId);

    // Invalidate caches
    this.clearCaches();
  }

  /**
   * Gets the direct prerequisites of a block (blocks that must come before it).
   *
   * @param blockId - The block ID to query
   * @returns A read-only set of prerequisite block IDs (empty set if block has no prerequisites)
   *
   * @example
   * ```ts
   * const prereqs = relationships.getPrerequisites('calculus-2');
   * // Returns: Set(['calculus-1'])
   * ```
   */
  getPrerequisites(blockId: string): ReadonlySet<string> {
    const prereqs = this.prerequisites.get(blockId);
    return prereqs ? new Set(prereqs) : new Set();
  }

  /**
   * Gets the direct post-requisites of a block (blocks that depend on it).
   *
   * @param blockId - The block ID to query
   * @returns A read-only set of post-requisite block IDs (empty set if no blocks depend on this one)
   *
   * @example
   * ```ts
   * const postreqs = relationships.getPostrequisites('calculus-1');
   * // Returns: Set(['calculus-2'])
   * ```
   */
  getPostrequisites(blockId: string): ReadonlySet<string> {
    const postreqs = this.postrequisites.get(blockId);
    return postreqs ? new Set(postreqs) : new Set();
  }

  /**
   * Checks if one block is a direct prerequisite of another.
   *
   * @param blockId - The dependent block
   * @param prerequisiteId - The potential prerequisite block
   * @returns True if prerequisiteId is a direct prerequisite of blockId
   */
  hasPrerequisite(blockId: string, prerequisiteId: string): boolean {
    const prereqs = this.prerequisites.get(blockId);
    return prereqs ? prereqs.has(prerequisiteId) : false;
  }

  /**
   * Checks if one block is a direct post-requisite of another.
   *
   * @param blockId - The prerequisite block
   * @param postrequisiteId - The potential post-requisite block
   * @returns True if postrequisiteId has blockId as a prerequisite
   */
  hasPostrequisite(blockId: string, postrequisiteId: string): boolean {
    const postreqs = this.postrequisites.get(blockId);
    return postreqs ? postreqs.has(postrequisiteId) : false;
  }

  /**
   * Gets all prerequisites of a block, including transitive ones.
   * Uses DFS with memoization for efficiency.
   *
   * @param blockId - The block ID to query
   * @returns A read-only set of all prerequisite block IDs (direct and indirect)
   *
   * @example
   * ```ts
   * // If: calc-1 → calc-2 → calc-3
   * const allPrereqs = relationships.getAllPrerequisites('calc-3');
   * // Returns: Set(['calc-1', 'calc-2'])
   * ```
   */
  getAllPrerequisites(blockId: string): ReadonlySet<string> {
    // Check cache first
    const cached = this.transitivePrereqsCache.get(blockId);
    if (cached) {
      return cached;
    }

    const allPrereqs = new Set<string>();
    const visited = new Set<string>();

    const dfs = (currentId: string): void => {
      if (visited.has(currentId)) return;
      visited.add(currentId);

      const directPrereqs = this.prerequisites.get(currentId);
      if (!directPrereqs) return;

      for (const prereqId of directPrereqs) {
        allPrereqs.add(prereqId);
        dfs(prereqId);
      }
    };

    dfs(blockId);

    // Cache the result
    this.transitivePrereqsCache.set(blockId, allPrereqs);

    return allPrereqs;
  }

  /**
   * Gets all post-requisites of a block, including transitive ones.
   * Uses DFS with memoization for efficiency.
   *
   * @param blockId - The block ID to query
   * @returns A read-only set of all post-requisite block IDs (direct and indirect)
   *
   * @example
   * ```ts
   * // If: calc-1 → calc-2 → calc-3
   * const allPostreqs = relationships.getAllPostrequisites('calc-1');
   * // Returns: Set(['calc-2', 'calc-3'])
   * ```
   */
  getAllPostrequisites(blockId: string): ReadonlySet<string> {
    // Check cache first
    const cached = this.transitivePostreqsCache.get(blockId);
    if (cached) {
      return cached;
    }

    const allPostreqs = new Set<string>();
    const visited = new Set<string>();

    const dfs = (currentId: string): void => {
      if (visited.has(currentId)) return;
      visited.add(currentId);

      const directPostreqs = this.postrequisites.get(currentId);
      if (!directPostreqs) return;

      for (const postreqId of directPostreqs) {
        allPostreqs.add(postreqId);
        dfs(postreqId);
      }
    };

    dfs(blockId);

    // Cache the result
    this.transitivePostreqsCache.set(blockId, allPostreqs);

    return allPostreqs;
  }

  /**
   * Checks if there is a path from one block to another.
   *
   * @param from - The starting block ID
   * @param to - The target block ID
   * @returns True if there is a directed path from 'from' to 'to'
   */
  hasPath(from: string, to: string): boolean {
    if (from === to) return true;

    const allPostreqs = this.getAllPostrequisites(from);
    return allPostreqs.has(to);
  }

  /**
   * Detects cycles in the prerequisite graph using DFS with color marking.
   *
   * @returns An array of cycles (each cycle is an array of block IDs), or null if no cycles exist
   *
   * @example
   * ```ts
   * const cycles = relationships.detectCycles();
   * if (cycles) {
   *   console.log('Found cycles:', cycles);
   * }
   * ```
   */
  detectCycles(): string[][] | null {
    const cycles: string[][] = [];
    const colors = new Map<string, 'white' | 'gray' | 'black'>();
    const parent = new Map<string, string | null>();

    // Initialize all blocks as white (unvisited)
    for (const blockId of this.getAllBlocks()) {
      colors.set(blockId, 'white');
      parent.set(blockId, null);
    }

    const dfs = (blockId: string): boolean => {
      colors.set(blockId, 'gray'); // Mark as being processed

      const postreqs = this.postrequisites.get(blockId);
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
    for (const blockId of this.getAllBlocks()) {
      if (colors.get(blockId) !== 'white') {
        continue;
      }
      dfs(blockId);
    }

    return cycles.length > 0 ? cycles : null;
  }

  /**
   * Computes a topological ordering of the blocks using Kahn's algorithm.
   *
   * @returns An array of block IDs in topological order, or null if the graph has cycles
   *
   * @example
   * ```ts
   * const order = relationships.getTopologicalOrder();
   * if (order) {
   *   console.log('Complete blocks in this order:', order);
   * }
   * ```
   */
  getTopologicalOrder(): string[] | null {
    // Calculate in-degrees
    const inDegree = new Map<string, number>();
    for (const blockId of this.getAllBlocks()) {
      const prereqs = this.prerequisites.get(blockId);
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
      const blockId = queue.shift()!;
      order.push(blockId);

      // Reduce in-degree for all post-requisites
      const postreqs = this.postrequisites.get(blockId);
      if (postreqs) {
        for (const postreqId of postreqs) {
          const newDegree = (inDegree.get(postreqId) ?? 1) - 1;
          inDegree.set(postreqId, newDegree);

          if (newDegree === 0) {
            queue.push(postreqId);
          }
        }
      }
    }

    // If not all blocks are in the order, there's a cycle
    if (order.length !== this.getBlockCount()) {
      return null;
    }

    return order;
  }

  /**
   * Gets all block IDs in this relationship graph.
   *
   * @returns A read-only set of all block IDs
   */
  getAllBlocks(): ReadonlySet<string> {
    return new Set(this.prerequisites.keys());
  }

  /**
   * Gets the total number of blocks in the graph.
   *
   * @returns The number of blocks
   */
  getBlockCount(): number {
    return this.prerequisites.size;
  }

  /**
   * Gets the total number of prerequisite relationships.
   *
   * @returns The number of relationships (edges)
   */
  getRelationshipCount(): number {
    let count = 0;
    for (const prereqs of this.prerequisites.values()) {
      count += prereqs.size;
    }
    return count;
  }

  /**
   * Clears all relationships and blocks from the graph.
   */
  clear(): void {
    this.prerequisites.clear();
    this.postrequisites.clear();
    this.clearCaches();
  }

  /**
   * Clears memoization caches.
   * Called automatically when the graph structure changes.
   */
  private clearCaches(): void {
    this.transitivePrereqsCache.clear();
    this.transitivePostreqsCache.clear();
  }

  /**
   * Returns a string representation of the relationship graph for debugging.
   *
   * @returns A human-readable string showing all relationships
   */
  toString(): string {
    const lines: string[] = [];
    lines.push(`HorizontalRelationships (${this.getBlockCount()} blocks, ${this.getRelationshipCount()} relationships)`);

    for (const blockId of this.getAllBlocks()) {
      const prereqs = Array.from(this.getPrerequisites(blockId));
      const postreqs = Array.from(this.getPostrequisites(blockId));

      lines.push(`  ${blockId}:`);
      if (prereqs.length > 0) {
        lines.push(`    Prerequisites: [${prereqs.join(', ')}]`);
      }
      if (postreqs.length > 0) {
        lines.push(`    Post-requisites: [${postreqs.join(', ')}]`);
      }
    }

    return lines.join('\n');
  }
}
