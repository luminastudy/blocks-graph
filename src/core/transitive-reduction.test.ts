import { describe, it, expect } from 'vitest'
import { removeTransitiveEdges } from './transitive-reduction.js'
import type { GraphEdge } from '../types/graph-edge.js'

describe('removeTransitiveEdges', () => {
  it('should remove simple transitive edge A→B→C with A→C', () => {
    const edges: GraphEdge[] = [
      { from: 'A', to: 'B', type: 'prerequisite' },
      { from: 'B', to: 'C', type: 'prerequisite' },
      { from: 'A', to: 'C', type: 'prerequisite' }, // Transitive
    ]

    const result = removeTransitiveEdges(edges)

    expect(result).toHaveLength(2)
    expect(result).toContainEqual({ from: 'A', to: 'B', type: 'prerequisite' })
    expect(result).toContainEqual({ from: 'B', to: 'C', type: 'prerequisite' })
    expect(result).not.toContainEqual({
      from: 'A',
      to: 'C',
      type: 'prerequisite',
    })
  })

  it('should remove transitive edge with longer path A→B→C→D with A→D', () => {
    const edges: GraphEdge[] = [
      { from: 'A', to: 'B', type: 'prerequisite' },
      { from: 'B', to: 'C', type: 'prerequisite' },
      { from: 'C', to: 'D', type: 'prerequisite' },
      { from: 'A', to: 'D', type: 'prerequisite' }, // Transitive
    ]

    const result = removeTransitiveEdges(edges)

    expect(result).toHaveLength(3)
    expect(result).toContainEqual({ from: 'A', to: 'B', type: 'prerequisite' })
    expect(result).toContainEqual({ from: 'B', to: 'C', type: 'prerequisite' })
    expect(result).toContainEqual({ from: 'C', to: 'D', type: 'prerequisite' })
    expect(result).not.toContainEqual({
      from: 'A',
      to: 'D',
      type: 'prerequisite',
    })
  })

  it('should handle multiple transitive edges', () => {
    const edges: GraphEdge[] = [
      { from: 'A', to: 'B', type: 'prerequisite' },
      { from: 'B', to: 'C', type: 'prerequisite' },
      { from: 'C', to: 'D', type: 'prerequisite' },
      { from: 'A', to: 'C', type: 'prerequisite' }, // Transitive
      { from: 'A', to: 'D', type: 'prerequisite' }, // Transitive
      { from: 'B', to: 'D', type: 'prerequisite' }, // Transitive
    ]

    const result = removeTransitiveEdges(edges)

    expect(result).toHaveLength(3)
    expect(result).toContainEqual({ from: 'A', to: 'B', type: 'prerequisite' })
    expect(result).toContainEqual({ from: 'B', to: 'C', type: 'prerequisite' })
    expect(result).toContainEqual({ from: 'C', to: 'D', type: 'prerequisite' })
  })

  it('should preserve non-transitive edges in diamond structure', () => {
    // Diamond: A→B, A→C, B→D, C→D
    // A→D would be transitive, but A→B and A→C are both necessary
    const edges: GraphEdge[] = [
      { from: 'A', to: 'B', type: 'prerequisite' },
      { from: 'A', to: 'C', type: 'prerequisite' },
      { from: 'B', to: 'D', type: 'prerequisite' },
      { from: 'C', to: 'D', type: 'prerequisite' },
      { from: 'A', to: 'D', type: 'prerequisite' }, // Transitive (via both B and C)
    ]

    const result = removeTransitiveEdges(edges)

    expect(result).toHaveLength(4)
    expect(result).toContainEqual({ from: 'A', to: 'B', type: 'prerequisite' })
    expect(result).toContainEqual({ from: 'A', to: 'C', type: 'prerequisite' })
    expect(result).toContainEqual({ from: 'B', to: 'D', type: 'prerequisite' })
    expect(result).toContainEqual({ from: 'C', to: 'D', type: 'prerequisite' })
    expect(result).not.toContainEqual({
      from: 'A',
      to: 'D',
      type: 'prerequisite',
    })
  })

  it('should handle complex graph with multiple paths', () => {
    // A→B→D and A→C→D, plus A→D (transitive)
    const edges: GraphEdge[] = [
      { from: 'A', to: 'B', type: 'prerequisite' },
      { from: 'A', to: 'C', type: 'prerequisite' },
      { from: 'B', to: 'D', type: 'prerequisite' },
      { from: 'C', to: 'D', type: 'prerequisite' },
      { from: 'D', to: 'E', type: 'prerequisite' },
      { from: 'A', to: 'D', type: 'prerequisite' }, // Transitive
      { from: 'B', to: 'E', type: 'prerequisite' }, // Transitive (B→D→E)
    ]

    const result = removeTransitiveEdges(edges)

    expect(result).toHaveLength(5)
    expect(result).not.toContainEqual({
      from: 'A',
      to: 'D',
      type: 'prerequisite',
    })
    expect(result).not.toContainEqual({
      from: 'B',
      to: 'E',
      type: 'prerequisite',
    })
  })

  it('should preserve all edges when no transitive edges exist', () => {
    const edges: GraphEdge[] = [
      { from: 'A', to: 'B', type: 'prerequisite' },
      { from: 'C', to: 'D', type: 'prerequisite' },
      { from: 'E', to: 'F', type: 'prerequisite' },
    ]

    const result = removeTransitiveEdges(edges)

    expect(result).toHaveLength(3)
    expect(result).toEqual(edges)
  })

  it('should handle graph with only direct edges', () => {
    const edges: GraphEdge[] = [
      { from: 'A', to: 'B', type: 'prerequisite' },
      { from: 'A', to: 'C', type: 'prerequisite' },
      { from: 'A', to: 'D', type: 'prerequisite' },
    ]

    const result = removeTransitiveEdges(edges)

    expect(result).toHaveLength(3)
    expect(result).toEqual(edges)
  })

  it('should handle empty edge list', () => {
    const edges: GraphEdge[] = []
    const result = removeTransitiveEdges(edges)
    expect(result).toHaveLength(0)
  })

  it('should preserve parent edges unchanged', () => {
    const edges: GraphEdge[] = [
      { from: 'A', to: 'B', type: 'prerequisite' },
      { from: 'B', to: 'C', type: 'prerequisite' },
      { from: 'A', to: 'C', type: 'prerequisite' }, // Transitive prerequisite
      { from: 'A', to: 'B', type: 'parent' },
      { from: 'B', to: 'C', type: 'parent' },
      { from: 'A', to: 'C', type: 'parent' }, // Parent edge (preserved)
    ]

    const result = removeTransitiveEdges(edges)

    // Should have 2 prerequisite edges (A→B, B→C) + 3 parent edges
    expect(result).toHaveLength(5)

    // All parent edges should be preserved
    expect(result).toContainEqual({ from: 'A', to: 'B', type: 'parent' })
    expect(result).toContainEqual({ from: 'B', to: 'C', type: 'parent' })
    expect(result).toContainEqual({ from: 'A', to: 'C', type: 'parent' })

    // Transitive prerequisite should be removed
    expect(result).not.toContainEqual({
      from: 'A',
      to: 'C',
      type: 'prerequisite',
    })
  })

  it('should handle self-loops correctly', () => {
    // Self-loop A→A with A→B creates an indirect path A→A→B
    // This makes A→B transitive (can reach B via the self-loop)
    const edges: GraphEdge[] = [
      { from: 'A', to: 'A', type: 'prerequisite' },
      { from: 'A', to: 'B', type: 'prerequisite' },
    ]

    const result = removeTransitiveEdges(edges)

    // A→B is transitive via A→A→B, so only A→A remains
    expect(result).toHaveLength(1)
    expect(result).toContainEqual({ from: 'A', to: 'A', type: 'prerequisite' })
  })

  it('should handle cyclic graphs gracefully', () => {
    // A→B→C→A cycle with A→C shortcut
    const edges: GraphEdge[] = [
      { from: 'A', to: 'B', type: 'prerequisite' },
      { from: 'B', to: 'C', type: 'prerequisite' },
      { from: 'C', to: 'A', type: 'prerequisite' },
      { from: 'A', to: 'C', type: 'prerequisite' }, // Transitive (A→B→C)
    ]

    const result = removeTransitiveEdges(edges)

    // In a cycle, the algorithm identifies transitive edges:
    // - A→B is transitive because A→C→A→B exists (via the cycle)
    // - A→C is transitive because A→B→C exists
    // Result: B→C and C→A remain (breaks the cycle at A→B)
    expect(result).toHaveLength(2)
    expect(result).toContainEqual({ from: 'B', to: 'C', type: 'prerequisite' })
    expect(result).toContainEqual({ from: 'C', to: 'A', type: 'prerequisite' })
  })
})
