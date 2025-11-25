import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import { expect, userEvent } from '@storybook/test'
import '../index.js'

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
]

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
    orientation: {
      control: 'select',
      options: ['ttb', 'ltr', 'rtl', 'btt'],
      description:
        'Graph orientation: ttb (top-to-bottom), ltr (left-to-right), rtl (right-to-left), btt (bottom-to-top)',
      table: {
        defaultValue: { summary: 'ttb' },
      },
    },
    prerequisiteLineStyle: {
      control: 'select',
      options: ['straight', 'dashed', 'dotted'],
      description:
        'Line style for prerequisite edges: straight (solid), dashed (8px/4px), dotted (2px/3px)',
      table: {
        defaultValue: { summary: 'dashed' },
      },
    },
    maxNodesPerLevel: {
      control: { type: 'number', min: 1, max: 20, step: 1 },
      description:
        'Maximum nodes per row (vertical) or column (horizontal) before wrapping to grid layout. ' +
        'Defaults to unlimited (no wrapping).',
      table: {
        defaultValue: { summary: 'undefined (unlimited)' },
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
}

export default meta
type Story = StoryObj

/**
 * Default story showing the BlocksGraph component with sample mathematics curriculum data.
 * The graph uses drill-down navigation:
 * - Initial view shows only root blocks (blocks with no parents)
 * - Click a block to navigate into it and view its children
 * - Click the same block again to return to the root view
 */
export const Default: Story = {
  render: args => {
    // Create a unique ID for this story instance to avoid conflicts
    const storyId = `graph-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 11)}`

    return html`
      <div
        style="width: 100%; height: 600px; border: 1px solid #ddd; border-radius: 4px;"
      >
        <blocks-graph
          id="${storyId}"
          language="${args.language}"
          show-prerequisites="${args.showPrerequisites}"
          node-width="${args.nodeWidth || ''}"
          node-height="${args.nodeHeight || ''}"
          horizontal-spacing="${args.horizontalSpacing || ''}"
          vertical-spacing="${args.verticalSpacing || ''}"
          orientation="${args.orientation || 'ttb'}"
          prerequisite-line-style="${args.prerequisiteLineStyle || 'dashed'}"
          @block-selected="${(e: CustomEvent) => {
            console.log('Block selected:', e.detail)
          }}"
          @blocks-rendered="${(e: CustomEvent) => {
            console.log('Blocks rendered:', e.detail)
          }}"
        ></blocks-graph>
      </div>
      <script>
        // Load example data after a short delay to ensure the component is ready
        setTimeout(() => {
          const graph = document.getElementById('${storyId}')
          if (graph && typeof graph.loadFromJson === 'function') {
            graph.loadFromJson(
              ${JSON.stringify(JSON.stringify(EXAMPLE_BLOCKS))},
              'v0.1'
            )
          }
        }, 100)
      </script>
    `
  },
  args: {
    language: 'en',
    showPrerequisites: true,
  },
  play: async ({ canvasElement }) => {
    // Wait for the graph to render
    await new Promise(resolve => setTimeout(resolve, 500))

    // Find the blocks-graph element
    const graphElement = canvasElement.querySelector('blocks-graph')
    expect(graphElement).toBeTruthy()

    // Check that the shadow DOM is rendered
    expect(graphElement?.shadowRoot).toBeTruthy()

    // Find SVG element in shadow DOM
    const svg = graphElement?.shadowRoot?.querySelector('svg')
    expect(svg).toBeTruthy()

    // Test interaction: click on a block
    const blocks =
      graphElement?.shadowRoot?.querySelectorAll('g[data-block-id]')
    if (blocks && blocks.length > 0) {
      const firstBlock = blocks[0] as HTMLElement

      // Click the first block to show its graph
      await userEvent.click(firstBlock)

      // Wait for re-render
      await new Promise(resolve => setTimeout(resolve, 300))

      // Verify that block-selected event was dispatched
      // (This is logged to console, which we can't easily test here)
      console.log('Interaction test: clicked first block')
    }
  },
}

/**
 * Story demonstrating root block auto-hide behavior with Combinatorics curriculum.
 * The root block "Combinatorics - The Open University" should be hidden,
 * and its 7 children should be shown automatically on initial render.
 */
export const CombinatoricsRootAutoHide: Story = {
  render: args => {
    const storyId = `combinatorics-graph-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 11)}`

    // Fetch the Combinatorics JSON from GitHub
    const fetchAndLoadData = async () => {
      try {
        // eslint-disable-next-line default/no-hardcoded-urls -- Example data for Storybook
        const response = await fetch(
          'https://raw.githubusercontent.com/luminastudy/the-open-university-combinatorics/refs/heads/main/lumina.json'
        )
        const data = await response.json()

        const element = document.getElementById(storyId)
        if (
          element &&
          'loadFromJson' in element &&
          typeof element.loadFromJson === 'function'
        ) {
          element.loadFromJson(JSON.stringify(data), 'v0.1')
        }
      } catch (error) {
        console.error('Failed to load Combinatorics data:', error)
      }
    }

    // Load data after component is ready
    setTimeout(fetchAndLoadData, 100)

    return html`
      <div>
        <div
          style="padding: 16px; background: #f5f5f5; border-radius: 4px; margin-bottom: 16px;"
        >
          <h3 style="margin: 0 0 8px 0;">Expected Behavior</h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li>
              <strong>Root block</strong> ("Combinatorics - The Open
              University") should be <strong>hidden</strong>
            </li>
            <li><strong>7 children</strong> should be shown automatically</li>
            <li>Check browser console for debug output</li>
          </ul>
        </div>
        <div
          style="width: 100%; height: 800px; border: 1px solid #ddd; border-radius: 4px;"
        >
          <blocks-graph
            id="${storyId}"
            language="${args.language}"
            show-prerequisites="${args.showPrerequisites}"
            orientation="${args.orientation || 'ttb'}"
          ></blocks-graph>
        </div>
      </div>
    `
  },
  args: {
    language: 'en',
    showPrerequisites: true,
  },
}

/**
 * Story demonstrating all four graph orientations side by side.
 * Shows how the same graph data can be rendered in different directions:
 * - TTB (Top-to-Bottom): Traditional hierarchical layout
 * - LTR (Left-to-Right): Horizontal flow, left to right
 * - RTL (Right-to-Left): Horizontal flow, right to left (for Hebrew/Arabic)
 * - BTT (Bottom-to-Top): Inverted hierarchical layout
 */
export const AllOrientations: Story = {
  render: () => {
    const orientations = [
      {
        value: 'ttb',
        label: 'Top-to-Bottom (TTB)',
        description: 'Traditional hierarchical layout',
      },
      {
        value: 'ltr',
        label: 'Left-to-Right (LTR)',
        description: 'Horizontal flow, ideal for timelines',
      },
      {
        value: 'rtl',
        label: 'Right-to-Left (RTL)',
        description: 'Horizontal flow for RTL languages',
      },
      {
        value: 'btt',
        label: 'Bottom-to-Top (BTT)',
        description: 'Inverted hierarchical layout',
      },
    ]

    return html`
      <div style="padding: 16px;">
        <h2 style="margin: 0 0 16px 0;">Graph Orientations Comparison</h2>
        <p style="margin: 0 0 24px 0; color: #666;">
          The same curriculum data displayed in four different orientations.
          Notice how edges connect appropriately for each orientation.
        </p>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
          ${orientations.map((orientation, index) => {
            const storyId = `orientation-${
              orientation.value
            }-${Date.now()}-${index}`

            setTimeout(() => {
              const graph = document.getElementById(storyId)
              if (
                graph &&
                'loadFromJson' in graph &&
                typeof graph.loadFromJson === 'function'
              ) {
                graph.loadFromJson(JSON.stringify(EXAMPLE_BLOCKS), 'v0.1')
              }
            }, 100)

            return html`
              <div
                style="border: 1px solid #ddd; border-radius: 8px; padding: 16px; background: white;"
              >
                <div style="margin-bottom: 12px;">
                  <h3 style="margin: 0 0 4px 0; color: #333;">
                    ${orientation.label}
                  </h3>
                  <p style="margin: 0; font-size: 14px; color: #666;">
                    ${orientation.description}
                  </p>
                </div>
                <div
                  style="width: 100%; height: 400px; border: 1px solid #e0e0e0; border-radius: 4px;"
                >
                  <blocks-graph
                    id="${storyId}"
                    language="en"
                    show-prerequisites="true"
                    show-parents="true"
                    orientation="${orientation.value}"
                    node-width="180"
                    node-height="70"
                    horizontal-spacing="60"
                    vertical-spacing="80"
                  ></blocks-graph>
                </div>
              </div>
            `
          })}
        </div>

        <div
          style="margin-top: 24px; padding: 16px; background: #f5f5f5; border-radius: 4px;"
        >
          <h4 style="margin: 0 0 8px 0;">Usage Example</h4>
          <pre
            style="margin: 0; padding: 12px; background: white; border-radius: 4px; overflow-x: auto;"
          ><code>&lt;blocks-graph orientation="ltr"&gt;&lt;/blocks-graph&gt;
&lt;blocks-graph orientation="rtl"&gt;&lt;/blocks-graph&gt;
&lt;blocks-graph orientation="ttb"&gt;&lt;/blocks-graph&gt;
&lt;blocks-graph orientation="btt"&gt;&lt;/blocks-graph&gt;</code></pre>
        </div>
      </div>
    `
  },
  parameters: {
    layout: 'fullscreen',
  },
}

/**
 * Story demonstrating prerequisite edge line styles.
 * Shows how different line styles can be used to customize prerequisite relationship edges.
 */
export const EdgeLineStyles: Story = {
  render: () => {
    const styleConfigs = [
      {
        style: 'straight',
        description: 'Solid line with no pattern',
      },
      {
        style: 'dashed',
        description: 'Default: Dashed line (8px/4px)',
      },
      {
        style: 'dotted',
        description: 'Dotted line (2px/3px)',
      },
    ]

    return html`
      <div style="padding: 16px;">
        <h2 style="margin: 0 0 16px 0;">Prerequisite Line Styles</h2>
        <p style="margin: 0 0 8px 0; color: #666;">
          Customize the appearance of prerequisite relationship edges.
        </p>
        <p style="margin: 0 0 24px 0; color: #666;">
          <strong>Available Styles:</strong> Straight (solid), Dashed (8px/4px),
          Dotted (2px/3px)
        </p>

        <div
          style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 24px;"
        >
          ${styleConfigs.map((config, index) => {
            const storyId = `edge-style-${index}-${Date.now()}-${Math.random()
              .toString(36)
              .substring(2, 11)}`

            setTimeout(() => {
              const graph = document.getElementById(storyId)
              if (
                graph &&
                'loadFromJson' in graph &&
                typeof graph.loadFromJson === 'function'
              ) {
                graph.loadFromJson(JSON.stringify(EXAMPLE_BLOCKS), 'v0.1')
              }
            }, 100)

            return html`
              <div
                style="border: 1px solid #ddd; border-radius: 8px; padding: 16px; background: white;"
              >
                <div style="margin-bottom: 12px;">
                  <h3 style="margin: 0 0 4px 0; color: #333; font-size: 16px;">
                    ${config.style}
                  </h3>
                  <p style="margin: 0; font-size: 13px; color: #666;">
                    ${config.description}
                  </p>
                </div>
                <div
                  style="width: 100%; height: 350px; border: 1px solid #e0e0e0; border-radius: 4px;"
                >
                  <blocks-graph
                    id="${storyId}"
                    language="en"
                    show-prerequisites="true"
                    prerequisite-line-style="${config.style}"
                    orientation="ttb"
                    node-width="160"
                    node-height="60"
                    horizontal-spacing="50"
                    vertical-spacing="70"
                  ></blocks-graph>
                </div>
              </div>
            `
          })}
        </div>

        <div
          style="margin-top: 24px; padding: 16px; background: #f5f5f5; border-radius: 4px;"
        >
          <h4 style="margin: 0 0 8px 0;">Usage Examples</h4>
          <pre
            style="margin: 0; padding: 12px; background: white; border-radius: 4px; overflow-x: auto; font-size: 13px;"
          ><code><!-- HTML -->
&lt;blocks-graph prerequisite-line-style="dotted"&gt;&lt;/blocks-graph&gt;

/* JavaScript */
const graph = document.querySelector('blocks-graph');
graph.prerequisiteLineStyle = 'straight';

/* React */
&lt;BlocksGraphReact prerequisiteLineStyle="dashed" /&gt;</code></pre>
        </div>

        <div
          style="margin-top: 16px; padding: 16px; background: #e3f2fd; border-left: 4px solid #2196f3; border-radius: 4px;"
        >
          <h4 style="margin: 0 0 8px 0; color: #1565c0;">Note</h4>
          <p style="margin: 0; color: #333;">
            <strong style="color: #4a90e2;">Blue edges</strong> represent
            prerequisite relationships. Parent-child relationships are
            visualized through the drill-down navigation model, not as
            connecting lines.
          </p>
        </div>
      </div>
    `
  },
  parameters: {
    layout: 'fullscreen',
  },
}

/**
 * Story demonstrating prerequisites-only relationships (a→b→c chain).
 * All three blocks are roots (no parents), so they all show together.
 * The prerequisite chain is visualized with dashed lines connecting them.
 */
export const PrerequisitesOnlyChain: Story = {
  render: args => {
    const storyId = `prereqs-only-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 11)}`

    const prerequisitesOnlyBlocks = [
      {
        id: '550e8400-e29b-41d4-a716-446655440010',
        title: {
          he_text: 'בלוק א',
          en_text: 'Block A',
        },
        prerequisites: [],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440011',
        title: {
          he_text: 'בלוק ב',
          en_text: 'Block B',
        },
        prerequisites: ['550e8400-e29b-41d4-a716-446655440010'],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440012',
        title: {
          he_text: 'בלוק ג',
          en_text: 'Block C',
        },
        prerequisites: ['550e8400-e29b-41d4-a716-446655440011'],
        parents: [],
      },
    ]

    return html`
      <div style="padding: 16px;">
        <div
          style="padding: 16px; background: #e8f5e9; border-left: 4px solid #4caf50; border-radius: 4px; margin-bottom: 16px;"
        >
          <h3 style="margin: 0 0 8px 0; color: #2e7d32;">
            Scenario 1: Prerequisites Only (No Parents)
          </h3>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #333;">
            <strong>Relationship:</strong> A → B → C (prerequisites chain)
          </p>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #333;">
            <strong>Expected behavior:</strong>
          </p>
          <ul
            style="margin: 0; padding-left: 20px; font-size: 14px; color: #333;"
          >
            <li>All 3 blocks show together as roots (no parents defined)</li>
            <li>Blue dashed lines show the prerequisite chain: A → B → C</li>
            <li>
              Clicking blocks only dispatches events (no navigation changes)
            </li>
          </ul>
        </div>
        <div
          style="width: 100%; height: 400px; border: 1px solid #ddd; border-radius: 4px;"
        >
          <blocks-graph
            id="${storyId}"
            language="${args.language}"
            show-prerequisites="true"
            orientation="ttb"
            node-width="180"
            node-height="70"
          ></blocks-graph>
        </div>
      </div>
      <script>
        setTimeout(() => {
          const graph = document.getElementById('${storyId}')
          if (graph && typeof graph.loadFromJson === 'function') {
            graph.loadFromJson(
              ${JSON.stringify(JSON.stringify(prerequisitesOnlyBlocks))},
              'v0.1'
            )
          }
        }, 100)
      </script>
    `
  },
  args: {
    language: 'en',
  },
}

/**
 * Story demonstrating parent-only relationships (a→b→c hierarchy).
 * Only root 'A' shows initially. Navigation reveals children one level at a time.
 */
export const ParentsOnlyHierarchy: Story = {
  render: args => {
    const storyId = `parents-only-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 11)}`

    const parentsOnlyBlocks = [
      {
        id: '550e8400-e29b-41d4-a716-446655440020',
        title: {
          he_text: 'בלוק א',
          en_text: 'Block A',
        },
        prerequisites: [],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440021',
        title: {
          he_text: 'בלוק ב',
          en_text: 'Block B',
        },
        prerequisites: [],
        parents: ['550e8400-e29b-41d4-a716-446655440020'],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440022',
        title: {
          he_text: 'בלוק ג',
          en_text: 'Block C',
        },
        prerequisites: [],
        parents: ['550e8400-e29b-41d4-a716-446655440021'],
      },
    ]

    return html`
      <div style="padding: 16px;">
        <div
          style="padding: 16px; background: #e3f2fd; border-left: 4px solid #2196f3; border-radius: 4px; margin-bottom: 16px;"
        >
          <h3 style="margin: 0 0 8px 0; color: #1565c0;">
            Scenario 2: Parents Only (No Prerequisites)
          </h3>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #333;">
            <strong>Relationship:</strong> C is child of B, B is child of A
          </p>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #333;">
            <strong>Expected behavior:</strong>
          </p>
          <ul
            style="margin: 0; padding-left: 20px; font-size: 14px; color: #333;"
          >
            <li><strong>Initially:</strong> Only Block A shows (the root)</li>
            <li><strong>Click A:</strong> Shows A and B (B is A's child)</li>
            <li><strong>Click B:</strong> Shows B and C (C is B's child)</li>
            <li>
              <strong>Click same block again:</strong> Return to root view
            </li>
          </ul>
          <p
            style="margin: 8px 0 0 0; padding: 8px; background: #fff3cd; border-radius: 4px; font-size: 13px;"
          >
            💡 <strong>Try it:</strong> Click on blocks to navigate through the
            hierarchy!
          </p>
        </div>
        <div
          style="width: 100%; height: 400px; border: 1px solid #ddd; border-radius: 4px;"
        >
          <blocks-graph
            id="${storyId}"
            language="${args.language}"
            show-prerequisites="true"
            orientation="ttb"
            node-width="180"
            node-height="70"
          ></blocks-graph>
        </div>
      </div>
      <script>
        setTimeout(() => {
          const graph = document.getElementById('${storyId}')
          if (graph && typeof graph.loadFromJson === 'function') {
            graph.loadFromJson(
              ${JSON.stringify(JSON.stringify(parentsOnlyBlocks))},
              'v0.1'
            )
          }
        }, 100)
      </script>
    `
  },
  args: {
    language: 'en',
  },
}

/**
 * Story demonstrating both prerequisites AND parent relationships together.
 * Navigation follows parent hierarchy, but prerequisite edges are also drawn.
 */
export const PrerequisitesAndParents: Story = {
  render: args => {
    const storyId = `both-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 11)}`

    const bothRelationshipsBlocks = [
      {
        id: '550e8400-e29b-41d4-a716-446655440030',
        title: {
          he_text: 'בלוק א',
          en_text: 'Block A',
        },
        prerequisites: [],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440031',
        title: {
          he_text: 'בלוק ב',
          en_text: 'Block B',
        },
        prerequisites: ['550e8400-e29b-41d4-a716-446655440030'],
        parents: ['550e8400-e29b-41d4-a716-446655440030'],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440032',
        title: {
          he_text: 'בלוק ג',
          en_text: 'Block C',
        },
        prerequisites: ['550e8400-e29b-41d4-a716-446655440031'],
        parents: ['550e8400-e29b-41d4-a716-446655440031'],
      },
    ]

    return html`
      <div style="padding: 16px;">
        <div
          style="padding: 16px; background: #f3e5f5; border-left: 4px solid #9c27b0; border-radius: 4px; margin-bottom: 16px;"
        >
          <h3 style="margin: 0 0 8px 0; color: #6a1b9a;">
            Scenario 3: Both Prerequisites AND Parents
          </h3>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #333;">
            <strong>Relationships:</strong> C is child of B (parent), B is child
            of A (parent) + prerequisite relationships
          </p>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #333;">
            <strong>Expected behavior:</strong>
          </p>
          <ul
            style="margin: 0; padding-left: 20px; font-size: 14px; color: #333;"
          >
            <li>
              <strong>Initially:</strong> Only Block A shows (same as Scenario
              2)
            </li>
            <li>
              <strong>Click A:</strong> Shows A and B with both blue
              (prerequisite) and gray (parent) edges
            </li>
            <li>
              <strong>Click B:</strong> Shows B and C with both edge types
            </li>
            <li>
              <strong>Navigation follows parents,</strong> prerequisites are
              visual indicators
            </li>
          </ul>
          <div
            style="margin-top: 12px; padding: 12px; background: white; border: 1px solid #e0e0e0; border-radius: 4px;"
          >
            <strong style="font-size: 13px;">Edge Legend:</strong>
            <div style="display: flex; gap: 16px; margin-top: 8px;">
              <span style="font-size: 13px;">
                <span
                  style="display: inline-block; width: 30px; height: 2px; background: #4a90e2; vertical-align: middle; border-top: 2px dashed #4a90e2;"
                ></span>
                Blue dashed = Prerequisites
              </span>
              <span style="font-size: 13px;">
                <span
                  style="display: inline-block; width: 30px; height: 2px; background: #666; vertical-align: middle;"
                ></span>
                Gray solid = Parents
              </span>
            </div>
          </div>
        </div>
        <div
          style="width: 100%; height: 400px; border: 1px solid #ddd; border-radius: 4px;"
        >
          <blocks-graph
            id="${storyId}"
            language="${args.language}"
            show-prerequisites="true"
            orientation="ttb"
            node-width="180"
            node-height="70"
          ></blocks-graph>
        </div>
      </div>
      <script>
        setTimeout(() => {
          const graph = document.getElementById('${storyId}')
          if (graph && typeof graph.loadFromJson === 'function') {
            graph.loadFromJson(
              ${JSON.stringify(JSON.stringify(bothRelationshipsBlocks))},
              'v0.1'
            )
          }
        }, 100)
      </script>
    `
  },
  args: {
    language: 'en',
  },
}

/**
 * Story demonstrating bilingual support by showing the same graph in Hebrew and English.
 * The component automatically displays the appropriate language based on the language attribute.
 */
export const BilingualComparison: Story = {
  render: () => {
    const hebrewId = `bilingual-he-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 11)}`
    const englishId = `bilingual-en-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 11)}`

    setTimeout(() => {
      const heGraph = document.getElementById(hebrewId)
      const enGraph = document.getElementById(englishId)

      if (
        heGraph &&
        'loadFromJson' in heGraph &&
        typeof heGraph.loadFromJson === 'function'
      ) {
        heGraph.loadFromJson(JSON.stringify(EXAMPLE_BLOCKS), 'v0.1')
      }

      if (
        enGraph &&
        'loadFromJson' in enGraph &&
        typeof enGraph.loadFromJson === 'function'
      ) {
        enGraph.loadFromJson(JSON.stringify(EXAMPLE_BLOCKS), 'v0.1')
      }
    }, 100)

    return html`
      <div style="padding: 16px;">
        <h2 style="margin: 0 0 8px 0;">Bilingual Support</h2>
        <p style="margin: 0 0 24px 0; color: #666;">
          The same curriculum data displayed in Hebrew (right-to-left) and
          English (left-to-right).
        </p>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
          <div
            style="border: 1px solid #ddd; border-radius: 8px; padding: 16px; background: white;"
          >
            <h3 style="margin: 0 0 12px 0; color: #333;">Hebrew (עברית)</h3>
            <div
              style="width: 100%; height: 500px; border: 1px solid #e0e0e0; border-radius: 4px;"
            >
              <blocks-graph
                id="${hebrewId}"
                language="he"
                show-prerequisites="true"
                orientation="ttb"
                node-width="200"
                node-height="80"
              ></blocks-graph>
            </div>
          </div>

          <div
            style="border: 1px solid #ddd; border-radius: 8px; padding: 16px; background: white;"
          >
            <h3 style="margin: 0 0 12px 0; color: #333;">English</h3>
            <div
              style="width: 100%; height: 500px; border: 1px solid #e0e0e0; border-radius: 4px;"
            >
              <blocks-graph
                id="${englishId}"
                language="en"
                show-prerequisites="true"
                orientation="ttb"
                node-width="200"
                node-height="80"
              ></blocks-graph>
            </div>
          </div>
        </div>

        <div
          style="margin-top: 24px; padding: 16px; background: #f5f5f5; border-radius: 4px;"
        >
          <h4 style="margin: 0 0 8px 0;">Usage Example</h4>
          <pre
            style="margin: 0; padding: 12px; background: white; border-radius: 4px; overflow-x: auto; font-size: 13px;"
          ><code>&lt;blocks-graph language="he"&gt;&lt;/blocks-graph&gt;
&lt;blocks-graph language="en"&gt;&lt;/blocks-graph&gt;</code></pre>
        </div>
      </div>
    `
  },
  parameters: {
    layout: 'fullscreen',
  },
}

/**
 * Story demonstrating the empty state when no blocks are loaded.
 * Shows the default message displayed to users before data is loaded.
 */
export const EmptyState: Story = {
  render: () => {
    const storyId = `empty-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 11)}`

    return html`
      <div style="padding: 16px;">
        <div
          style="padding: 16px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px; margin-bottom: 16px;"
        >
          <h3 style="margin: 0 0 8px 0; color: #f57c00;">Empty State</h3>
          <p style="margin: 0; font-size: 14px; color: #333;">
            This is what users see when no blocks have been loaded yet. The
            component displays a helpful message prompting them to load data.
          </p>
        </div>
        <div
          style="width: 100%; height: 400px; border: 1px solid #ddd; border-radius: 4px;"
        >
          <blocks-graph
            id="${storyId}"
            language="en"
            show-prerequisites="true"
          ></blocks-graph>
        </div>
      </div>
    `
  },
}

/**
 * Story demonstrating custom node sizing and spacing configurations.
 * Shows how developers can adjust the layout to fit different use cases.
 */
export const CustomSizingAndSpacing: Story = {
  render: () => {
    const configs = [
      {
        label: 'Compact',
        nodeWidth: 150,
        nodeHeight: 50,
        horizontalSpacing: 40,
        verticalSpacing: 50,
      },
      {
        label: 'Default',
        nodeWidth: 200,
        nodeHeight: 80,
        horizontalSpacing: 80,
        verticalSpacing: 100,
      },
      {
        label: 'Spacious',
        nodeWidth: 250,
        nodeHeight: 100,
        horizontalSpacing: 120,
        verticalSpacing: 140,
      },
    ]

    return html`
      <div style="padding: 16px;">
        <h2 style="margin: 0 0 8px 0;">Custom Sizing and Spacing</h2>
        <p style="margin: 0 0 24px 0; color: #666;">
          Adjust node dimensions and spacing to fit your design requirements.
        </p>

        <div style="display: flex; flex-direction: column; gap: 32px;">
          ${configs.map((config, index) => {
            const storyId = `sizing-${index}-${Date.now()}-${Math.random()
              .toString(36)
              .substring(2, 11)}`

            setTimeout(() => {
              const graph = document.getElementById(storyId)
              if (
                graph &&
                'loadFromJson' in graph &&
                typeof graph.loadFromJson === 'function'
              ) {
                graph.loadFromJson(JSON.stringify(EXAMPLE_BLOCKS), 'v0.1')
              }
            }, 100)

            return html`
              <div
                style="border: 1px solid #ddd; border-radius: 8px; padding: 16px; background: white;"
              >
                <div style="margin-bottom: 12px;">
                  <h3 style="margin: 0 0 4px 0; color: #333;">
                    ${config.label}
                  </h3>
                  <p style="margin: 0; font-size: 13px; color: #666;">
                    Node: ${config.nodeWidth}×${config.nodeHeight}px, Spacing:
                    H${config.horizontalSpacing} / V${config.verticalSpacing}
                  </p>
                </div>
                <div
                  style="width: 100%; height: 400px; border: 1px solid #e0e0e0; border-radius: 4px; overflow: auto;"
                >
                  <blocks-graph
                    id="${storyId}"
                    language="en"
                    show-prerequisites="true"
                    orientation="ttb"
                    node-width="${config.nodeWidth}"
                    node-height="${config.nodeHeight}"
                    horizontal-spacing="${config.horizontalSpacing}"
                    vertical-spacing="${config.verticalSpacing}"
                  ></blocks-graph>
                </div>
              </div>
            `
          })}
        </div>

        <div
          style="margin-top: 24px; padding: 16px; background: #f5f5f5; border-radius: 4px;"
        >
          <h4 style="margin: 0 0 8px 0;">Usage Example</h4>
          <pre
            style="margin: 0; padding: 12px; background: white; border-radius: 4px; overflow-x: auto; font-size: 13px;"
          ><code>&lt;blocks-graph
  node-width="250"
  node-height="100"
  horizontal-spacing="120"
  vertical-spacing="140"
&gt;&lt;/blocks-graph&gt;</code></pre>
        </div>
      </div>
    `
  },
  parameters: {
    layout: 'fullscreen',
  },
}

/**
 * Story demonstrating the prerequisites visibility toggle.
 * Shows how the graph changes when prerequisite edges are hidden.
 */
export const PrerequisitesToggle: Story = {
  render: () => {
    const withId = `prereqs-with-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 11)}`
    const withoutId = `prereqs-without-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 11)}`

    setTimeout(() => {
      const withGraph = document.getElementById(withId)
      const withoutGraph = document.getElementById(withoutId)

      if (
        withGraph &&
        'loadFromJson' in withGraph &&
        typeof withGraph.loadFromJson === 'function'
      ) {
        withGraph.loadFromJson(JSON.stringify(EXAMPLE_BLOCKS), 'v0.1')
      }

      if (
        withoutGraph &&
        'loadFromJson' in withoutGraph &&
        typeof withoutGraph.loadFromJson === 'function'
      ) {
        withoutGraph.loadFromJson(JSON.stringify(EXAMPLE_BLOCKS), 'v0.1')
      }
    }, 100)

    return html`
      <div style="padding: 16px;">
        <h2 style="margin: 0 0 8px 0;">Prerequisites Visibility Toggle</h2>
        <p style="margin: 0 0 24px 0; color: #666;">
          Control whether prerequisite relationships (blue dashed lines) are
          displayed. Parent hierarchy remains visible regardless.
        </p>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
          <div
            style="border: 1px solid #ddd; border-radius: 8px; padding: 16px; background: white;"
          >
            <h3 style="margin: 0 0 12px 0; color: #333;">
              With Prerequisites (Default)
            </h3>
            <div
              style="width: 100%; height: 450px; border: 1px solid #e0e0e0; border-radius: 4px;"
            >
              <blocks-graph
                id="${withId}"
                language="en"
                show-prerequisites="true"
                orientation="ttb"
              ></blocks-graph>
            </div>
          </div>

          <div
            style="border: 1px solid #ddd; border-radius: 8px; padding: 16px; background: white;"
          >
            <h3 style="margin: 0 0 12px 0; color: #333;">
              Without Prerequisites
            </h3>
            <div
              style="width: 100%; height: 450px; border: 1px solid #e0e0e0; border-radius: 4px;"
            >
              <blocks-graph
                id="${withoutId}"
                language="en"
                show-prerequisites="false"
                orientation="ttb"
              ></blocks-graph>
            </div>
          </div>
        </div>

        <div
          style="margin-top: 24px; padding: 16px; background: #e3f2fd; border-left: 4px solid #2196f3; border-radius: 4px;"
        >
          <h4 style="margin: 0 0 8px 0; color: #1565c0;">Note</h4>
          <p style="margin: 0; font-size: 14px; color: #333;">
            Hiding prerequisites only removes the visual edges (blue dashed
            lines). The parent-child hierarchy and navigation behavior remain
            unchanged.
          </p>
        </div>
      </div>
    `
  },
  parameters: {
    layout: 'fullscreen',
  },
}

/**
 * Story demonstrating a block with multiple prerequisites from different branches.
 * Shows how the graph handles complex prerequisite webs.
 */
export const ComplexPrerequisiteWeb: Story = {
  render: args => {
    const storyId = `complex-web-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 11)}`

    const complexWebBlocks = [
      {
        id: '550e8400-e29b-41d4-a716-446655440040',
        title: {
          he_text: 'אלגברה בסיסית',
          en_text: 'Basic Algebra',
        },
        prerequisites: [],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440041',
        title: {
          he_text: 'גאומטריה בסיסית',
          en_text: 'Basic Geometry',
        },
        prerequisites: [],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440042',
        title: {
          he_text: 'טריגונומטריה',
          en_text: 'Trigonometry',
        },
        prerequisites: [],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440043',
        title: {
          he_text: 'חדו״א מתקדם',
          en_text: 'Advanced Calculus',
        },
        prerequisites: [
          '550e8400-e29b-41d4-a716-446655440040',
          '550e8400-e29b-41d4-a716-446655440041',
          '550e8400-e29b-41d4-a716-446655440042',
        ],
        parents: [],
      },
    ]

    return html`
      <div style="padding: 16px;">
        <div
          style="padding: 16px; background: #fff3e0; border-left: 4px solid #ff9800; border-radius: 4px; margin-bottom: 16px;"
        >
          <h3 style="margin: 0 0 8px 0; color: #e65100;">
            Complex Prerequisite Web
          </h3>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #333;">
            <strong>Scenario:</strong> Advanced Calculus requires three
            different prerequisites from separate branches
          </p>
          <ul
            style="margin: 0; padding-left: 20px; font-size: 14px; color: #333;"
          >
            <li>Basic Algebra → Advanced Calculus</li>
            <li>Basic Geometry → Advanced Calculus</li>
            <li>Trigonometry → Advanced Calculus</li>
          </ul>
          <p
            style="margin: 8px 0 0 0; padding: 8px; background: white; border-radius: 4px; font-size: 13px;"
          >
            💡 All four blocks show together (all are roots with no parents).
            Three prerequisite edges converge on the Advanced Calculus block.
          </p>
        </div>
        <div
          style="width: 100%; height: 450px; border: 1px solid #ddd; border-radius: 4px;"
        >
          <blocks-graph
            id="${storyId}"
            language="${args.language}"
            show-prerequisites="true"
            orientation="ttb"
            node-width="180"
            node-height="70"
            horizontal-spacing="100"
            vertical-spacing="120"
          ></blocks-graph>
        </div>
      </div>
      <script>
        setTimeout(() => {
          const graph = document.getElementById('${storyId}')
          if (graph && typeof graph.loadFromJson === 'function') {
            graph.loadFromJson(
              ${JSON.stringify(JSON.stringify(complexWebBlocks))},
              'v0.1'
            )
          }
        }, 100)
      </script>
    `
  },
  args: {
    language: 'en',
  },
}

/**
 * Story demonstrating automatic transitive edge reduction.
 * Shows how redundant prerequisite edges are automatically removed for cleaner visualization.
 * When A→B→C→D exists with direct shortcuts (A→C, A→D, B→D), only the direct chain is shown.
 */
export const TransitiveReduction: Story = {
  render: args => {
    const storyId = `transitive-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 11)}`

    const transitiveBlocks = [
      {
        id: '550e8400-e29b-41d4-a716-446655440070',
        title: {
          he_text: 'מתמטיקה בסיסית',
          en_text: 'Basic Math',
        },
        prerequisites: [],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440071',
        title: {
          he_text: 'אלגברה',
          en_text: 'Algebra',
        },
        prerequisites: ['550e8400-e29b-41d4-a716-446655440070'],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440072',
        title: {
          he_text: 'חשבון אינפיניטסימלי',
          en_text: 'Calculus',
        },
        prerequisites: [
          '550e8400-e29b-41d4-a716-446655440071',
          '550e8400-e29b-41d4-a716-446655440070', // Transitive - will be hidden
        ],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440073',
        title: {
          he_text: 'אנליזה מתקדמת',
          en_text: 'Advanced Analysis',
        },
        prerequisites: [
          '550e8400-e29b-41d4-a716-446655440072',
          '550e8400-e29b-41d4-a716-446655440071', // Transitive - will be hidden
          '550e8400-e29b-41d4-a716-446655440070', // Transitive - will be hidden
        ],
        parents: [],
      },
    ]

    return html`
      <div style="padding: 16px;">
        <div
          style="padding: 16px; background: #e8f5e9; border-left: 4px solid #4caf50; border-radius: 4px; margin-bottom: 16px;"
        >
          <h3 style="margin: 0 0 8px 0; color: #2e7d32;">
            Automatic Transitive Reduction
          </h3>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #333;">
            <strong>Feature:</strong> Automatically removes redundant
            prerequisite edges for cleaner visualization
          </p>
          <div
            style="margin: 8px 0; padding: 12px; background: white; border-radius: 4px;"
          >
            <p style="margin: 0 0 8px 0; font-size: 13px; color: #333;">
              <strong>Data in JSON:</strong>
            </p>
            <ul
              style="margin: 0; padding-left: 20px; font-size: 13px; color: #333;"
            >
              <li>Basic Math → Algebra</li>
              <li>Algebra → Calculus</li>
              <li><del>Basic Math → Calculus</del> (transitive, removed)</li>
              <li>Calculus → Advanced Analysis</li>
              <li>
                <del>Algebra → Advanced Analysis</del> (transitive, removed)
              </li>
              <li>
                <del>Basic Math → Advanced Analysis</del> (transitive, removed)
              </li>
            </ul>
          </div>
          <div
            style="margin-top: 12px; padding: 12px; background: #c8e6c9; border-radius: 4px;"
          >
            <p style="margin: 0; font-size: 13px; color: #1b5e20;">
              <strong>✨ Result:</strong> Only
              <strong>3 clean edges</strong> are displayed (Basic Math → Algebra
              → Calculus → Advanced Analysis), even though the data contained 6
              prerequisite edges. The transitive edges are automatically
              detected and hidden!
            </p>
          </div>
        </div>
        <div
          style="width: 100%; height: 450px; border: 1px solid #ddd; border-radius: 4px;"
        >
          <blocks-graph
            id="${storyId}"
            language="${args.language}"
            show-prerequisites="true"
            orientation="ttb"
            node-width="200"
            node-height="70"
            horizontal-spacing="80"
            vertical-spacing="100"
          ></blocks-graph>
        </div>
        <div
          style="margin-top: 16px; padding: 16px; background: #f5f5f5; border-radius: 4px;"
        >
          <h4 style="margin: 0 0 8px 0;">How It Works</h4>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #333;">
            The graph engine uses <strong>transitive reduction</strong>: when an
            edge A→C exists but there's also a path A→B→C, the direct A→C edge
            is considered redundant and automatically removed from the
            visualization.
          </p>
          <p style="margin: 0; font-size: 14px; color: #666;">
            This feature is <strong>always active</strong> and requires no
            configuration. It makes complex prerequisite chains much easier to
            understand at a glance.
          </p>
        </div>
      </div>
      <script>
        setTimeout(() => {
          const graph = document.getElementById('${storyId}')
          if (graph && typeof graph.loadFromJson === 'function') {
            graph.loadFromJson(
              ${JSON.stringify(JSON.stringify(transitiveBlocks))},
              'v0.1'
            )
          }
        }, 100)
      </script>
    `
  },
  args: {
    language: 'en',
  },
}

/**
 * Story demonstrating a single isolated block.
 * Shows the edge case where only one block exists in the graph.
 */
export const SingleBlock: Story = {
  render: args => {
    const storyId = `single-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 11)}`

    const singleBlockData = [
      {
        id: '550e8400-e29b-41d4-a716-446655440050',
        title: {
          he_text: 'מבוא למדעי המחשב',
          en_text: 'Introduction to Computer Science',
        },
        prerequisites: [],
        parents: [],
      },
    ]

    return html`
      <div style="padding: 16px;">
        <div
          style="padding: 16px; background: #e8eaf6; border-left: 4px solid #3f51b5; border-radius: 4px; margin-bottom: 16px;"
        >
          <h3 style="margin: 0 0 8px 0; color: #283593;">Single Block</h3>
          <p style="margin: 0; font-size: 14px; color: #333;">
            Edge case: Only one block exists with no relationships. The graph
            displays a single centered node.
          </p>
        </div>
        <div
          style="width: 100%; height: 300px; border: 1px solid #ddd; border-radius: 4px;"
        >
          <blocks-graph
            id="${storyId}"
            language="${args.language}"
            show-prerequisites="true"
            orientation="ttb"
          ></blocks-graph>
        </div>
      </div>
      <script>
        setTimeout(() => {
          const graph = document.getElementById('${storyId}')
          if (graph && typeof graph.loadFromJson === 'function') {
            graph.loadFromJson(
              ${JSON.stringify(JSON.stringify(singleBlockData))},
              'v0.1'
            )
          }
        }, 100)
      </script>
    `
  },
  args: {
    language: 'en',
  },
}

/**
 * Story demonstrating grid layout with maxNodesPerLevel.
 * Shows how nodes automatically wrap into a grid when exceeding the maximum per level.
 */
export const GridLayoutWrapping: Story = {
  render: () => {
    const configs = [
      {
        label: 'Unlimited (Default)',
        maxNodesPerLevel: undefined,
        description: 'All 10 nodes in a single row',
      },
      {
        label: 'Max 5 per row',
        maxNodesPerLevel: 5,
        description: 'Wraps into 2 rows: 5 + 5',
      },
      {
        label: 'Max 3 per row',
        maxNodesPerLevel: 3,
        description: 'Wraps into 4 rows: 3 + 3 + 3 + 1',
      },
    ]

    // Create many blocks at the same level
    const manyBlocks = Array.from({ length: 10 }, (_, i) => ({
      id: `550e8400-e29b-41d4-a716-44665544${String(i).padStart(4, '0')}`,
      title: {
        he_text: `בלוק ${i + 1}`,
        en_text: `Block ${i + 1}`,
      },
      prerequisites: [],
      parents: [],
    }))

    return html`
      <div style="padding: 16px;">
        <h2 style="margin: 0 0 8px 0;">Grid Layout with maxNodesPerLevel</h2>
        <p style="margin: 0 0 8px 0; color: #666;">
          Control how many nodes appear per row (vertical orientation) or per
          column (horizontal orientation) before wrapping to a grid.
        </p>
        <p style="margin: 0 0 24px 0; color: #666;">
          <strong>Use case:</strong> When you have many blocks at the same
          level, grid wrapping creates a more compact and organized layout.
        </p>

        <div style="display: flex; flex-direction: column; gap: 32px;">
          ${configs.map((config, index) => {
            const storyId = `grid-${index}-${Date.now()}-${Math.random()
              .toString(36)
              .substring(2, 11)}`

            setTimeout(() => {
              const graph = document.getElementById(storyId)
              if (
                graph &&
                'loadFromJson' in graph &&
                typeof graph.loadFromJson === 'function'
              ) {
                graph.loadFromJson(JSON.stringify(manyBlocks), 'v0.1')
              }
            }, 100)

            return html`
              <div
                style="border: 1px solid #ddd; border-radius: 8px; padding: 16px; background: white;"
              >
                <div style="margin-bottom: 12px;">
                  <h3 style="margin: 0 0 4px 0; color: #333;">
                    ${config.label}
                  </h3>
                  <p style="margin: 0; font-size: 13px; color: #666;">
                    ${config.description}
                  </p>
                </div>
                <div
                  style="width: 100%; height: 400px; border: 1px solid #e0e0e0; border-radius: 4px; overflow: auto;"
                >
                  <blocks-graph
                    id="${storyId}"
                    language="en"
                    show-prerequisites="true"
                    orientation="ttb"
                    node-width="140"
                    node-height="60"
                    horizontal-spacing="20"
                    vertical-spacing="20"
                    max-nodes-per-level="${config.maxNodesPerLevel || ''}"
                  ></blocks-graph>
                </div>
              </div>
            `
          })}
        </div>

        <div
          style="margin-top: 24px; padding: 16px; background: #f5f5f5; border-radius: 4px;"
        >
          <h4 style="margin: 0 0 8px 0;">Usage Examples</h4>
          <pre
            style="margin: 0; padding: 12px; background: white; border-radius: 4px; overflow-x: auto; font-size: 13px;"
          ><code><!-- HTML: Wrap after 5 nodes -->
&lt;blocks-graph max-nodes-per-level="5"&gt;&lt;/blocks-graph&gt;

/* JavaScript */
const graph = document.querySelector('blocks-graph');
graph.maxNodesPerLevel = 3;

/* React */
&lt;BlocksGraphReact maxNodesPerLevel={5} /&gt;

/* Vue */
&lt;BlocksGraphVue :max-nodes-per-level="5" /&gt;

/* Angular */
&lt;blocks-graph-angular [maxNodesPerLevel]="5"&gt;&lt;/blocks-graph-angular&gt;</code></pre>
        </div>
      </div>
    `
  },
  parameters: {
    layout: 'fullscreen',
  },
}

/**
 * Story demonstrating grid layout with horizontal orientation (LTR).
 * Shows how wrapping works differently in horizontal layouts.
 */
export const GridLayoutHorizontal: Story = {
  render: () => {
    const configs = [
      {
        orientation: 'ltr',
        maxNodesPerLevel: undefined,
        label: 'LTR - Unlimited',
        description: 'All nodes in a single column',
      },
      {
        orientation: 'ltr',
        maxNodesPerLevel: 4,
        label: 'LTR - Max 4 per column',
        description: 'Wraps into 3 columns: 4 + 4 + 2',
      },
      {
        orientation: 'rtl',
        maxNodesPerLevel: 4,
        label: 'RTL - Max 4 per column',
        description: 'Same wrapping, right-to-left direction',
      },
    ]

    // Create many blocks at the same level
    const manyBlocks = Array.from({ length: 10 }, (_, i) => ({
      id: `550e8400-e29b-41d4-a716-44665555${String(i).padStart(4, '0')}`,
      title: {
        he_text: `בלוק ${i + 1}`,
        en_text: `Block ${i + 1}`,
      },
      prerequisites: [],
      parents: [],
    }))

    return html`
      <div style="padding: 16px;">
        <h2 style="margin: 0 0 8px 0;">
          Grid Layout - Horizontal Orientations
        </h2>
        <p style="margin: 0 0 24px 0; color: #666;">
          In horizontal orientations (LTR/RTL), maxNodesPerLevel controls
          <strong>columns</strong> instead of rows. Nodes wrap into multiple
          columns when the limit is exceeded.
        </p>

        <div
          style="display: grid; grid-template-columns: repeat(auto-fit, minmax(450px, 1fr)); gap: 24px;"
        >
          ${configs.map((config, index) => {
            const storyId = `grid-horiz-${index}-${Date.now()}-${Math.random()
              .toString(36)
              .substring(2, 11)}`

            setTimeout(() => {
              const graph = document.getElementById(storyId)
              if (
                graph &&
                'loadFromJson' in graph &&
                typeof graph.loadFromJson === 'function'
              ) {
                graph.loadFromJson(JSON.stringify(manyBlocks), 'v0.1')
              }
            }, 100)

            return html`
              <div
                style="border: 1px solid #ddd; border-radius: 8px; padding: 16px; background: white;"
              >
                <div style="margin-bottom: 12px;">
                  <h3 style="margin: 0 0 4px 0; color: #333; font-size: 16px;">
                    ${config.label}
                  </h3>
                  <p style="margin: 0; font-size: 13px; color: #666;">
                    ${config.description}
                  </p>
                </div>
                <div
                  style="width: 100%; height: 400px; border: 1px solid #e0e0e0; border-radius: 4px; overflow: auto;"
                >
                  <blocks-graph
                    id="${storyId}"
                    language="en"
                    show-prerequisites="true"
                    orientation="${config.orientation}"
                    node-width="120"
                    node-height="50"
                    horizontal-spacing="20"
                    vertical-spacing="20"
                    max-nodes-per-level="${config.maxNodesPerLevel || ''}"
                  ></blocks-graph>
                </div>
              </div>
            `
          })}
        </div>

        <div
          style="margin-top: 24px; padding: 16px; background: #e3f2fd; border-left: 4px solid #2196f3; border-radius: 4px;"
        >
          <h4 style="margin: 0 0 8px 0; color: #1565c0;">Orientation Guide</h4>
          <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #333;">
            <li>
              <strong>TTB/BTT (vertical):</strong> maxNodesPerLevel limits
              <strong>columns</strong>, wraps into <strong>rows</strong>
            </li>
            <li>
              <strong>LTR/RTL (horizontal):</strong> maxNodesPerLevel limits
              <strong>rows</strong>, wraps into <strong>columns</strong>
            </li>
          </ul>
        </div>
      </div>
    `
  },
  parameters: {
    layout: 'fullscreen',
  },
}

/**
 * Story demonstrating grid layout with multiple levels of different sizes.
 * Shows how each level can wrap independently based on its node count.
 */
export const GridLayoutMultipleLevels: Story = {
  render: args => {
    const storyId = `grid-multi-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 11)}`

    // Create a multi-level graph with varying node counts per level
    const rootBlock = {
      id: '550e8400-e29b-41d4-a716-446655660000',
      title: {
        he_text: 'שורש',
        en_text: 'Root',
      },
      prerequisites: [],
      parents: [],
    }

    const level1Blocks = Array.from({ length: 8 }, (_, i) => ({
      id: `550e8400-e29b-41d4-a716-446655660${String(i + 1).padStart(3, '0')}`,
      title: {
        he_text: `רמה 1-${i + 1}`,
        en_text: `Level 1-${i + 1}`,
      },
      prerequisites: [rootBlock.id],
      parents: [],
    }))

    const level2Blocks = Array.from({ length: 12 }, (_, i) => ({
      id: `550e8400-e29b-41d4-a716-446655661${String(i).padStart(3, '0')}`,
      title: {
        he_text: `רמה 2-${i + 1}`,
        en_text: `Level 2-${i + 1}`,
      },
      prerequisites: [level1Blocks[i % 8]?.id ?? ''],
      parents: [],
    }))

    const multiLevelBlocks = [rootBlock, ...level1Blocks, ...level2Blocks]

    return html`
      <div style="padding: 16px;">
        <div
          style="padding: 16px; background: #e8f5e9; border-left: 4px solid #4caf50; border-radius: 4px; margin-bottom: 16px;"
        >
          <h3 style="margin: 0 0 8px 0; color: #2e7d32;">
            Grid Layout - Multiple Levels
          </h3>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #333;">
            <strong>Scenario:</strong> Three levels with different node counts
          </p>
          <ul
            style="margin: 0; padding-left: 20px; font-size: 14px; color: #333;"
          >
            <li>Level 0: 1 root block (no wrapping)</li>
            <li>Level 1: 8 blocks → wraps into 2 rows (4 + 4)</li>
            <li>Level 2: 12 blocks → wraps into 3 rows (4 + 4 + 4)</li>
          </ul>
          <p
            style="margin: 8px 0 0 0; padding: 8px; background: white; border-radius: 4px; font-size: 13px;"
          >
            💡 Each level wraps independently based on its own node count. The
            grid layout creates a clean, organized visualization even with many
            nodes.
          </p>
        </div>
        <div
          style="width: 100%; height: 650px; border: 1px solid #ddd; border-radius: 4px; overflow: auto;"
        >
          <blocks-graph
            id="${storyId}"
            language="${args.language}"
            show-prerequisites="true"
            orientation="ttb"
            node-width="120"
            node-height="50"
            horizontal-spacing="15"
            vertical-spacing="30"
            max-nodes-per-level="4"
          ></blocks-graph>
        </div>
      </div>
      <script>
        setTimeout(() => {
          const graph = document.getElementById('${storyId}')
          if (graph && typeof graph.loadFromJson === 'function') {
            graph.loadFromJson(
              ${JSON.stringify(JSON.stringify(multiLevelBlocks))},
              'v0.1'
            )
          }
        }, 100)
      </script>
    `
  },
  args: {
    language: 'en',
    maxNodesPerLevel: 2,
  },
}
