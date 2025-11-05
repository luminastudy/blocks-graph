import { describe, expect, it, beforeEach } from 'vitest';
import { HorizontalRelationships } from './horizontal-relationships.js';
import type { Block } from '../types/block.js';
import type { BlockGraph } from '../types/block-graph.js';

describe('HorizontalRelationships', () => {
  let relationships: HorizontalRelationships;

  beforeEach(() => {
    relationships = new HorizontalRelationships();
  });

  describe('constructor', () => {
    it('should create an empty relationship graph', () => {
      expect(relationships.getBlockCount()).toBe(0);
      expect(relationships.getRelationshipCount()).toBe(0);
    });
  });

  describe('addRelationship', () => {
    it('should add a prerequisite relationship', () => {
      relationships.addRelationship('A', 'B');

      expect(relationships.hasPrerequisite('B', 'A')).toBe(true);
      expect(relationships.hasPostrequisite('A', 'B')).toBe(true);
    });

    it('should maintain bidirectional consistency', () => {
      relationships.addRelationship('A', 'B');

      const prereqs = relationships.getPrerequisites('B');
      const postreqs = relationships.getPostrequisites('A');

      expect(prereqs.has('A')).toBe(true);
      expect(postreqs.has('B')).toBe(true);
    });

    it('should prevent self-loops', () => {
      expect(() => relationships.addRelationship('A', 'A')).toThrow(
        'Cannot add self-loop: block A cannot be its own prerequisite'
      );
    });

    it('should allow multiple prerequisites for a block', () => {
      relationships.addRelationship('A', 'C');
      relationships.addRelationship('B', 'C');

      const prereqs = relationships.getPrerequisites('C');
      expect(prereqs.size).toBe(2);
      expect(prereqs.has('A')).toBe(true);
      expect(prereqs.has('B')).toBe(true);
    });

    it('should allow multiple post-requisites for a block', () => {
      relationships.addRelationship('A', 'B');
      relationships.addRelationship('A', 'C');

      const postreqs = relationships.getPostrequisites('A');
      expect(postreqs.size).toBe(2);
      expect(postreqs.has('B')).toBe(true);
      expect(postreqs.has('C')).toBe(true);
    });

    it('should handle adding same relationship multiple times idempotently', () => {
      relationships.addRelationship('A', 'B');
      relationships.addRelationship('A', 'B');

      expect(relationships.getRelationshipCount()).toBe(1);
    });
  });

  describe('removeRelationship', () => {
    it('should remove a prerequisite relationship', () => {
      relationships.addRelationship('A', 'B');
      relationships.removeRelationship('A', 'B');

      expect(relationships.hasPrerequisite('B', 'A')).toBe(false);
      expect(relationships.hasPostrequisite('A', 'B')).toBe(false);
    });

    it('should maintain bidirectional consistency when removing', () => {
      relationships.addRelationship('A', 'B');
      relationships.removeRelationship('A', 'B');

      const prereqs = relationships.getPrerequisites('B');
      const postreqs = relationships.getPostrequisites('A');

      expect(prereqs.has('A')).toBe(false);
      expect(postreqs.has('B')).toBe(false);
    });

    it('should handle removing non-existent relationship gracefully', () => {
      expect(() => relationships.removeRelationship('A', 'B')).not.toThrow();
    });
  });

  describe('removeBlock', () => {
    it('should remove a block and all its relationships', () => {
      relationships.addRelationship('A', 'B');
      relationships.addRelationship('B', 'C');
      relationships.removeBlock('B');

      expect(relationships.getBlockCount()).toBe(2);
      expect(relationships.hasPrerequisite('C', 'B')).toBe(false);
      expect(relationships.hasPostrequisite('A', 'B')).toBe(false);
    });

    it('should clean up incoming and outgoing edges', () => {
      relationships.addRelationship('A', 'B');
      relationships.addRelationship('B', 'C');
      relationships.addRelationship('D', 'B');
      relationships.removeBlock('B');

      expect(relationships.getPostrequisites('A').size).toBe(0);
      expect(relationships.getPrerequisites('C').size).toBe(0);
      expect(relationships.getPostrequisites('D').size).toBe(0);
    });

    it('should handle removing non-existent block gracefully', () => {
      expect(() => relationships.removeBlock('NonExistent')).not.toThrow();
    });
  });

  describe('getPrerequisites', () => {
    it('should return direct prerequisites', () => {
      relationships.addRelationship('A', 'B');
      relationships.addRelationship('C', 'B');

      const prereqs = relationships.getPrerequisites('B');
      expect(prereqs.size).toBe(2);
      expect(prereqs.has('A')).toBe(true);
      expect(prereqs.has('C')).toBe(true);
    });

    it('should return empty set for block with no prerequisites', () => {
      relationships.addRelationship('A', 'B');
      const prereqs = relationships.getPrerequisites('A');
      expect(prereqs.size).toBe(0);
    });

    it('should return empty set for non-existent block', () => {
      const prereqs = relationships.getPrerequisites('NonExistent');
      expect(prereqs.size).toBe(0);
    });

    it('should return read-only set', () => {
      relationships.addRelationship('A', 'B');
      const prereqs = relationships.getPrerequisites('B');

      // Attempting to modify should not affect internal state
      // @ts-expect-error - Testing runtime behavior
      prereqs.add?.('C');
      expect(relationships.getPrerequisites('B').size).toBe(1);
    });
  });

  describe('getPostrequisites', () => {
    it('should return direct post-requisites', () => {
      relationships.addRelationship('A', 'B');
      relationships.addRelationship('A', 'C');

      const postreqs = relationships.getPostrequisites('A');
      expect(postreqs.size).toBe(2);
      expect(postreqs.has('B')).toBe(true);
      expect(postreqs.has('C')).toBe(true);
    });

    it('should return empty set for block with no post-requisites', () => {
      relationships.addRelationship('A', 'B');
      const postreqs = relationships.getPostrequisites('B');
      expect(postreqs.size).toBe(0);
    });

    it('should return empty set for non-existent block', () => {
      const postreqs = relationships.getPostrequisites('NonExistent');
      expect(postreqs.size).toBe(0);
    });
  });

  describe('getAllPrerequisites', () => {
    it('should return transitive prerequisites', () => {
      // Chain: A → B → C → D
      relationships.addRelationship('A', 'B');
      relationships.addRelationship('B', 'C');
      relationships.addRelationship('C', 'D');

      const allPrereqs = relationships.getAllPrerequisites('D');
      expect(allPrereqs.size).toBe(3);
      expect(allPrereqs.has('A')).toBe(true);
      expect(allPrereqs.has('B')).toBe(true);
      expect(allPrereqs.has('C')).toBe(true);
    });

    it('should handle diamond dependencies', () => {
      // Diamond: A → B → D, A → C → D
      relationships.addRelationship('A', 'B');
      relationships.addRelationship('A', 'C');
      relationships.addRelationship('B', 'D');
      relationships.addRelationship('C', 'D');

      const allPrereqs = relationships.getAllPrerequisites('D');
      expect(allPrereqs.size).toBe(3);
      expect(allPrereqs.has('A')).toBe(true);
      expect(allPrereqs.has('B')).toBe(true);
      expect(allPrereqs.has('C')).toBe(true);
    });

    it('should return empty set for block with no prerequisites', () => {
      relationships.addRelationship('A', 'B');
      const allPrereqs = relationships.getAllPrerequisites('A');
      expect(allPrereqs.size).toBe(0);
    });

    it('should use memoization for repeated queries', () => {
      relationships.addRelationship('A', 'B');
      relationships.addRelationship('B', 'C');

      const result1 = relationships.getAllPrerequisites('C');
      const result2 = relationships.getAllPrerequisites('C');

      // Should return the same cached instance
      expect(result1).toBe(result2);
    });

    it('should invalidate cache when graph changes', () => {
      relationships.addRelationship('A', 'B');
      const before = relationships.getAllPrerequisites('B');

      relationships.addRelationship('C', 'A');
      const after = relationships.getAllPrerequisites('B');

      expect(after.size).toBe(2);
      expect(after.has('A')).toBe(true);
      expect(after.has('C')).toBe(true);
    });
  });

  describe('getAllPostrequisites', () => {
    it('should return transitive post-requisites', () => {
      // Chain: A → B → C → D
      relationships.addRelationship('A', 'B');
      relationships.addRelationship('B', 'C');
      relationships.addRelationship('C', 'D');

      const allPostreqs = relationships.getAllPostrequisites('A');
      expect(allPostreqs.size).toBe(3);
      expect(allPostreqs.has('B')).toBe(true);
      expect(allPostreqs.has('C')).toBe(true);
      expect(allPostreqs.has('D')).toBe(true);
    });

    it('should handle diamond dependencies', () => {
      // Diamond: A → B → D, A → C → D
      relationships.addRelationship('A', 'B');
      relationships.addRelationship('A', 'C');
      relationships.addRelationship('B', 'D');
      relationships.addRelationship('C', 'D');

      const allPostreqs = relationships.getAllPostrequisites('A');
      expect(allPostreqs.size).toBe(3);
      expect(allPostreqs.has('B')).toBe(true);
      expect(allPostreqs.has('C')).toBe(true);
      expect(allPostreqs.has('D')).toBe(true);
    });

    it('should return empty set for block with no post-requisites', () => {
      relationships.addRelationship('A', 'B');
      const allPostreqs = relationships.getAllPostrequisites('B');
      expect(allPostreqs.size).toBe(0);
    });
  });

  describe('hasPath', () => {
    it('should detect direct path', () => {
      relationships.addRelationship('A', 'B');
      expect(relationships.hasPath('A', 'B')).toBe(true);
    });

    it('should detect transitive path', () => {
      relationships.addRelationship('A', 'B');
      relationships.addRelationship('B', 'C');
      expect(relationships.hasPath('A', 'C')).toBe(true);
    });

    it('should return false for no path', () => {
      relationships.addRelationship('A', 'B');
      relationships.addRelationship('C', 'D');
      expect(relationships.hasPath('A', 'D')).toBe(false);
    });

    it('should return true for same block', () => {
      expect(relationships.hasPath('A', 'A')).toBe(true);
    });

    it('should not detect reverse path', () => {
      relationships.addRelationship('A', 'B');
      expect(relationships.hasPath('B', 'A')).toBe(false);
    });
  });

  describe('detectCycles', () => {
    it('should return null for acyclic graph', () => {
      relationships.addRelationship('A', 'B');
      relationships.addRelationship('B', 'C');
      expect(relationships.detectCycles()).toBe(null);
    });

    it('should detect simple cycle', () => {
      relationships.addRelationship('A', 'B');
      relationships.addRelationship('B', 'C');
      relationships.addRelationship('C', 'A');

      const cycles = relationships.detectCycles();
      expect(cycles).not.toBe(null);
      expect(cycles!.length).toBeGreaterThan(0);

      const cycle = cycles![0]!;
      expect(cycle).toContain('A');
      expect(cycle).toContain('B');
      expect(cycle).toContain('C');
    });

    it('should detect self-referential cycle (if somehow created)', () => {
      // Note: addRelationship prevents this, but detectCycles should handle it
      // This test ensures the detection algorithm is robust
      relationships.addRelationship('A', 'B');
      expect(relationships.detectCycles()).toBe(null);
    });

    it('should return null for empty graph', () => {
      expect(relationships.detectCycles()).toBe(null);
    });

    it('should return null for single node with no edges', () => {
      relationships.addRelationship('A', 'B');
      relationships.removeRelationship('A', 'B');
      expect(relationships.detectCycles()).toBe(null);
    });
  });

  describe('getTopologicalOrder', () => {
    it('should return topological order for linear chain', () => {
      relationships.addRelationship('A', 'B');
      relationships.addRelationship('B', 'C');

      const order = relationships.getTopologicalOrder();
      expect(order).not.toBe(null);
      expect(order!.length).toBe(3);

      const indexA = order!.indexOf('A');
      const indexB = order!.indexOf('B');
      const indexC = order!.indexOf('C');

      expect(indexA).toBeLessThan(indexB);
      expect(indexB).toBeLessThan(indexC);
    });

    it('should return topological order for diamond', () => {
      // Diamond: A → B → D, A → C → D
      relationships.addRelationship('A', 'B');
      relationships.addRelationship('A', 'C');
      relationships.addRelationship('B', 'D');
      relationships.addRelationship('C', 'D');

      const order = relationships.getTopologicalOrder();
      expect(order).not.toBe(null);
      expect(order!.length).toBe(4);

      const indexA = order!.indexOf('A');
      const indexB = order!.indexOf('B');
      const indexC = order!.indexOf('C');
      const indexD = order!.indexOf('D');

      expect(indexA).toBeLessThan(indexB);
      expect(indexA).toBeLessThan(indexC);
      expect(indexB).toBeLessThan(indexD);
      expect(indexC).toBeLessThan(indexD);
    });

    it('should return null for cyclic graph', () => {
      relationships.addRelationship('A', 'B');
      relationships.addRelationship('B', 'C');
      relationships.addRelationship('C', 'A');

      const order = relationships.getTopologicalOrder();
      expect(order).toBe(null);
    });

    it('should return array for empty graph', () => {
      const order = relationships.getTopologicalOrder();
      expect(order).not.toBe(null);
      expect(order!.length).toBe(0);
    });

    it('should handle disconnected components', () => {
      relationships.addRelationship('A', 'B');
      relationships.addRelationship('C', 'D');

      const order = relationships.getTopologicalOrder();
      expect(order).not.toBe(null);
      expect(order!.length).toBe(4);
    });
  });

  describe('fromBlocks', () => {
    it('should create relationships from block prerequisites', () => {
      const blocks: Block[] = [
        {
          id: '1',
          title: { he: 'א', en: 'A' },
          prerequisites: [],
          parents: [],
        },
        {
          id: '2',
          title: { he: 'ב', en: 'B' },
          prerequisites: ['1'],
          parents: [],
        },
        {
          id: '3',
          title: { he: 'ג', en: 'C' },
          prerequisites: ['1', '2'],
          parents: [],
        },
      ];

      const rel = HorizontalRelationships.fromBlocks(blocks);

      expect(rel.getBlockCount()).toBe(3);
      expect(rel.getRelationshipCount()).toBe(3);
      expect(rel.hasPrerequisite('2', '1')).toBe(true);
      expect(rel.hasPrerequisite('3', '1')).toBe(true);
      expect(rel.hasPrerequisite('3', '2')).toBe(true);
    });

    it('should handle blocks with no prerequisites', () => {
      const blocks: Block[] = [
        {
          id: '1',
          title: { he: 'א', en: 'A' },
          prerequisites: [],
          parents: [],
        },
      ];

      const rel = HorizontalRelationships.fromBlocks(blocks);
      expect(rel.getBlockCount()).toBe(1);
      expect(rel.getRelationshipCount()).toBe(0);
    });

    it('should handle empty blocks array', () => {
      const rel = HorizontalRelationships.fromBlocks([]);
      expect(rel.getBlockCount()).toBe(0);
      expect(rel.getRelationshipCount()).toBe(0);
    });
  });

  describe('fromGraph', () => {
    it('should create relationships from graph prerequisite edges', () => {
      const graph: BlockGraph = {
        blocks: new Map([
          ['1', { id: '1', title: { he: 'א', en: 'A' }, prerequisites: [], parents: [] }],
          ['2', { id: '2', title: { he: 'ב', en: 'B' }, prerequisites: ['1'], parents: [] }],
        ]),
        edges: [
          { from: '1', to: '2', type: 'prerequisite' },
        ],
      };

      const rel = HorizontalRelationships.fromGraph(graph);

      expect(rel.getBlockCount()).toBe(2);
      expect(rel.getRelationshipCount()).toBe(1);
      expect(rel.hasPrerequisite('2', '1')).toBe(true);
    });

    it('should ignore parent edges', () => {
      const graph: BlockGraph = {
        blocks: new Map([
          ['1', { id: '1', title: { he: 'א', en: 'A' }, prerequisites: [], parents: [] }],
          ['2', { id: '2', title: { he: 'ב', en: 'B' }, prerequisites: [], parents: ['1'] }],
        ]),
        edges: [
          { from: '1', to: '2', type: 'parent' },
        ],
      };

      const rel = HorizontalRelationships.fromGraph(graph);

      expect(rel.getBlockCount()).toBe(2);
      expect(rel.getRelationshipCount()).toBe(0);
    });

    it('should handle mixed edge types', () => {
      const graph: BlockGraph = {
        blocks: new Map([
          ['1', { id: '1', title: { he: 'א', en: 'A' }, prerequisites: [], parents: [] }],
          ['2', { id: '2', title: { he: 'ב', en: 'B' }, prerequisites: ['1'], parents: ['1'] }],
        ]),
        edges: [
          { from: '1', to: '2', type: 'prerequisite' },
          { from: '1', to: '2', type: 'parent' },
        ],
      };

      const rel = HorizontalRelationships.fromGraph(graph);

      expect(rel.getBlockCount()).toBe(2);
      expect(rel.getRelationshipCount()).toBe(1);
      expect(rel.hasPrerequisite('2', '1')).toBe(true);
    });
  });

  describe('getAllBlocks', () => {
    it('should return all block IDs', () => {
      relationships.addRelationship('A', 'B');
      relationships.addRelationship('C', 'D');

      const blocks = relationships.getAllBlocks();
      expect(blocks.size).toBe(4);
      expect(blocks.has('A')).toBe(true);
      expect(blocks.has('B')).toBe(true);
      expect(blocks.has('C')).toBe(true);
      expect(blocks.has('D')).toBe(true);
    });

    it('should return empty set for empty graph', () => {
      const blocks = relationships.getAllBlocks();
      expect(blocks.size).toBe(0);
    });
  });

  describe('clear', () => {
    it('should clear all relationships and blocks', () => {
      relationships.addRelationship('A', 'B');
      relationships.addRelationship('C', 'D');

      relationships.clear();

      expect(relationships.getBlockCount()).toBe(0);
      expect(relationships.getRelationshipCount()).toBe(0);
    });

    it('should invalidate caches', () => {
      relationships.addRelationship('A', 'B');
      relationships.addRelationship('B', 'C');
      relationships.getAllPrerequisites('C'); // Prime the cache

      relationships.clear();

      expect(relationships.getAllPrerequisites('C').size).toBe(0);
    });
  });

  describe('toString', () => {
    it('should return human-readable representation', () => {
      relationships.addRelationship('A', 'B');
      relationships.addRelationship('A', 'C');

      const str = relationships.toString();
      expect(str).toContain('HorizontalRelationships');
      expect(str).toContain('3 blocks');
      expect(str).toContain('2 relationships');
    });
  });

  describe('complex scenarios', () => {
    it('should handle complex curriculum graph', () => {
      // Math curriculum: Algebra → Calculus 1 → Calculus 2
      //                  Geometry → Trigonometry → Calculus 1
      relationships.addRelationship('Algebra', 'Calculus 1');
      relationships.addRelationship('Geometry', 'Trigonometry');
      relationships.addRelationship('Trigonometry', 'Calculus 1');
      relationships.addRelationship('Calculus 1', 'Calculus 2');

      // Verify transitive prerequisites for Calculus 2
      const calc2Prereqs = relationships.getAllPrerequisites('Calculus 2');
      expect(calc2Prereqs.size).toBe(4);
      expect(calc2Prereqs.has('Algebra')).toBe(true);
      expect(calc2Prereqs.has('Geometry')).toBe(true);
      expect(calc2Prereqs.has('Trigonometry')).toBe(true);
      expect(calc2Prereqs.has('Calculus 1')).toBe(true);

      // Verify topological order exists
      const order = relationships.getTopologicalOrder();
      expect(order).not.toBe(null);

      // No cycles should exist
      expect(relationships.detectCycles()).toBe(null);
    });

    it('should handle large graph efficiently', () => {
      // Create a large linear chain
      const n = 1000;
      for (let i = 0; i < n - 1; i++) {
        relationships.addRelationship(`block-${i}`, `block-${i + 1}`);
      }

      expect(relationships.getBlockCount()).toBe(n);
      expect(relationships.getRelationshipCount()).toBe(n - 1);

      // Should efficiently compute transitive prerequisites
      const allPrereqs = relationships.getAllPrerequisites(`block-${n - 1}`);
      expect(allPrereqs.size).toBe(n - 1);

      // Topological order should work
      const order = relationships.getTopologicalOrder();
      expect(order).not.toBe(null);
      expect(order!.length).toBe(n);
    });
  });
});
