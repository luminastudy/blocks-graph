/**
 * @lumina-study/blocks-graph
 *
 * Framework-agnostic Web Component for visualizing Lumina Study block schemas
 */

// Export the main Web Component
export { BlocksGraph } from './components/blocks-graph.js'

// Export types
export type { Block } from './types/block.js'
export { isBlock } from './types/is-block.js'
export type { BlockGraph } from './types/block-graph.js'
export type { BlockPosition } from './types/block-position.js'
export type { GraphEdge } from './types/graph-edge.js'
export type { PositionedBlock } from './types/positioned-block.js'
export type { Orientation } from './types/orientation.js'
export { isValidOrientation } from './types/is-valid-orientation.js'
export type { EdgeLineStyle } from './types/edge-style.js'
export { isValidEdgeLineStyle } from './types/is-valid-edge-line-style.js'
export { edgeLineStyleToDashArray } from './types/edge-line-style-to-dash-array.js'

// Export core classes
export { GraphEngine } from './core/graph-engine.js'
export { HorizontalRelationships } from './core/horizontal-relationships.js'
export type { GraphLayoutConfig } from './core/graph-layout-config.js'
export { GraphRenderer } from './core/renderer.js'
export type { RendererConfig } from './core/renderer-config.js'
export { removeTransitiveEdges } from './core/transitive-reduction.js'

// Export adaptors - v0.1
export { SchemaV01Adaptor } from './adaptors/v0.1/adaptor.js'
export { schemaV01Adaptor } from './adaptors/v0.1/instance.js'
export type { BlockSchemaV01 } from './adaptors/v0.1/types.js'
export type { BlockTitle } from './adaptors/v0.1/block-title.js'
export { isBlockSchemaV01 } from './adaptors/v0.1/validators.js'

// Export adaptors - v0.2
export { SchemaV02Adaptor } from './adaptors/v0.2/adaptor.js'
export { schemaV02Adaptor } from './adaptors/v0.2/instance.js'
export type { BlockSchemaV02 } from './adaptors/v0.2/types.js'
export { isBlockSchemaV02 } from './adaptors/v0.2/validators.js'
export { isLocalUuid } from './adaptors/v0.2/is-local-uuid.js'
export { isExternalReference } from './adaptors/v0.2/is-external-reference.js'
export { parseExternalReference } from './adaptors/v0.2/parse-external-reference.js'
export { getExternalReferenceUrl } from './adaptors/v0.2/get-external-reference-url.js'
export { getExternalReferenceLabel } from './adaptors/v0.2/get-external-reference-label.js'
export type { ExternalPlatform } from './adaptors/v0.2/external-platform.js'
export type { ParsedExternalReference } from './adaptors/v0.2/parsed-external-reference.js'

// Export custom errors
export { InvalidBlockSchemaError } from './errors/invalid-block-schema-error.js'
export { UnsupportedSchemaVersionError } from './errors/unsupported-schema-version-error.js'
export { BlocksFetchError } from './errors/blocks-fetch-error.js'
export { DuplicateBlockIdError } from './errors/duplicate-block-id-error.js'
