import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import '../index.js'

/**
 * Storybook stories for demonstrating Automatic Transitive Reduction.
 *
 * Transitive reduction removes redundant prerequisite edges for cleaner visualization.
 * When A→B→C exists and there's also a direct A→C edge, the A→C edge is considered
 * transitive (redundant) and is automatically hidden.
 */

const meta: Meta = {
  title: 'Features/Transitive Reduction',
  component: 'blocks-graph',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Automatic Transitive Reduction

The graph engine automatically removes redundant prerequisite edges for cleaner visualization.

### How It Works

When an edge A→C exists but there's also an indirect path A→B→C (or longer), the direct A→C edge is considered **transitive** (redundant) and is automatically removed from the visualization.

### Benefits

- **Cleaner graphs**: Reduces visual clutter by removing redundant edges
- **Easier to understand**: Shows only essential relationships
- **No configuration needed**: Always active, works automatically
- **Preserves data integrity**: Original edges are preserved in your data, only visualization is affected

### Algorithm

The graph uses BFS (Breadth-First Search) to detect indirect paths:
1. For each direct edge A→C, check if there's any path A→...→C through intermediate nodes
2. If an indirect path exists, mark the direct edge as transitive
3. Transitive edges are excluded from rendering but parent edges are never affected
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj

/**
 * Helper to create a unique story ID
 */
function createStoryId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}

/**
 * Helper to render a story with explanation
 */
function renderTransitiveStory(config: {
  storyId: string
  blocks: object[]
  title: string
  description: string
  dataEdges: string[]
  renderedEdges: string[]
  removedEdges: string[]
  height?: string
  nodeWidth?: number
  nodeHeight?: number
}) {
  const {
    storyId,
    blocks,
    title,
    description,
    dataEdges,
    renderedEdges,
    removedEdges,
    height = '450px',
    nodeWidth = 180,
    nodeHeight = 70,
  } = config

  return html`
    <div style="padding: 16px;">
      <div
        style="padding: 16px; background: #e8f5e9; border-left: 4px solid #4caf50; border-radius: 4px; margin-bottom: 16px;"
      >
        <h3 style="margin: 0 0 8px 0; color: #2e7d32;">${title}</h3>
        <p style="margin: 0 0 12px 0; font-size: 14px; color: #333;">
          ${description}
        </p>
        <div
          style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;"
        >
          <div
            style="padding: 12px; background: white; border-radius: 4px; border: 1px solid #e0e0e0;"
          >
            <h4 style="margin: 0 0 8px 0; font-size: 13px; color: #666;">
              📥 Input Edges (${dataEdges.length})
            </h4>
            <ul
              style="margin: 0; padding-left: 16px; font-size: 12px; color: #333;"
            >
              ${dataEdges.map(edge => html`<li>${edge}</li>`)}
            </ul>
          </div>
          <div
            style="padding: 12px; background: #c8e6c9; border-radius: 4px; border: 1px solid #a5d6a7;"
          >
            <h4 style="margin: 0 0 8px 0; font-size: 13px; color: #1b5e20;">
              ✅ Rendered (${renderedEdges.length})
            </h4>
            <ul
              style="margin: 0; padding-left: 16px; font-size: 12px; color: #1b5e20;"
            >
              ${renderedEdges.map(edge => html`<li>${edge}</li>`)}
            </ul>
          </div>
          <div
            style="padding: 12px; background: #ffcdd2; border-radius: 4px; border: 1px solid #ef9a9a;"
          >
            <h4 style="margin: 0 0 8px 0; font-size: 13px; color: #b71c1c;">
              ❌ Removed (${removedEdges.length})
            </h4>
            <ul
              style="margin: 0; padding-left: 16px; font-size: 12px; color: #b71c1c; text-decoration: line-through;"
            >
              ${removedEdges.map(edge => html`<li>${edge}</li>`)}
            </ul>
          </div>
        </div>
      </div>
      <div
        style="width: 100%; height: ${height}; border: 1px solid #ddd; border-radius: 4px;"
      >
        <blocks-graph
          id="${storyId}"
          language="en"
          show-prerequisites="true"
          orientation="ttb"
          node-width="${nodeWidth}"
          node-height="${nodeHeight}"
          horizontal-spacing="80"
          vertical-spacing="100"
        ></blocks-graph>
      </div>
    </div>
    <script>
      setTimeout(() => {
        const graph = document.getElementById('${storyId}')
        if (graph && typeof graph.loadFromJson === 'function') {
          graph.loadFromJson(${JSON.stringify(JSON.stringify(blocks))}, 'v0.1')
        }
      }, 100)
    </script>
  `
}

// =============================================================================
// BASIC EXAMPLES
// =============================================================================

/**
 * The simplest transitive reduction case: A→B→C with a redundant A→C edge.
 * The direct A→C edge is removed because there's already a path through B.
 */
