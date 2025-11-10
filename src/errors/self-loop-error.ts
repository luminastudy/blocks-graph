/**
 * Error thrown when attempting to create a self-loop in the prerequisite graph
 */
export class SelfLoopError extends Error {
  constructor(public readonly blockId: string) {
    super(`Cannot add self-loop: block ${blockId} cannot be its own prerequisite`);
    this.name = 'SelfLoopError';
  }
}
