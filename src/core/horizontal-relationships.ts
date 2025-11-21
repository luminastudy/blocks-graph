import type { Block } from '../types/block.js'
import type { BlockGraph } from '../types/block-graph.js'
import { SelfLoopError } from '../errors/self-loop-error.js'
import { HorizontalRelationshipsAlgorithms } from './horizontal-relationships-algorithms.js'

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
  private readonly prerequisites: Map<string, Set<string>>

  /**
   * Maps each block ID to the set of blocks that have it as a prerequisite.
   * If A→B (A is prerequisite of B), then postrequisites.get(A) contains B.
   */
  private readonly postrequisites: Map<string, Set<string>>

  /**
   * Memoization cache for transitive prerequisites to avoid recomputation.
   */
  private readonly transitivePrereqsCache: Map<string, Set<string>>

  /**
   * Memoization cache for transitive post-requisites to avoid recomputation.
   */
  private readonly transitivePostreqsCache: Map<string, Set<string>>

  constructor() {
    this.prerequisites = new Map()
    this.postrequisites = new Map()
    this.transitivePrereqsCache = new Map()
    this.transitivePostreqsCache = new Map()
  }

  /** Creates instance from blocks array */
  static fromBlocks(blocks: Block[]): HorizontalRelationships {
    const r = new HorizontalRelationships()
    for (const b of blocks) {
      r.ensureBlockExists(b.id)
      for (const p of b.prerequisites) {
        r.addRelationship(p, b.id)
      }
    }
    return r
  }

  /** Creates instance from BlockGraph */
  static fromGraph(graph: BlockGraph): HorizontalRelationships {
    const r = new HorizontalRelationships()
    for (const id of graph.blocks.keys()) {
      r.ensureBlockExists(id)
    }
    for (const e of graph.edges) {
      if (e.type !== 'prerequisite') continue
      r.addRelationship(e.from, e.to)
    }
    return r
  }

  /**
   * Ensures a block exists in the internal maps.
   * This is called automatically when adding relationships.
   */
  ensureBlockExists(blockId: string): void {
    if (!this.prerequisites.has(blockId)) {
      this.prerequisites.set(blockId, new Set())
    }
    if (!this.postrequisites.has(blockId)) {
      this.postrequisites.set(blockId, new Set())
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
      throw new SelfLoopError(from)
    }

    this.ensureBlockExists(from)
    this.ensureBlockExists(to)

    // Add to both maps for bidirectional lookup
    this.prerequisites.get(to)!.add(from)
    this.postrequisites.get(from)!.add(to)

    // Invalidate caches since graph structure changed
    this.clearCaches()
  }

  /**
   * Removes a prerequisite relationship between two blocks.
   *
   * @param from - The prerequisite block ID
   * @param to - The dependent block ID
   */
  removeRelationship(from: string, to: string): void {
    const toPrereqs = this.prerequisites.get(to)
    if (toPrereqs) {
      toPrereqs.delete(from)
    }
    const fromPostreqs = this.postrequisites.get(from)
    if (fromPostreqs) {
      fromPostreqs.delete(to)
    }

    // Invalidate caches since graph structure changed
    this.clearCaches()
  }

  /**
   * Removes a block and all its relationships from the graph.
   *
   * @param blockId - The block ID to remove
   */
  removeBlock(blockId: string): void {
    // Remove all incoming edges (prerequisites pointing to this block)
    const prereqs = this.prerequisites.get(blockId)
    if (prereqs) {
      for (const prereqId of prereqs) {
        const prereqPostreqs = this.postrequisites.get(prereqId)
        if (prereqPostreqs) {
          prereqPostreqs.delete(blockId)
        }
      }
    }

    // Remove all outgoing edges (postrequisites this block points to)
    const postreqs = this.postrequisites.get(blockId)
    if (postreqs) {
      for (const postreqId of postreqs) {
        const postreqPrereqs = this.prerequisites.get(postreqId)
        if (postreqPrereqs) {
          postreqPrereqs.delete(blockId)
        }
      }
    }

    // Remove the block itself
    this.prerequisites.delete(blockId)
    this.postrequisites.delete(blockId)

    // Invalidate caches
    this.clearCaches()
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
    const prereqs = this.prerequisites.get(blockId)
    return prereqs ? new Set(prereqs) : new Set()
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
    const postreqs = this.postrequisites.get(blockId)
    return postreqs ? new Set(postreqs) : new Set()
  }

  /**
   * Checks if one block is a direct prerequisite of another.
   *
   * @param blockId - The dependent block
   * @param prerequisiteId - The potential prerequisite block
   * @returns True if prerequisiteId is a direct prerequisite of blockId
   */
  hasPrerequisite(blockId: string, prerequisiteId: string): boolean {
    const prereqs = this.prerequisites.get(blockId)
    return prereqs ? prereqs.has(prerequisiteId) : false
  }

  /**
   * Checks if one block is a direct post-requisite of another.
   *
   * @param blockId - The prerequisite block
   * @param postrequisiteId - The potential post-requisite block
   * @returns True if postrequisiteId has blockId as a prerequisite
   */
  hasPostrequisite(blockId: string, postrequisiteId: string): boolean {
    const postreqs = this.postrequisites.get(blockId)
    return postreqs ? postreqs.has(postrequisiteId) : false
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
    return HorizontalRelationshipsAlgorithms.computeAllPrerequisites(
      blockId,
      this.prerequisites,
      this.transitivePrereqsCache
    )
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
    return HorizontalRelationshipsAlgorithms.computeAllPostrequisites(
      blockId,
      this.postrequisites,
      this.transitivePostreqsCache
    )
  }

  /**
   * Checks if there is a path from one block to another.
   *
   * @param from - The starting block ID
   * @param to - The target block ID
   * @returns True if there is a directed path from 'from' to 'to'
   */
  hasPath(from: string, to: string): boolean {
    if (from === to) return true

    const allPostreqs = this.getAllPostrequisites(from)
    return allPostreqs.has(to)
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
    return HorizontalRelationshipsAlgorithms.detectCyclesInGraph(
      this.prerequisites,
      this.postrequisites,
      () => this.getAllBlocks()
    )
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
    return HorizontalRelationshipsAlgorithms.computeTopologicalOrder(
      this.prerequisites,
      this.postrequisites,
      () => this.getAllBlocks()
    )
  }

  /**
   * Gets all block IDs in this relationship graph.
   *
   * @returns A read-only set of all block IDs
   */
  getAllBlocks(): ReadonlySet<string> {
    return new Set(this.prerequisites.keys())
  }

  /**
   * Gets the total number of blocks in the graph.
   *
   * @returns The number of blocks
   */
  getBlockCount(): number {
    return this.prerequisites.size
  }

  /**
   * Gets the total number of prerequisite relationships.
   *
   * @returns The number of relationships (edges)
   */
  getRelationshipCount(): number {
    let count = 0
    for (const prereqs of this.prerequisites.values()) {
      count += prereqs.size
    }
    return count
  }

  /**
   * Clears all relationships and blocks from the graph.
   */
  clear(): void {
    this.prerequisites.clear()
    this.postrequisites.clear()
    this.clearCaches()
  }

  /**
   * Clears memoization caches.
   * Called automatically when the graph structure changes.
   */
  private clearCaches(): void {
    this.transitivePrereqsCache.clear()
    this.transitivePostreqsCache.clear()
  }

  /**
   * Returns a string representation of the relationship graph for debugging.
   *
   * @returns A human-readable string showing all relationships
   */
  toString(): string {
    const lines: string[] = []
    lines.push(
      `HorizontalRelationships (${this.getBlockCount()} blocks, ${this.getRelationshipCount()} relationships)`
    )

    for (const blockId of this.getAllBlocks()) {
      const prereqs = Array.from(this.getPrerequisites(blockId))
      const postreqs = Array.from(this.getPostrequisites(blockId))

      lines.push(`  ${blockId}:`)
      if (prereqs.length > 0) {
        lines.push(`    Prerequisites: [${prereqs.join(', ')}]`)
      }
      if (postreqs.length > 0) {
        lines.push(`    Post-requisites: [${postreqs.join(', ')}]`)
      }
    }

    return lines.join('\n')
  }
}
