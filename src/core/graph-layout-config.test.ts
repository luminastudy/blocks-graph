import { describe, it, expect } from 'vitest';
import type { GraphLayoutConfig } from './graph-layout-config.js';
import { DEFAULT_LAYOUT_CONFIG } from './default-layout-config.js';

describe('GraphLayoutConfig', () => {
  it('should include orientation in the interface', () => {
    const config: GraphLayoutConfig = {
      nodeWidth: 200,
      nodeHeight: 80,
      horizontalSpacing: 80,
      verticalSpacing: 100,
      orientation: 'ttb',
    };

    expect(config.orientation).toBe('ttb');
  });

  it('should allow orientation to be optional', () => {
    const config: GraphLayoutConfig = {
      nodeWidth: 200,
      nodeHeight: 80,
      horizontalSpacing: 80,
      verticalSpacing: 100,
    };

    expect(config.orientation).toBeUndefined();
  });

  it('should accept all valid orientation values', () => {
    const ttbConfig: GraphLayoutConfig = { ...DEFAULT_LAYOUT_CONFIG, orientation: 'ttb' };
    const ltrConfig: GraphLayoutConfig = { ...DEFAULT_LAYOUT_CONFIG, orientation: 'ltr' };
    const rtlConfig: GraphLayoutConfig = { ...DEFAULT_LAYOUT_CONFIG, orientation: 'rtl' };
    const bttConfig: GraphLayoutConfig = { ...DEFAULT_LAYOUT_CONFIG, orientation: 'btt' };

    expect(ttbConfig.orientation).toBe('ttb');
    expect(ltrConfig.orientation).toBe('ltr');
    expect(rtlConfig.orientation).toBe('rtl');
    expect(bttConfig.orientation).toBe('btt');
  });

  describe('DEFAULT_LAYOUT_CONFIG', () => {
    it('should include ttb as default orientation', () => {
      expect(DEFAULT_LAYOUT_CONFIG.orientation).toBe('ttb');
    });

    it('should maintain backward compatibility values', () => {
      expect(DEFAULT_LAYOUT_CONFIG.nodeWidth).toBe(200);
      expect(DEFAULT_LAYOUT_CONFIG.nodeHeight).toBe(80);
      expect(DEFAULT_LAYOUT_CONFIG.horizontalSpacing).toBe(80);
      expect(DEFAULT_LAYOUT_CONFIG.verticalSpacing).toBe(100);
    });

    it('should be usable with partial config merging', () => {
      const customConfig: Partial<GraphLayoutConfig> = {
        nodeWidth: 300,
        orientation: 'ltr',
      };

      const merged = { ...DEFAULT_LAYOUT_CONFIG, ...customConfig };

      expect(merged.nodeWidth).toBe(300);
      expect(merged.nodeHeight).toBe(80);
      expect(merged.orientation).toBe('ltr');
    });

    it('should preserve ttb orientation when custom config omits it', () => {
      const customConfig: Partial<GraphLayoutConfig> = {
        nodeWidth: 300,
      };

      const merged = { ...DEFAULT_LAYOUT_CONFIG, ...customConfig };

      expect(merged.orientation).toBe('ttb');
    });
  });
});
