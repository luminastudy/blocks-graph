import type { ViewportState } from './viewport-state.js'

/**
 * Manages viewport transformation state (zoom and pan)
 */
export class ViewportManager {
  private state: ViewportState

  constructor() {
    this.state = {
      zoom: 1.0,
      panX: 0,
      panY: 0,
      minZoom: 0.1,
      maxZoom: 5.0,
    }
  }

  /**
   * Get current viewport state
   */
  getState(): ViewportState {
    return { ...this.state }
  }

  /**
   * Get current zoom level
   */
  getZoomLevel(): number {
    return this.state.zoom
  }

  /**
   * Set zoom limits with validation
   * Clamps current zoom if it falls outside new limits
   */
  setZoomLimits(min: number, max: number): void {
    // Validate: minZoom must be positive
    if (min <= 0) {
      console.warn(
        `[ViewportManager] minZoom must be greater than 0, received: ${min}`
      )
      return
    }

    // Validate: minZoom must be less than maxZoom
    if (min >= max) {
      console.warn(
        `[ViewportManager] minZoom must be less than maxZoom, received: min=${min}, max=${max}`
      )
      return
    }

    // Update limits
    this.state.minZoom = min
    this.state.maxZoom = max

    // Clamp current zoom to new limits
    this.state.zoom = this.clampZoom(this.state.zoom)
  }

  /**
   * Set zoom level directly
   * Will be clamped to current limits
   */
  zoom(level: number): void {
    this.state.zoom = this.clampZoom(level)
  }

  /**
   * Set pan offset
   */
  pan(x: number, y: number): void {
    this.state.panX = x
    this.state.panY = y
  }

  /**
   * Reset viewport to default state
   * Sets zoom to 1.0 and pan to origin (0, 0)
   * Preserves configured zoom limits
   */
  reset(): void {
    this.state.zoom = 1.0
    this.state.panX = 0
    this.state.panY = 0
  }

  /**
   * Get SVG transformation matrix from current zoom and pan state
   * Returns array in SVG matrix format: [a, b, c, d, e, f]
   * For uniform zoom with translation: [zoom, 0, 0, zoom, panX, panY]
   */
  getTransformMatrix(): [number, number, number, number, number, number] {
    return [
      this.state.zoom, // a: scaleX
      0, // b: skewY
      0, // c: skewX
      this.state.zoom, // d: scaleY
      this.state.panX, // e: translateX
      this.state.panY, // f: translateY
    ]
  }

  /**
   * Get SVG transformation matrix as string for SVG transform attribute
   * Returns format: "matrix(a, b, c, d, e, f)"
   */
  getTransformMatrixString(): string {
    const [a, b, c, d, e, f] = this.getTransformMatrix()
    return `matrix(${a}, ${b}, ${c}, ${d}, ${e}, ${f})`
  }

  /**
   * Clamp zoom value to current limits
   */
  private clampZoom(value: number): number {
    return Math.max(this.state.minZoom, Math.min(this.state.maxZoom, value))
  }
}
