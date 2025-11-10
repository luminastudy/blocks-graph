import { describe, it, expect } from 'vitest';
import { wrapTextToLines } from './text-wrapper.js';

describe('wrapTextToLines', () => {
  const fontSize = 14;
  const fontFamily = 'system-ui, -apple-system, sans-serif';
  const maxWidth = 180; // 200px block width - 20px padding

  it('should return single line for short text', () => {
    const result = wrapTextToLines('Short text', maxWidth, fontSize, fontFamily, 3);
    expect(result.lines).toHaveLength(1);
    expect(result.lines[0]).toBe('Short text');
    expect(result.isTruncated).toBe(false);
  });

  it('should wrap text to multiple lines when needed', () => {
    const longText = 'This is a very long title that should wrap to multiple lines';
    const result = wrapTextToLines(longText, maxWidth, fontSize, fontFamily, 3);
    expect(result.lines.length).toBeGreaterThan(1);
    expect(result.lines.length).toBeLessThanOrEqual(3);
  });

  it('should truncate with ellipsis when exceeding max lines', () => {
    const veryLongText =
      'This is an extremely long title that has way too many words and should definitely be truncated with an ellipsis because it exceeds the maximum number of lines allowed';
    const result = wrapTextToLines(veryLongText, maxWidth, fontSize, fontFamily, 3);
    expect(result.lines).toHaveLength(3);
    expect(result.lines[2]).toContain('...');
    expect(result.isTruncated).toBe(true);
  });

  it('should handle single word that is too long', () => {
    const longWord = 'Supercalifragilisticexpialidocious';
    const result = wrapTextToLines(longWord, maxWidth, fontSize, fontFamily, 3);
    expect(result.lines).toHaveLength(1);
    expect(result.lines[0]).toBe(longWord);
    expect(result.isTruncated).toBe(false);
  });

  it('should handle empty text', () => {
    const result = wrapTextToLines('', maxWidth, fontSize, fontFamily, 3);
    expect(result.lines).toHaveLength(0);
    expect(result.isTruncated).toBe(false);
  });

  it('should handle text with multiple spaces', () => {
    const textWithSpaces = 'Text  with   multiple    spaces';
    const result = wrapTextToLines(textWithSpaces, maxWidth, fontSize, fontFamily, 3);
    expect(result.lines.length).toBeGreaterThan(0);
    expect(result.isTruncated).toBe(false);
  });

  it('should respect maxLines parameter', () => {
    const longText = 'This is a very long title that should wrap to multiple lines';
    const result1 = wrapTextToLines(longText, maxWidth, fontSize, fontFamily, 1);
    expect(result1.lines.length).toBeLessThanOrEqual(1);

    const result2 = wrapTextToLines(longText, maxWidth, fontSize, fontFamily, 2);
    expect(result2.lines.length).toBeLessThanOrEqual(2);

    const result3 = wrapTextToLines(longText, maxWidth, fontSize, fontFamily, 3);
    expect(result3.lines.length).toBeLessThanOrEqual(3);
  });

  it('should not truncate when text fits within max lines', () => {
    const mediumText = 'Introduction to Advanced Mathematical Analysis';
    const result = wrapTextToLines(mediumText, maxWidth, fontSize, fontFamily, 3);
    expect(result.isTruncated).toBe(false);
    expect(result.lines[result.lines.length - 1]).not.toContain('...');
  });
});
