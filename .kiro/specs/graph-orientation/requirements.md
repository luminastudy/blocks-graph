# Requirements Document

## Introduction

This feature adds configurable graph orientation to the `@luminastudy/blocks-graph` Web Component, allowing developers to control the directional flow of node layouts. Currently, the graph uses a fixed top-to-bottom (TTB) layout where parent nodes appear above their children. This enhancement will support multiple orientation modes: top-to-bottom (TTB), left-to-right (LTR), right-to-left (RTL), and bottom-to-top (BTT).

**Business Value:**

- **Internationalization Support**: RTL orientation aligns with Hebrew and Arabic reading patterns, improving UX for right-to-left language users
- **Flexible Visualization**: Different orientation modes suit different use cases (e.g., organizational charts vs. process flows)
- **Framework Consistency**: Maintains the component's framework-agnostic nature while extending layout capabilities
- **Enhanced Accessibility**: Allows matching visual hierarchy to cultural reading conventions

This feature extends the existing layout configuration system without breaking changes, following the component's declarative attribute pattern and imperative API design.

## Requirements

### Requirement 1: Orientation Configuration

**Objective:** As a developer using the blocks-graph component, I want to specify the graph's orientation direction, so that nodes are arranged according to my preferred visual layout (top-to-bottom, left-to-right, right-to-left, or bottom-to-top).

#### Acceptance Criteria

1. WHEN a developer sets the `orientation` attribute to "ttb" THEN the BlocksGraph component SHALL arrange nodes in a top-to-bottom layout where parent nodes appear above child nodes
2. WHEN a developer sets the `orientation` attribute to "ltr" THEN the BlocksGraph component SHALL arrange nodes in a left-to-right layout where parent nodes appear to the left of child nodes
3. WHEN a developer sets the `orientation` attribute to "rtl" THEN the BlocksGraph component SHALL arrange nodes in a right-to-left layout where parent nodes appear to the right of child nodes
4. WHEN a developer sets the `orientation` attribute to "btt" THEN the BlocksGraph component SHALL arrange nodes in a bottom-to-top layout where parent nodes appear below child nodes
5. WHEN no `orientation` attribute is specified THEN the BlocksGraph component SHALL default to "ttb" (top-to-bottom) orientation to maintain backward compatibility
6. WHEN an invalid orientation value is provided THEN the BlocksGraph component SHALL log a warning and fall back to the default "ttb" orientation
7. WHERE the orientation is "ttb" or "btt" THE BlocksGraph component SHALL apply vertical spacing between levels and horizontal spacing between siblings
8. WHERE the orientation is "ltr" or "rtl" THE BlocksGraph component SHALL apply horizontal spacing between levels and vertical spacing between siblings

### Requirement 2: Web Component Attribute Integration

**Objective:** As a developer using HTML markup, I want to configure orientation using standard Web Component attributes, so that I can set the graph direction declaratively without JavaScript.

#### Acceptance Criteria

1. WHEN the `orientation` attribute is added to the `observedAttributes` list THEN the BlocksGraph component SHALL respond to attribute changes and re-render the graph
2. WHEN a developer changes the `orientation` attribute value dynamically THEN the BlocksGraph component SHALL detect the change via `attributeChangedCallback` and trigger a re-layout
3. WHEN the orientation attribute changes from one valid value to another THEN the BlocksGraph component SHALL preserve block data and selection state while applying the new layout
4. IF the component is already rendered with blocks AND the orientation changes THEN the BlocksGraph component SHALL automatically re-render without requiring manual data reload

### Requirement 3: JavaScript API Support

**Objective:** As a developer using the imperative API, I want to set and get the orientation property programmatically, so that I can control graph direction through JavaScript code.

#### Acceptance Criteria

1. WHEN a developer accesses `graph.orientation` THEN the BlocksGraph component SHALL return the current orientation value ("ttb", "ltr", "rtl", or "btt")
2. WHEN a developer sets `graph.orientation = "ltr"` THEN the BlocksGraph component SHALL update the orientation attribute and trigger a re-render
3. IF no orientation has been explicitly set THEN accessing `graph.orientation` SHALL return "ttb" as the default value
4. WHEN the orientation property is set via JavaScript THEN the corresponding HTML attribute SHALL be updated to maintain attribute-property synchronization

### Requirement 4: Layout Engine Adaptation

**Objective:** As a system component, the GraphEngine needs to compute node positions based on orientation, so that blocks are correctly positioned according to the specified directional flow.

#### Acceptance Criteria

