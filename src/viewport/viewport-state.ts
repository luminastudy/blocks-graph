/**
 * Viewport transformation state (zoom and pan)
 */
export interface ViewportState {
  zoom: number
  panX: number
  panY: number
  minZoom: number
  maxZoom: number
}
