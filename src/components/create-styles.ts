/**
 * Create and return a style element for the blocks graph
 */
export function createStyles(): HTMLStyleElement {
  const style = document.createElement('style')
  style.textContent = `
    :host {
      display: block;
      width: 100%;
      height: 100%;
      min-height: 400px;
    }

    svg {
      width: 100%;
      height: 100%;
    }

    .block {
      cursor: pointer;
      transition: opacity 0.2s;
    }

    .block:hover rect {
      filter: brightness(0.95);
    }

    .edge {
      pointer-events: none;
    }

    .error {
      color: #d32f2f;
      padding: 1rem;
      font-family: system-ui, -apple-system, sans-serif;
    }
  `
  return style
}