export const SimpleChain: Story = {
  name: 'Simple Chain (A→B→C)',
  render: () => {
    const storyId = createStoryId('simple-chain')
    const blocks = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        title: { he_text: 'א', en_text: 'A - Foundation' },
        prerequisites: [],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        title: { he_text: 'ב', en_text: 'B - Intermediate' },
        prerequisites: ['550e8400-e29b-41d4-a716-446655440001'],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        title: { he_text: 'ג', en_text: 'C - Advanced' },
        prerequisites: [
          '550e8400-e29b-41d4-a716-446655440002',
          '550e8400-e29b-41d4-a716-446655440001', // Transitive!
        ],
        parents: [],
      },
    ]

    return renderTransitiveStory({
      storyId,
      blocks,
      title: 'Simple Chain: A → B → C',
      description:
        'The most basic transitive reduction case. C lists both A and B as prerequisites, but since A→B exists, the A→C edge is redundant.',
      dataEdges: ['A → B', 'B → C', 'A → C'],
      renderedEdges: ['A → B', 'B → C'],
      removedEdges: ['A → C (transitive via B)'],
    })
  },
}

/**
 * A four-node chain: A→B→C→D with all shortcut edges.
 * All shortcuts (A→C, A→D, B→D) are removed.
 */
export const FourNodeChain: Story = {
  name: 'Four Node Chain (A→B→C→D)',
  render: () => {
    const storyId = createStoryId('four-chain')
    const blocks = [
      {
        id: '550e8400-e29b-41d4-a716-446655440010',
        title: { he_text: 'א', en_text: 'A - Start' },
        prerequisites: [],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440011',
        title: { he_text: 'ב', en_text: 'B - Step 1' },
        prerequisites: ['550e8400-e29b-41d4-a716-446655440010'],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440012',
        title: { he_text: 'ג', en_text: 'C - Step 2' },
        prerequisites: [
          '550e8400-e29b-41d4-a716-446655440011',
          '550e8400-e29b-41d4-a716-446655440010', // Transitive!
        ],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440013',
        title: { he_text: 'ד', en_text: 'D - Final' },
        prerequisites: [
          '550e8400-e29b-41d4-a716-446655440012',
          '550e8400-e29b-41d4-a716-446655440011', // Transitive!
          '550e8400-e29b-41d4-a716-446655440010', // Transitive!
        ],
        parents: [],
      },
    ]

    return renderTransitiveStory({
      storyId,
      blocks,
      title: 'Four Node Chain: A → B → C → D',
      description:
        'A longer chain where multiple transitive edges are removed. D declares all predecessors as prerequisites, but only the direct edge C→D is needed.',
      dataEdges: ['A → B', 'B → C', 'A → C', 'C → D', 'B → D', 'A → D'],
      renderedEdges: ['A → B', 'B → C', 'C → D'],
      removedEdges: ['A → C (via B)', 'B → D (via C)', 'A → D (via B → C)'],
      height: '500px',
    })
  },
}

/**
 * No transitive edges: A simple chain without shortcuts.
 * All edges are essential and none are removed.
 */
export const NoTransitiveEdges: Story = {
  name: 'No Transitive Edges',
  render: () => {
    const storyId = createStoryId('no-transitive')
    const blocks = [
      {
        id: '550e8400-e29b-41d4-a716-446655440020',
        title: { he_text: 'א', en_text: 'A - First' },
        prerequisites: [],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440021',
        title: { he_text: 'ב', en_text: 'B - Second' },
        prerequisites: ['550e8400-e29b-41d4-a716-446655440020'],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440022',
        title: { he_text: 'ג', en_text: 'C - Third' },
        prerequisites: ['550e8400-e29b-41d4-a716-446655440021'],
        parents: [],
      },
    ]

    return renderTransitiveStory({
      storyId,
      blocks,
      title: 'No Transitive Edges',
      description:
        'A clean chain with only direct prerequisites. No edges are removed because there are no shortcuts.',
      dataEdges: ['A → B', 'B → C'],
      renderedEdges: ['A → B', 'B → C'],
      removedEdges: [],
    })
  },
}

// =============================================================================
// DIAMOND AND COMPLEX PATTERNS
// =============================================================================

/**
 * Diamond pattern: A→B, A→C, B→D, C→D with A→D shortcut.
 * The A→D edge is transitive because there are paths through B and C.
 */
export const DiamondPattern: Story = {
  name: 'Diamond Pattern',
  render: () => {
    const storyId = createStoryId('diamond')
    const blocks = [
      {
        id: '550e8400-e29b-41d4-a716-446655440030',
        title: { he_text: 'א', en_text: 'A - Start' },
        prerequisites: [],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440031',
        title: { he_text: 'ב', en_text: 'B - Path 1' },
        prerequisites: ['550e8400-e29b-41d4-a716-446655440030'],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440032',
        title: { he_text: 'ג', en_text: 'C - Path 2' },
        prerequisites: ['550e8400-e29b-41d4-a716-446655440030'],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440033',
        title: { he_text: 'ד', en_text: 'D - Convergence' },
        prerequisites: [
          '550e8400-e29b-41d4-a716-446655440031',
          '550e8400-e29b-41d4-a716-446655440032',
          '550e8400-e29b-41d4-a716-446655440030', // Transitive!
        ],
        parents: [],
      },
    ]

    return renderTransitiveStory({
      storyId,
      blocks,
      title: 'Diamond Pattern',
      description:
        'A classic diamond where two parallel paths converge. The direct A→D edge is removed because paths exist through both B and C.',
      dataEdges: ['A → B', 'A → C', 'B → D', 'C → D', 'A → D'],
      renderedEdges: ['A → B', 'A → C', 'B → D', 'C → D'],
      removedEdges: ['A → D (via B or C)'],
      height: '400px',
    })
  },
}

