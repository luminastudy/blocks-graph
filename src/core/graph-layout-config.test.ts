import { describe, it, expect } from 'vitest';
import type { GraphLayoutConfig } from './graph-layout-config.js';
import { DEFAULT_LAYOUT_CONFIG } from './default-layout-config.js';

describe('GraphLayoutConfig', () => {
  describe('orientation property', () => {
    it('should accept ttb orientation', () => {
      const config: GraphLayoutConfig = {
        nodeWidth: 200,
        nodeHeight: 80,
        horizontalSpacing: 80,
        verticalSpacing: 100,
        orientation: 'ttb',
      };
      expect(config.orientation).toBe('ttb');
    });

    it('should accept ltr orientation', () => {
      const config: GraphLayoutConfig = {
        nodeWidth: 200,
        nodeHeight: 80,
        horizontalSpacing: 80,
        verticalSpacing: 100,
        orientation: 'ltr',
      };
      expect(config.orientation).toBe('ltr');
    });

    it('should accept rtl orientation', () => {
      const config: GraphLayoutConfig = {
        nodeWidth: 200,
        nodeHeight: 80,
        horizontalSpacing: 80,
        verticalSpacing: 100,
        orientation: 'rtl',
      };
      expect(config.orientation).toBe('rtl');
    });

    it('should accept btt orientation', () => {
      const config: GraphLayoutConfig = {
        nodeWidth: 200,
        nodeHeight: 80,
        horizontalSpacing: 80,
        verticalSpacing: 100,
        orientation: 'btt',
      };
      expect(config.orientation).toBe('btt');
    });

    it('should be optional (config without orientation is valid)', () => {
      const config: GraphLayoutConfig = {
        nodeWidth: 200,
        nodeHeight: 80,
        horizontalSpacing: 80,
        verticalSpacing: 100,
      };
      expect(config.orientation).toBeUndefined();
    });

    // Type-level test: This should cause TypeScript error
    // @ts-expect-error - Invalid orientation value
    it('should reject invalid orientation at compile time', () => {
      const config: GraphLayoutConfig = {
        nodeWidth: 200,
        nodeHeight: 80,
        horizontalSpacing: 80,
        verticalSpacing: 100,
        // @ts-expect-error
        orientation: 'invalid',
      };
      expect(config).toBeDefined();
    });
  });

  describe('DEFAULT_LAYOUT_CONFIG', () => {
    it('should include ttb orientation by default', () => {
      expect(DEFAULT_LAYOUT_CONFIG.orientation).toBe('ttb');
    });

    it('should allow merging with user config preserving orientation', () => {
      const userConfig = { orientation: 'ltr' as const };
      const merged = { ...DEFAULT_LAYOUT_CONFIG, ...userConfig };
      expect(merged.orientation).toBe('ltr');
    });

    it('should use default orientation when user config omits it', () => {
      const userConfig = { nodeWidth: 300 };
      const merged = { ...DEFAULT_LAYOUT_CONFIG, ...userConfig };
      expect(merged.orientation).toBe('ttb');
    });
  });
});
