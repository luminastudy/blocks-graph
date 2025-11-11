import { describe, it, expect } from 'vitest';
import type { Orientation } from './orientation.js';

describe('Orientation Type', () => {
  it('should accept "ttb" as valid orientation', () => {
    const orientation: Orientation = 'ttb';
    expect(orientation).toBe('ttb');
  });

  it('should accept "ltr" as valid orientation', () => {
    const orientation: Orientation = 'ltr';
    expect(orientation).toBe('ltr');
  });

  it('should accept "rtl" as valid orientation', () => {
    const orientation: Orientation = 'rtl';
    expect(orientation).toBe('rtl');
  });

  it('should accept "btt" as valid orientation', () => {
    const orientation: Orientation = 'btt';
    expect(orientation).toBe('btt');
  });

  // Type-level test: This should cause a TypeScript error if uncommented
  // @ts-expect-error - Invalid orientation value
  it('should reject invalid orientation values at compile time', () => {
    // @ts-expect-error
    const invalid: Orientation = 'invalid';
    expect(invalid).toBeDefined();
  });
});
