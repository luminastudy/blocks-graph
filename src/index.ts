/**
 * @luminastudy/blocks-graph
 *
 * Framework-agnostic Web Component for visualizing Lumina Study block schemas
 */

// Export the main Web Component
export { BlocksGraph } from './components/blocks-graph.js';

// Export types
export type { Block, BlockGraph, BlockPosition, GraphEdge, PositionedBlock } from './types/block.js';

// Export core classes
export { GraphEngine } from './core/graph-engine.js';
export type { GraphLayoutConfig } from './core/graph-layout-config.js';
export { GraphRenderer } from './core/renderer.js';
export type { RendererConfig } from './core/renderer.js';

// Export adaptors
export { SchemaV01Adaptor } from './adaptors/v0.1/adaptor.js';
export { schemaV01Adaptor } from './adaptors/v0.1/instance.js';
export type { BlockSchemaV01 } from './adaptors/v0.1/types.js';
export type { BlockTitle } from './adaptors/v0.1/block-title.js';
export { isBlockSchemaV01 } from './adaptors/v0.1/validators.js';

// Export custom errors
export { InvalidBlockSchemaError, UnsupportedSchemaVersionError, BlocksFetchError } from './errors.js';
