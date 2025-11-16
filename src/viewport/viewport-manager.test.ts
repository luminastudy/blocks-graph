import { describe, it, expect } from 'vitest'
import { ViewportManager } from './viewport-manager.js'

describe('ViewportManager', () => {
  describe('State Initialization', () => {
    it('should initialize with default zoom level of 1.0', () => {
      const manager = new ViewportManager()
      const state = manager.getState()

      expect(state.zoom).toBe(1.0)
    })

    it('should initialize with default pan offset at origin (0, 0)', () => {
      const manager = new ViewportManager()
      const state = manager.getState()

      expect(state.panX).toBe(0)
      expect(state.panY).toBe(0)
    })

    it('should initialize with default minimum zoom of 0.1', () => {
      const manager = new ViewportManager()
      const state = manager.getState()

      expect(state.minZoom).toBe(0.1)
    })

    it('should initialize with default maximum zoom of 5.0', () => {
      const manager = new ViewportManager()
      const state = manager.getState()

      expect(state.maxZoom).toBe(5.0)
    })
  })

  describe('State Getters', () => {
    it('should provide getZoomLevel() to retrieve current zoom', () => {
      const manager = new ViewportManager()

      expect(manager.getZoomLevel()).toBe(1.0)
    })

    it('should provide getState() to retrieve complete state', () => {
      const manager = new ViewportManager()
      const state = manager.getState()

      expect(state).toEqual({
        zoom: 1.0,
        panX: 0,
        panY: 0,
        minZoom: 0.1,
        maxZoom: 5.0,
      })
    })
  })

  describe('Zoom Limit Validation', () => {
    it('should accept valid zoom limits (min < max)', () => {
      const manager = new ViewportManager()

      // Should not throw
      expect(() => manager.setZoomLimits(0.5, 3.0)).not.toThrow()

      const state = manager.getState()
      expect(state.minZoom).toBe(0.5)
      expect(state.maxZoom).toBe(3.0)
    })

    it('should reject limits where min >= max', () => {
      const manager = new ViewportManager()
      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {})

      manager.setZoomLimits(2.0, 1.0) // Invalid: min > max

      expect(consoleWarnSpy).toHaveBeenCalled()
      expect(consoleWarnSpy.mock.calls[0]?.[0]).toContain(
        'minZoom must be less than maxZoom'
      )

      // Limits should remain unchanged
      const state = manager.getState()
      expect(state.minZoom).toBe(0.1)
      expect(state.maxZoom).toBe(5.0)

      consoleWarnSpy.mockRestore()
    })

    it('should reject limits where min equals max', () => {
      const manager = new ViewportManager()
      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {})

      manager.setZoomLimits(1.5, 1.5) // Invalid: min = max

      expect(consoleWarnSpy).toHaveBeenCalled()

      // Limits should remain unchanged
      const state = manager.getState()
      expect(state.minZoom).toBe(0.1)
      expect(state.maxZoom).toBe(5.0)

      consoleWarnSpy.mockRestore()
    })

    it('should reject minZoom of 0 or negative', () => {
      const manager = new ViewportManager()
      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {})

      manager.setZoomLimits(0, 2.0) // Invalid: min = 0
      expect(consoleWarnSpy).toHaveBeenCalled()

      manager.setZoomLimits(-0.5, 2.0) // Invalid: min < 0
      expect(consoleWarnSpy).toHaveBeenCalledTimes(2)

      consoleWarnSpy.mockRestore()
    })
  })

  describe('Zoom Clamping', () => {
    it('should clamp zoom to maximum when exceeding limit', () => {
      const manager = new ViewportManager()

      // Set zoom to 3.0, then change max to 2.0
      manager.zoom(3.0)
      manager.setZoomLimits(0.1, 2.0)

      const state = manager.getState()
      expect(state.zoom).toBe(2.0) // Clamped to new max
    })

    it('should clamp zoom to minimum when below limit', () => {
      const manager = new ViewportManager()

      // Set zoom to 0.2, then change min to 0.5
      manager.zoom(0.2)
      manager.setZoomLimits(0.5, 5.0)

      const state = manager.getState()
      expect(state.zoom).toBe(0.5) // Clamped to new min
    })

    it('should not change zoom when within new limits', () => {
      const manager = new ViewportManager()

      manager.zoom(1.5)
      manager.setZoomLimits(0.5, 3.0)

      const state = manager.getState()
      expect(state.zoom).toBe(1.5) // Unchanged, within limits
    })
  })

  describe('Matrix Calculation', () => {
    it('should generate identity matrix at default state (zoom=1, pan=0)', () => {
      const manager = new ViewportManager()
      const matrix = manager.getTransformMatrix()

      // Identity matrix: [1, 0, 0, 1, 0, 0]
      expect(matrix).toEqual([1, 0, 0, 1, 0, 0])
    })

    it('should generate correct matrix for zoom only (no pan)', () => {
      const manager = new ViewportManager()

      manager.zoom(2.0)
      const matrix = manager.getTransformMatrix()

      // Zoom 2x: [2, 0, 0, 2, 0, 0]
      expect(matrix).toEqual([2, 0, 0, 2, 0, 0])
    })

    it('should generate correct matrix for pan only (no zoom)', () => {
      const manager = new ViewportManager()

      manager.pan(50, 100)
      const matrix = manager.getTransformMatrix()

      // Pan (50, 100): [1, 0, 0, 1, 50, 100]
      expect(matrix).toEqual([1, 0, 0, 1, 50, 100])
    })

    it('should generate correct matrix for combined zoom and pan', () => {
      const manager = new ViewportManager()

      manager.zoom(1.5)
      manager.pan(30, 60)
      const matrix = manager.getTransformMatrix()

      // Zoom 1.5x + Pan (30, 60): [1.5, 0, 0, 1.5, 30, 60]
      expect(matrix).toEqual([1.5, 0, 0, 1.5, 30, 60])
    })

    it('should apply uniform scaling (zoom to both x and y axes)', () => {
      const manager = new ViewportManager()

      manager.zoom(3.0)
      const matrix = manager.getTransformMatrix()

      // Verify uniform scaling: matrix[0] === matrix[3]
      expect(matrix[0]).toBe(3.0)
      expect(matrix[3]).toBe(3.0)
      expect(matrix[0]).toBe(matrix[3])
    })

    it('should return array in SVG matrix format [a, b, c, d, e, f]', () => {
      const manager = new ViewportManager()
      const matrix = manager.getTransformMatrix()

      // Verify it's an array of 6 numbers
      expect(Array.isArray(matrix)).toBe(true)
      expect(matrix).toHaveLength(6)
      matrix.forEach(value => {
        expect(typeof value).toBe('number')
      })
    })

    it('should generate correct string format "matrix(a, b, c, d, e, f)"', () => {
      const manager = new ViewportManager()

      manager.zoom(2.0)
      manager.pan(10, 20)
      const matrixString = manager.getTransformMatrixString()

      expect(matrixString).toBe('matrix(2, 0, 0, 2, 10, 20)')
    })

    it('should handle negative pan values in matrix', () => {
      const manager = new ViewportManager()

      manager.pan(-50, -100)
      const matrix = manager.getTransformMatrix()

      expect(matrix).toEqual([1, 0, 0, 1, -50, -100])
    })

    it('should handle fractional zoom values in matrix', () => {
      const manager = new ViewportManager()

      manager.zoom(0.5)
      const matrix = manager.getTransformMatrix()

      expect(matrix).toEqual([0.5, 0, 0, 0.5, 0, 0])
    })
  })

  describe('Viewport Reset', () => {
    it('should reset zoom to 1.0', () => {
      const manager = new ViewportManager()

      manager.zoom(2.5)
      manager.reset()

      const state = manager.getState()
      expect(state.zoom).toBe(1.0)
    })

    it('should reset pan to origin (0, 0)', () => {
      const manager = new ViewportManager()

      manager.pan(100, 200)
      manager.reset()

      const state = manager.getState()
      expect(state.panX).toBe(0)
      expect(state.panY).toBe(0)
    })

    it('should preserve configured zoom limits after reset', () => {
      const manager = new ViewportManager()

      manager.setZoomLimits(0.5, 3.0)
      manager.reset()

      const state = manager.getState()
      expect(state.minZoom).toBe(0.5)
      expect(state.maxZoom).toBe(3.0)
    })

    it('should reset both zoom and pan simultaneously', () => {
      const manager = new ViewportManager()

      manager.zoom(3.0)
      manager.pan(150, 250)
      manager.reset()

      const state = manager.getState()
      expect(state.zoom).toBe(1.0)
      expect(state.panX).toBe(0)
      expect(state.panY).toBe(0)
    })

    it('should reset transform matrix to identity', () => {
      const manager = new ViewportManager()

      manager.zoom(2.0)
      manager.pan(50, 100)
      manager.reset()

      const matrix = manager.getTransformMatrix()
      expect(matrix).toEqual([1, 0, 0, 1, 0, 0])
    })
  })
})
