/**
 * Create and return an error message element
 */
export function createErrorMessage(errorMessage: string): HTMLDivElement {
  const errorDiv = document.createElement('div')
  errorDiv.className = 'error'
  errorDiv.textContent = `Error: ${errorMessage}`
  return errorDiv
}
