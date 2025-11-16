# Implementation Plan

## Phase 1: Core Viewport Infrastructure

- [x] 1. Implement viewport state management system
- [x] 1.1 Create viewport state tracking with zoom and pan
  - Build state container for zoom level, pan offset (x, y), and zoom limits
  - Implement default values: zoom at 1.0 (100%), pan at origin (0, 0)
  - Set default zoom boundaries at 0.1x minimum and 5.0x maximum
  - Create getters for retrieving current state values
  - _Requirements: 3.1, 3.2, 4.1, 4.2_

- [x] 1.2 Implement zoom limit validation and constraint enforcement
  - Build validation logic ensuring minimum zoom is less than maximum
  - Create clamping mechanism to enforce zoom stays within boundaries
  - Implement setter for configurable zoom limits with validation
  - Add warning logging for invalid limit configurations
  - _Requirements: 3.3, 3.4, 3.6, 3.7_

- [x] 1.3 Create SVG transformation matrix calculation
  - Build matrix generation from zoom level and pan offset
  - Implement uniform scaling (zoom applied equally to both axes)
  - Ensure matrix format matches SVG specification: [a, b, c, d, e, f]
  - Create matrix-to-string converter for SVG transform attribute
  - _Requirements: 1.3, 4.4_

- [x] 1.4 Implement viewport reset functionality
  - Create reset operation returning zoom to 1.0 and pan to origin
  - Ensure reset preserves configured zoom limits
  - Build mechanism to trigger reset externally
  - _Requirements: 4.1, 4.2, 5.3_

- [x] 1.5 Add unit tests for viewport state management
  - Test default state initialization values
  - Verify zoom limit validation and clamping behavior
  - Test matrix calculation for various zoom/pan combinations
  - Verify reset functionality returns to defaults
  - Test invalid inputs trigger appropriate warnings
  - _Requirements: All Requirement 3, 4 items_

## Phase 2: Gesture Recognition System

- [ ] 2. Build mouse and pointer event handling
- [x] 2.1 Implement pointer event tracking for pan gestures
  - Create gesture state tracking for pointer down, move, up events
  - Store initial pointer position on press
  - Calculate movement delta during pointer move
  - Implement 5-pixel movement threshold for click vs drag distinction
  - _Requirements: 2.1, 2.2, 2.3, 2.7, 8.3_

- [x] 2.2 Implement pan operation with movement tracking
  - Build pan delta calculation from pointer movement
  - Apply pan offset updates to viewport state
  - Ensure zoom level remains constant during pan
  - Handle pointer movement outside component bounds
  - _Requirements: 2.2, 2.4, 2.5, 2.6, 2.9_

- [x] 2.3 Implement wheel event handling for zoom
  - Capture wheel events and prevent default browser zoom
  - Calculate zoom delta from wheel event deltaY
  - Implement fixed zoom increment per wheel tick
  - Apply zoom changes respecting min/max limits
  - _Requirements: 1.1, 1.2, 1.4, 1.5_

- [x] 2.4 Implement cursor-centered zoom transformation
  - Convert mouse screen coordinates to SVG coordinate space
  - Calculate zoom center point at cursor position
  - Adjust pan offset to maintain cursor position during zoom
  - Apply inverse transform calculation for coordinate conversion
  - _Requirements: 1.6, 1.7, 4.4_

- [x] 2.5 Add unit tests for gesture recognition
  - Test pointer tracking initialization and cleanup
  - Verify 5-pixel threshold distinguishes click from drag
  - Test wheel event zoom delta calculation
  - Verify cursor-centered zoom maintains position
  - Test gesture state reset on pointer up
  - _Requirements: All Requirement 1, 2, 8.3 items_

- [ ] 3. Implement touch gesture support
- [x] 3.1 Build single-finger touch pan gesture
  - Track touch start position and movement
  - Calculate pan delta from touch move events
  - Prevent default browser scroll and zoom behaviors
  - Distinguish tap from pan using movement threshold
  - _Requirements: 7.1, 7.4, 7.5_

- [ ] 3.2 Implement two-finger pinch-to-zoom gesture
  - Detect two simultaneous touch points
  - Calculate distance between touch points
  - Derive zoom scale factor from distance change
  - Apply zoom centered at midpoint between fingers
  - _Requirements: 7.2, 7.3, 7.6_

- [ ] 3.3 Add touch gesture fallback and compatibility
  - Implement graceful degradation for browsers without touch support
  - Ensure touch and mouse events don't conflict
  - Apply same zoom and pan limits to touch gestures
  - _Requirements: 7.7, 7.8_

