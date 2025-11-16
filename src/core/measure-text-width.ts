/**
 * Measure the width of text using canvas context
 */
export function measureTextWidth(
  text: string,
  fontSize: number,
  fontFamily: string
): number {
  // Create a temporary canvas for text measurement
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (!context) {
    // Fallback: rough estimate based on character count
    return text.length * fontSize * 0.6
  }
  context.font = `${fontSize}px ${fontFamily}`
  return context.measureText(text).width
}