/**
 * Double diamond: Two diamonds stacked (A→B,C→D→E,F→G).
 * Multiple transitive edges at different levels.
 */
export const DoubleDiamond: Story = {
  name: 'Double Diamond',
  render: () => {
    const storyId = createStoryId('double-diamond')
    const blocks = [
      {
        id: '550e8400-e29b-41d4-a716-446655440040',
        title: { he_text: 'א', en_text: 'A - Origin' },
        prerequisites: [],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440041',
        title: { he_text: 'ב', en_text: 'B - Left' },
        prerequisites: ['550e8400-e29b-41d4-a716-446655440040'],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440042',
        title: { he_text: 'ג', en_text: 'C - Right' },
        prerequisites: ['550e8400-e29b-41d4-a716-446655440040'],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440043',
        title: { he_text: 'ד', en_text: 'D - Middle' },
        prerequisites: [
          '550e8400-e29b-41d4-a716-446655440041',
          '550e8400-e29b-41d4-a716-446655440042',
          '550e8400-e29b-41d4-a716-446655440040', // Transitive!
        ],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440044',
        title: { he_text: 'ה', en_text: 'E - Left 2' },
        prerequisites: ['550e8400-e29b-41d4-a716-446655440043'],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440045',
        title: { he_text: 'ו', en_text: 'F - Right 2' },
        prerequisites: ['550e8400-e29b-41d4-a716-446655440043'],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440046',
        title: { he_text: 'ז', en_text: 'G - Final' },
        prerequisites: [
          '550e8400-e29b-41d4-a716-446655440044',
          '550e8400-e29b-41d4-a716-446655440045',
          '550e8400-e29b-41d4-a716-446655440043', // Transitive!
        ],
        parents: [],
      },
    ]

    return renderTransitiveStory({
      storyId,
      blocks,
      title: 'Double Diamond Pattern',
      description:
        'Two diamond patterns stacked vertically. Transitive edges are removed at both the D and G convergence points.',
      dataEdges: [
        'A → B',
        'A → C',
        'B → D',
        'C → D',
        'A → D',
        'D → E',
        'D → F',
        'E → G',
        'F → G',
        'D → G',
      ],
      renderedEdges: [
        'A → B',
        'A → C',
        'B → D',
        'C → D',
        'D → E',
        'D → F',
        'E → G',
        'F → G',
      ],
      removedEdges: ['A → D (via B or C)', 'D → G (via E or F)'],
      height: '600px',
      nodeWidth: 140,
      nodeHeight: 60,
    })
  },
}

/**
 * Fan-in pattern: Multiple sources converge to one target.
 * A, B, C all point to D, plus A points to B and C (creating transitives).
 */
export const FanInPattern: Story = {
  name: 'Fan-In Pattern',
  render: () => {
    const storyId = createStoryId('fan-in')
    const blocks = [
      {
        id: '550e8400-e29b-41d4-a716-446655440050',
        title: { he_text: 'א', en_text: 'A - Source' },
        prerequisites: [],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440051',
        title: { he_text: 'ב', en_text: 'B - Branch 1' },
        prerequisites: ['550e8400-e29b-41d4-a716-446655440050'],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440052',
        title: { he_text: 'ג', en_text: 'C - Branch 2' },
        prerequisites: ['550e8400-e29b-41d4-a716-446655440050'],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440053',
        title: { he_text: 'ד', en_text: 'D - Branch 3' },
        prerequisites: ['550e8400-e29b-41d4-a716-446655440050'],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440054',
        title: { he_text: 'ה', en_text: 'E - Convergence' },
        prerequisites: [
          '550e8400-e29b-41d4-a716-446655440051',
          '550e8400-e29b-41d4-a716-446655440052',
          '550e8400-e29b-41d4-a716-446655440053',
          '550e8400-e29b-41d4-a716-446655440050', // Transitive!
        ],
        parents: [],
      },
    ]

    return renderTransitiveStory({
      storyId,
      blocks,
      title: 'Fan-In Pattern',
      description:
        'Multiple branches from A converge at E. The direct A→E edge is transitive because multiple paths exist through B, C, and D.',
      dataEdges: [
        'A → B',
        'A → C',
        'A → D',
        'B → E',
        'C → E',
        'D → E',
        'A → E',
      ],
      renderedEdges: ['A → B', 'A → C', 'A → D', 'B → E', 'C → E', 'D → E'],
      removedEdges: ['A → E (via B, C, or D)'],
      height: '400px',
    })
  },
}

// =============================================================================
// REAL-WORLD CURRICULUM EXAMPLES
// =============================================================================

/**
 * Mathematics curriculum with transitive prerequisites.
 * Shows a realistic educational dependency structure.
 */
