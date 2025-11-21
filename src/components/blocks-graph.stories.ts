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
    parentLineStyle: {
      control: 'select',
      options: ['straight', 'dashed', 'dotted'],
      description:
        'Line style for parent edges: straight (solid), dashed (8px/4px), dotted (2px/3px)',
      table: {
        defaultValue: { summary: 'straight' },
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
          show-parents="${args.showParents}"
          node-width="${args.nodeWidth || ''}"
          node-height="${args.nodeHeight || ''}"
          horizontal-spacing="${args.horizontalSpacing || ''}"
          vertical-spacing="${args.verticalSpacing || ''}"
          orientation="${args.orientation || 'ttb'}"
          prerequisite-line-style="${args.prerequisiteLineStyle || 'dashed'}"
          parent-line-style="${args.parentLineStyle || 'straight'}"
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
    showParents: true,
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
            show-parents="${args.showParents}"
            orientation="${args.orientation || 'ttb'}"
          ></blocks-graph>
        </div>
      </div>
    `
  },
  args: {
    language: 'en',
    showPrerequisites: true,
    showParents: true,
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
 * Story demonstrating all edge line style combinations.
 * Shows how different line styles can be used to visually distinguish
 * prerequisite and parent relationships in the graph.
 */
export const EdgeLineStyles: Story = {
  render: () => {
    const styleConfigs = [
      {
        prerequisite: 'straight',
        parent: 'straight',
        description: 'Both solid (default clean look)',
      },
      {
        prerequisite: 'dashed',
        parent: 'straight',
        description: 'Default: Dashed prerequisites, solid parents',
      },
      {
        prerequisite: 'dotted',
        parent: 'straight',
        description: 'Dotted prerequisites, solid parents',
      },
      {
        prerequisite: 'straight',
        parent: 'dashed',
        description: 'Solid prerequisites, dashed parents',
      },
      {
        prerequisite: 'dashed',
        parent: 'dashed',
        description: 'Both dashed',
      },
      {
        prerequisite: 'dotted',
        parent: 'dotted',
        description: 'Both dotted',
      },
      {
        prerequisite: 'straight',
        parent: 'dotted',
        description: 'Solid prerequisites, dotted parents',
      },
      {
        prerequisite: 'dotted',
        parent: 'dashed',
        description: 'Dotted prerequisites, dashed parents',
      },
    ]

    return html`
      <div style="padding: 16px;">
        <h2 style="margin: 0 0 16px 0;">Edge Line Style Combinations</h2>
        <p style="margin: 0 0 8px 0; color: #666;">
          Customize the appearance of prerequisite (blue) and parent (gray)
          relationship edges.
        </p>
        <p style="margin: 0 0 24px 0; color: #666;">
          <strong>Styles:</strong> Straight (solid), Dashed (8px/4px), Dotted
          (2px/3px)
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
                    Prerequisites: ${config.prerequisite} / Parents:
                    ${config.parent}
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
                    show-parents="true"
                    prerequisite-line-style="${config.prerequisite}"
                    parent-line-style="${config.parent}"
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
&lt;blocks-graph
  prerequisite-line-style="dotted"
  parent-line-style="dashed"
&gt;&lt;/blocks-graph&gt;

/* JavaScript */
const graph = document.querySelector('blocks-graph');
graph.prerequisiteLineStyle = 'straight';
graph.parentLineStyle = 'dotted';

/* React */
&lt;BlocksGraphReact
  prerequisiteLineStyle="dashed"
  parentLineStyle="straight"
/&gt;</code></pre>
        </div>

        <div
          style="margin-top: 16px; padding: 16px; background: #e3f2fd; border-left: 4px solid #2196f3; border-radius: 4px;"
        >
          <h4 style="margin: 0 0 8px 0; color: #1565c0;">
            Edge Color Reference
          </h4>
          <ul style="margin: 0; padding-left: 20px; color: #333;">
            <li>
              <strong style="color: #4a90e2;">Blue edges</strong>: Prerequisite
              relationships
            </li>
            <li>
              <strong style="color: #666;">Gray edges</strong>: Parent
              relationships
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
