# Kiro Specification Workflow

## Active Specifications

### connector-style-configuration
**Status**: Initialized
**Description**: Enable developers to customize connector/edge styles with advanced options including colors, widths, dash patterns, arrow markers, curves, and animations. Supports multiple configuration methods (programmatic API, web component attributes, CSS variables, per-edge styling).

**Phase**: initialized
**Spec Location**: `.kiro/specs/connector-style-configuration/`

### runnable-examples
**Status**: Completed
**Description**: Create an examples folder with runnable demonstrations showing how to use the @luminastudy/blocks-graph library in both React and pure HTML contexts.

**Phase**: tasks-generated
**Spec Location**: `.kiro/specs/runnable-examples/`

### graph-orientation
**Status**: Initialized
**Description**: Add configurable graph orientation options (top-to-bottom, right-to-left, left-to-right) to control how nodes are organized and displayed in the graph visualization.

**Phase**: initialized
**Spec Location**: `.kiro/specs/graph-orientation/`

### pan-zoom-interaction
**Status**: Initialized
**Description**: Enable users to pan around the graph by dragging and zoom in/out using mouse scroll wheel for better navigation of large graphs.

**Phase**: initialized
**Spec Location**: `.kiro/specs/pan-zoom-interaction/`

---

## Workflow Commands

Follow these commands in order for spec-driven development:

1. **`/kiro:spec-requirements <feature-name>`** - Generate comprehensive requirements
2. **`/kiro:spec-design <feature-name>`** - Create technical design (requires approved requirements)
3. **`/kiro:spec-tasks <feature-name>`** - Generate implementation tasks (requires approved design)
4. **`/kiro:spec-impl <feature-name> [task-numbers]`** - Execute implementation with TDD
5. **`/kiro:spec-status <feature-name>`** - Check specification status and progress