export const MathCurriculum: Story = {
  name: 'Math Curriculum',
  render: () => {
    const storyId = createStoryId('math-curriculum')
    const blocks = [
      {
        id: '550e8400-e29b-41d4-a716-446655440060',
        title: { he_text: 'מתמטיקה בסיסית', en_text: 'Basic Math' },
        prerequisites: [],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440061',
        title: { he_text: 'אלגברה', en_text: 'Algebra' },
        prerequisites: ['550e8400-e29b-41d4-a716-446655440060'],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440062',
        title: { he_text: 'גאומטריה', en_text: 'Geometry' },
        prerequisites: ['550e8400-e29b-41d4-a716-446655440060'],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440063',
        title: { he_text: 'טריגונומטריה', en_text: 'Trigonometry' },
        prerequisites: [
          '550e8400-e29b-41d4-a716-446655440061',
          '550e8400-e29b-41d4-a716-446655440062',
          '550e8400-e29b-41d4-a716-446655440060', // Transitive!
        ],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440064',
        title: { he_text: 'חשבון', en_text: 'Calculus' },
        prerequisites: [
          '550e8400-e29b-41d4-a716-446655440063',
          '550e8400-e29b-41d4-a716-446655440061', // Transitive!
          '550e8400-e29b-41d4-a716-446655440060', // Transitive!
        ],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440065',
        title: { he_text: 'אנליזה', en_text: 'Analysis' },
        prerequisites: [
          '550e8400-e29b-41d4-a716-446655440064',
          '550e8400-e29b-41d4-a716-446655440063', // Transitive!
          '550e8400-e29b-41d4-a716-446655440061', // Transitive!
          '550e8400-e29b-41d4-a716-446655440060', // Transitive!
        ],
        parents: [],
      },
    ]

    return renderTransitiveStory({
      storyId,
      blocks,
      title: 'Mathematics Curriculum',
      description:
        'A realistic math curriculum where each advanced course lists all previous courses as prerequisites. Transitive reduction reveals the essential path.',
      dataEdges: [
        'Basic → Algebra',
        'Basic → Geometry',
        'Algebra → Trig',
        'Geometry → Trig',
        'Basic → Trig',
        'Trig → Calc',
        'Algebra → Calc',
        'Basic → Calc',
        'Calc → Analysis',
        'Trig → Analysis',
        'Algebra → Analysis',
        'Basic → Analysis',
      ],
      renderedEdges: [
        'Basic → Algebra',
        'Basic → Geometry',
        'Algebra → Trig',
        'Geometry → Trig',
        'Trig → Calc',
        'Calc → Analysis',
      ],
      removedEdges: [
        'Basic → Trig',
        'Algebra → Calc',
        'Basic → Calc',
        'Trig → Analysis',
        'Algebra → Analysis',
        'Basic → Analysis',
      ],
      height: '550px',
      nodeWidth: 160,
      nodeHeight: 65,
    })
  },
}

/**
 * Computer Science curriculum with complex prerequisites.
 */
export const CSCurriculum: Story = {
  name: 'CS Curriculum',
  render: () => {
    const storyId = createStoryId('cs-curriculum')
    const blocks = [
      {
        id: '550e8400-e29b-41d4-a716-446655440070',
        title: { he_text: 'מבוא למדמ"ח', en_text: 'Intro to CS' },
        prerequisites: [],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440071',
        title: { he_text: 'מבני נתונים', en_text: 'Data Structures' },
        prerequisites: ['550e8400-e29b-41d4-a716-446655440070'],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440072',
        title: { he_text: 'אלגוריתמים', en_text: 'Algorithms' },
        prerequisites: [
          '550e8400-e29b-41d4-a716-446655440071',
          '550e8400-e29b-41d4-a716-446655440070', // Transitive!
        ],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440073',
        title: { he_text: 'מערכות הפעלה', en_text: 'Operating Systems' },
        prerequisites: [
          '550e8400-e29b-41d4-a716-446655440071',
          '550e8400-e29b-41d4-a716-446655440070', // Transitive!
        ],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440074',
        title: { he_text: 'מערכות מבוזרות', en_text: 'Distributed Systems' },
        prerequisites: [
          '550e8400-e29b-41d4-a716-446655440072',
          '550e8400-e29b-41d4-a716-446655440073',
          '550e8400-e29b-41d4-a716-446655440071', // Transitive!
          '550e8400-e29b-41d4-a716-446655440070', // Transitive!
        ],
        parents: [],
      },
    ]

    return renderTransitiveStory({
      storyId,
      blocks,
      title: 'Computer Science Curriculum',
      description:
        'A CS degree progression where advanced courses declare all foundational courses. The graph shows only direct prerequisite relationships.',
      dataEdges: [
        'Intro → DS',
        'DS → Algo',
        'Intro → Algo',
        'DS → OS',
        'Intro → OS',
        'Algo → Distributed',
        'OS → Distributed',
        'DS → Distributed',
        'Intro → Distributed',
      ],
      renderedEdges: [
        'Intro → DS',
        'DS → Algo',
        'DS → OS',
        'Algo → Distributed',
        'OS → Distributed',
      ],
      removedEdges: [
        'Intro → Algo',
        'Intro → OS',
        'DS → Distributed',
        'Intro → Distributed',
      ],
      height: '500px',
      nodeWidth: 170,
      nodeHeight: 60,
    })
  },
}

// =============================================================================
// EDGE CASES
// =============================================================================

/**
 * Multiple independent chains with no transitives.
 * Two separate prerequisite chains that don't interact.
 */
