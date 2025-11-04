import { describe, expect, it } from 'vitest';
import { GraphEngine } from './graph-engine.js';
import type { Block } from '../types/block.js';

describe('GraphEngine', () => {
  const engine = new GraphEngine();

  describe('buildGraph', () => {
    it('should build a graph from blocks', () => {
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
      ];

      const graph = engine.buildGraph(blocks);

      expect(graph.blocks.size).toBe(2);
      expect(graph.blocks.get('1')).toBeDefined();
      expect(graph.blocks.get('2')).toBeDefined();
      expect(graph.edges).toHaveLength(1);
      expect(graph.edges[0]).toEqual({
        from: '1',
        to: '2',
        type: 'prerequisite',
      });
    });

    it('should create parent edges', () => {
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
          prerequisites: [],
          parents: ['1'],
        },
      ];

      const graph = engine.buildGraph(blocks);

      expect(graph.edges).toHaveLength(1);
      expect(graph.edges[0]).toEqual({
        from: '1',
        to: '2',
        type: 'parent',
      });
    });

    it('should create both prerequisite and parent edges', () => {
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
          parents: ['1'],
        },
      ];

      const graph = engine.buildGraph(blocks);

      expect(graph.edges).toHaveLength(2);
      expect(graph.edges.filter(e => e.type === 'prerequisite')).toHaveLength(1);
      expect(graph.edges.filter(e => e.type === 'parent')).toHaveLength(1);
    });

    it('should handle empty blocks array', () => {
      const graph = engine.buildGraph([]);

      expect(graph.blocks.size).toBe(0);
      expect(graph.edges).toHaveLength(0);
    });
  });

  describe('layoutGraph', () => {
    it('should calculate positions for blocks', () => {
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
      ];

      const graph = engine.buildGraph(blocks);
      const positioned = engine.layoutGraph(graph);

      expect(positioned).toHaveLength(2);

      for (const item of positioned) {
        expect(item.position.x).toBeGreaterThanOrEqual(0);
        expect(item.position.y).toBeGreaterThanOrEqual(0);
        expect(item.position.width).toBeGreaterThan(0);
        expect(item.position.height).toBeGreaterThan(0);
      }
    });

    it('should place child blocks at higher y positions', () => {
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
      ];

      const graph = engine.buildGraph(blocks);
      const positioned = engine.layoutGraph(graph);

      const block1Pos = positioned.find(p => p.block.id === '1')?.position;
      const block2Pos = positioned.find(p => p.block.id === '2')?.position;

      expect(block1Pos).toBeDefined();
      expect(block2Pos).toBeDefined();
      expect(block2Pos!.y).toBeGreaterThan(block1Pos!.y);
    });
  });

  describe('process', () => {
    it('should process blocks end-to-end', () => {
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
      ];

      const result = engine.process(blocks);

      expect(result.graph.blocks.size).toBe(2);
      expect(result.positioned).toHaveLength(2);
    });
  });

  describe('custom layout config', () => {
    it('should use custom node dimensions', () => {
      const customEngine = new GraphEngine({
        nodeWidth: 300,
        nodeHeight: 100,
      });

      const blocks: Block[] = [
        {
          id: '1',
          title: { he: 'א', en: 'A' },
          prerequisites: [],
          parents: [],
        },
      ];

      const { positioned } = customEngine.process(blocks);

      expect(positioned[0]?.position.width).toBe(300);
      expect(positioned[0]?.position.height).toBe(100);
    });
  });
});
