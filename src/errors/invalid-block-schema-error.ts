/**
 * Error thrown when block schema validation fails
 */
export class InvalidBlockSchemaError extends Error {
  constructor(message: string, public readonly validationErrors?: string) {
    super(message);
    this.name = 'InvalidBlockSchemaError';
  }
}
