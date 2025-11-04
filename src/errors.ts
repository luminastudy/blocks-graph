/**
 * Custom error classes for the blocks-graph library
 */

/**
 * Error thrown when block schema validation fails
 */
export class InvalidBlockSchemaError extends Error {
  constructor(message: string, public readonly validationErrors?: string) {
    super(message);
    this.name = 'InvalidBlockSchemaError';
  }
}

/**
 * Error thrown when an unsupported schema version is requested
 */
export class UnsupportedSchemaVersionError extends Error {
  constructor(public readonly version: string) {
    super(`Unsupported schema version: ${version}`);
    this.name = 'UnsupportedSchemaVersionError';
  }
}

/**
 * Error thrown when fetching blocks from a URL fails
 */
export class BlocksFetchError extends Error {
  constructor(url: string, public readonly statusText: string) {
    super(`Failed to fetch blocks from ${url}: ${statusText}`);
    this.name = 'BlocksFetchError';
  }
}