export const IndependentChains: Story = {
  name: 'Independent Chains',
  render: () => {
    const storyId = createStoryId('independent')
    const blocks = [
      {
        id: '550e8400-e29b-41d4-a716-446655440080',
        title: { he_text: 'א', en_text: 'A1' },
        prerequisites: [],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440081',
        title: { he_text: 'ב', en_text: 'A2' },
        prerequisites: ['550e8400-e29b-41d4-a716-446655440080'],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440082',
        title: { he_text: 'ג', en_text: 'A3' },
        prerequisites: ['550e8400-e29b-41d4-a716-446655440081'],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440083',
        title: { he_text: 'ד', en_text: 'B1' },
        prerequisites: [],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440084',
        title: { he_text: 'ה', en_text: 'B2' },
        prerequisites: ['550e8400-e29b-41d4-a716-446655440083'],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440085',
        title: { he_text: 'ו', en_text: 'B3' },
        prerequisites: ['550e8400-e29b-41d4-a716-446655440084'],
        parents: [],
      },
    ]

    return renderTransitiveStory({
      storyId,
      blocks,
      title: 'Independent Chains',
      description:
        'Two completely separate chains that do not interact. No transitive edges exist because neither chain has shortcuts.',
      dataEdges: ['A1 → A2', 'A2 → A3', 'B1 → B2', 'B2 → B3'],
      renderedEdges: ['A1 → A2', 'A2 → A3', 'B1 → B2', 'B2 → B3'],
      removedEdges: [],
      height: '350px',
      nodeWidth: 140,
      nodeHeight: 60,
    })
  },
}

/**
 * Crossing chains: Two chains that share some nodes.
 */
export const CrossingChains: Story = {
  name: 'Crossing Chains',
  render: () => {
    const storyId = createStoryId('crossing')
    const blocks = [
      {
        id: '550e8400-e29b-41d4-a716-446655440090',
        title: { he_text: 'א', en_text: 'Root' },
        prerequisites: [],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440091',
        title: { he_text: 'ב', en_text: 'Left' },
        prerequisites: ['550e8400-e29b-41d4-a716-446655440090'],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440092',
        title: { he_text: 'ג', en_text: 'Right' },
        prerequisites: ['550e8400-e29b-41d4-a716-446655440090'],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440093',
        title: { he_text: 'ד', en_text: 'Cross Left' },
        prerequisites: [
          '550e8400-e29b-41d4-a716-446655440091',
          '550e8400-e29b-41d4-a716-446655440092',
          '550e8400-e29b-41d4-a716-446655440090', // Transitive!
        ],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440094',
        title: { he_text: 'ה', en_text: 'Cross Right' },
        prerequisites: [
          '550e8400-e29b-41d4-a716-446655440091',
          '550e8400-e29b-41d4-a716-446655440092',
          '550e8400-e29b-41d4-a716-446655440090', // Transitive!
        ],
        parents: [],
      },
    ]

    return renderTransitiveStory({
      storyId,
      blocks,
      title: 'Crossing Chains',
      description:
        'Two branches from Root converge at two different points. Both Cross Left and Cross Right have transitive edges to Root.',
      dataEdges: [
        'Root → Left',
        'Root → Right',
        'Left → Cross Left',
        'Right → Cross Left',
        'Root → Cross Left',
        'Left → Cross Right',
        'Right → Cross Right',
        'Root → Cross Right',
      ],
      renderedEdges: [
        'Root → Left',
        'Root → Right',
        'Left → Cross Left',
        'Right → Cross Left',
        'Left → Cross Right',
        'Right → Cross Right',
      ],
      removedEdges: ['Root → Cross Left', 'Root → Cross Right'],
      height: '400px',
      nodeWidth: 140,
      nodeHeight: 60,
    })
  },
}

/**
 * Long chain: 6 nodes in a row with all possible shortcuts.
 * Maximum transitive reduction in a linear graph.
 */
export const LongChain: Story = {
  name: 'Long Chain (6 Nodes)',
  render: () => {
    const storyId = createStoryId('long-chain')
    const blocks = [
      {
        id: '550e8400-e29b-41d4-a716-4466554400a0',
        title: { he_text: 'א', en_text: 'Node 1' },
        prerequisites: [],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-4466554400a1',
        title: { he_text: 'ב', en_text: 'Node 2' },
        prerequisites: ['550e8400-e29b-41d4-a716-4466554400a0'],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-4466554400a2',
        title: { he_text: 'ג', en_text: 'Node 3' },
        prerequisites: [
          '550e8400-e29b-41d4-a716-4466554400a1',
          '550e8400-e29b-41d4-a716-4466554400a0', // Transitive
        ],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-4466554400a3',
        title: { he_text: 'ד', en_text: 'Node 4' },
        prerequisites: [
          '550e8400-e29b-41d4-a716-4466554400a2',
          '550e8400-e29b-41d4-a716-4466554400a1', // Transitive
          '550e8400-e29b-41d4-a716-4466554400a0', // Transitive
        ],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-4466554400a4',
        title: { he_text: 'ה', en_text: 'Node 5' },
        prerequisites: [
          '550e8400-e29b-41d4-a716-4466554400a3',
          '550e8400-e29b-41d4-a716-4466554400a2', // Transitive
          '550e8400-e29b-41d4-a716-4466554400a1', // Transitive
          '550e8400-e29b-41d4-a716-4466554400a0', // Transitive
        ],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-4466554400a5',
        title: { he_text: 'ו', en_text: 'Node 6' },
        prerequisites: [
          '550e8400-e29b-41d4-a716-4466554400a4',
          '550e8400-e29b-41d4-a716-4466554400a3', // Transitive
          '550e8400-e29b-41d4-a716-4466554400a2', // Transitive
          '550e8400-e29b-41d4-a716-4466554400a1', // Transitive
          '550e8400-e29b-41d4-a716-4466554400a0', // Transitive
        ],
        parents: [],
      },
    ]

    return renderTransitiveStory({
      storyId,
      blocks,
      title: 'Long Chain with All Shortcuts',
      description:
        'A 6-node linear chain where every node declares all previous nodes as prerequisites. 15 input edges reduced to 5 essential edges.',
      dataEdges: [
        '1 → 2',
        '2 → 3',
        '1 → 3',
        '3 → 4',
        '2 → 4',
        '1 → 4',
        '4 → 5',
        '3 → 5',
        '2 → 5',
        '1 → 5',
        '5 → 6',
        '4 → 6',
        '3 → 6',
        '2 → 6',
        '1 → 6',
      ],
      renderedEdges: ['1 → 2', '2 → 3', '3 → 4', '4 → 5', '5 → 6'],
      removedEdges: [
        '1 → 3',
        '1 → 4',
        '2 → 4',
        '1 → 5',
        '2 → 5',
        '3 → 5',
        '1 → 6',
        '2 → 6',
        '3 → 6',
        '4 → 6',
      ],
      height: '650px',
      nodeWidth: 140,
      nodeHeight: 55,
    })
  },
}

