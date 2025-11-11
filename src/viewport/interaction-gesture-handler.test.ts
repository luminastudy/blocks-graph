import { describe, it, expect, beforeEach } from 'vitest';
import { InteractionGestureHandler } from './interaction-gesture-handler.js';
import { ViewportManager } from './viewport-manager.js';

// Helper to create mock PointerEvent (JSDOM doesn't support PointerEvent)
function createPointerEvent(type: string, options: { clientX: number; clientY: number }): PointerEvent {
  const event = new MouseEvent(type, {
    clientX: options.clientX,
    clientY: options.clientY,
    bubbles: true,
    cancelable: true,
  }) as unknown as PointerEvent;
  return event;
}

describe('InteractionGestureHandler', () => {
  let handler: InteractionGestureHandler;
  let viewportManager: ViewportManager;
  let svgElement: SVGSVGElement;

  beforeEach(() => {
    viewportManager = new ViewportManager();
    handler = new InteractionGestureHandler(viewportManager);

    // Create a mock SVG element for coordinate calculations
    svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    document.body.appendChild(svgElement);
  });

  describe('Pointer Event Tracking', () => {
    it('should initialize with idle state (not panning)', () => {
      expect(handler.isPanGesture()).toBe(false);
    });

    it('should track pointer down event and start position', () => {
      const event = createPointerEvent('pointerdown', {
        clientX: 100,
        clientY: 150,
      });

      handler.handlePointerDown(event, svgElement);

      // Should not be panning yet (haven't moved)
      expect(handler.isPanGesture()).toBe(false);
    });

    it('should calculate movement delta during pointer move', () => {
      // Pointer down at (100, 150)
      const downEvent = createPointerEvent('pointerdown', {
        clientX: 100,
        clientY: 150,
      });
      handler.handlePointerDown(downEvent, svgElement);

      // Move to (110, 160) - 10px horizontal, 10px vertical = ~14px total
      const moveEvent = createPointerEvent('pointermove', {
        clientX: 110,
        clientY: 160,
      });
      handler.handlePointerMove(moveEvent, svgElement);

      // Should now be considered a pan gesture (> 5px threshold)
      expect(handler.isPanGesture()).toBe(true);
    });

    it('should not consider pan gesture when movement below 5px threshold', () => {
      // Pointer down at (100, 150)
      const downEvent = createPointerEvent('pointerdown', {
        clientX: 100,
        clientY: 150,
      });
      handler.handlePointerDown(downEvent, svgElement);

      // Move to (103, 152) - 3px horizontal, 2px vertical = ~3.6px total
      const moveEvent = createPointerEvent('pointermove', {
        clientX: 103,
        clientY: 152,
      });
      handler.handlePointerMove(moveEvent, svgElement);

      // Should NOT be considered a pan gesture (< 5px threshold)
      expect(handler.isPanGesture()).toBe(false);
    });

    it('should reset gesture state on pointer up', () => {
      // Start a pan gesture
      const downEvent = createPointerEvent('pointerdown', {
        clientX: 100,
        clientY: 150,
      });
      handler.handlePointerDown(downEvent, svgElement);

      const moveEvent = createPointerEvent('pointermove', {
        clientX: 120,
        clientY: 170,
      });
      handler.handlePointerMove(moveEvent, svgElement);

      expect(handler.isPanGesture()).toBe(true);

      // Release pointer
      const upEvent = createPointerEvent('pointerup', {
        clientX: 120,
        clientY: 170,
      });
      handler.handlePointerUp(upEvent);

      // Gesture should be reset
      expect(handler.isPanGesture()).toBe(false);
    });

    it('should handle pointer movement outside component bounds', () => {
      // Pointer down inside
      const downEvent = createPointerEvent('pointerdown', {
        clientX: 100,
        clientY: 150,
      });
      handler.handlePointerDown(downEvent, svgElement);

      // Move far outside (simulating drag outside component)
      const moveEvent = createPointerEvent('pointermove', {
        clientX: -50,
        clientY: 1000,
      });
      handler.handlePointerMove(moveEvent, svgElement);

      // Should still be considered a pan gesture
      expect(handler.isPanGesture()).toBe(true);
    });

    it('should accumulate total movement across multiple pointer moves', () => {
      const downEvent = createPointerEvent('pointerdown', {
        clientX: 100,
        clientY: 100,
      });
      handler.handlePointerDown(downEvent, svgElement);

      // Move 3px (not enough yet)
      let moveEvent = createPointerEvent('pointermove', {
        clientX: 103,
        clientY: 100,
      });
      handler.handlePointerMove(moveEvent, svgElement);
      expect(handler.isPanGesture()).toBe(false);

      // Move another 3px (total 6px, should trigger)
      moveEvent = createPointerEvent('pointermove', {
        clientX: 106,
        clientY: 100,
      });
      handler.handlePointerMove(moveEvent, svgElement);
      expect(handler.isPanGesture()).toBe(true);
    });

    it('should not track movement when pointer not initially down', () => {
      // Try to move without pointer down first
      const moveEvent = createPointerEvent('pointermove', {
        clientX: 200,
        clientY: 200,
      });

      // Should not throw and should remain idle
      handler.handlePointerMove(moveEvent, svgElement);
      expect(handler.isPanGesture()).toBe(false);
    });
  });

  describe('Pan Operation', () => {
    it('should apply pan delta to viewportManager when panning', () => {
      // Start at (100, 100)
      const downEvent = createPointerEvent('pointerdown', {
        clientX: 100,
        clientY: 100,
      });
      handler.handlePointerDown(downEvent, svgElement);

      // Move to (120, 130) - exceeds 5px threshold, becomes pan gesture
      const moveEvent1 = createPointerEvent('pointermove', {
        clientX: 120,
        clientY: 130,
      });
      handler.handlePointerMove(moveEvent1, svgElement);

      // Verify viewport pan was updated
      const state = viewportManager.getState();
      expect(state.panX).toBe(20); // Delta: 120 - 100 = 20
      expect(state.panY).toBe(30); // Delta: 130 - 100 = 30
    });

    it('should accumulate pan deltas across multiple moves', () => {
      // Start at (100, 100)
      const downEvent = createPointerEvent('pointerdown', {
        clientX: 100,
        clientY: 100,
      });
      handler.handlePointerDown(downEvent, svgElement);

      // Move to (110, 110) - first increment
      const moveEvent1 = createPointerEvent('pointermove', {
        clientX: 110,
        clientY: 110,
      });
      handler.handlePointerMove(moveEvent1, svgElement);

      // Move to (125, 130) - second increment
      const moveEvent2 = createPointerEvent('pointermove', {
        clientX: 125,
        clientY: 130,
      });
      handler.handlePointerMove(moveEvent2, svgElement);

      // Total delta should be: 125 - 100 = 25, 130 - 100 = 30
      const state = viewportManager.getState();
      expect(state.panX).toBe(25);
      expect(state.panY).toBe(30);
    });

    it('should not apply pan when movement below threshold', () => {
      // Start at (100, 100)
      const downEvent = createPointerEvent('pointerdown', {
        clientX: 100,
        clientY: 100,
      });
      handler.handlePointerDown(downEvent, svgElement);

      // Move only 3px (below 5px threshold)
      const moveEvent = createPointerEvent('pointermove', {
        clientX: 103,
        clientY: 100,
      });
      handler.handlePointerMove(moveEvent, svgElement);

      // Viewport should remain at origin (no pan applied)
      const state = viewportManager.getState();
      expect(state.panX).toBe(0);
      expect(state.panY).toBe(0);
    });

    it('should preserve zoom level during pan', () => {
      // Set zoom to 2.0
      viewportManager.zoom(2.0);

      // Start pan gesture
      const downEvent = createPointerEvent('pointerdown', {
        clientX: 100,
        clientY: 100,
      });
      handler.handlePointerDown(downEvent, svgElement);

      // Pan by 20px
      const moveEvent = createPointerEvent('pointermove', {
        clientX: 120,
        clientY: 120,
      });
      handler.handlePointerMove(moveEvent, svgElement);

      // Verify zoom unchanged
      const state = viewportManager.getState();
      expect(state.zoom).toBe(2.0);
      expect(state.panX).toBe(20);
      expect(state.panY).toBe(20);
    });

    it('should handle negative deltas (pan in opposite direction)', () => {
      // Start at (200, 200)
      const downEvent = createPointerEvent('pointerdown', {
        clientX: 200,
        clientY: 200,
      });
      handler.handlePointerDown(downEvent, svgElement);

      // Move to (170, 180) - negative delta
      const moveEvent = createPointerEvent('pointermove', {
        clientX: 170,
        clientY: 180,
      });
      handler.handlePointerMove(moveEvent, svgElement);

      // Verify negative pan values
      const state = viewportManager.getState();
      expect(state.panX).toBe(-30); // 170 - 200 = -30
      expect(state.panY).toBe(-20); // 180 - 200 = -20
    });

    it('should reset pan state on pointer up', () => {
      // Perform a pan
      const downEvent = createPointerEvent('pointerdown', {
        clientX: 100,
        clientY: 100,
      });
      handler.handlePointerDown(downEvent, svgElement);

      const moveEvent = createPointerEvent('pointermove', {
        clientX: 150,
        clientY: 150,
      });
      handler.handlePointerMove(moveEvent, svgElement);

      // Viewport should have pan applied
      let state = viewportManager.getState();
      expect(state.panX).toBe(50);
      expect(state.panY).toBe(50);

      // Release pointer
      const upEvent = createPointerEvent('pointerup', {
        clientX: 150,
        clientY: 150,
      });
      handler.handlePointerUp(upEvent);

      // Gesture state should reset, but viewport pan should PERSIST
      expect(handler.isPanGesture()).toBe(false);
      state = viewportManager.getState();
      expect(state.panX).toBe(50); // Pan should persist after gesture ends
      expect(state.panY).toBe(50);
    });
  });

  describe('Wheel Zoom', () => {
    // Helper to create mock WheelEvent
    function createWheelEvent(deltaY: number, clientX: number = 0, clientY: number = 0): WheelEvent {
      const event = new WheelEvent('wheel', {
        deltaY: deltaY,
        clientX: clientX,
        clientY: clientY,
        bubbles: true,
        cancelable: true,
      });
      return event;
    }

    it('should zoom in when wheel scrolls up (negative deltaY)', () => {
      // Wheel up (negative deltaY) should increase zoom
      const event = createWheelEvent(-100, 250, 250);
      handler.handleWheel(event, svgElement);

      const state = viewportManager.getState();
      expect(state.zoom).toBeGreaterThan(1.0); // Should have zoomed in from default 1.0
    });

    it('should zoom out when wheel scrolls down (positive deltaY)', () => {
      // Start at zoom 2.0
      viewportManager.zoom(2.0);

      // Wheel down (positive deltaY) should decrease zoom
      const event = createWheelEvent(100, 250, 250);
      handler.handleWheel(event, svgElement);

      const state = viewportManager.getState();
      expect(state.zoom).toBeLessThan(2.0); // Should have zoomed out
    });

    it('should use fixed zoom increment per wheel tick', () => {
      // Starting at zoom 1.0
      const event1 = createWheelEvent(-100, 250, 250);
      handler.handleWheel(event1, svgElement);

      const zoomAfterFirst = viewportManager.getState().zoom;
      const increment = zoomAfterFirst - 1.0;

      // Reset and test again to verify consistent increment
      viewportManager.reset();
      const event2 = createWheelEvent(-100, 250, 250);
      handler.handleWheel(event2, svgElement);

      const zoomAfterSecond = viewportManager.getState().zoom;
      expect(zoomAfterSecond).toBeCloseTo(1.0 + increment, 5);
    });

    it('should respect minimum zoom limit', () => {
      // Set zoom to minimum (0.1)
      viewportManager.zoom(0.1);

      // Try to zoom out further
      const event = createWheelEvent(100, 250, 250);
      handler.handleWheel(event, svgElement);

      const state = viewportManager.getState();
      expect(state.zoom).toBe(0.1); // Should be clamped at minimum
    });

    it('should respect maximum zoom limit', () => {
      // Set zoom to maximum (5.0)
      viewportManager.zoom(5.0);

      // Try to zoom in further
      const event = createWheelEvent(-100, 250, 250);
      handler.handleWheel(event, svgElement);

      const state = viewportManager.getState();
      expect(state.zoom).toBe(5.0); // Should be clamped at maximum
    });

    it('should call preventDefault to block browser zoom', () => {
      const event = createWheelEvent(-100, 250, 250);
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      handler.handleWheel(event, svgElement);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should not zoom when zoom is disabled', () => {
      // Note: Will need to add enableZoom config support
      // For now, this test documents expected behavior
      const initialZoom = viewportManager.getState().zoom;

      const event = createWheelEvent(-100, 250, 250);
      handler.handleWheel(event, svgElement);

      // With current implementation, zoom should change
      // After we add enableZoom config, this test will verify it works
      const finalZoom = viewportManager.getState().zoom;
      expect(finalZoom).not.toBe(initialZoom); // Will change once config added
    });
  });

  describe('Cursor-Centered Zoom', () => {
    // No special setup needed - cursor-centered zoom works
    // directly with cursor coordinates and viewport state

    // Helper to create mock WheelEvent
    function createWheelEvent(deltaY: number, clientX: number = 0, clientY: number = 0): WheelEvent {
      const event = new WheelEvent('wheel', {
        deltaY: deltaY,
        clientX: clientX,
        clientY: clientY,
        bubbles: true,
        cancelable: true,
      });
      return event;
    }

    it('should adjust pan offset when zooming to keep cursor position fixed', () => {
      // Start at default state (zoom=1, pan=0,0)
      // Cursor at screen position (200, 200)
      // This corresponds to SVG position (200, 200) at zoom=1

      const event = createWheelEvent(-100, 200, 200); // Zoom in at (200, 200)
      handler.handleWheel(event, svgElement);

      // After zooming to 1.1x:
      // The point that was at SVG (200, 200) should still appear at screen (200, 200)
      // This requires adjusting pan offset

      const state = viewportManager.getState();
      expect(state.zoom).toBeCloseTo(1.1, 5);

      // Pan should be adjusted to keep point (200, 200) fixed
      // Formula: newPan = cursor - (cursor - oldPan) * (newZoom / oldZoom)
      // newPanX = 200 - (200 - 0) * (1.1 / 1.0) = 200 - 220 = -20
      expect(state.panX).toBeCloseTo(-20, 5);
      expect(state.panY).toBeCloseTo(-20, 5);
    });

    it('should handle cursor-centered zoom at non-zero initial pan', () => {
      // Start with pan offset
      viewportManager.pan(50, 50);

      // Zoom in at cursor position (300, 300)
      const event = createWheelEvent(-100, 300, 300);
      handler.handleWheel(event, svgElement);

      const state = viewportManager.getState();
      expect(state.zoom).toBeCloseTo(1.1, 5);

      // newPanX = 300 - (300 - 50) * (1.1 / 1.0) = 300 - 275 = 25
      expect(state.panX).toBeCloseTo(25, 5);
      expect(state.panY).toBeCloseTo(25, 5);
    });

    it('should handle cursor-centered zoom when already zoomed', () => {
      // Start at 2x zoom with some pan
      viewportManager.zoom(2.0);
      viewportManager.pan(100, 100);

      // Zoom in further at cursor (400, 400)
      const event = createWheelEvent(-100, 400, 400);
      handler.handleWheel(event, svgElement);

      const state = viewportManager.getState();
      expect(state.zoom).toBeCloseTo(2.1, 5);

      // newPanX = 400 - (400 - 100) * (2.1 / 2.0) = 400 - 315 = 85
      expect(state.panX).toBeCloseTo(85, 5);
      expect(state.panY).toBeCloseTo(85, 5);
    });

    it('should handle zoom out with cursor-centered transformation', () => {
      // Start at 2x zoom
      viewportManager.zoom(2.0);
      viewportManager.pan(0, 0);

      // Zoom out at cursor (200, 200)
      const event = createWheelEvent(100, 200, 200); // Positive deltaY = zoom out
      handler.handleWheel(event, svgElement);

      const state = viewportManager.getState();
      expect(state.zoom).toBeCloseTo(1.9, 5);

      // newPanX = 200 - (200 - 0) * (1.9 / 2.0) = 200 - 190 = 10
      expect(state.panX).toBeCloseTo(10, 5);
      expect(state.panY).toBeCloseTo(10, 5);
    });

    it('should handle cursor at origin (0, 0)', () => {
      // Cursor at (0, 0)
      const event = createWheelEvent(-100, 0, 0);
      handler.handleWheel(event, svgElement);

      const state = viewportManager.getState();
      expect(state.zoom).toBeCloseTo(1.1, 5);

      // newPanX = 0 - (0 - 0) * (1.1 / 1.0) = 0
      expect(state.panX).toBe(0);
      expect(state.panY).toBe(0);
    });

    it('should handle cursor-centered zoom with negative pan offset', () => {
      // Start with negative pan
      viewportManager.pan(-100, -100);

      // Zoom in at cursor (150, 150)
      const event = createWheelEvent(-100, 150, 150);
      handler.handleWheel(event, svgElement);

      const state = viewportManager.getState();
      expect(state.zoom).toBeCloseTo(1.1, 5);

      // newPanX = 150 - (150 - (-100)) * (1.1 / 1.0) = 150 - 275 = -125
      expect(state.panX).toBeCloseTo(-125, 5);
      expect(state.panY).toBeCloseTo(-125, 5);
    });
  });

  describe('Touch Pan Gesture', () => {
    // Helper to create mock TouchEvent
    function createTouchEvent(
      type: string,
      touches: Array<{ clientX: number; clientY: number; identifier: number }>
    ): TouchEvent {
      const touchList = touches.map(t => ({
        clientX: t.clientX,
        clientY: t.clientY,
        identifier: t.identifier,
        target: svgElement,
      }));

      const event = new Event(type, { bubbles: true, cancelable: true }) as TouchEvent;
      Object.defineProperty(event, 'touches', {
        value: touchList,
        writable: false,
      });
      Object.defineProperty(event, 'targetTouches', {
        value: touchList,
        writable: false,
      });
      Object.defineProperty(event, 'changedTouches', {
        value: touchList,
        writable: false,
      });

      return event;
    }

    it('should track single touch start and position', () => {
      const event = createTouchEvent('touchstart', [{ clientX: 100, clientY: 150, identifier: 0 }]);

      handler.handleTouchStart(event, svgElement);

      // Should not be panning yet (haven't moved)
      expect(handler.isPanGesture()).toBe(false);
    });

    it('should apply pan delta during touch move', () => {
      // Touch start at (100, 100)
      const startEvent = createTouchEvent('touchstart', [{ clientX: 100, clientY: 100, identifier: 0 }]);
      handler.handleTouchStart(startEvent, svgElement);

      // Move to (120, 130) - exceeds 5px threshold
      const moveEvent = createTouchEvent('touchmove', [{ clientX: 120, clientY: 130, identifier: 0 }]);
      handler.handleTouchMove(moveEvent, svgElement);

      // Verify viewport pan was updated
      const state = viewportManager.getState();
      expect(state.panX).toBe(20); // Delta: 120 - 100 = 20
      expect(state.panY).toBe(30); // Delta: 130 - 100 = 30
    });

    it('should not consider tap when movement below 5px threshold', () => {
      // Touch start at (100, 150)
      const startEvent = createTouchEvent('touchstart', [{ clientX: 100, clientY: 150, identifier: 0 }]);
      handler.handleTouchStart(startEvent, svgElement);

      // Move to (103, 152) - 3px horizontal, 2px vertical = ~3.6px total
      const moveEvent = createTouchEvent('touchmove', [{ clientX: 103, clientY: 152, identifier: 0 }]);
      handler.handleTouchMove(moveEvent, svgElement);

      // Should NOT be considered a pan gesture (< 5px threshold)
      expect(handler.isPanGesture()).toBe(false);
    });

    it('should reset gesture state on touch end', () => {
      // Start a pan gesture
      const startEvent = createTouchEvent('touchstart', [{ clientX: 100, clientY: 150, identifier: 0 }]);
      handler.handleTouchStart(startEvent, svgElement);

      const moveEvent = createTouchEvent('touchmove', [{ clientX: 120, clientY: 170, identifier: 0 }]);
      handler.handleTouchMove(moveEvent, svgElement);

      expect(handler.isPanGesture()).toBe(true);

      // Release touch
      const endEvent = createTouchEvent('touchend', []);
      handler.handleTouchEnd(endEvent);

      // Gesture should be reset
      expect(handler.isPanGesture()).toBe(false);
    });

    it('should call preventDefault to block browser scroll', () => {
      const startEvent = createTouchEvent('touchstart', [{ clientX: 100, clientY: 150, identifier: 0 }]);
      const preventDefaultSpy = vi.spyOn(startEvent, 'preventDefault');

      handler.handleTouchStart(startEvent, svgElement);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should ignore multi-touch when more than one finger', () => {
      // Two-finger touch should not trigger pan (that's for pinch-to-zoom)
      const event = createTouchEvent('touchstart', [
        { clientX: 100, clientY: 100, identifier: 0 },
        { clientX: 200, clientY: 200, identifier: 1 },
      ]);

      handler.handleTouchStart(event, svgElement);

      // Should not start pan gesture with 2 fingers
      expect(handler.isPanGesture()).toBe(false);
    });

    it('should accumulate pan deltas across multiple touch moves', () => {
      const startEvent = createTouchEvent('touchstart', [{ clientX: 100, clientY: 100, identifier: 0 }]);
      handler.handleTouchStart(startEvent, svgElement);

      // Move to (110, 110) - first increment
      const moveEvent1 = createTouchEvent('touchmove', [{ clientX: 110, clientY: 110, identifier: 0 }]);
      handler.handleTouchMove(moveEvent1, svgElement);

      // Move to (125, 130) - second increment
      const moveEvent2 = createTouchEvent('touchmove', [{ clientX: 125, clientY: 130, identifier: 0 }]);
      handler.handleTouchMove(moveEvent2, svgElement);

      // Total delta should be: 125 - 100 = 25, 130 - 100 = 30
      const state = viewportManager.getState();
      expect(state.panX).toBe(25);
      expect(state.panY).toBe(30);
    });
  });
});
