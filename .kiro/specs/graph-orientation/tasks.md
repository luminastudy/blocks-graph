# Implementation Plan

## Task Overview

This implementation adds configurable graph orientation to the blocks-graph Web Component, enabling developers to control directional flow (top-to-bottom, left-to-right, right-to-left, bottom-to-top) while maintaining full backward compatibility. The work extends three core components with type-safe configuration and comprehensive testing.

## Implementation Tasks

- [x] 1. Define orientation types and extend configuration interfaces
- [x] 1.1 Create orientation type definition with four valid values
  - Define union type for orientation values supporting TTB, LTR, RTL, and BTT modes
  - Ensure type provides compile-time validation for invalid orientation strings
  - Enable IDE autocomplete for orientation values in TypeScript projects
  - _Requirements: 6.1, 6.3, 6.4_

- [x] 1.2 Extend layout configuration to include orientation property
  - Add optional orientation property to layout configuration interface
  - Update default configuration to explicitly include TTB orientation
  - Maintain backward compatibility by making orientation property optional
  - Ensure TypeScript type checking enforces valid orientation values
  - _Requirements: 6.2, 7.2, 7.3_

- [x] 1.3 Write unit tests for type definitions and configuration
  - Test that valid orientation values are accepted by TypeScript compiler
  - Test that invalid orientation values trigger compile-time type errors
  - Verify default configuration includes TTB orientation
  - Test configuration merging preserves orientation when specified
  - Test configuration merging uses default orientation when omitted
  - _Requirements: 6.1, 6.2, 7.3_

- [x] 2. Implement layout engine position calculation for all orientations
- [x] 2.1 Build axis selection logic based on orientation
  - Determine whether to use vertical axis (TTB, BTT) or horizontal axis (LTR, RTL) for level progression
  - Calculate direction multiplier for reversed orientations (BTT, RTL)
  - Select appropriate spacing parameter based on orientation and axis
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 2.2 Implement position calculation for vertical orientations
  - Calculate block positions for top-to-bottom orientation with downward level progression
  - Calculate block positions for bottom-to-top orientation with upward level progression
  - Apply vertical spacing between levels and horizontal spacing between siblings
  - Ensure maximum level calculation for reversed direction positioning
  - _Requirements: 1.1, 1.4, 1.7, 4.1, 4.2_

- [x] 2.3 Implement position calculation for horizontal orientations
  - Calculate block positions for left-to-right orientation with rightward level progression
  - Calculate block positions for right-to-left orientation with leftward level progression
  - Apply horizontal spacing between levels and vertical spacing between siblings
  - Swap axis assignments so x-coordinate represents level depth
  - _Requirements: 1.2, 1.3, 1.8, 4.3, 4.4_

- [x] 2.4 Write comprehensive layout engine tests for all orientations
  - Test TTB orientation produces correct y-axis positions with downward progression
  - Test BTT orientation produces correct y-axis positions with upward progression
  - Test LTR orientation produces correct x-axis positions with rightward progression
  - Test RTL orientation produces correct x-axis positions with leftward progression
  - Test spacing parameter application for vertical and horizontal orientations
  - Test consistent spacing ratios across all orientations
  - Verify layout maintains O(n) complexity for all orientation modes
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 10.3_

- [x] 3. Implement edge rendering with orientation-aware connection points
- [x] 3.1 Create connection point calculation helper method
  - Build method accepting block positions and orientation to calculate edge endpoints
  - Calculate bottom-to-top connection points for TTB orientation
  - Calculate top-to-bottom connection points for BTT orientation
  - Calculate right-to-left connection points for LTR orientation
  - Calculate left-to-right connection points for RTL orientation
  - Ensure connection points are always at block boundary centers
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 3.2 Integrate connection point calculation into edge rendering
  - Pass orientation configuration to edge rendering logic
  - Use connection point helper to determine edge start and end coordinates
  - Maintain existing edge styling for all orientations
  - Preserve visual consistency across orientation changes
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 3.3 Write comprehensive edge rendering tests for all orientations
  - Test TTB edges connect from parent bottom-center to child top-center
  - Test BTT edges connect from parent top-center to child bottom-center
  - Test LTR edges connect from parent right-center to child left-center
  - Test RTL edges connect from parent left-center to child right-center
  - Test edge styling remains consistent across all orientations
  - Verify connection points align with block boundaries correctly
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 4. Extend Web Component with orientation attribute and property
- [x] 4.1 Add orientation to observed attributes list
  - Include orientation in component's observed attributes array
  - Ensure attribute changes trigger attributeChangedCallback lifecycle
  - _Requirements: 2.1_

- [x] 4.2 Implement orientation attribute change handler
  - Detect orientation attribute changes in attributeChangedCallback
  - Validate orientation value against allowed values (TTB, LTR, RTL, BTT)
  - Log warning for invalid orientation values with guidance
  - Fall back to default TTB orientation for invalid values
  - Trigger layout configuration update when orientation changes
  - _Requirements: 1.6, 2.2_

- [x] 4.3 Implement orientation getter and setter properties
  - Create getter returning current orientation attribute value or TTB default
  - Create setter that updates orientation attribute and triggers re-render
  - Maintain attribute-property synchronization bidirectionally
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 4.4 Update layout configuration builder to include orientation
  - Extract orientation value from component attributes during config building
  - Pass orientation to layout engine via configuration object
  - Handle missing orientation gracefully with default value
  - Ensure new GraphEngine instance receives orientation configuration
  - _Requirements: 2.2, 4.5_