// =============================================================================
// SPECIAL CASES
// =============================================================================

/**
 * Parent edges are preserved: Shows that transitive reduction
 * only affects prerequisite edges, not parent edges.
 */
export const ParentEdgesPreserved: Story = {
  name: 'Parent Edges Preserved',
  render: () => {
    const storyId = createStoryId('parent-preserved')
    const blocks = [
      {
        id: '550e8400-e29b-41d4-a716-4466554400b0',
        title: { he_text: 'א', en_text: 'Root' },
        prerequisites: [],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-4466554400b1',
        title: { he_text: 'ב', en_text: 'Child A' },
        prerequisites: ['550e8400-e29b-41d4-a716-4466554400b0'],
        parents: ['550e8400-e29b-41d4-a716-4466554400b0'],
      },
      {
        id: '550e8400-e29b-41d4-a716-4466554400b2',
        title: { he_text: 'ג', en_text: 'Child B' },
        prerequisites: [
          '550e8400-e29b-41d4-a716-4466554400b1',
          '550e8400-e29b-41d4-a716-4466554400b0', // Transitive prerequisite
        ],
        parents: ['550e8400-e29b-41d4-a716-4466554400b0'], // Parent preserved!
      },
    ]

    return html`
      <div style="padding: 16px;">
        <div
          style="padding: 16px; background: #e3f2fd; border-left: 4px solid #2196f3; border-radius: 4px; margin-bottom: 16px;"
        >
          <h3 style="margin: 0 0 8px 0; color: #1565c0;">
            Parent Edges Are Never Removed
          </h3>
          <p style="margin: 0 0 12px 0; font-size: 14px; color: #333;">
            Transitive reduction only affects
            <strong>prerequisite</strong> edges. Parent-child relationships are
            always preserved.
          </p>
          <div
            style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;"
          >
            <div
              style="padding: 12px; background: white; border-radius: 4px; border: 1px solid #e0e0e0;"
            >
              <h4 style="margin: 0 0 8px 0; font-size: 13px; color: #666;">
                Prerequisite Edges
              </h4>
              <ul
                style="margin: 0; padding-left: 16px; font-size: 12px; color: #333;"
              >
                <li>Root → Child A ✅</li>
                <li>Child A → Child B ✅</li>
                <li style="text-decoration: line-through; color: #b71c1c;">
                  Root → Child B ❌ (transitive)
                </li>
              </ul>
            </div>
            <div
              style="padding: 12px; background: #fff3e0; border-radius: 4px; border: 1px solid #ffcc80;"
            >
              <h4 style="margin: 0 0 8px 0; font-size: 13px; color: #e65100;">
                Parent Edges (always preserved)
              </h4>
              <ul
                style="margin: 0; padding-left: 16px; font-size: 12px; color: #333;"
              >
                <li>Root → Child A ✅</li>
                <li>Root → Child B ✅</li>
              </ul>
            </div>
          </div>
        </div>
        <div
          style="width: 100%; height: 400px; border: 1px solid #ddd; border-radius: 4px;"
        >
          <blocks-graph
            id="${storyId}"
            language="en"
            show-prerequisites="true"
            orientation="ttb"
            node-width="180"
            node-height="70"
            horizontal-spacing="80"
            vertical-spacing="100"
          ></blocks-graph>
        </div>
        <div
          style="margin-top: 16px; padding: 12px; background: #fff8e1; border-radius: 4px; font-size: 13px;"
        >
          <strong>💡 Note:</strong> Click on "Root" to see both Child A and
          Child B as its children. The parent relationship defines navigation,
          while prerequisites (blue dashed lines) show learning dependencies.
        </div>
      </div>
      <script>
        setTimeout(() => {
          const graph = document.getElementById('${storyId}')
          if (graph && typeof graph.loadFromJson === 'function') {
            graph.loadFromJson(
              ${JSON.stringify(JSON.stringify(blocks))},
              'v0.1'
            )
          }
        }, 100)
      </script>
    `
  },
}

