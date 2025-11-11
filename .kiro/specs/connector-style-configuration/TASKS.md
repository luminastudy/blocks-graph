# Implementation Plan

## Task Overview

This implementation transforms the connector rendering system from simple SVG lines to a comprehensive path-based system supporting arrows, curves, animations, and multiple configuration methods. Tasks follow a 6-phase approach building from foundation to polish, with each phase validated before proceeding to the next.

## Implementation Tasks

- [ ] 1. Establish core path rendering foundation
- [ ] 1.1 Define unified connector style configuration structure
  - Create configuration interface for all connector visual properties
  - Define color, width, and dash pattern properties
  - Include arrow marker configuration properties
  - Add curve type and tension configuration
  - Specify animation configuration structure
  - Establish default values for all properties
  - _Requirements: 1.1, 1.2, 1.3, 4.1, 4.3_

- [ ] 1.2 Implement configuration migration from legacy format
  - Build migration logic for existing prerequisite edge styles
  - Build migration logic for existing parent edge styles
  - Merge prerequisite and parent styles into unified configuration
  - Map legacy property names to new unified names
  - Preserve visual output identical to previous version
  - Apply default values for properties not in legacy config
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.8_

- [ ] 1.3 Replace line rendering with path-based rendering
  - Generate straight-line SVG path data for connector endpoints
  - Replace line element creation with path element creation
  - Apply path data to SVG path elements
  - Maintain existing CSS class naming conventions
  - Preserve data attributes for edge tracking
  - Ensure z-order renders edges before blocks
  - _Requirements: 1.1, 1.2, 3.1, 3.6, 9.8_

- [ ] 1.4 Apply basic connector styling properties
  - Read stroke color from configuration and apply to paths
  - Read stroke width from configuration and apply to paths
  - Read dash pattern from configuration and apply to paths
  - Handle undefined dash pattern for solid lines
  - Validate color values and fallback to defaults for invalid
  - Clamp width values to valid range
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 4.3_

- [ ] 1.5 Validate path rendering produces identical visual output
  - Test straight paths render at same positions as previous lines
  - Verify stroke colors match legacy configuration
  - Verify stroke widths match legacy configuration
  - Verify dash patterns match legacy configuration
  - Confirm CSS classes preserved correctly
  - Validate dimming opacity still functions
  - _Requirements: 9.8, Visual regression test_

- [ ] 2. Build arrow marker system for directional indicators
- [ ] 2.1 Create marker definition management system
  - Build registry for tracking created marker definitions
  - Generate unique marker IDs from style signatures
  - Detect duplicate styles to enable marker reuse
  - Store marker IDs mapped to style signatures
  - Provide lookup mechanism for existing markers
  - Enable clearing all markers from registry
  - _Requirements: 2.2, 2.9, 11.1_

- [ ] 2.2 Generate SVG marker definitions for arrow heads
  - Create SVG marker element with correct viewBox
  - Set reference point for arrow positioning
  - Define arrow shape using SVG path
  - Configure marker dimensions based on arrow size
  - Set orientation to auto-rotate with path direction
  - Add marker definition to SVG defs element
  - _Requirements: 2.1, 2.2, 2.3, 2.7, 2.8_

- [ ] 2.3 Apply marker colors and sizing configuration
  - Read arrow color from configuration or use stroke color
  - Scale arrow marker dimensions based on arrow size
  - Apply fill color to arrow path shape
  - Validate arrow size values and clamp to valid range
  - Handle undefined arrow color by inheriting stroke color
  - _Requirements: 2.3, 2.4, 2.5_

- [ ] 2.4 Attach markers to connector path elements
  - Check if arrows enabled in configuration
  - Retrieve or create marker definition for edge style
  - Set marker-end attribute on path element
  - Remove marker-end attribute when arrows disabled
  - Verify arrows point toward target node
  - Position arrows at exact path endpoint
  - _Requirements: 2.1, 2.6, 2.7, 2.8_

- [ ] 2.5 Optimize marker reuse across multiple edges
  - Check marker registry before creating new markers
  - Return existing marker ID for identical styles
  - Measure marker definition count in SVG defs
  - Verify single marker serves multiple edges with same style
  - Test performance with hundreds of edges sharing markers
  - _Requirements: 2.9, 11.1, 11.7_

- [ ] 3. Implement curved path generation algorithms
- [ ] 3.1 Build straight path generation utility
  - Calculate path data for linear connections
  - Generate moveto command from source point
  - Generate lineto command to target point
  - Format path data string following SVG specification
  - Return valid SVG path data string
  - _Requirements: 3.6, 1.1_

- [ ] 3.2 Implement bezier curve calculation logic
  - Calculate control points based on tension parameter
  - Generate cubic bezier curve commands
  - Ensure smooth curve flow from source to target
  - Handle tension range from straight to maximum curve
  - Format bezier path data string correctly
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.8_

- [ ] 3.3 Build arc path generation for curved connectors
  - Calculate arc radius and rotation parameters
  - Generate arc command with correct sweep direction
  - Ensure natural curve appearance for connections
  - Format arc path data string following SVG spec
  - _Requirements: 3.1, 3.5, 3.8_

