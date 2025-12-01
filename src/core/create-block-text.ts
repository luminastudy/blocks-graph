import type { BlockPosition } from '../types/block-position.js'
import type { TextStyle } from './text-style.js'
import type { BlockTextResult } from './block-text-result.js'
import { wrapTextToLines } from './text-wrapper.js'

/**
 * Creates SVG text element for a block title with proper positioning and wrapping
 */
export function createBlockText(
  title: string,
  position: BlockPosition,
  opacity: string,
  textStyle: TextStyle
): BlockTextResult {
  const fontSize = textStyle.fontSize
  const fontFamily = textStyle.fontFamily
  const lineHeight =
    textStyle.lineHeight !== undefined ? textStyle.lineHeight : 1.2
  const horizontalPadding =
    textStyle.horizontalPadding !== undefined ? textStyle.horizontalPadding : 10
  const maxLines = textStyle.maxLines !== undefined ? textStyle.maxLines : 3
  const maxTextWidth = position.width - 2 * horizontalPadding

  const { lines, isTruncated } = wrapTextToLines(
    title,
    maxTextWidth,
    fontSize,
    fontFamily,
    maxLines
  )

  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
  text.setAttribute('x', String(position.x + position.width / 2))
  text.setAttribute('text-anchor', 'middle')
  text.setAttribute('fill', textStyle.fill)
  text.setAttribute('font-size', String(fontSize))
  text.setAttribute('font-family', fontFamily)
  text.setAttribute('opacity', opacity)

  const totalTextHeight = lines.length * fontSize * lineHeight
  const startY =
    position.y + position.height / 2 - totalTextHeight / 2 + fontSize / 2

  lines.forEach((line, index) => {
    const tspan = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'tspan'
    )
    tspan.setAttribute('x', String(position.x + position.width / 2))
    tspan.setAttribute('y', String(startY + index * fontSize * lineHeight))
    tspan.setAttribute('dominant-baseline', 'middle')
    tspan.textContent = line
    text.appendChild(tspan)
  })

  return { text, isTruncated, lineCount: lines.length }
}