/**
 * Mixed: Some transitives, some essential edges.
 * Complex graph that demonstrates selective reduction.
 */
export const MixedComplexity: Story = {
  name: 'Mixed Complexity',
  render: () => {
    const storyId = createStoryId('mixed')
    const blocks = [
      {
        id: '550e8400-e29b-41d4-a716-4466554400c0',
        title: { he_text: 'א', en_text: 'Foundation' },
        prerequisites: [],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-4466554400c1',
        title: { he_text: 'ב', en_text: 'Theory' },
        prerequisites: ['550e8400-e29b-41d4-a716-4466554400c0'],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-4466554400c2',
        title: { he_text: 'ג', en_text: 'Practice' },
        prerequisites: ['550e8400-e29b-41d4-a716-4466554400c0'],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-4466554400c3',
        title: { he_text: 'ד', en_text: 'Lab' },
        prerequisites: ['550e8400-e29b-41d4-a716-4466554400c0'],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-4466554400c4',
        title: { he_text: 'ה', en_text: 'Advanced Theory' },
        prerequisites: [
          '550e8400-e29b-41d4-a716-4466554400c1',
          '550e8400-e29b-41d4-a716-4466554400c0', // Transitive
        ],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-4466554400c5',
        title: { he_text: 'ו', en_text: 'Project' },
        prerequisites: [
          '550e8400-e29b-41d4-a716-4466554400c2',
          '550e8400-e29b-41d4-a716-4466554400c3',
          '550e8400-e29b-41d4-a716-4466554400c0', // Transitive
        ],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-4466554400c6',
        title: { he_text: 'ז', en_text: 'Capstone' },
        prerequisites: [
          '550e8400-e29b-41d4-a716-4466554400c4',
          '550e8400-e29b-41d4-a716-4466554400c5',
          '550e8400-e29b-41d4-a716-4466554400c1', // Transitive
          '550e8400-e29b-41d4-a716-4466554400c2', // Transitive
          '550e8400-e29b-41d4-a716-4466554400c0', // Transitive
        ],
        parents: [],
      },
    ]

    return renderTransitiveStory({
      storyId,
      blocks,
      title: 'Mixed Complexity Graph',
      description:
        'A complex course structure with multiple paths and selective transitive reduction. Not all Foundation edges are transitive - only those with indirect paths.',
      dataEdges: [
        'Foundation → Theory',
        'Foundation → Practice',
        'Foundation → Lab',
        'Theory → Adv Theory',
        'Foundation → Adv Theory',
        'Practice → Project',
        'Lab → Project',
        'Foundation → Project',
        'Adv Theory → Capstone',
        'Project → Capstone',
        'Theory → Capstone',
        'Practice → Capstone',
        'Foundation → Capstone',
      ],
      renderedEdges: [
        'Foundation → Theory',
        'Foundation → Practice',
        'Foundation → Lab',
        'Theory → Adv Theory',
        'Practice → Project',
        'Lab → Project',
        'Adv Theory → Capstone',
        'Project → Capstone',
      ],
      removedEdges: [
        'Foundation → Adv Theory',
        'Foundation → Project',
        'Theory → Capstone',
        'Practice → Capstone',
        'Foundation → Capstone',
      ],
      height: '600px',
      nodeWidth: 160,
      nodeHeight: 55,
    })
  },
}

/**
 * Before/After comparison showing the same graph with and without
 * transitive reduction (for visual demonstration).
 */