- [ ] 3.4 Integrate curve algorithms with path rendering
  - Select appropriate curve algorithm based on curve type
  - Apply tension parameter to control curve intensity
  - Generate curved path data for non-straight types
  - Default to straight paths when curve type unspecified
  - Maintain backward compatibility with straight-only rendering
  - _Requirements: 3.6, 4.5_

- [ ] 3.5 Calculate tangent angles for arrow alignment on curves
  - Compute curve tangent at endpoint for arrow rotation
  - Ensure arrows align with curve direction
  - Handle both bezier and arc curve types
  - Verify arrow pointing matches curve flow
  - _Requirements: 3.9, 2.8_

- [ ] 3.6 Handle multiple edges between same nodes
  - Detect when multiple edges share same endpoints
  - Apply different curve offsets to prevent overlap
  - Ensure each edge renders with distinct path
  - Maintain visual clarity for overlapping edges
  - _Requirements: 3.7_

- [ ] 4. Enable multiple configuration methods
- [ ] 4.1 Implement programmatic API configuration
  - Accept connector style configuration in renderer constructor
  - Merge provided configuration with defaults
  - Support partial configuration updates via updateConfig
  - Preserve unspecified properties during updates
  - Validate configuration values and apply defaults for invalid
  - Provide method to query current configuration
  - _Requirements: 4.1, 4.2, 4.6, 4.7, 4.8, 4.9_

- [ ] 4.2 Build per-edge style override system
  - Create storage for edge-specific style overrides
  - Generate edge identifiers from source and target IDs
  - Provide API to set custom style for specific edge
  - Provide API to clear custom style for specific edge
  - Resolve final style by merging edge override with global config
  - Query edge overrides during rendering
  - _Requirements: 5.1, 5.2, 5.8, 5.9_

- [ ] 4.3 Apply per-edge style overrides during rendering
  - Check for edge-specific override before using global config
  - Override color for edges with custom color specified
  - Override width for edges with custom width specified
  - Override dash pattern for edges with custom pattern specified
  - Override arrow settings for edges with custom arrows
  - Override curve settings for edges with custom curves
  - _Requirements: 5.3, 5.4, 5.5, 5.6, 5.7_

- [ ] 4.4 Add web component attributes for connector styling
  - Register new attributes for edge color, width, and dash pattern
  - Register attributes for arrow enablement and sizing
  - Register attributes for curve type and tension
  - Register attributes for animation settings
  - Observe attribute changes in web component
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [ ] 4.5 Handle web component attribute changes
  - Parse attribute values when changed
  - Validate attribute values and apply defaults for invalid
  - Update renderer configuration when attributes change
  - Trigger graph re-render after configuration update
  - Log warnings for invalid attribute values
  - Revert to defaults when attributes removed
  - _Requirements: 7.7, 7.8, 7.9_

- [ ] 4.6 Implement CSS custom property reading
  - Read CSS variables from shadow DOM computed styles
  - Map CSS variable names to configuration properties
  - Parse CSS variable values to appropriate types
  - Handle undefined CSS variables gracefully
  - Validate CSS variable values and ignore invalid
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

- [ ] 4.7 Detect CSS custom property changes
  - Set up mutation observer for style changes
  - Detect when CSS variable values change
  - Cache CSS variable values for comparison
  - Trigger configuration update when changes detected
  - Apply CSS variables as lowest priority configuration
  - _Requirements: 6.8, 6.9_

- [ ] 4.8 Establish configuration priority system
  - Apply per-edge overrides at highest priority
  - Apply programmatic API config at second priority
  - Apply web component attributes at third priority
  - Apply CSS custom properties at lowest priority
  - Resolve final configuration by merging priority layers
  - _Requirements: 6.9, Configuration priority requirement_

- [ ] 5. Add animation and transition polish
- [ ] 5.1 Configure CSS transitions for connector properties
  - Enable CSS transitions when animation enabled in config
  - Set transition duration from animation configuration
  - Set transition easing function from animation configuration
  - Apply transitions to stroke color property
  - Apply transitions to stroke width property
  - Disable transitions when animation disabled
  - _Requirements: 10.1, 10.2, 10.3, 10.7_

- [ ] 5.2 Implement smooth style change animations
  - Animate color changes with configured duration
  - Animate width changes with configured duration
  - Ensure smooth visual transitions between values
  - Verify transition easing functions work correctly
  - _Requirements: 10.2, 10.3, 10.5, 10.6_

- [ ] 5.3 Add fade animations for edge visibility
  - Animate edge opacity when edges appear
  - Animate edge opacity when edges disappear
  - Apply fade-in effect for new edges
  - Apply fade-out effect for removed edges
  - _Requirements: 10.4_

- [ ] 5.4 Handle path morphing for curve type changes
  - Interpolate between straight and curved paths
  - Animate path data changes smoothly
  - Ensure smooth visual transition during path morphing
  - _Requirements: 10.9_

- [ ] 5.5 Ensure graceful degradation for browsers without transitions
  - Detect browser support for CSS transitions
  - Apply instant style updates if transitions unsupported
  - Maintain functionality without animations
  - _Requirements: 10.8_

