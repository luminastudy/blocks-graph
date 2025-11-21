/**
 * Type guard to validate orientation value
 */
export function isValidOrientation(
  value: string | null
): value is 'ttb' | 'ltr' | 'rtl' | 'btt' {
  return (
    value === 'ttb' || value === 'ltr' || value === 'rtl' || value === 'btt'
  )
}
