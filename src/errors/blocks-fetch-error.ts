/**
 * Error thrown when fetching blocks from a URL fails
 */
export class BlocksFetchError extends Error {
  constructor(
    url: string,
    public readonly statusText: string
  ) {
    super(`Failed to fetch blocks from ${url}: ${statusText}`)
    this.name = 'BlocksFetchError'
  }
}