- [x] 4.5 Write Web Component attribute integration tests
  - Test orientation attribute added to observedAttributes array
  - Test setting orientation attribute via HTML triggers re-render
  - Test changing orientation attribute dynamically updates layout
  - Test invalid orientation value logs warning and uses TTB default
  - Test orientation getter returns current value or TTB default
  - Test orientation setter updates attribute and triggers re-render
  - Test attribute-property synchronization works bidirectionally
  - _Requirements: 1.6, 2.1, 2.2, 3.1, 3.2, 3.3, 3.4_

- [ ] 5. Implement dynamic orientation changes with state preservation
- [ ] 5.1 Ensure block data preservation during orientation changes
  - Verify block data array remains unchanged when orientation changes
  - Confirm block IDs, titles, and relationships persist across re-layout
  - Test prerequisite and parent relationships remain valid after orientation change
  - _Requirements: 2.3, 9.2, 9.3_

- [ ] 5.2 Ensure selection state preservation during orientation changes
  - Preserve selected block ID when orientation changes
  - Maintain selection level state through re-layout
  - Verify dimmed blocks set remains consistent after orientation change
  - _Requirements: 2.3_

- [ ] 5.3 Verify automatic re-render without manual data reload
  - Test component re-renders automatically when orientation changes
  - Confirm no manual loadFromJson or setBlocks call needed after orientation change
  - Validate complete render cycle executes with new orientation
  - _Requirements: 2.4_

- [ ] 5.4 Write integration tests for dynamic orientation changes
  - Test changing orientation from TTB to LTR preserves all block data
  - Test switching between all four orientations maintains relationships
  - Test selection state persists through multiple orientation changes
  - Test re-render completes without requiring data reload
  - Measure re-render performance matches initial render time bounds
  - _Requirements: 2.3, 2.4, 9.2, 9.3, 10.1_

- [ ] 6. Validate backward compatibility with existing implementations
- [ ] 6.1 Test default behavior without orientation specified
  - Verify component renders using TTB layout when orientation attribute absent
  - Test JavaScript API returns "ttb" when no orientation set
  - Confirm configuration objects work without orientation property
  - Ensure GraphEngine defaults to TTB behavior with empty configuration
  - _Requirements: 1.5, 7.1, 7.2, 7.3_

- [ ] 6.2 Run existing test suite without modifications
  - Execute all existing unit tests and verify they pass unchanged
  - Run existing integration tests without any code modifications
  - Confirm existing examples render identically to previous version
  - Validate no breaking changes in component API or behavior
  - _Requirements: 7.4_

- [ ] 6.3 Verify schema validation compatibility
  - Test schema validation works identically for all orientation modes
  - Verify data integrity maintained across orientation changes
  - Confirm prerequisite and parent relationships validate correctly regardless of orientation
  - _Requirements: 9.1, 9.2, 9.3_

- [ ] 7. Perform performance validation and optimization
- [ ] 7.1 Benchmark layout calculation performance
  - Measure layout calculation time for 100 blocks in each orientation
  - Verify all orientations complete within similar time bounds
  - Test performance remains under 50ms for 100-block graphs
  - _Requirements: 10.1, 10.3_

- [ ] 7.2 Benchmark orientation change performance
  - Measure complete re-layout and re-render time for orientation changes
  - Test with varying graph sizes (10, 50, 100, 500 blocks)
  - Verify orientation changes complete within initial render time bounds
  - Ensure no noticeable UI lag for graphs up to 500 blocks
  - _Requirements: 10.1, 10.2_

- [ ] 7.3 Verify algorithmic complexity
  - Confirm layout calculation scales linearly with block count
  - Test 1000-block graph completes within 10x the 100-block time
  - Verify O(n) complexity maintained for all four orientations
  - _Requirements: 10.3_

- [ ] 8. Update documentation and examples
- [ ] 8.1 Update README with orientation documentation
  - Add orientation to Attributes table with description and valid values
  - Include HTML attribute examples for all four orientations
  - Add JavaScript property examples showing dynamic orientation changes
  - Document default value (TTB) and backward compatibility guarantee
  - _Requirements: 8.1, 8.2_

- [ ] 8.2 Document spacing parameter behavior
  - Explain how spacing parameters apply differently for vertical vs horizontal orientations
  - Clarify vertical spacing becomes level spacing for LTR/RTL modes
  - Clarify horizontal spacing becomes level spacing for TTB/BTT modes
  - Provide visual examples showing spacing in different orientations
  - _Requirements: 8.3_

- [ ] 8.3 Create interactive orientation demonstration
  - Build example showing dynamic orientation switching with controls
  - Include UI controls for changing orientation between all four modes
  - Display same graph data in different orientations for comparison
  - Add to HTML example or create dedicated orientation demo
  - _Requirements: 8.4_

- [ ] 8.4 Update TypeScript type documentation
  - Document Orientation type with valid values and usage examples
  - Add JSDoc comments explaining orientation configuration
  - Provide code examples showing type-safe orientation usage
  - Include autocomplete guidance for IDE users
  - _Requirements: 6.4, 8.2_