- [ ] 3.4 Add unit tests for touch gesture handling
  - Test single-finger pan delta calculation
  - Verify pinch gesture zoom scale derivation
  - Test touch threshold for tap vs pan distinction
  - Verify preventDefault called to avoid browser conflicts
  - Test fallback behavior when touch unsupported
  - _Requirements: All Requirement 7 items_

## Phase 3: Component Integration

- [ ] 4. Integrate viewport system into BlocksGraph component
- [ ] 4.1 Add viewport-related component attributes
  - Add enable-pan attribute to observed attributes list
  - Add enable-zoom attribute to observed attributes list
  - Add min-zoom and max-zoom attributes for limit configuration
  - Implement attribute change callbacks for viewport attributes
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.7_

- [ ] 4.2 Wire gesture handlers to Shadow DOM events
  - Attach pointer event listeners to SVG element in Shadow DOM
  - Connect wheel event listener with passive: false for preventDefault
  - Add touch event listeners for pinch gesture support
  - Ensure event listeners cleaned up on component disconnect
  - _Requirements: 1.1, 1.2, 2.1, 7.1, 7.2_

- [ ] 4.3 Implement viewport configuration from attributes
  - Parse enable-pan and enable-zoom boolean attributes
  - Parse min-zoom and max-zoom numeric attributes with validation
  - Apply default values when attributes not specified
  - Log warnings for invalid attribute values
  - _Requirements: 6.5, 6.6, 6.8_

- [ ] 4.4 Integrate viewport state with render pipeline
  - Pass viewport transform to renderer during render cycle
  - Preserve viewport state across data changes and re-renders
  - Trigger viewport reset when orientation attribute changes
  - Ensure viewport state maintained during block selection changes
  - _Requirements: 4.5, 4.6, 4.7, 4.8_

- [ ] 4.5 Add integration tests for component attributes
  - Test attribute parsing and default value application
  - Verify attribute changes trigger re-render with new settings
  - Test orientation change resets viewport
  - Verify invalid attributes logged and defaults used
  - _Requirements: All Requirement 6 items_

- [ ] 5. Extend GraphRenderer with viewport transform application
- [ ] 5.1 Implement transform group wrapping in SVG output
  - Create viewport transform group element in SVG
  - Wrap existing edges and blocks groups inside transform group
  - Apply transform matrix as SVG matrix attribute
  - Maintain existing viewBox calculation for initial fit
  - _Requirements: 1.3, 2.5, 4.4_

- [ ] 5.2 Add backward compatibility for non-viewport rendering
  - Render without transform group when viewport not provided
  - Preserve existing rendering behavior for legacy usage
  - Ensure all existing tests pass without modification
  - _Requirements: 12.1, 12.2, 12.4_

- [ ] 5.3 Add unit tests for renderer viewport integration
  - Test transform group creation and nesting
  - Verify matrix string format correctness
  - Test backward compatibility without viewport
  - Verify existing rendering logic unchanged
  - _Requirements: 1.3, 4.4, 12.2_

## Phase 4: Visual Feedback and User Experience

- [ ] 6. Implement cursor visual feedback system
- [ ] 6.1 Add cursor styles for pan/zoom interactions
  - Create CSS rule for grab cursor on graph background
  - Implement grabbing cursor during active pan gesture
  - Maintain pointer cursor on block elements
  - Revert cursor states on interaction completion
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [ ] 6.2 Handle cursor states for disabled interactions
  - Use default cursor when pan disabled via attribute
  - Use default cursor when zoom disabled via attribute
  - Ensure cursor styles respect enable/disable configuration
  - _Requirements: 9.5_

- [ ] 6.3 Implement smooth visual updates with animation frame
  - Use requestAnimationFrame for pan/zoom render scheduling
  - Throttle rapid events to maintain 60 FPS target
  - Ensure single render per frame for combined pan+zoom
  - Implement fallback for environments without requestAnimationFrame
  - _Requirements: 9.8, 10.1, 10.2_

- [ ] 6.4 Add integration tests for visual feedback
  - Test cursor style changes during interaction lifecycle
  - Verify requestAnimationFrame throttling behavior
  - Test smooth updates without flickering
  - Verify fallback behavior when rAF unavailable
  - _Requirements: 1.9, 9.6, 9.7, 9.8_

## Phase 5: Selection Integration and Disambiguation

- [ ] 7. Integrate viewport interactions with block selection
- [ ] 7.1 Implement click vs pan disambiguation
  - Track total movement distance during pointer drag
  - Compare movement against 5-pixel threshold on pointer up
  - Trigger block click handler when movement below threshold
  - Prevent block selection when movement exceeds threshold
  - _Requirements: 8.1, 8.2, 8.3, 8.7_

