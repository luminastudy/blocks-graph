/**
 * Handles user interaction gestures (mouse, touch, keyboard) for viewport navigation
 */

import { ViewportManager } from './viewport-manager.js'

interface GestureState {
  isPanning: boolean
  startX: number
  startY: number
  totalMovement: number
}

interface InteractionConfig {
  enablePan: boolean
  enableZoom: boolean
  clickThreshold: number // Movement threshold for click vs pan (default: 5px)
}

export class InteractionGestureHandler {
  private viewportManager: ViewportManager
  private config: InteractionConfig
  private gestureState: GestureState
  private initialPanX: number
  private initialPanY: number

  constructor(viewportManager: ViewportManager) {
    this.viewportManager = viewportManager
    this.initialPanX = 0
    this.initialPanY = 0

    this.config = {
      enablePan: true,
      enableZoom: true,
      clickThreshold: 5,
    }

    this.gestureState = {
      isPanning: false,
      startX: 0,
      startY: 0,
      totalMovement: 0,
    }
  }

  /**
   * Handle pointer down event - start tracking gesture
   */
  handlePointerDown(event: PointerEvent, _svgElement: SVGSVGElement): void {
    if (!this.config.enablePan) {
      return
    }

    // Capture initial viewport pan state at gesture start
    const currentState = this.viewportManager.getState()
    this.initialPanX = currentState.panX
    this.initialPanY = currentState.panY

    this.gestureState = {
      isPanning: false,
      startX: event.clientX,
      startY: event.clientY,
      totalMovement: 0,
    }
  }

  /**
   * Handle pointer move event - calculate movement delta
   */
  handlePointerMove(event: PointerEvent, _svgElement: SVGSVGElement): void {
    // Only track movement if we have a valid start position (pointer was down)
    if (
      this.gestureState.startX === 0 &&
      this.gestureState.startY === 0 &&
      this.gestureState.totalMovement === 0
    ) {
      return
    }

    if (!this.config.enablePan) {
      return
    }

    // Calculate movement from last known position
    const currentX = event.clientX
    const currentY = event.clientY

    // Calculate total movement from start position
    const deltaX = currentX - this.gestureState.startX
    const deltaY = currentY - this.gestureState.startY
    const totalMovement = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    this.gestureState.totalMovement = totalMovement

    // If movement exceeds threshold, it's a pan gesture
    if (totalMovement >= this.config.clickThreshold) {
      this.gestureState.isPanning = true

      // Apply pan delta to viewport
      this.viewportManager.pan(
        this.initialPanX + deltaX,
        this.initialPanY + deltaY
      )
    }
  }

  /**
   * Handle pointer up event - complete gesture
   */
  handlePointerUp(_event: PointerEvent): void {
    // Reset gesture state
    this.gestureState = {
      isPanning: false,
      startX: 0,
      startY: 0,
      totalMovement: 0,
    }
  }

  /**
   * Handle wheel event - zoom in or out
   * Wheel up (negative deltaY) = zoom in
   * Wheel down (positive deltaY) = zoom out
   * Zoom is centered at cursor position
   */
  handleWheel(event: WheelEvent, _svgElement: SVGSVGElement): void {
    if (!this.config.enableZoom) {
      return
    }

    // Prevent default browser zoom behavior
    event.preventDefault()

    // Fixed zoom increment per wheel tick
    const zoomIncrement = 0.1

    // Calculate zoom direction (negative deltaY = zoom in, positive = zoom out)
    const zoomDelta = event.deltaY > 0 ? -zoomIncrement : zoomIncrement

    // Get current viewport state
    const currentState = this.viewportManager.getState()
    const oldZoom = currentState.zoom
    const oldPanX = currentState.panX
    const oldPanY = currentState.panY

    // Calculate new zoom (will be clamped by ViewportManager)
    const newZoom = oldZoom + zoomDelta

    // Get cursor position
    const cursorX = event.clientX
    const cursorY = event.clientY

    // Calculate new pan offset to keep cursor position fixed
    // Formula: newPan = cursor - (cursor - oldPan) * (newZoom / oldZoom)
    // This ensures the point under the cursor stays at the same screen position
    const newPanX = cursorX - (cursorX - oldPanX) * (newZoom / oldZoom)
    const newPanY = cursorY - (cursorY - oldPanY) * (newZoom / oldZoom)

    // Apply new zoom and pan together
    this.viewportManager.zoom(newZoom)
    this.viewportManager.pan(newPanX, newPanY)
  }

  /**
   * Handle touch start event - start tracking touch gesture
   * Only handles single-finger touch for pan
   */
  handleTouchStart(event: TouchEvent, _svgElement: SVGSVGElement): void {
    if (!this.config.enablePan) {
      return
    }

    // Only handle single-finger touch (multi-touch is for pinch-to-zoom)
    if (event.touches.length !== 1) {
      return
    }

    // Prevent default browser scroll/zoom
    event.preventDefault()

    const touch = event.touches[0]! // Safe: already checked length !== 1

    // Capture initial viewport pan state at gesture start
    const currentState = this.viewportManager.getState()
    this.initialPanX = currentState.panX
    this.initialPanY = currentState.panY

    this.gestureState = {
      isPanning: false,
      startX: touch.clientX,
      startY: touch.clientY,
      totalMovement: 0,
    }
  }

  /**
   * Handle touch move event - calculate movement delta for pan
   */
  handleTouchMove(event: TouchEvent, _svgElement: SVGSVGElement): void {
    // Only track movement if we have a valid start position (touch was down)
    if (
      this.gestureState.startX === 0 &&
      this.gestureState.startY === 0 &&
      this.gestureState.totalMovement === 0
    ) {
      return
    }

    if (!this.config.enablePan) {
      return
    }

    // Only handle single-finger touch
    if (event.touches.length !== 1) {
      return
    }

    // Prevent default browser scroll/zoom
    event.preventDefault()

    const touch = event.touches[0]! // Safe: already checked length !== 1

    // Calculate movement from start position
    const currentX = touch.clientX
    const currentY = touch.clientY

    // Calculate total movement from start position
    const deltaX = currentX - this.gestureState.startX
    const deltaY = currentY - this.gestureState.startY
    const totalMovement = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    this.gestureState.totalMovement = totalMovement

    // If movement exceeds threshold, it's a pan gesture
    if (totalMovement >= this.config.clickThreshold) {
      this.gestureState.isPanning = true

      // Apply pan delta to viewport
      this.viewportManager.pan(
        this.initialPanX + deltaX,
        this.initialPanY + deltaY
      )
    }
  }

  /**
   * Handle touch end event - complete touch gesture
   */
  handleTouchEnd(_event: TouchEvent): void {
    // Reset gesture state
    this.gestureState = {
      isPanning: false,
      startX: 0,
      startY: 0,
      totalMovement: 0,
    }
  }

  /**
   * Check if current gesture is a pan gesture
   * Returns true when movement >= clickThreshold
   */
  isPanGesture(): boolean {
    return this.gestureState.isPanning
  }

  /**
   * Reset gesture handler to idle state
   */
  reset(): void {
    this.gestureState = {
      isPanning: false,
      startX: 0,
      startY: 0,
      totalMovement: 0,
    }
  }
}
