import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import '../index.js'

/**
 * Storybook stories for demonstrating Graph Orientation feature.
 *
 * The orientation attribute controls how the graph flows and how blocks are arranged:
 * - TTB (top-to-bottom): Traditional hierarchical layout with root at top
 * - LTR (left-to-right): Horizontal flow with root on left
 * - RTL (right-to-left): Horizontal flow with root on right (for RTL languages)
 * - BTT (bottom-to-top): Inverted hierarchical layout with root at bottom
 */

const meta: Meta = {
  title: 'Features/Graph Orientation',
  component: 'blocks-graph',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Graph Orientation

Control the direction and flow of your graph visualization with four orientation options.

### Available Orientations

| Value | Direction | Use Case |
|-------|-----------|----------|
| \`ttb\` | Top-to-Bottom | Traditional org charts, hierarchies |
| \`ltr\` | Left-to-Right | Timelines, process flows, western reading |
| \`rtl\` | Right-to-Left | Hebrew/Arabic content, RTL interfaces |
| \`btt\` | Bottom-to-Top | Growth diagrams, bottom-up hierarchies |

### Spacing Behavior

The \`horizontal-spacing\` and \`vertical-spacing\` attributes adapt based on orientation:

| Orientation | Level Spacing | Sibling Spacing |
|-------------|---------------|-----------------|
| TTB/BTT | vertical-spacing | horizontal-spacing |
| LTR/RTL | horizontal-spacing | vertical-spacing |

### Usage

\`\`\`html
<blocks-graph orientation="ltr"></blocks-graph>
\`\`\`

\`\`\`javascript
const graph = document.querySelector('blocks-graph');
graph.orientation = 'rtl';
\`\`\`
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj

// Sample curriculum data
const CURRICULUM_BLOCKS = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    title: { he_text: 'מבוא למתמטיקה', en_text: 'Introduction to Mathematics' },
    prerequisites: [],
    parents: [],
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    title: { he_text: 'אלגברה ליניארית', en_text: 'Linear Algebra' },
    prerequisites: ['550e8400-e29b-41d4-a716-446655440000'],
    parents: [],
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    title: { he_text: 'חשבון אינפיניטסימלי', en_text: 'Calculus' },
    prerequisites: ['550e8400-e29b-41d4-a716-446655440000'],
    parents: [],
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    title: { he_text: 'אנליזה מתמטית', en_text: 'Mathematical Analysis' },
    prerequisites: [
      '550e8400-e29b-41d4-a716-446655440001',
      '550e8400-e29b-41d4-a716-446655440002',
    ],
    parents: [],
  },
]

// Longer chain for process flow demos
const PROCESS_FLOW_BLOCKS = [
  {
    id: '550e8400-e29b-41d4-a716-446655440010',
    title: { he_text: 'שלב 1', en_text: 'Step 1: Planning' },
    prerequisites: [],
    parents: [],
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440011',
    title: { he_text: 'שלב 2', en_text: 'Step 2: Design' },
    prerequisites: ['550e8400-e29b-41d4-a716-446655440010'],
    parents: [],
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440012',
    title: { he_text: 'שלב 3', en_text: 'Step 3: Development' },
    prerequisites: ['550e8400-e29b-41d4-a716-446655440011'],
    parents: [],
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440013',
    title: { he_text: 'שלב 4', en_text: 'Step 4: Testing' },
    prerequisites: ['550e8400-e29b-41d4-a716-446655440012'],
    parents: [],
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440014',
    title: { he_text: 'שלב 5', en_text: 'Step 5: Deployment' },
    prerequisites: ['550e8400-e29b-41d4-a716-446655440013'],
    parents: [],
  },
]

/**
 * Helper to create unique story IDs
 */
function createStoryId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}

// =============================================================================
// INDIVIDUAL ORIENTATION STORIES
// =============================================================================

/**
 * Top-to-Bottom (TTB) orientation - the default layout.
 * Root blocks appear at the top, children flow downward.
 */
export const TopToBottom: Story = {
  name: 'TTB (Top-to-Bottom)',
  render: () => {
    const storyId = createStoryId('ttb')

    return html`
      <div style="padding: 16px;">
        <div
          style="padding: 16px; background: #e3f2fd; border-left: 4px solid #2196f3; border-radius: 4px; margin-bottom: 16px;"
        >
          <h3 style="margin: 0 0 8px 0; color: #1565c0;">
            Top-to-Bottom (TTB) - Default
          </h3>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #333;">
            Traditional hierarchical layout with root blocks at the top.
          </p>
          <ul
            style="margin: 0; padding-left: 20px; font-size: 14px; color: #333;"
          >
            <li><strong>Root position:</strong> Top of the graph</li>
            <li><strong>Flow direction:</strong> Downward (↓)</li>
            <li>
              <strong>Level spacing:</strong> Controlled by
              <code>vertical-spacing</code>
            </li>
            <li>
              <strong>Sibling spacing:</strong> Controlled by
              <code>horizontal-spacing</code>
            </li>
            <li>
              <strong>Use cases:</strong> Org charts, family trees, topic
              hierarchies
            </li>
          </ul>
        </div>
        <div
          style="width: 100%; height: 500px; border: 1px solid #ddd; border-radius: 4px;"
        >
          <blocks-graph
            id="${storyId}"
            language="en"
            show-prerequisites="true"
            orientation="ttb"
            node-width="200"
            node-height="70"
            horizontal-spacing="80"
            vertical-spacing="100"
          ></blocks-graph>
        </div>
        <div
          style="margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 4px;"
        >
          <code style="font-size: 13px;"
            >&lt;blocks-graph orientation="ttb"&gt;&lt;/blocks-graph&gt;</code
          >
        </div>
      </div>
      <script>
        setTimeout(() => {
          const graph = document.getElementById('${storyId}')
          if (graph && typeof graph.loadFromJson === 'function') {
            graph.loadFromJson(
              ${JSON.stringify(JSON.stringify(CURRICULUM_BLOCKS))},
              'v0.1'
            )
          }
        }, 100)
      </script>
    `
  },
}

/**
 * Left-to-Right (LTR) orientation.
 * Root blocks appear on the left, children flow rightward.
 */
export const LeftToRight: Story = {
  name: 'LTR (Left-to-Right)',
  render: () => {
    const storyId = createStoryId('ltr')

    return html`
      <div style="padding: 16px;">
        <div
          style="padding: 16px; background: #e8f5e9; border-left: 4px solid #4caf50; border-radius: 4px; margin-bottom: 16px;"
        >
          <h3 style="margin: 0 0 8px 0; color: #2e7d32;">
            Left-to-Right (LTR)
          </h3>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #333;">
            Horizontal flow layout ideal for timelines and process flows.
          </p>
          <ul
            style="margin: 0; padding-left: 20px; font-size: 14px; color: #333;"
          >
            <li><strong>Root position:</strong> Left side of the graph</li>
            <li><strong>Flow direction:</strong> Rightward (→)</li>
            <li>
              <strong>Level spacing:</strong> Controlled by
              <code>horizontal-spacing</code>
            </li>
            <li>
              <strong>Sibling spacing:</strong> Controlled by
              <code>vertical-spacing</code>
            </li>
            <li>
              <strong>Use cases:</strong> Timelines, process flows, western
              reading order
            </li>
          </ul>
        </div>
        <div
          style="width: 100%; height: 400px; border: 1px solid #ddd; border-radius: 4px;"
        >
          <blocks-graph
            id="${storyId}"
            language="en"
            show-prerequisites="true"
            orientation="ltr"
            node-width="180"
            node-height="70"
            horizontal-spacing="100"
            vertical-spacing="80"
          ></blocks-graph>
        </div>
        <div
          style="margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 4px;"
        >
          <code style="font-size: 13px;"
            >&lt;blocks-graph orientation="ltr"&gt;&lt;/blocks-graph&gt;</code
          >
        </div>
      </div>
      <script>
        setTimeout(() => {
          const graph = document.getElementById('${storyId}')
          if (graph && typeof graph.loadFromJson === 'function') {
            graph.loadFromJson(
              ${JSON.stringify(JSON.stringify(CURRICULUM_BLOCKS))},
              'v0.1'
            )
          }
        }, 100)
      </script>
    `
  },
}

/**
 * Right-to-Left (RTL) orientation.
 * Root blocks appear on the right, children flow leftward.
 */
export const RightToLeft: Story = {
  name: 'RTL (Right-to-Left)',
  render: () => {
    const storyId = createStoryId('rtl')

    return html`
      <div style="padding: 16px;">
        <div
          style="padding: 16px; background: #fff3e0; border-left: 4px solid #ff9800; border-radius: 4px; margin-bottom: 16px;"
        >
          <h3 style="margin: 0 0 8px 0; color: #e65100;">
            Right-to-Left (RTL)
          </h3>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #333;">
            Horizontal flow for RTL languages (Hebrew, Arabic) and interfaces.
          </p>
          <ul
            style="margin: 0; padding-left: 20px; font-size: 14px; color: #333;"
          >
            <li><strong>Root position:</strong> Right side of the graph</li>
            <li><strong>Flow direction:</strong> Leftward (←)</li>
            <li>
              <strong>Level spacing:</strong> Controlled by
              <code>horizontal-spacing</code>
            </li>
            <li>
              <strong>Sibling spacing:</strong> Controlled by
              <code>vertical-spacing</code>
            </li>
            <li>
              <strong>Use cases:</strong> Hebrew/Arabic UIs, RTL reading
              contexts
            </li>
          </ul>
        </div>
        <div
          style="width: 100%; height: 400px; border: 1px solid #ddd; border-radius: 4px;"
        >
          <blocks-graph
            id="${storyId}"
            language="he"
            show-prerequisites="true"
            orientation="rtl"
            node-width="180"
            node-height="70"
            horizontal-spacing="100"
            vertical-spacing="80"
          ></blocks-graph>
        </div>
        <div
          style="margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 4px;"
        >
          <code style="font-size: 13px;"
            >&lt;blocks-graph orientation="rtl"
            language="he"&gt;&lt;/blocks-graph&gt;</code
          >
        </div>
      </div>
      <script>
        setTimeout(() => {
          const graph = document.getElementById('${storyId}')
          if (graph && typeof graph.loadFromJson === 'function') {
            graph.loadFromJson(
              ${JSON.stringify(JSON.stringify(CURRICULUM_BLOCKS))},
              'v0.1'
            )
          }
        }, 100)
      </script>
    `
  },
}

/**
 * Bottom-to-Top (BTT) orientation.
 * Root blocks appear at the bottom, children flow upward.
 */
export const BottomToTop: Story = {
  name: 'BTT (Bottom-to-Top)',
  render: () => {
    const storyId = createStoryId('btt')

    return html`
      <div style="padding: 16px;">
        <div
          style="padding: 16px; background: #f3e5f5; border-left: 4px solid #9c27b0; border-radius: 4px; margin-bottom: 16px;"
        >
          <h3 style="margin: 0 0 8px 0; color: #6a1b9a;">
            Bottom-to-Top (BTT)
          </h3>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #333;">
            Inverted hierarchical layout with root at the bottom.
          </p>
          <ul
            style="margin: 0; padding-left: 20px; font-size: 14px; color: #333;"
          >
            <li><strong>Root position:</strong> Bottom of the graph</li>
            <li><strong>Flow direction:</strong> Upward (↑)</li>
            <li>
              <strong>Level spacing:</strong> Controlled by
              <code>vertical-spacing</code>
            </li>
            <li>
              <strong>Sibling spacing:</strong> Controlled by
              <code>horizontal-spacing</code>
            </li>
            <li>
              <strong>Use cases:</strong> Growth diagrams, build-up processes,
              evolution trees
            </li>
          </ul>
        </div>
        <div
          style="width: 100%; height: 500px; border: 1px solid #ddd; border-radius: 4px;"
        >
          <blocks-graph
            id="${storyId}"
            language="en"
            show-prerequisites="true"
            orientation="btt"
            node-width="200"
            node-height="70"
            horizontal-spacing="80"
            vertical-spacing="100"
          ></blocks-graph>
        </div>
        <div
          style="margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 4px;"
        >
          <code style="font-size: 13px;"
            >&lt;blocks-graph orientation="btt"&gt;&lt;/blocks-graph&gt;</code
          >
        </div>
      </div>
      <script>
        setTimeout(() => {
          const graph = document.getElementById('${storyId}')
          if (graph && typeof graph.loadFromJson === 'function') {
            graph.loadFromJson(
              ${JSON.stringify(JSON.stringify(CURRICULUM_BLOCKS))},
              'v0.1'
            )
          }
        }, 100)
      </script>
    `
  },
}

// =============================================================================
// COMPARISON STORIES
// =============================================================================

/**
 * Side-by-side comparison of all four orientations.
 */
export const AllOrientationsComparison: Story = {
  name: 'All Orientations Comparison',
  render: () => {
    const orientations = [
      {
        value: 'ttb',
        label: 'Top-to-Bottom (TTB)',
        color: '#2196f3',
        bg: '#e3f2fd',
      },
      {
        value: 'ltr',
        label: 'Left-to-Right (LTR)',
        color: '#4caf50',
        bg: '#e8f5e9',
      },
      {
        value: 'rtl',
        label: 'Right-to-Left (RTL)',
        color: '#ff9800',
        bg: '#fff3e0',
      },
      {
        value: 'btt',
        label: 'Bottom-to-Top (BTT)',
        color: '#9c27b0',
        bg: '#f3e5f5',
      },
    ]

    return html`
      <div style="padding: 16px;">
        <h2 style="margin: 0 0 16px 0;">All Orientations Comparison</h2>
        <p style="margin: 0 0 24px 0; color: #666;">
          The same data displayed in all four orientations. Notice how edge
          connection points adapt to each direction.
        </p>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
          ${orientations.map((o, index) => {
            const storyId = createStoryId(`comparison-${o.value}-${index}`)

            setTimeout(() => {
              const graph = document.getElementById(storyId)
              if (
                graph &&
                'loadFromJson' in graph &&
                typeof graph.loadFromJson === 'function'
              ) {
                graph.loadFromJson(JSON.stringify(CURRICULUM_BLOCKS), 'v0.1')
              }
            }, 100)

            return html`
              <div
                style="border: 2px solid ${o.color}; border-radius: 8px; overflow: hidden;"
              >
                <div
                  style="padding: 12px; background: ${o.bg}; border-bottom: 1px solid ${o.color};"
                >
                  <h3 style="margin: 0; color: ${o.color}; font-size: 16px;">
                    ${o.label}
                  </h3>
                </div>
                <div style="height: 350px; background: white;">
                  <blocks-graph
                    id="${storyId}"
                    language="en"
                    show-prerequisites="true"
                    orientation="${o.value}"
                    node-width="160"
                    node-height="55"
                    horizontal-spacing="50"
                    vertical-spacing="70"
                  ></blocks-graph>
                </div>
              </div>
            `
          })}
        </div>
      </div>
    `
  },
  parameters: {
    layout: 'fullscreen',
  },
}

/**
 * Vertical vs Horizontal comparison.
 */
export const VerticalVsHorizontal: Story = {
  name: 'Vertical vs Horizontal',
  render: () => {
    const verticalId = createStoryId('vertical')
    const horizontalId = createStoryId('horizontal')

    return html`
      <div style="padding: 16px;">
        <h2 style="margin: 0 0 8px 0;">Vertical vs Horizontal Layouts</h2>
        <p style="margin: 0 0 24px 0; color: #666;">
          Choose based on your content and available space. Vertical works well
          for deep hierarchies, horizontal for sequential flows.
        </p>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
          <div
            style="border: 1px solid #ddd; border-radius: 8px; padding: 16px; background: white;"
          >
            <h3 style="margin: 0 0 8px 0; color: #333;">Vertical (TTB)</h3>
            <p style="margin: 0 0 12px 0; font-size: 13px; color: #666;">
              Best for hierarchies with many siblings at each level.
            </p>
            <div
              style="width: 100%; height: 400px; border: 1px solid #e0e0e0; border-radius: 4px;"
            >
              <blocks-graph
                id="${verticalId}"
                language="en"
                show-prerequisites="true"
                orientation="ttb"
                node-width="180"
                node-height="60"
                horizontal-spacing="60"
                vertical-spacing="80"
              ></blocks-graph>
            </div>
          </div>

          <div
            style="border: 1px solid #ddd; border-radius: 8px; padding: 16px; background: white;"
          >
            <h3 style="margin: 0 0 8px 0; color: #333;">Horizontal (LTR)</h3>
            <p style="margin: 0 0 12px 0; font-size: 13px; color: #666;">
              Best for sequential processes and timelines.
            </p>
            <div
              style="width: 100%; height: 400px; border: 1px solid #e0e0e0; border-radius: 4px;"
            >
              <blocks-graph
                id="${horizontalId}"
                language="en"
                show-prerequisites="true"
                orientation="ltr"
                node-width="180"
                node-height="60"
                horizontal-spacing="80"
                vertical-spacing="60"
              ></blocks-graph>
            </div>
          </div>
        </div>
      </div>
      <script>
        setTimeout(() => {
          const vGraph = document.getElementById('${verticalId}')
          const hGraph = document.getElementById('${horizontalId}')
          const data = ${JSON.stringify(JSON.stringify(CURRICULUM_BLOCKS))}
          if (vGraph && typeof vGraph.loadFromJson === 'function') {
            vGraph.loadFromJson(data, 'v0.1')
          }
          if (hGraph && typeof hGraph.loadFromJson === 'function') {
            hGraph.loadFromJson(data, 'v0.1')
          }
        }, 100)
      </script>
    `
  },
  parameters: {
    layout: 'fullscreen',
  },
}

// =============================================================================
// USE CASE STORIES
// =============================================================================

/**
 * Process flow using LTR orientation.
 */
export const ProcessFlowTimeline: Story = {
  name: 'Process Flow (Timeline)',
  render: () => {
    const storyId = createStoryId('process-flow')

    return html`
      <div style="padding: 16px;">
        <div
          style="padding: 16px; background: #e8f5e9; border-left: 4px solid #4caf50; border-radius: 4px; margin-bottom: 16px;"
        >
          <h3 style="margin: 0 0 8px 0; color: #2e7d32;">
            Process Flow / Timeline
          </h3>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #333;">
            LTR orientation is perfect for displaying sequential processes,
            project phases, or timelines where the natural reading order matches
            the flow.
          </p>
          <p style="margin: 0; font-size: 13px; color: #666;">
            <strong>Tip:</strong> Use wider horizontal-spacing to emphasize the
            sequential nature of the flow.
          </p>
        </div>
        <div
          style="width: 100%; height: 300px; border: 1px solid #ddd; border-radius: 4px; overflow: auto;"
        >
          <blocks-graph
            id="${storyId}"
            language="en"
            show-prerequisites="true"
            orientation="ltr"
            node-width="160"
            node-height="80"
            horizontal-spacing="120"
            vertical-spacing="60"
          ></blocks-graph>
        </div>
      </div>
      <script>
        setTimeout(() => {
          const graph = document.getElementById('${storyId}')
          if (graph && typeof graph.loadFromJson === 'function') {
            graph.loadFromJson(
              ${JSON.stringify(JSON.stringify(PROCESS_FLOW_BLOCKS))},
              'v0.1'
            )
          }
        }, 100)
      </script>
    `
  },
}

/**
 * Hebrew curriculum using RTL orientation.
 */
export const HebrewCurriculum: Story = {
  name: 'Hebrew Curriculum (RTL)',
  render: () => {
    const storyId = createStoryId('hebrew')

    return html`
      <div style="padding: 16px;">
        <div
          style="padding: 16px; background: #fff3e0; border-left: 4px solid #ff9800; border-radius: 4px; margin-bottom: 16px;"
        >
          <h3 style="margin: 0 0 8px 0; color: #e65100;">
            Hebrew Curriculum (RTL)
          </h3>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #333;">
            RTL orientation combined with Hebrew language creates a natural
            reading experience for RTL language users.
          </p>
          <p style="margin: 0; font-size: 13px; color: #666;">
            <strong>Note:</strong> The graph flows right-to-left, matching the
            Hebrew reading direction.
          </p>
        </div>
        <div
          style="width: 100%; height: 400px; border: 1px solid #ddd; border-radius: 4px;"
        >
          <blocks-graph
            id="${storyId}"
            language="he"
            show-prerequisites="true"
            orientation="rtl"
            node-width="200"
            node-height="70"
            horizontal-spacing="100"
            vertical-spacing="80"
          ></blocks-graph>
        </div>
      </div>
      <script>
        setTimeout(() => {
          const graph = document.getElementById('${storyId}')
          if (graph && typeof graph.loadFromJson === 'function') {
            graph.loadFromJson(
              ${JSON.stringify(JSON.stringify(CURRICULUM_BLOCKS))},
              'v0.1'
            )
          }
        }, 100)
      </script>
    `
  },
}

/**
 * Skill tree using BTT orientation.
 */
export const SkillTreeGrowth: Story = {
  name: 'Skill Tree (Growth)',
  render: () => {
    const storyId = createStoryId('skill-tree')

    const skillTreeBlocks = [
      {
        id: '550e8400-e29b-41d4-a716-446655440020',
        title: { he_text: 'בסיס', en_text: 'Foundation' },
        prerequisites: [],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440021',
        title: { he_text: 'מיומנות א', en_text: 'Skill A' },
        prerequisites: ['550e8400-e29b-41d4-a716-446655440020'],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440022',
        title: { he_text: 'מיומנות ב', en_text: 'Skill B' },
        prerequisites: ['550e8400-e29b-41d4-a716-446655440020'],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440023',
        title: { he_text: 'מיומנות ג', en_text: 'Skill C' },
        prerequisites: ['550e8400-e29b-41d4-a716-446655440020'],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440024',
        title: { he_text: 'מומחיות', en_text: 'Expertise' },
        prerequisites: [
          '550e8400-e29b-41d4-a716-446655440021',
          '550e8400-e29b-41d4-a716-446655440022',
        ],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440025',
        title: { he_text: 'שליטה', en_text: 'Mastery' },
        prerequisites: [
          '550e8400-e29b-41d4-a716-446655440024',
          '550e8400-e29b-41d4-a716-446655440023',
        ],
        parents: [],
      },
    ]

    return html`
      <div style="padding: 16px;">
        <div
          style="padding: 16px; background: #f3e5f5; border-left: 4px solid #9c27b0; border-radius: 4px; margin-bottom: 16px;"
        >
          <h3 style="margin: 0 0 8px 0; color: #6a1b9a;">
            Skill Tree (Bottom-to-Top Growth)
          </h3>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #333;">
            BTT orientation visualizes growth and progression from foundation to
            mastery. The upward flow emphasizes achievement and advancement.
          </p>
          <p style="margin: 0; font-size: 13px; color: #666;">
            <strong>Use cases:</strong> Skill trees, talent systems, progression
            charts, evolution diagrams
          </p>
        </div>
        <div
          style="width: 100%; height: 500px; border: 1px solid #ddd; border-radius: 4px;"
        >
          <blocks-graph
            id="${storyId}"
            language="en"
            show-prerequisites="true"
            orientation="btt"
            node-width="160"
            node-height="65"
            horizontal-spacing="80"
            vertical-spacing="90"
          ></blocks-graph>
        </div>
      </div>
      <script>
        setTimeout(() => {
          const graph = document.getElementById('${storyId}')
          if (graph && typeof graph.loadFromJson === 'function') {
            graph.loadFromJson(
              ${JSON.stringify(JSON.stringify(skillTreeBlocks))},
              'v0.1'
            )
          }
        }, 100)
      </script>
    `
  },
}

// =============================================================================
// SPACING STORIES
// =============================================================================

/**
 * Demonstrates how spacing behaves differently in vertical vs horizontal orientations.
 */
export const SpacingBehavior: Story = {
  name: 'Spacing Behavior',
  render: () => {
    const ttbId = createStoryId('spacing-ttb')
    const ltrId = createStoryId('spacing-ltr')

    return html`
      <div style="padding: 16px;">
        <h2 style="margin: 0 0 8px 0;">Spacing Behavior by Orientation</h2>
        <p style="margin: 0 0 24px 0; color: #666;">
          The same spacing values (H: 100px, V: 60px) produce different layouts
          depending on orientation.
        </p>

        <div
          style="margin-bottom: 24px; padding: 16px; background: #fff8e1; border-radius: 4px;"
        >
          <h4 style="margin: 0 0 12px 0; color: #f57c00;">Spacing Rules</h4>
          <table
            style="width: 100%; border-collapse: collapse; font-size: 14px;"
          >
            <thead>
              <tr style="background: #fff3e0;">
                <th
                  style="padding: 8px; text-align: left; border: 1px solid #ffe0b2;"
                >
                  Orientation
                </th>
                <th
                  style="padding: 8px; text-align: left; border: 1px solid #ffe0b2;"
                >
                  Level Spacing
                </th>
                <th
                  style="padding: 8px; text-align: left; border: 1px solid #ffe0b2;"
                >
                  Sibling Spacing
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 8px; border: 1px solid #ffe0b2;">
                  <strong>TTB / BTT</strong> (vertical)
                </td>
                <td style="padding: 8px; border: 1px solid #ffe0b2;">
                  vertical-spacing (60px)
                </td>
                <td style="padding: 8px; border: 1px solid #ffe0b2;">
                  horizontal-spacing (100px)
                </td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ffe0b2;">
                  <strong>LTR / RTL</strong> (horizontal)
                </td>
                <td style="padding: 8px; border: 1px solid #ffe0b2;">
                  horizontal-spacing (100px)
                </td>
                <td style="padding: 8px; border: 1px solid #ffe0b2;">
                  vertical-spacing (60px)
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
          <div
            style="border: 1px solid #ddd; border-radius: 8px; padding: 16px; background: white;"
          >
            <h3 style="margin: 0 0 8px 0; color: #333;">TTB: H=100, V=60</h3>
            <p style="margin: 0 0 12px 0; font-size: 13px; color: #666;">
              Wide siblings (100px), compact levels (60px)
            </p>
            <div
              style="width: 100%; height: 350px; border: 1px solid #e0e0e0; border-radius: 4px;"
            >
              <blocks-graph
                id="${ttbId}"
                language="en"
                show-prerequisites="true"
                orientation="ttb"
                node-width="150"
                node-height="55"
                horizontal-spacing="100"
                vertical-spacing="60"
              ></blocks-graph>
            </div>
          </div>

          <div
            style="border: 1px solid #ddd; border-radius: 8px; padding: 16px; background: white;"
          >
            <h3 style="margin: 0 0 8px 0; color: #333;">LTR: H=100, V=60</h3>
            <p style="margin: 0 0 12px 0; font-size: 13px; color: #666;">
              Wide levels (100px), compact siblings (60px)
            </p>
            <div
              style="width: 100%; height: 350px; border: 1px solid #e0e0e0; border-radius: 4px;"
            >
              <blocks-graph
                id="${ltrId}"
                language="en"
                show-prerequisites="true"
                orientation="ltr"
                node-width="150"
                node-height="55"
                horizontal-spacing="100"
                vertical-spacing="60"
              ></blocks-graph>
            </div>
          </div>
        </div>
      </div>
      <script>
        setTimeout(() => {
          const ttbGraph = document.getElementById('${ttbId}')
          const ltrGraph = document.getElementById('${ltrId}')
          const data = ${JSON.stringify(JSON.stringify(CURRICULUM_BLOCKS))}
          if (ttbGraph && typeof ttbGraph.loadFromJson === 'function') {
            ttbGraph.loadFromJson(data, 'v0.1')
          }
          if (ltrGraph && typeof ltrGraph.loadFromJson === 'function') {
            ltrGraph.loadFromJson(data, 'v0.1')
          }
        }, 100)
      </script>
    `
  },
  parameters: {
    layout: 'fullscreen',
  },
}

/**
 * Dynamic orientation switching demonstration.
 */
export const DynamicOrientation: Story = {
  name: 'Dynamic Switching',
  render: () => {
    const storyId = createStoryId('dynamic')

    return html`
      <div style="padding: 16px;">
        <div
          style="padding: 16px; background: #e8eaf6; border-left: 4px solid #3f51b5; border-radius: 4px; margin-bottom: 16px;"
        >
          <h3 style="margin: 0 0 8px 0; color: #283593;">
            Dynamic Orientation Switching
          </h3>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #333;">
            Orientation can be changed dynamically via JavaScript. The graph
            re-renders automatically.
          </p>
          <div style="display: flex; gap: 8px; margin-top: 12px;">
            <button
              onclick="document.getElementById('${storyId}').orientation = 'ttb'"
              style="padding: 8px 16px; background: #2196f3; color: white; border: none; border-radius: 4px; cursor: pointer;"
            >
              TTB
            </button>
            <button
              onclick="document.getElementById('${storyId}').orientation = 'ltr'"
              style="padding: 8px 16px; background: #4caf50; color: white; border: none; border-radius: 4px; cursor: pointer;"
            >
              LTR
            </button>
            <button
              onclick="document.getElementById('${storyId}').orientation = 'rtl'"
              style="padding: 8px 16px; background: #ff9800; color: white; border: none; border-radius: 4px; cursor: pointer;"
            >
              RTL
            </button>
            <button
              onclick="document.getElementById('${storyId}').orientation = 'btt'"
              style="padding: 8px 16px; background: #9c27b0; color: white; border: none; border-radius: 4px; cursor: pointer;"
            >
              BTT
            </button>
          </div>
        </div>
        <div
          style="width: 100%; height: 500px; border: 1px solid #ddd; border-radius: 4px;"
        >
          <blocks-graph
            id="${storyId}"
            language="en"
            show-prerequisites="true"
            orientation="ttb"
            node-width="180"
            node-height="70"
            horizontal-spacing="80"
            vertical-spacing="90"
          ></blocks-graph>
        </div>
        <div
          style="margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 4px;"
        >
          <pre
            style="margin: 0; font-size: 13px; overflow-x: auto;"
          ><code>// Change orientation dynamically
const graph = document.querySelector('blocks-graph');
graph.orientation = 'ltr'; // or 'ttb', 'rtl', 'btt'</code></pre>
        </div>
      </div>
      <script>
        setTimeout(() => {
          const graph = document.getElementById('${storyId}')
          if (graph && typeof graph.loadFromJson === 'function') {
            graph.loadFromJson(
              ${JSON.stringify(JSON.stringify(CURRICULUM_BLOCKS))},
              'v0.1'
            )
          }
        }, 100)
      </script>
    `
  },
}
