import type { Orientation } from './orientation.js'

/**
 * Type guard to check if a value is a valid orientation.
 *
 * Use this function to validate orientation values at runtime, especially when
 * parsing user input, query parameters, or configuration files.
 *
 * @param value - The value to check
 * @returns `true` if the value is a valid Orientation, `false` otherwise
 *
 * @example
 * ```typescript
 * import { isValidOrientation } from './is-valid-orientation.js';
 * import type { Orientation } from './orientation.js';
 *
 * const userInput = 'ltr';
 * if (isValidOrientation(userInput)) {
 *   // TypeScript now knows userInput is Orientation
 *   const orientation: Orientation = userInput;
 * } else {
 *   console.warn(`Invalid orientation: ${userInput}`);
 * }
 * ```
 */
export function isValidOrientation(value: unknown): value is Orientation {
  return (
    typeof value === 'string' && ['ttb', 'ltr', 'rtl', 'btt'].includes(value)
  )
}