- [ ] 7.2 Preserve selection state during viewport changes
  - Maintain selected block ID during pan operations
  - Preserve selection highlighting during zoom operations
  - Keep dimmed blocks state consistent during transforms
  - Ensure viewport reset preserves selection unless explicit clear
  - _Requirements: 8.4, 8.5, 8.6, 8.8_

- [ ] 7.3 Add integration tests for selection preservation
  - Test click triggers selection when movement < 5px
  - Verify pan occurs without selection when movement ≥ 5px
  - Test selection highlighting persists during pan/zoom
  - Verify block-selected events not emitted during pan
  - _Requirements: All Requirement 8 items_

## Phase 6: Programmatic API

- [ ] 8. Implement public API for viewport control
- [ ] 8.1 Add zoom property getter and setter
  - Expose current zoom level as readonly property
  - Implement setter with validation and limit clamping
  - Log warning when programmatic zoom exceeds limits
  - Trigger re-render when zoom set programmatically
  - _Requirements: 5.1, 5.2, 5.6, 5.7_

- [ ] 8.2 Implement resetViewport public method
  - Create method to reset zoom to 1.0 and pan to origin
  - Trigger re-render after reset
  - Preserve selection state during reset
  - _Requirements: 5.3, 5.6, 8.8_

- [ ] 8.3 Implement panTo navigation method
  - Create method accepting target x, y coordinates
  - Validate numeric coordinates and throw on invalid input
  - Update pan offset to center viewport at target
  - Trigger re-render with new pan position
  - _Requirements: 5.4, 5.6_

- [ ] 8.4 Implement zoomToFit automatic framing
  - Calculate graph bounding box from positioned blocks
  - Compute zoom and pan to fit graph in viewport
  - Apply calculated transform respecting zoom limits
  - Trigger re-render with fitted viewport
  - _Requirements: 5.5, 5.6_

- [ ] 8.5 Add unit tests for programmatic API
  - Test zoom property setter with valid and invalid values
  - Verify resetViewport returns to defaults
  - Test panTo with various coordinates
  - Verify zoomToFit calculates correct transform
  - Test API methods trigger appropriate renders
  - _Requirements: All Requirement 5 items_

## Phase 7: Keyboard Accessibility

- [ ] 9. Implement keyboard navigation controls
- [ ] 9.1 Add keyboard shortcuts for zoom control
  - Implement "+" and Ctrl+"+" for zoom in
  - Implement "-" and Ctrl+"-" for zoom out
  - Apply keyboard zoom increment (default 0.2x)
  - Center keyboard zoom on viewport center
  - _Requirements: 11.1, 11.3_

- [ ] 9.2 Implement arrow key pan navigation
  - Handle arrow key presses when component focused
  - Apply pan step distance per arrow key (default 50px)
  - Support all four directions (up, down, left, right)
  - _Requirements: 11.2_

- [ ] 9.3 Add viewport reset keyboard shortcut
  - Implement Ctrl+0 and Cmd+0 for reset
  - Reset zoom to 1.0 and pan to origin
  - Preserve selection state during reset
  - _Requirements: 11.4_

- [ ] 9.4 Implement keyboard event accessibility features
  - Prevent default browser zoom shortcuts to avoid conflicts
  - Add focus indicator when component receives keyboard focus
  - Announce zoom level changes to screen readers via ARIA
  - Provide ARIA labels describing pan/zoom capabilities
  - _Requirements: 11.5, 11.6, 11.7, 11.8_

- [ ] 9.5 Add unit tests for keyboard navigation
  - Test zoom in/out keyboard shortcuts
  - Verify arrow keys pan in correct directions
  - Test Ctrl+0 reset shortcut
  - Verify preventDefault called for browser shortcuts
  - Test ARIA announcements for state changes
  - _Requirements: All Requirement 11 items_

## Phase 8: Performance Optimization

- [ ] 10. Optimize rendering performance
- [ ] 10.1 Implement transform-based rendering strategy
  - Apply viewport transforms without re-rendering graph elements
  - Cache transform matrix and update only when state changes
  - Use CSS transforms for GPU acceleration where possible
  - Avoid re-calculating block positions during pan/zoom
  - _Requirements: 10.3, 10.5, 10.8_

- [ ] 10.2 Add event throttling for high-frequency interactions
  - Throttle wheel events to prevent excessive zoom updates
  - Batch pointer move events via requestAnimationFrame
  - Limit render frequency to 60 FPS maximum
  - Implement fallback for constrained environments
  - _Requirements: 10.2, 10.6, 10.7_

