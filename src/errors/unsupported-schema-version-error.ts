/**
 * Error thrown when an unsupported schema version is requested
 */
export class UnsupportedSchemaVersionError extends Error {
  constructor(public readonly version: string) {
    super(`Unsupported schema version: ${version}`);
    this.name = 'UnsupportedSchemaVersionError';
  }
}