export const BeforeAfterComparison: Story = {
  name: 'Before/After Comparison',
  render: () => {
    const afterId = createStoryId('after')

    const blocks = [
      {
        id: '550e8400-e29b-41d4-a716-4466554400d0',
        title: { he_text: 'א', en_text: 'A' },
        prerequisites: [],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-4466554400d1',
        title: { he_text: 'ב', en_text: 'B' },
        prerequisites: ['550e8400-e29b-41d4-a716-4466554400d0'],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-4466554400d2',
        title: { he_text: 'ג', en_text: 'C' },
        prerequisites: [
          '550e8400-e29b-41d4-a716-4466554400d1',
          '550e8400-e29b-41d4-a716-4466554400d0',
        ],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-4466554400d3',
        title: { he_text: 'ד', en_text: 'D' },
        prerequisites: [
          '550e8400-e29b-41d4-a716-4466554400d2',
          '550e8400-e29b-41d4-a716-4466554400d1',
          '550e8400-e29b-41d4-a716-4466554400d0',
        ],
        parents: [],
      },
    ]

    return html`
      <div style="padding: 16px;">
        <h2 style="margin: 0 0 8px 0;">Before & After Transitive Reduction</h2>
        <p style="margin: 0 0 24px 0; color: #666;">
          Visual comparison showing how transitive reduction cleans up the
          graph.
        </p>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
          <!-- Before (conceptual) -->
          <div
            style="border: 1px solid #ffcdd2; border-radius: 8px; padding: 16px; background: #ffebee;"
          >
            <h3 style="margin: 0 0 12px 0; color: #c62828;">
              ❌ Without Transitive Reduction
            </h3>
            <div
              style="padding: 16px; background: white; border-radius: 4px; margin-bottom: 12px;"
            >
              <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: bold;">
                All declared edges shown (6 edges):
              </p>
              <svg
                viewBox="0 0 300 400"
                style="width: 100%; height: 300px; display: block;"
              >
                <!-- Nodes -->
                <rect
                  x="110"
                  y="20"
                  width="80"
                  height="40"
                  rx="4"
                  fill="#e3f2fd"
                  stroke="#1976d2"
                  stroke-width="2"
                />
                <text
                  x="150"
                  y="45"
                  text-anchor="middle"
                  font-size="14"
                  font-weight="bold"
                >
                  A
                </text>

                <rect
                  x="110"
                  y="120"
                  width="80"
                  height="40"
                  rx="4"
                  fill="#e3f2fd"
                  stroke="#1976d2"
                  stroke-width="2"
                />
                <text
                  x="150"
                  y="145"
                  text-anchor="middle"
                  font-size="14"
                  font-weight="bold"
                >
                  B
                </text>

                <rect
                  x="110"
                  y="220"
                  width="80"
                  height="40"
                  rx="4"
                  fill="#e3f2fd"
                  stroke="#1976d2"
                  stroke-width="2"
                />
                <text
                  x="150"
                  y="245"
                  text-anchor="middle"
                  font-size="14"
                  font-weight="bold"
                >
                  C
                </text>

                <rect
                  x="110"
                  y="320"
                  width="80"
                  height="40"
                  rx="4"
                  fill="#e3f2fd"
                  stroke="#1976d2"
                  stroke-width="2"
                />
                <text
                  x="150"
                  y="345"
                  text-anchor="middle"
                  font-size="14"
                  font-weight="bold"
                >
                  D
                </text>

                <!-- Essential edges (solid) -->
                <line
                  x1="150"
                  y1="60"
                  x2="150"
                  y2="120"
                  stroke="#4a90e2"
                  stroke-width="2"
                  stroke-dasharray="8,4"
                />
                <line
                  x1="150"
                  y1="160"
                  x2="150"
                  y2="220"
                  stroke="#4a90e2"
                  stroke-width="2"
                  stroke-dasharray="8,4"
                />
                <line
                  x1="150"
                  y1="260"
                  x2="150"
                  y2="320"
                  stroke="#4a90e2"
                  stroke-width="2"
                  stroke-dasharray="8,4"
                />

                <!-- Transitive edges (red, would be removed) -->
                <line
                  x1="110"
                  y1="60"
                  x2="110"
                  y2="220"
                  stroke="#ef5350"
                  stroke-width="2"
                  stroke-dasharray="8,4"
                />
                <line
                  x1="190"
                  y1="60"
                  x2="190"
                  y2="320"
                  stroke="#ef5350"
                  stroke-width="2"
                  stroke-dasharray="8,4"
                />
                <line
                  x1="190"
                  y1="160"
                  x2="190"
                  y2="320"
                  stroke="#ef5350"
                  stroke-width="2"
                  stroke-dasharray="8,4"
                />
              </svg>
              <div style="font-size: 12px; color: #666; text-align: center;">
                <span style="color: #4a90e2;">— Essential</span>
                &nbsp;&nbsp;
                <span style="color: #ef5350;"
                  >— Transitive (clutters view)</span
                >
              </div>
            </div>
          </div>

          <!-- After (actual graph) -->
          <div
            style="border: 1px solid #c8e6c9; border-radius: 8px; padding: 16px; background: #e8f5e9;"
          >
            <h3 style="margin: 0 0 12px 0; color: #2e7d32;">
              ✅ With Transitive Reduction
            </h3>
            <div
              style="width: 100%; height: 350px; border: 1px solid #a5d6a7; border-radius: 4px; background: white;"
            >
              <blocks-graph
                id="${afterId}"
                language="en"
                show-prerequisites="true"
                orientation="ttb"
                node-width="140"
                node-height="50"
                horizontal-spacing="60"
                vertical-spacing="80"
              ></blocks-graph>
            </div>
            <p
              style="margin: 12px 0 0 0; font-size: 12px; color: #2e7d32; text-align: center;"
            >
              Only 3 essential edges shown - clean and clear!
            </p>
          </div>
        </div>

        <div
          style="margin-top: 24px; padding: 16px; background: #f5f5f5; border-radius: 4px;"
        >
          <h4 style="margin: 0 0 8px 0;">Summary</h4>
          <ul
            style="margin: 0; padding-left: 20px; font-size: 14px; color: #333;"
          >
            <li>
              <strong>Input:</strong> 6 prerequisite edges declared in data
            </li>
            <li>
              <strong>Output:</strong> 3 essential edges rendered (50%
              reduction)
            </li>
            <li>
              <strong>Removed:</strong> A→C, A→D, B→D (all have indirect paths)
            </li>
          </ul>
        </div>
      </div>
      <script>
        setTimeout(() => {
          const graph = document.getElementById('${afterId}')
          if (graph && typeof graph.loadFromJson === 'function') {
            graph.loadFromJson(
              ${JSON.stringify(JSON.stringify(blocks))},
              'v0.1'
            )
          }
        }, 100)
      </script>
    `
  },
}