- [ ] 10.3 Add performance benchmarking tests
  - Measure pan/zoom render time with 100-block graphs
  - Verify 60 FPS maintained during continuous interactions
  - Test rapid wheel events throttled appropriately
  - Verify no memory leaks in gesture state cleanup
  - Measure performance with 500-block graphs (30 FPS acceptable)
  - _Requirements: 10.1, 10.4_

## Phase 9: Error Handling and Edge Cases

- [ ] 11. Implement robust error handling
- [ ] 11.1 Add attribute parsing validation
  - Validate numeric attributes (min-zoom, max-zoom) parse correctly
  - Log warnings for non-numeric or invalid attribute values
  - Use default values when parsing fails
  - Validate min-zoom < max-zoom relationship
  - _Requirements: 3.6, 3.7, 6.8_

- [ ] 11.2 Handle runtime error scenarios
  - Prevent transform overflow with safe numeric bounds
  - Handle missing SVG element gracefully in event handlers
  - Implement fallback when requestAnimationFrame unavailable
  - Log errors without breaking component functionality
  - _Requirements: Error handling requirements_

- [ ] 11.3 Add boundary condition tests
  - Test zoom at minimum and maximum limits
  - Verify behavior with extreme pan values
  - Test simultaneous conflicting gestures
  - Verify orientation change during active gesture
  - Test component disconnect during active pan
  - _Requirements: 3.5, 3.8_

## Phase 10: Testing and Documentation

- [ ] 12. Create comprehensive test suite
- [ ] 12.1 Add E2E tests for complete user workflows
  - Test full pan gesture lifecycle (press, drag, release)
  - Test zoom workflow with cursor positioning
  - Test touch pinch gesture on mobile viewports
  - Test block selection after pan gesture
  - Test keyboard navigation complete flows
  - _Requirements: All major requirements_

- [ ] 12.2 Add cross-browser compatibility tests
  - Verify Pointer Events work in Chrome, Firefox, Safari
  - Test touch gestures on mobile browsers (iOS Safari, Chrome)
  - Verify wheel events across different mouse/trackpad devices
  - Test keyboard shortcuts on Windows and macOS
  - _Requirements: 7.7, 11.7_

- [ ] 12.3 Create Storybook examples and documentation
  - Build interactive story demonstrating pan with mouse
  - Create story showing zoom with scroll wheel
  - Add story for touch gestures on mobile
  - Demonstrate programmatic API usage
  - Show keyboard navigation examples
  - Document all attributes and their effects
  - _Requirements: 13.1, 13.2, 13.4, 13.7_

- [ ] 12.4 Update README and TypeScript definitions
  - Add pan/zoom attributes to README attributes table
  - Document programmatic API methods with TypeScript examples
  - Include valid value ranges for configuration attributes
  - Add troubleshooting section for common issues
  - Export TypeScript types for viewport state and configuration
  - Add JSDoc comments to all public API methods
  - _Requirements: 13.1, 13.2, 13.3, 13.5, 13.6, 13.8_

## Phase 11: Integration and Polish

- [ ] 13. Integrate all features and validate requirements
- [ ] 13.1 Verify backward compatibility
  - Test existing examples work without modification
  - Verify default behavior matches pre-viewport rendering
  - Ensure all existing tests pass
  - Test graphs render correctly at default viewport (zoom=1, pan=0)
  - _Requirements: 12.1, 12.2, 12.4_

- [ ] 13.2 Validate complete requirements coverage
  - Cross-reference all 13 requirements with implemented features
  - Test all acceptance criteria are satisfied
  - Verify edge cases and error scenarios handled
  - Confirm performance targets met (60 FPS for ≤100 blocks)
  - _Requirements: All 13 requirements_

- [ ] 13.3 Final integration testing
  - Test pan/zoom with all orientation modes (TTB, LTR, RTL, BTT)
  - Verify interaction with show-prerequisites and show-parents toggles
  - Test multiple BlocksGraph instances on same page
  - Verify viewport state isolation between instances
  - Test with real-world large graph data (Open University curriculum)
  - _Requirements: 4.7, 12.6, 12.7_

- [ ] 13.4 Polish and finalize
  - Review cursor feedback consistency across all states
  - Ensure visual transitions smooth without jarring effects
  - Verify silent behavior at zoom limits (no error messages)
  - Confirm ARIA labels and announcements working
  - Final code review and cleanup
  - _Requirements: 9.6, 11.5, 11.8_
