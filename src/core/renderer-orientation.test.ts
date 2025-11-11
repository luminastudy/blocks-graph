import { describe, expect, it, beforeEach } from 'vitest';
import { GraphEngine } from './graph-engine.js';
import { GraphRenderer } from './renderer.js';
import type { Block } from '../types/block.js';
import { JSDOM } from 'jsdom';

describe('GraphRenderer - Orientation', () => {
  let dom: JSDOM;

  beforeEach(() => {
    dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    global.document = dom.window.document as unknown as Document;
  });

  const blocks: Block[] = [
    {
      id: '1',
      title: { he: 'א', en: 'Parent' },
      prerequisites: [],
      parents: [],
    },
    {
      id: '2',
      title: { he: 'ב', en: 'Child' },
      prerequisites: ['1'],
      parents: [],
    },
  ];

  describe('TTB orientation', () => {
    it('should connect from parent bottom-center to child top-center', () => {
      const engine = new GraphEngine({ orientation: 'ttb' });
      const renderer = new GraphRenderer({ orientation: 'ttb', showPrerequisites: true, showParents: true });

      const { graph, positioned } = engine.process(blocks);
      const svg = renderer.render(graph, positioned);

      const lines = svg.querySelectorAll('line.edge-prerequisite');
      expect(lines.length).toBe(1);

      const line = lines[0];
      const x1 = Number.parseFloat(line.getAttribute('x1') || '0');
      const y1 = Number.parseFloat(line.getAttribute('y1') || '0');
      const x2 = Number.parseFloat(line.getAttribute('x2') || '0');
      const y2 = Number.parseFloat(line.getAttribute('y2') || '0');

      const parent = positioned.find(pb => pb.block.id === '1');
      const child = positioned.find(pb => pb.block.id === '2');

      // Parent bottom-center
      expect(x1).toBe(parent!.position.x + parent!.position.width / 2);
      expect(y1).toBe(parent!.position.y + parent!.position.height);

      // Child top-center
      expect(x2).toBe(child!.position.x + child!.position.width / 2);
      expect(y2).toBe(child!.position.y);
    });
  });

  describe('BTT orientation', () => {
    it('should connect from parent top-center to child bottom-center', () => {
      const engine = new GraphEngine({ orientation: 'btt' });
      const renderer = new GraphRenderer({ orientation: 'btt', showPrerequisites: true, showParents: true });

      const { graph, positioned } = engine.process(blocks);
      const svg = renderer.render(graph, positioned);

      const lines = svg.querySelectorAll('line.edge-prerequisite');
      const line = lines[0];
      const x1 = Number.parseFloat(line.getAttribute('x1') || '0');
      const y1 = Number.parseFloat(line.getAttribute('y1') || '0');
      const x2 = Number.parseFloat(line.getAttribute('x2') || '0');
      const y2 = Number.parseFloat(line.getAttribute('y2') || '0');

      const parent = positioned.find(pb => pb.block.id === '1');
      const child = positioned.find(pb => pb.block.id === '2');

      // Parent top-center
      expect(x1).toBe(parent!.position.x + parent!.position.width / 2);
      expect(y1).toBe(parent!.position.y);

      // Child bottom-center
      expect(x2).toBe(child!.position.x + child!.position.width / 2);
      expect(y2).toBe(child!.position.y + child!.position.height);
    });
  });

  describe('LTR orientation', () => {
    it('should connect from parent right-center to child left-center', () => {
      const engine = new GraphEngine({ orientation: 'ltr' });
      const renderer = new GraphRenderer({ orientation: 'ltr', showPrerequisites: true, showParents: true });

      const { graph, positioned } = engine.process(blocks);
      const svg = renderer.render(graph, positioned);

      const lines = svg.querySelectorAll('line.edge-prerequisite');
      const line = lines[0];
      const x1 = Number.parseFloat(line.getAttribute('x1') || '0');
      const y1 = Number.parseFloat(line.getAttribute('y1') || '0');
      const x2 = Number.parseFloat(line.getAttribute('x2') || '0');
      const y2 = Number.parseFloat(line.getAttribute('y2') || '0');

      const parent = positioned.find(pb => pb.block.id === '1');
      const child = positioned.find(pb => pb.block.id === '2');

      // Parent right-center
      expect(x1).toBe(parent!.position.x + parent!.position.width);
      expect(y1).toBe(parent!.position.y + parent!.position.height / 2);

      // Child left-center
      expect(x2).toBe(child!.position.x);
      expect(y2).toBe(child!.position.y + child!.position.height / 2);
    });
  });

  describe('RTL orientation', () => {
    it('should connect from parent left-center to child right-center', () => {
      const engine = new GraphEngine({ orientation: 'rtl' });
      const renderer = new GraphRenderer({ orientation: 'rtl', showPrerequisites: true, showParents: true });

      const { graph, positioned } = engine.process(blocks);
      const svg = renderer.render(graph, positioned);

      const lines = svg.querySelectorAll('line.edge-prerequisite');
      const line = lines[0];
      const x1 = Number.parseFloat(line.getAttribute('x1') || '0');
      const y1 = Number.parseFloat(line.getAttribute('y1') || '0');
      const x2 = Number.parseFloat(line.getAttribute('x2') || '0');
      const y2 = Number.parseFloat(line.getAttribute('y2') || '0');

      const parent = positioned.find(pb => pb.block.id === '1');
      const child = positioned.find(pb => pb.block.id === '2');

      // Parent left-center
      expect(x1).toBe(parent!.position.x);
      expect(y1).toBe(parent!.position.y + parent!.position.height / 2);

      // Child right-center
      expect(x2).toBe(child!.position.x + child!.position.width);
      expect(y2).toBe(child!.position.y + child!.position.height / 2);
    });
  });

  describe('Edge styling consistency', () => {
    it('should maintain edge styling across all orientations', () => {
      const orientations = ['ttb', 'btt', 'ltr', 'rtl'] as const;

      for (const orientation of orientations) {
        const engine = new GraphEngine({ orientation });
        const renderer = new GraphRenderer({ orientation, showPrerequisites: true, showParents: true });

        const { graph, positioned } = engine.process(blocks);
        const svg = renderer.render(graph, positioned);

        const lines = svg.querySelectorAll('line.edge-prerequisite');
        const line = lines[0];

        expect(line.getAttribute('stroke')).toBeTruthy();
        expect(line.getAttribute('stroke-width')).toBeTruthy();
        expect(line.getAttribute('class')).toContain('edge-prerequisite');
      }
    });
  });
});
