import { describe, it, expect } from 'vitest'
import { createBlockText } from './create-block-text.js'
import type { BlockPosition } from '../types/block-position.js'
import type { TextStyle } from './text-style.js'

describe('createBlockText', () => {
  const defaultPosition: BlockPosition = {
    x: 0,
    y: 0,
    width: 200,
    height: 80,
  }

  const defaultTextStyle: TextStyle = {
    fontSize: 14,
    fill: '#000000',
    fontFamily: 'Arial',
    maxLines: 3,
    lineHeight: 1.2,
    horizontalPadding: 10,
  }

  it('creates an SVG text element', () => {
    const result = createBlockText(
      'Test Title',
      defaultPosition,
      '1',
      defaultTextStyle
    )

    expect(result.text.tagName).toBe('text')
  })

  it('sets text anchor to middle for centering', () => {
    const result = createBlockText(
      'Test Title',
      defaultPosition,
      '1',
      defaultTextStyle
    )

    expect(result.text.getAttribute('text-anchor')).toBe('middle')
  })

  it('applies fill color from textStyle', () => {
    const result = createBlockText(
      'Test Title',
      defaultPosition,
      '1',
      defaultTextStyle
    )

    expect(result.text.getAttribute('fill')).toBe('#000000')
  })

  it('applies opacity to text element', () => {
    const result = createBlockText(
      'Test Title',
      defaultPosition,
      '0.5',
      defaultTextStyle
    )

    expect(result.text.getAttribute('opacity')).toBe('0.5')
  })

  it('creates tspan elements for text lines', () => {
    const result = createBlockText(
      'Test Title',
      defaultPosition,
      '1',
      defaultTextStyle
    )

    const tspans = result.text.querySelectorAll('tspan')
    expect(tspans.length).toBeGreaterThan(0)
  })

  it('returns lineCount matching number of tspan elements', () => {
    const result = createBlockText(
      'Test Title',
      defaultPosition,
      '1',
      defaultTextStyle
    )

    const tspans = result.text.querySelectorAll('tspan')
    expect(result.lineCount).toBe(tspans.length)
  })

  it('returns isTruncated false for short text', () => {
    const result = createBlockText(
      'Short',
      defaultPosition,
      '1',
      defaultTextStyle
    )

    expect(result.isTruncated).toBe(false)
  })

  it('uses default lineHeight when not specified', () => {
    const styleWithoutLineHeight: TextStyle = {
      fontSize: 14,
      fill: '#000000',
      fontFamily: 'Arial',
    }

    const result = createBlockText(
      'Test Title',
      defaultPosition,
      '1',
      styleWithoutLineHeight
    )

    expect(result.text).toBeDefined()
    expect(result.lineCount).toBeGreaterThan(0)
  })
})
