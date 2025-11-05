import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { expect, userEvent } from '@storybook/test';
import '../index.js';

// Sample data for stories
const EXAMPLE_BLOCKS = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    title: {
      he_text: 'מבוא למתמטיקה',
      en_text: 'Introduction to Mathematics',
    },
    prerequisites: [],
    parents: [],
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    title: {
      he_text: 'אלגברה ליניארית',
      en_text: 'Linear Algebra',
    },
    prerequisites: ['550e8400-e29b-41d4-a716-446655440000'],
    parents: ['550e8400-e29b-41d4-a716-446655440000'],
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    title: {
      he_text: 'חשבון אינפיניטסימלי',
      en_text: 'Calculus',
    },
    prerequisites: ['550e8400-e29b-41d4-a716-446655440000'],
    parents: ['550e8400-e29b-41d4-a716-446655440000'],
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    title: {
      he_text: 'אנליזה מתמטית',
      en_text: 'Mathematical Analysis',
    },
    prerequisites: [
      '550e8400-e29b-41d4-a716-446655440001',
      '550e8400-e29b-41d4-a716-446655440002',
    ],
    parents: ['550e8400-e29b-41d4-a716-446655440002'],
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    title: {
      he_text: 'תורת המספרים',
      en_text: 'Number Theory',
    },
    prerequisites: ['550e8400-e29b-41d4-a716-446655440001'],
    parents: ['550e8400-e29b-41d4-a716-446655440001'],
  },
];

const meta: Meta = {
  title: 'Components/BlocksGraph',
  component: 'blocks-graph',
  tags: ['autodocs'],
  argTypes: {
    language: {
      control: 'select',
      options: ['en', 'he'],
      description: 'Language for block titles',
      table: {
        defaultValue: { summary: 'en' },
      },
    },
    showPrerequisites: {
      control: 'boolean',
      description: 'Show prerequisite relationships',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    showParents: {
      control: 'boolean',
      description: 'Show parent relationships',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    nodeWidth: {
      control: { type: 'number', min: 100, max: 400, step: 10 },
      description: 'Width of each node in pixels',
      table: {
        defaultValue: { summary: '200' },
      },
    },
    nodeHeight: {
      control: { type: 'number', min: 40, max: 200, step: 10 },
      description: 'Height of each node in pixels',
      table: {
        defaultValue: { summary: '60' },
      },
    },
    horizontalSpacing: {
      control: { type: 'number', min: 20, max: 200, step: 10 },
      description: 'Horizontal spacing between nodes',
      table: {
        defaultValue: { summary: '100' },
      },
    },
    verticalSpacing: {
      control: { type: 'number', min: 20, max: 200, step: 10 },
      description: 'Vertical spacing between nodes',
      table: {
        defaultValue: { summary: '80' },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A Web Component for rendering interactive block dependency graphs. ' +
          'Displays educational content blocks with their prerequisites and relationships. ' +
          'Features click-to-explore functionality with three-level selection states.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

/**
 * Default story showing the BlocksGraph component with sample mathematics curriculum data.
 * Click on any block to show its prerequisites and post-requisites.
 * Click again to toggle sub-blocks, or a third time to reset to default view.
 */
export const Default: Story = {
  render: (args) => {
    // Create a unique ID for this story instance to avoid conflicts
    const storyId = `graph-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return html`
      <div style="width: 100%; height: 600px; border: 1px solid #ddd; border-radius: 4px;">
        <blocks-graph
          id="${storyId}"
          language="${args.language}"
          show-prerequisites="${args.showPrerequisites}"
          show-parents="${args.showParents}"
          node-width="${args.nodeWidth || ''}"
          node-height="${args.nodeHeight || ''}"
          horizontal-spacing="${args.horizontalSpacing || ''}"
          vertical-spacing="${args.verticalSpacing || ''}"
          @block-selected="${(e: CustomEvent) => {
            console.log('Block selected:', e.detail);
          }}"
          @blocks-rendered="${(e: CustomEvent) => {
            console.log('Blocks rendered:', e.detail);
          }}"
        ></blocks-graph>
      </div>
      <script>
        // Load example data after a short delay to ensure the component is ready
        setTimeout(() => {
          const graph = document.getElementById('${storyId}');
          if (graph && typeof graph.loadFromJson === 'function') {
            graph.loadFromJson(${JSON.stringify(JSON.stringify(EXAMPLE_BLOCKS))}, 'v0.1');
          }
        }, 100);
      </script>
    `;
  },
  args: {
    language: 'en',
    showPrerequisites: true,
    showParents: true,
  },
  play: async ({ canvasElement }) => {
    // Wait for the graph to render
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Find the blocks-graph element
    const graphElement = canvasElement.querySelector('blocks-graph');
    expect(graphElement).toBeTruthy();

    // Check that the shadow DOM is rendered
    expect(graphElement?.shadowRoot).toBeTruthy();

    // Find SVG element in shadow DOM
    const svg = graphElement?.shadowRoot?.querySelector('svg');
    expect(svg).toBeTruthy();

    // Test interaction: click on a block
    const blocks = graphElement?.shadowRoot?.querySelectorAll('g[data-block-id]');
    if (blocks && blocks.length > 0) {
      const firstBlock = blocks[0] as HTMLElement;

      // Click the first block to show its graph
      await userEvent.click(firstBlock);

      // Wait for re-render
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Verify that block-selected event was dispatched
      // (This is logged to console, which we can't easily test here)
      console.log('Interaction test: clicked first block');
    }
  },
};

/**
 * Story demonstrating root block auto-hide behavior with Combinatorics curriculum.
 * The root block "Combinatorics - The Open University" should be hidden,
 * and its 7 children should be shown automatically on initial render.
 */
export const CombinatoricsRootAutoHide: Story = {
  render: (args) => {
    const storyId = `combinatorics-graph-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Fetch the Combinatorics JSON from GitHub
    const fetchAndLoadData = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/luminastudy/the-open-university-combinatorics/refs/heads/main/lumin.json');
        const data = await response.json();

        const element = document.getElementById(storyId);
        if (element && 'loadFromJson' in element && typeof element.loadFromJson === 'function') {
          element.loadFromJson(JSON.stringify(data), 'v0.1');
        }
      } catch (error) {
        console.error('Failed to load Combinatorics data:', error);
      }
    };

    // Load data after component is ready
    setTimeout(fetchAndLoadData, 100);

    return html`
      <div>
        <div style="padding: 16px; background: #f5f5f5; border-radius: 4px; margin-bottom: 16px;">
          <h3 style="margin: 0 0 8px 0;">Expected Behavior</h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li><strong>Root block</strong> ("Combinatorics - The Open University") should be <strong>hidden</strong></li>
            <li><strong>7 children</strong> should be shown automatically</li>
            <li>Check browser console for debug output</li>
          </ul>
        </div>
        <div style="width: 100%; height: 800px; border: 1px solid #ddd; border-radius: 4px;">
          <blocks-graph
            id="${storyId}"
            language="${args.language}"
            show-prerequisites="${args.showPrerequisites}"
            show-parents="${args.showParents}"
          ></blocks-graph>
        </div>
      </div>
    `;
  },
  args: {
    language: 'en',
    showPrerequisites: true,
    showParents: true,
  },
};
