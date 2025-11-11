import { describe, expect, it } from 'vitest';
import { GraphEngine } from './graph-engine.js';
import type { Block } from '../types/block.js';

describe('GraphEngine - Orientation', () => {
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
      prerequisites: ['1'],
      parents: [],
    },
  ];

  describe('TTB orientation (default)', () => {
    it('should use y-axis for level progression with downward direction', () => {
      const engine = new GraphEngine({ orientation: 'ttb' });
      const graph = engine.buildGraph(blocks);
      const positioned = engine.layoutGraph(graph);

      const block1 = positioned.find(pb => pb.block.id === '1');
      const block2 = positioned.find(pb => pb.block.id === '2');
      const block3 = positioned.find(pb => pb.block.id === '3');

      // Block 1 should be at level 0 (y = 0)
      expect(block1?.position.y).toBe(0);

      // Blocks 2 and 3 should be at level 1 (y > 0)
      expect(block2?.position.y).toBeGreaterThan(0);
      expect(block3?.position.y).toBeGreaterThan(0);
      expect(block2?.position.y).toBe(block3?.position.y); // Same level

      // Siblings should differ in x position
      expect(block2?.position.x).not.toBe(block3?.position.x);
    });

    it('should apply horizontal spacing for siblings', () => {
      const engine = new GraphEngine({
        orientation: 'ttb',
        horizontalSpacing: 100,
        nodeWidth: 200,
      });
      const graph = engine.buildGraph(blocks);
      const positioned = engine.layoutGraph(graph);

      const block2 = positioned.find(pb => pb.block.id === '2');
      const block3 = positioned.find(pb => pb.block.id === '3');

      // Siblings should be separated by nodeWidth + horizontalSpacing
      const expectedSpacing = 300; // 200 + 100
      expect(Math.abs(block2!.position.x - block3!.position.x)).toBe(expectedSpacing);
    });
  });

  describe('BTT orientation', () => {
    it('should use y-axis for level progression with upward direction', () => {
      const engine = new GraphEngine({ orientation: 'btt' });
      const graph = engine.buildGraph(blocks);
      const positioned = engine.layoutGraph(graph);

      const block1 = positioned.find(pb => pb.block.id === '1');
      const block2 = positioned.find(pb => pb.block.id === '2');
      const block3 = positioned.find(pb => pb.block.id === '3');

      // BTT: parent should be at higher y than children
      expect(block1!.position.y).toBeGreaterThan(block2!.position.y);
      expect(block1!.position.y).toBeGreaterThan(block3!.position.y);

      // Siblings should be at same level
      expect(block2?.position.y).toBe(block3?.position.y);
    });
  });

  describe('LTR orientation', () => {
    it('should use x-axis for level progression with rightward direction', () => {
      const engine = new GraphEngine({ orientation: 'ltr' });
      const graph = engine.buildGraph(blocks);
      const positioned = engine.layoutGraph(graph);

      const block1 = positioned.find(pb => pb.block.id === '1');
      const block2 = positioned.find(pb => pb.block.id === '2');
      const block3 = positioned.find(pb => pb.block.id === '3');

      // Block 1 should be at level 0 (x = 0)
      expect(block1?.position.x).toBe(0);

      // Blocks 2 and 3 should be at level 1 (x > 0)
      expect(block2?.position.x).toBeGreaterThan(0);
      expect(block3?.position.x).toBeGreaterThan(0);
      expect(block2?.position.x).toBe(block3?.position.x); // Same level

      // Siblings should differ in y position
      expect(block2?.position.y).not.toBe(block3?.position.y);
    });

    it('should apply vertical spacing for siblings', () => {
      const engine = new GraphEngine({
        orientation: 'ltr',
        verticalSpacing: 120,
        nodeHeight: 80,
      });
      const graph = engine.buildGraph(blocks);
      const positioned = engine.layoutGraph(graph);

      const block2 = positioned.find(pb => pb.block.id === '2');
      const block3 = positioned.find(pb => pb.block.id === '3');

      // Siblings should be separated by nodeHeight + verticalSpacing
      const expectedSpacing = 200; // 80 + 120
      expect(Math.abs(block2!.position.y - block3!.position.y)).toBe(expectedSpacing);
    });
  });

  describe('RTL orientation', () => {
    it('should use x-axis for level progression with leftward direction', () => {
      const engine = new GraphEngine({ orientation: 'rtl' });
      const graph = engine.buildGraph(blocks);
      const positioned = engine.layoutGraph(graph);

      const block1 = positioned.find(pb => pb.block.id === '1');
      const block2 = positioned.find(pb => pb.block.id === '2');
      const block3 = positioned.find(pb => pb.block.id === '3');

      // RTL: parent should be at higher x than children
      expect(block1!.position.x).toBeGreaterThan(block2!.position.x);
      expect(block1!.position.x).toBeGreaterThan(block3!.position.x);

      // Siblings should be at same level
      expect(block2?.position.x).toBe(block3?.position.x);
    });
  });

  describe('Default behavior', () => {
    it('should default to TTB when orientation is not specified', () => {
      const engine = new GraphEngine(); // No orientation specified
      const graph = engine.buildGraph(blocks);
      const positioned = engine.layoutGraph(graph);

      const block1 = positioned.find(pb => pb.block.id === '1');
      const block2 = positioned.find(pb => pb.block.id === '2');

      // Should behave like TTB
      expect(block1?.position.y).toBe(0);
      expect(block2?.position.y).toBeGreaterThan(0);
    });
  });

  describe('Spacing consistency', () => {
    it('should maintain consistent spacing ratios across orientations', () => {
      const config = {
        nodeWidth: 200,
        nodeHeight: 80,
        horizontalSpacing: 100,
        verticalSpacing: 120,
      };

      const ttbEngine = new GraphEngine({ ...config, orientation: 'ttb' });
      const ltrEngine = new GraphEngine({ ...config, orientation: 'ltr' });

      const graph = ttbEngine.buildGraph(blocks);
      const ttbPositioned = ttbEngine.layoutGraph(graph);
      const ltrPositioned = ltrEngine.layoutGraph(graph);

      const ttbBlock2 = ttbPositioned.find(pb => pb.block.id === '2');
      const ttbBlock3 = ttbPositioned.find(pb => pb.block.id === '3');
      const ltrBlock2 = ltrPositioned.find(pb => pb.block.id === '2');
      const ltrBlock3 = ltrPositioned.find(pb => pb.block.id === '3');

      // TTB sibling spacing (horizontal)
      const ttbSpacing = Math.abs(ttbBlock2!.position.x - ttbBlock3!.position.x);
      expect(ttbSpacing).toBe(300); // nodeWidth + horizontalSpacing

      // LTR sibling spacing (vertical)
      const ltrSpacing = Math.abs(ltrBlock2!.position.y - ltrBlock3!.position.y);
      expect(ltrSpacing).toBe(200); // nodeHeight + verticalSpacing
    });
  });
});
