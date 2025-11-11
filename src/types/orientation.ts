/**
 * Supported graph orientation modes
 *
 * - `ttb`: Top-to-bottom (default) - parent nodes appear above children
 * - `ltr`: Left-to-right - parent nodes appear to the left of children
 * - `rtl`: Right-to-left - parent nodes appear to the right of children
 * - `btt`: Bottom-to-top - parent nodes appear below children
 */
export type Orientation = 'ttb' | 'ltr' | 'rtl' | 'btt';

/**
 * Check if a value is a valid orientation
 */
export function isValidOrientation(value: unknown): value is Orientation {
  return (
    typeof value === 'string' &&
    (value === 'ttb' || value === 'ltr' || value === 'rtl' || value === 'btt')
  );
}
