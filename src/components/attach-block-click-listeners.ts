/**
 * Attach click event listeners to block elements
 */
export function attachBlockClickListeners(
  svg: SVGElement,
  blockCount: number,
  handleBlockClick: (blockId: string) => void,
  dispatchEvent: (event: Event) => boolean
): void {
  const blockElements = svg.querySelectorAll('.block');
  blockElements.forEach((blockEl) => {
    const blockId = blockEl.getAttribute('data-id');
    if (blockId) {
      blockEl.addEventListener('click', () => {
        handleBlockClick(blockId);
      });
    }
  });

  // Dispatch custom event when render is complete
  dispatchEvent(new CustomEvent('blocks-rendered', {
    detail: { blockCount },
  }));
}
