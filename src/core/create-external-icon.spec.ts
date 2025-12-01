import { describe, it, expect, beforeEach } from 'vitest'
import { createExternalIcon } from './create-external-icon.js'
import type { BlockPosition } from '../types/block-position.js'

describe('createExternalIcon', () => {
  let position: BlockPosition

  beforeEach(() => {
    position = {
      x: 100,
      y: 50,
      width: 200,
      height: 80,
    }
  })

  it('creates an SVG group element', () => {
    const icon = createExternalIcon(position, 'github', '1')
    expect(icon.tagName).toBe('g')
  })

  it('adds external-icon class', () => {
    const icon = createExternalIcon(position, 'github', '1')
    expect(icon.getAttribute('class')).toContain('external-icon')
  })

  it('adds platform-specific class for github', () => {
    const icon = createExternalIcon(position, 'github', '1')
    expect(icon.getAttribute('class')).toContain('external-icon-github')
  })

  it('adds platform-specific class for gitlab', () => {
    const icon = createExternalIcon(position, 'gitlab', '1')
    expect(icon.getAttribute('class')).toContain('external-icon-gitlab')
  })

  it('sets opacity attribute', () => {
    const icon = createExternalIcon(position, 'github', '0.5')
    expect(icon.getAttribute('opacity')).toBe('0.5')
  })

  it('contains a path element for github', () => {
    const icon = createExternalIcon(position, 'github', '1')
    const path = icon.querySelector('path')
    expect(path).not.toBeNull()
    expect(path?.getAttribute('fill')).toBe('#24292f')
  })

  it('contains a path element for gitlab', () => {
    const icon = createExternalIcon(position, 'gitlab', '1')
    const path = icon.querySelector('path')
    expect(path).not.toBeNull()
    expect(path?.getAttribute('fill')).toBe('#fc6d26')
  })

  it('creates generic icon for unknown platforms', () => {
    const icon = createExternalIcon(position, 'unknown', '1')
    const path = icon.querySelector('path')
    expect(path).not.toBeNull()
    expect(path?.getAttribute('stroke')).toBe('#666')
  })

  it('includes a tooltip title element', () => {
    const icon = createExternalIcon(position, 'github', '1')
    const title = icon.querySelector('title')
    expect(title).not.toBeNull()
    expect(title?.textContent).toContain('GitHub')
  })

  it('includes correct tooltip for gitlab', () => {
    const icon = createExternalIcon(position, 'gitlab', '1')
    const title = icon.querySelector('title')
    expect(title).not.toBeNull()
    expect(title?.textContent).toContain('GitLab')
  })

  it('positions icon in top-right corner of block', () => {
    const icon = createExternalIcon(position, 'github', '1')
    const path = icon.querySelector('path')
    const pathD = path?.getAttribute('d') ?? ''

    // Icon should be positioned near top-right corner
    // Block: x=100, width=200, so right edge is at x=300
    // Icon size is 14, padding is 6, so icon starts at x=300-14-6=280
    expect(pathD).toContain('287') // center of icon (280 + 7)
  })
})