- [ ] 6. Optimize performance and validate functionality
- [ ] 6.1 Implement selective edge re-rendering
  - Track which edges have style changes
  - Skip re-rendering for unchanged edges
  - Only update DOM for affected edge elements
  - Skip style attribute updates when values unchanged
  - _Requirements: 11.2, 11.3_

- [ ] 6.2 Add configuration value caching
  - Cache computed CSS variable values
  - Avoid redundant getComputedStyle calls
  - Use cached values for comparison
  - _Requirements: 11.5_

- [ ] 6.3 Optimize path generation with caching
  - Cache generated path data for position pairs
  - Reuse cached paths for repeated calculations
  - Implement efficient lookup for cached paths
  - _Requirements: 11.6, 11.7_

- [ ] 6.4 Batch DOM updates for style changes
  - Collect multiple style updates before applying
  - Apply updates in single DOM transaction
  - Minimize layout thrashing from repeated updates
  - _Requirements: 11.8_

- [ ] 6.5 Validate rendering performance targets
  - Measure edge rendering time with 100 edges
  - Verify render completes within 50ms target
  - Test with 500 edges and verify acceptable performance
  - Ensure animation frame rate maintains 60 FPS
  - Validate marker reuse limits defs element size
  - _Requirements: 11.7, 11.9, Performance targets_

- [ ] 6.6 Test unified styling across edge types
  - Verify prerequisite edges use unified configuration
  - Verify parent edges use unified configuration
  - Confirm no visual distinction between edge types by default
  - Test global style updates apply to all edge types
  - Validate dimming preserves styles while adjusting opacity
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8_

- [ ] 6.7 Verify backward compatibility with legacy configurations
  - Test legacy prerequisite style migrates correctly
  - Test legacy parent style migrates correctly
  - Test merged legacy styles produce expected unified config
  - Verify legacy dashArray maps to dashPattern correctly
  - Confirm visual output matches previous version exactly
  - Test mixed legacy and new config prioritizes new
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.9_

- [ ] 6.8 Validate error handling and fallback behavior
  - Test invalid color values fallback to defaults
  - Test out-of-range numeric values get clamped
  - Test unsupported curve types fallback to straight
  - Test invalid dash patterns render as solid
  - Verify path generation errors fallback to straight
  - Confirm marker creation failures skip arrows gracefully
  - _Requirements: Error handling requirements_

- [ ] 6.9 Create comprehensive test suite
  - Write unit tests for path generation algorithms
  - Write unit tests for marker management and reuse
  - Write unit tests for configuration migration logic
  - Write unit tests for style resolution and priority
  - Write integration tests for end-to-end configuration flow
  - Write integration tests for arrow marker integration
  - Write integration tests for curve path rendering
  - Write integration tests for animation behavior
  - Write visual regression tests comparing old and new rendering
  - Write performance benchmarks for large graphs
  - _Requirements: All requirements validated through tests_

- [ ] 7. Update documentation and examples
- [ ] 7.1 Document connector styling API in README
  - Add connector styling section to README
  - Document connectorStyle configuration properties
  - Explain color, width, dash pattern configuration
  - Explain arrow marker configuration
  - Explain curve type and tension configuration
  - Explain animation configuration
  - _Requirements: 12.1, 12.8_

- [ ] 7.2 Provide code examples for each configuration method
  - Show programmatic API configuration example
  - Show web component attribute configuration example
  - Show CSS custom property configuration example
  - Show per-edge style override example
  - Include both basic and advanced use cases
  - _Requirements: 12.2, 12.4_

- [ ] 7.3 Export TypeScript type definitions
  - Export ConnectorStyle interface from package
  - Export AnimationConfig interface from package
  - Export CurveType and EasingFunction types
  - Ensure type definitions available for library consumers
  - _Requirements: 12.3_

- [ ] 7.4 Create migration guide for upgrading
  - Document legacy edgeStyle configuration format
  - Explain new connectorStyle configuration format
  - Provide before and after code examples
  - List property name changes and mappings
  - Explain backward compatibility guarantee
  - _Requirements: 12.6_

- [ ] 7.5 Add visual reference documentation
  - Include screenshots of different connector styles
  - Show examples of arrows with various configurations
  - Show examples of curves with different tensions
  - Demonstrate animation effects visually
  - _Requirements: 12.7_

- [ ] 7.6 Update HTML example with connector features
  - Add connector style controls to HTML example
  - Demonstrate color, width, and dash pattern controls
  - Add arrow enable/disable toggle
  - Add curve type selector
  - Show animation controls
  - _Requirements: 12.9, HTML example requirement_

- [ ] 7.7 Update React example with connector features
  - Add connector style controls to React example
  - Implement state management for connector configuration
  - Demonstrate programmatic API usage
  - Show web component attribute binding
  - Include TypeScript type usage
  - _Requirements: 12.9, React example requirement_

- [ ] 7.8 Create troubleshooting guide
  - Document common configuration issues
  - Explain CSS variable priority behavior
  - Provide solutions for styling not applying
  - Address performance concerns with large graphs
  - Include debugging tips for visual issues
  - _Requirements: 12.5_
