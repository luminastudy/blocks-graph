/**
 * Text wrapping utilities for SVG rendering
 */
import { measureTextWidth } from './measure-text-width.js';

/**
 * Wrap text into multiple lines that fit within maxWidth
 * Returns an object with lines array and isTruncated boolean
 */
export function wrapTextToLines(
  text: string,
  maxWidth: number,
  fontSize: number,
  fontFamily: string,
  maxLines: number,
): { lines: string[]; isTruncated: boolean } {
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const lines: string[] = [];
  let currentLine = '';
  let isTruncated = false;

  for (const [wordIndex, word] of words.entries()) {
    if (!word) continue;

    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = measureTextWidth(testLine, fontSize, fontFamily);

    if (testWidth <= maxWidth) {
      currentLine = testLine;
    } else {
      // Line is full, push current line and start new one
      if (currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        // Single word is too long, force it on a line
        lines.push(word);
        currentLine = '';
      }

      // Check if we've reached max lines
      if (lines.length >= maxLines) {
        // Need to truncate
        isTruncated = true;
        // Add remaining words to check if we need ellipsis
        const remainingWords = words.slice(wordIndex + 1);
        if (remainingWords.length > 0 || currentLine) {
          // Truncate last line with ellipsis
          let lastLine = lines[lines.length - 1];
          if (!lastLine) break;

          const ellipsis = '...';
          // Keep removing words until "..." fits
          while (lastLine && measureTextWidth(lastLine + ellipsis, fontSize, fontFamily) > maxWidth) {
            const lastLineWords: string[] = lastLine.split(/\s+/);
            lastLineWords.pop();
            lastLine = lastLineWords.join(' ');
          }
          lines[lines.length - 1] = lastLine + ellipsis;
        }
        break;
      }
    }
  }

  // Add the last line if it exists and we haven't truncated
  if (currentLine && !isTruncated) {
    lines.push(currentLine);
  }

  return { lines, isTruncated };
}
