/**
 * Supported graph orientation modes.
 *
 * - `ttb` (top-to-bottom): Parent nodes appear above child nodes
 * - `ltr` (left-to-right): Parent nodes appear to the left of child nodes
 * - `rtl` (right-to-left): Parent nodes appear to the right of child nodes
 * - `btt` (bottom-to-top): Parent nodes appear below child nodes
 */
export type Orientation = 'ttb' | 'ltr' | 'rtl' | 'btt';

/**
 * Type guard to check if a value is a valid orientation
 */
export function isValidOrientation(value: unknown): value is Orientation {
  return (
    typeof value === 'string' &&
    ['ttb', 'ltr', 'rtl', 'btt'].includes(value)
  );
}