1. WHEN the orientation is "ttb" THEN the GraphEngine SHALL calculate positions using vertical levels (y-axis) with depth increasing downward
2. WHEN the orientation is "btt" THEN the GraphEngine SHALL calculate positions using vertical levels (y-axis) with depth increasing upward
3. WHEN the orientation is "ltr" THEN the GraphEngine SHALL calculate positions using horizontal levels (x-axis) with depth increasing to the right
4. WHEN the orientation is "rtl" THEN the GraphEngine SHALL calculate positions using horizontal levels (x-axis) with depth increasing to the left
5. WHERE orientation changes the primary layout axis THE GraphEngine SHALL swap the roles of horizontal and vertical spacing parameters appropriately
6. WHEN calculating block positions for any orientation THEN the GraphEngine SHALL maintain consistent spacing ratios and relative positioning between connected nodes

### Requirement 5: Edge Rendering Adaptation

**Objective:** As a rendering component, the GraphRenderer needs to draw edges correctly for different orientations, so that relationship lines connect nodes appropriately regardless of layout direction.

#### Acceptance Criteria

1. WHEN the orientation is "ttb" THEN the GraphRenderer SHALL draw edges from the bottom center of parent nodes to the top center of child nodes
2. WHEN the orientation is "btt" THEN the GraphRenderer SHALL draw edges from the top center of parent nodes to the bottom center of child nodes
3. WHEN the orientation is "ltr" THEN the GraphRenderer SHALL draw edges from the right center of parent nodes to the left center of child nodes
4. WHEN the orientation is "rtl" THEN the GraphRenderer SHALL draw edges from the left center of parent nodes to the right center of child nodes
5. WHERE edges connect nodes in any orientation THE GraphRenderer SHALL maintain visual consistency in line styling (stroke width, color, dash patterns)

### Requirement 6: Configuration Type Safety

**Objective:** As a TypeScript developer, I want proper type definitions for orientation values, so that I get compile-time validation and IDE autocomplete when using the component.

#### Acceptance Criteria

1. WHEN TypeScript type definitions are generated THEN the orientation configuration SHALL be defined as a union type of literal strings: `"ttb" | "ltr" | "rtl" | "btt"`
2. WHEN the GraphLayoutConfig interface is extended THEN it SHALL include an optional `orientation` property with the correct type
3. IF a developer uses TypeScript AND provides an invalid orientation value THEN the TypeScript compiler SHALL show a type error before runtime
4. WHEN developers use IDEs with TypeScript support THEN they SHALL receive autocomplete suggestions for valid orientation values

### Requirement 7: Backward Compatibility

**Objective:** As an existing user of the blocks-graph component, I want my current implementations to continue working without changes, so that upgrading to the new version doesn't break my application.

#### Acceptance Criteria

1. WHEN existing code does not specify an orientation attribute THEN the BlocksGraph component SHALL behave identically to previous versions using top-to-bottom layout
2. WHEN existing configuration objects are passed to GraphEngine THEN they SHALL work correctly even without an orientation property
3. IF the orientation property is omitted from configuration THEN the GraphEngine SHALL default to "ttb" behavior matching current implementation
4. WHEN the component loads with no orientation specified THEN all existing examples, tests, and documentation SHALL continue to function without modification

### Requirement 8: Documentation and Examples

**Objective:** As a developer learning to use the orientation feature, I want clear documentation and examples, so that I can understand how to configure and use different orientations effectively.

#### Acceptance Criteria

1. WHEN the feature is implemented THEN the README.md SHALL include orientation in the Attributes table with description, type, default value, and valid options
2. WHEN developers read API documentation THEN they SHALL find clear examples showing how to set orientation via HTML attributes and JavaScript properties
3. WHERE orientation affects behavior THE documentation SHALL explain how spacing parameters apply differently for vertical vs. horizontal orientations
4. WHEN developers view examples THEN at least one example SHALL demonstrate changing orientation dynamically and show the visual effect

### Requirement 9: Schema Validation Compatibility

**Objective:** As a system ensuring data integrity, the existing schema validation must continue to work correctly regardless of graph orientation, so that block data remains valid and relationships are preserved.

#### Acceptance Criteria

1. WHEN blocks are loaded with schema validation AND orientation is set THEN the schema adaptor SHALL validate data identically for all orientation modes
2. IF orientation changes after blocks are loaded THEN all prerequisite and parent relationships SHALL remain valid and correctly connected
3. WHEN the graph re-renders with a new orientation THEN block IDs, titles, and relationship references SHALL be preserved unchanged

### Requirement 10: Performance Consistency

**Objective:** As a performance-conscious developer, I want orientation changes to have minimal performance impact, so that the graph remains responsive when switching between layout modes.

#### Acceptance Criteria

1. WHEN orientation is changed dynamically THEN the re-layout and re-render operation SHALL complete within the same time bounds as the initial render
2. IF the graph contains a large number of blocks AND orientation changes THEN the component SHALL not cause noticeable UI lag or blocking
3. WHEN calculating positions for any orientation THEN the GraphEngine SHALL maintain O(n) time complexity where n is the number of blocks
