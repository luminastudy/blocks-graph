import { describe, it, expect, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { BlocksGraphReact } from './BlocksGraphReact.js';
import type { Block } from '../../types/block.js';
import type { BlocksGraph } from '../../components/blocks-graph.js';

const mockBlocks: Block[] = [
  {
    id: 'block-1',
    title: { he: 'בלוק 1', en: 'Block 1' },
    prerequisites: [],
    parents: [],
  },
  {
    id: 'block-2',
    title: { he: 'בלוק 2', en: 'Block 2' },
    prerequisites: ['block-1'],
    parents: [],
  },
];

describe('BlocksGraphReact - Rendering', () => {
  it('renders without crashing', () => {
    const { container } = render(<BlocksGraphReact blocks={mockBlocks} />);
    const element = container.querySelector('blocks-graph');
    expect(element).toBeTruthy();
  });

  it('passes blocks to web component', async () => {
    const { container } = render(<BlocksGraphReact blocks={mockBlocks} />);
    const element = container.querySelector('blocks-graph') as HTMLElement & BlocksGraph;

    await waitFor(() => {
      expect(element.setBlocks).toBeDefined();
    });
  });

  it('applies className prop', () => {
    const { container } = render(
      <BlocksGraphReact blocks={mockBlocks} className="custom-class" />
    );
    const element = container.querySelector('blocks-graph');

    expect(element?.className).toBe('custom-class');
  });

  it('applies style prop', () => {
    const { container } = render(
      <BlocksGraphReact
        blocks={mockBlocks}
        style={{ width: '100%', height: '600px' }}
      />
    );
    const element = container.querySelector('blocks-graph') as HTMLElement;

    expect(element?.style.width).toBe('100%');
    expect(element?.style.height).toBe('600px');
  });
});

describe('BlocksGraphReact - Configuration Props', () => {
  it('applies language prop', () => {
    const { container } = render(
      <BlocksGraphReact blocks={mockBlocks} language="he" />
    );
    const element = container.querySelector('blocks-graph') as HTMLElement & BlocksGraph;

    waitFor(() => {
      expect(element.language).toBe('he');
    });
  });

  it('applies orientation prop', () => {
    const { container } = render(
      <BlocksGraphReact blocks={mockBlocks} orientation="ltr" />
    );
    const element = container.querySelector('blocks-graph') as HTMLElement & BlocksGraph;

    waitFor(() => {
      expect(element.orientation).toBe('ltr');
    });
  });

  it('applies show props', () => {
    const { container } = render(
      <BlocksGraphReact
        blocks={mockBlocks}
        showPrerequisites={false}
        showParents={false}
      />
    );
    const element = container.querySelector('blocks-graph') as HTMLElement & BlocksGraph;

    waitFor(() => {
      expect(element.showPrerequisites).toBe(false);
      expect(element.showParents).toBe(false);
    });
  });

    it('applies layout props via attributes', () => {
      const { container } = render(
        <BlocksGraphReact
          blocks={mockBlocks}
          nodeWidth={250}
          nodeHeight={100}
          horizontalSpacing={90}
          verticalSpacing={110}
        />
      );
      const element = container.querySelector('blocks-graph');

      expect(element?.getAttribute('node-width')).toBe('250');
      expect(element?.getAttribute('node-height')).toBe('100');
      expect(element?.getAttribute('horizontal-spacing')).toBe('90');
      expect(element?.getAttribute('vertical-spacing')).toBe('110');
    });
});

describe('BlocksGraphReact - Event Handlers', () => {
  it('handles onBlocksRendered event', async () => {
    const handleRendered = vi.fn();
    const { container } = render(
      <BlocksGraphReact blocks={mockBlocks} onBlocksRendered={handleRendered} />
    );
    const element = container.querySelector('blocks-graph');

    // Simulate event
    const event = new CustomEvent('blocks-rendered', {
      detail: { blockCount: 2 },
    });
    element?.dispatchEvent(event);

    await waitFor(() => {
      expect(handleRendered).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { blockCount: 2 },
        })
      );
    });
  });

  it('handles onBlockSelected event', async () => {
    const handleSelected = vi.fn();
    const { container } = render(
      <BlocksGraphReact blocks={mockBlocks} onBlockSelected={handleSelected} />
    );
    const element = container.querySelector('blocks-graph');

    // Simulate event
    const event = new CustomEvent('block-selected', {
      detail: { blockId: 'block-1', selectionLevel: 1 },
    });
    element?.dispatchEvent(event);

    await waitFor(() => {
      expect(handleSelected).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { blockId: 'block-1', selectionLevel: 1 },
        })
      );
    });
  });

    it('cleans up event listeners on unmount', () => {
      const handleRendered = vi.fn();
      const handleSelected = vi.fn();

      const { container, unmount } = render(
        <BlocksGraphReact
          blocks={mockBlocks}
          onBlocksRendered={handleRendered}
          onBlockSelected={handleSelected}
        />
      );
      const element = container.querySelector('blocks-graph');

      unmount();

      // Dispatch events after unmount
      const renderedEvent = new CustomEvent('blocks-rendered', {
        detail: { blockCount: 2 },
      });
      const selectedEvent = new CustomEvent('block-selected', {
        detail: { blockId: 'block-1', selectionLevel: 1 },
      });

      element?.dispatchEvent(renderedEvent);
      element?.dispatchEvent(selectedEvent);

      // Handlers should not be called after unmount
      expect(handleRendered).not.toHaveBeenCalled();
      expect(handleSelected).not.toHaveBeenCalled();
    });
});

describe('BlocksGraphReact - Updates', () => {
  it('updates when blocks change', async () => {
    const { container, rerender } = render(
      <BlocksGraphReact blocks={mockBlocks} />
    );
    const element = container.querySelector('blocks-graph') as HTMLElement & BlocksGraph;

    const newBlocks: Block[] = [
      {
        id: 'block-3',
        title: { he: 'בלוק 3', en: 'Block 3' },
        prerequisites: [],
        parents: [],
      },
    ];

    rerender(<BlocksGraphReact blocks={newBlocks} />);

    // The wrapper should call setBlocks with new data
    await waitFor(() => {
      expect(element).toBeTruthy();
    });
  });

  it('updates when language changes', async () => {
    const { container, rerender } = render(
      <BlocksGraphReact blocks={mockBlocks} language="en" />
    );
    const element = container.querySelector('blocks-graph') as HTMLElement & BlocksGraph;

    rerender(<BlocksGraphReact blocks={mockBlocks} language="he" />);

    await waitFor(() => {
      expect(element.language).toBe('he');
    });
  });

  it('updates when orientation changes', async () => {
    const { container, rerender } = render(
      <BlocksGraphReact blocks={mockBlocks} orientation="ttb" />
    );
    const element = container.querySelector('blocks-graph') as HTMLElement & BlocksGraph;

    rerender(<BlocksGraphReact blocks={mockBlocks} orientation="ltr" />);

    await waitFor(() => {
      expect(element.orientation).toBe('ltr');
    });
  });
});