# Adaptors

Adaptors convert external schema formats into the internal `Block` format used by the blocks-graph system.

## Purpose

Different data sources may use different schemas to represent blocks and their relationships. Adaptors provide a clean abstraction layer that:

- Validates incoming data against schema specifications
- Transforms external formats to the internal Block representation
- Maintains version compatibility as schemas evolve
- Isolates the core system from schema-specific details

## Architecture

Adaptors are organized by schema version in subdirectories (e.g., `v0.1/`, `v0.2/`). Each version contains:

- **types.ts** - TypeScript types and validation logic for that schema version
- **adaptor.ts** - The adaptor class that performs transformations
- **adaptor.test.ts** - Test suite for the adaptor

This structure allows multiple schema versions to coexist and makes it easy to add support for new versions.

## Adaptor Interface

While adaptors may vary in implementation, they typically provide:

### Core Methods

- **`adapt(schemaBlock)`** - Convert a single block from external to internal format
- **`adaptMany(schemaBlocks)`** - Convert multiple blocks at once
- **`adaptFromJson(json)`** - Parse JSON string and adapt the blocks
- **`validate(data)`** - Static method to check if data conforms to the schema

### Validation

Adaptors use JSON Schema validation to ensure data integrity. Invalid data is either filtered out with warnings or throws an error, depending on the method used.

## Usage Pattern

```typescript
// Import the adaptor for your schema version
import { schemaV0XAdaptor } from './adaptors/v0.X/adaptor.js';

// Validate data
if (Adaptor.validate(externalData)) {
  // Adapt to internal format
  const blocks = adaptor.adapt(externalData);
}

// Parse and adapt from JSON
const blocks = adaptor.adaptFromJson(jsonString);

// Adapt multiple blocks
const blocks = adaptor.adaptMany(externalDataArray);
```

## Adding New Adaptors

When creating a new schema version adaptor:

1. Create a new versioned directory (e.g., `v0.2/`)
2. Define the schema types in `types.ts` with validation functions
3. Implement the adaptor class in `adaptor.ts`
4. Add comprehensive tests in `adaptor.test.ts`
5. Export a default instance for convenience

Ensure backward compatibility by maintaining older adaptors alongside new versions.
