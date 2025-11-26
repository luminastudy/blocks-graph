import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import '../index.js'

const meta: Meta = {
  title: 'Features/Grid Layout',
  component: 'blocks-graph',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Demonstrations of the grid layout feature that wraps nodes into rows/columns ' +
          'when using maxNodesPerLevel configuration.',
      },
    },
  },
}

export default meta
type Story = StoryObj

// Helper to create unique IDs for story instances
const createStoryId = (prefix: string): string =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`

// Create blocks at the same level for grid demonstrations
const createFlatBlocks = (count: number, prefix = 'Block') =>
  Array.from({ length: count }, (_, i) => ({
    id: `550e8400-e29b-41d4-a716-44665544${String(i).padStart(4, '0')}`,
    title: {
      he_text: `בלוק ${i + 1}`,
      en_text: `${prefix} ${i + 1}`,
    },
    prerequisites: [],
    parents: [],
  }))

// ============================================================================
// BASIC GRID EXAMPLES
// ============================================================================

/**
 * Default behavior without grid wrapping - all nodes appear in a single row.
 * This is the baseline before applying maxNodesPerLevel.
 */
export const NoWrapping: Story = {
  render: () => {
    const storyId = createStoryId('no-wrap')
    const blocks = createFlatBlocks(8)

    setTimeout(() => {
      const graph = document.getElementById(storyId)
      if (
        graph &&
        'loadFromJson' in graph &&
        typeof graph.loadFromJson === 'function'
      ) {
        graph.loadFromJson(JSON.stringify(blocks), 'v0.1')
      }
    }, 100)

    return html`
      <div style="padding: 16px;">
        <div
          style="padding: 16px; background: #e8eaf6; border-left: 4px solid #3f51b5; border-radius: 4px; margin-bottom: 16px;"
        >
          <h3 style="margin: 0 0 8px 0; color: #283593;">
            No Grid Wrapping (Default)
          </h3>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #333;">
            Without maxNodesPerLevel, all 8 blocks appear in a single row.
          </p>
          <p style="margin: 0; font-size: 13px; color: #666;">
            This can lead to very wide graphs when many nodes exist at the same
            level.
          </p>
        </div>
        <div
          style="width: 100%; height: 300px; border: 1px solid #ddd; border-radius: 4px; overflow: auto;"
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
          ></blocks-graph>
        </div>
      </div>
    `
  },
}

/**
 * Basic grid wrapping with 4 nodes per row.
 * Demonstrates the fundamental grid layout behavior.
 */
export const BasicWrapping: Story = {
  render: () => {
    const storyId = createStoryId('basic-wrap')
    const blocks = createFlatBlocks(10)

    setTimeout(() => {
      const graph = document.getElementById(storyId)
      if (
        graph &&
        'loadFromJson' in graph &&
        typeof graph.loadFromJson === 'function'
      ) {
        graph.loadFromJson(JSON.stringify(blocks), 'v0.1')
      }
    }, 100)

    return html`
      <div style="padding: 16px;">
        <div
          style="padding: 16px; background: #e8f5e9; border-left: 4px solid #4caf50; border-radius: 4px; margin-bottom: 16px;"
        >
          <h3 style="margin: 0 0 8px 0; color: #2e7d32;">
            Basic Grid Wrapping (max 4 per row)
          </h3>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #333;">
            With <code>max-nodes-per-level="4"</code>, 10 blocks wrap into 3
            rows: 4 + 4 + 2
          </p>
          <p style="margin: 0; font-size: 13px; color: #666;">
            This creates a more compact, readable layout.
          </p>
        </div>
        <div
          style="width: 100%; height: 400px; border: 1px solid #ddd; border-radius: 4px; overflow: auto;"
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
            max-nodes-per-level="4"
          ></blocks-graph>
        </div>
      </div>
    `
  },
}

/**
 * Minimal wrapping with 2 nodes per row creates a narrow, tall layout.
 */
export const NarrowGrid: Story = {
  render: () => {
    const storyId = createStoryId('narrow-grid')
    const blocks = createFlatBlocks(8)

    setTimeout(() => {
      const graph = document.getElementById(storyId)
      if (
        graph &&
        'loadFromJson' in graph &&
        typeof graph.loadFromJson === 'function'
      ) {
        graph.loadFromJson(JSON.stringify(blocks), 'v0.1')
      }
    }, 100)

    return html`
      <div style="padding: 16px;">
        <div
          style="padding: 16px; background: #fff3e0; border-left: 4px solid #ff9800; border-radius: 4px; margin-bottom: 16px;"
        >
          <h3 style="margin: 0 0 8px 0; color: #e65100;">
            Narrow Grid (max 2 per row)
          </h3>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #333;">
            <code>max-nodes-per-level="2"</code> creates a narrow, vertical
            layout.
          </p>
          <p style="margin: 0; font-size: 13px; color: #666;">
            8 blocks become 4 rows of 2 blocks each.
          </p>
        </div>
        <div
          style="width: 100%; height: 500px; border: 1px solid #ddd; border-radius: 4px; overflow: auto;"
        >
          <blocks-graph
            id="${storyId}"
            language="en"
            show-prerequisites="true"
            orientation="ttb"
            node-width="160"
            node-height="60"
            horizontal-spacing="30"
            vertical-spacing="20"
            max-nodes-per-level="2"
          ></blocks-graph>
        </div>
      </div>
    `
  },
}

/**
 * Single column layout (max 1 per row) - extreme vertical arrangement.
 */
export const SingleColumn: Story = {
  render: () => {
    const storyId = createStoryId('single-col')
    const blocks = createFlatBlocks(5)

    setTimeout(() => {
      const graph = document.getElementById(storyId)
      if (
        graph &&
        'loadFromJson' in graph &&
        typeof graph.loadFromJson === 'function'
      ) {
        graph.loadFromJson(JSON.stringify(blocks), 'v0.1')
      }
    }, 100)

    return html`
      <div style="padding: 16px;">
        <div
          style="padding: 16px; background: #fce4ec; border-left: 4px solid #e91e63; border-radius: 4px; margin-bottom: 16px;"
        >
          <h3 style="margin: 0 0 8px 0; color: #880e4f;">
            Single Column (max 1 per row)
          </h3>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #333;">
            <code>max-nodes-per-level="1"</code> forces all nodes into a single
            vertical column.
          </p>
          <p style="margin: 0; font-size: 13px; color: #666;">
            Useful for very narrow containers or step-by-step displays.
          </p>
        </div>
        <div
          style="width: 100%; height: 500px; border: 1px solid #ddd; border-radius: 4px; overflow: auto;"
        >
          <blocks-graph
            id="${storyId}"
            language="en"
            show-prerequisites="true"
            orientation="ttb"
            node-width="200"
            node-height="60"
            horizontal-spacing="20"
            vertical-spacing="15"
            max-nodes-per-level="1"
          ></blocks-graph>
        </div>
      </div>
    `
  },
}

// ============================================================================
// ORIENTATION COMBINATIONS
// ============================================================================

/**
 * Grid wrapping in Left-to-Right orientation.
 * In horizontal layouts, maxNodesPerLevel controls column wrapping.
 */
export const HorizontalLTRGrid: Story = {
  render: () => {
    const storyId = createStoryId('ltr-grid')
    const blocks = createFlatBlocks(9)

    setTimeout(() => {
      const graph = document.getElementById(storyId)
      if (
        graph &&
        'loadFromJson' in graph &&
        typeof graph.loadFromJson === 'function'
      ) {
        graph.loadFromJson(JSON.stringify(blocks), 'v0.1')
      }
    }, 100)

    return html`
      <div style="padding: 16px;">
        <div
          style="padding: 16px; background: #e3f2fd; border-left: 4px solid #2196f3; border-radius: 4px; margin-bottom: 16px;"
        >
          <h3 style="margin: 0 0 8px 0; color: #1565c0;">
            LTR Orientation Grid (max 3 per column)
          </h3>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #333;">
            In horizontal orientations, maxNodesPerLevel limits
            <strong>rows per column</strong>.
          </p>
          <p style="margin: 0; font-size: 13px; color: #666;">
            9 blocks with max 3 = 3 columns of 3 blocks each.
          </p>
        </div>
        <div
          style="width: 100%; height: 400px; border: 1px solid #ddd; border-radius: 4px; overflow: auto;"
        >
          <blocks-graph
            id="${storyId}"
            language="en"
            show-prerequisites="true"
            orientation="ltr"
            node-width="140"
            node-height="55"
            horizontal-spacing="25"
            vertical-spacing="15"
            max-nodes-per-level="3"
          ></blocks-graph>
        </div>
      </div>
    `
  },
}

/**
 * Grid wrapping in Right-to-Left orientation.
 * Perfect for Hebrew/Arabic content with grid layout.
 */
export const HorizontalRTLGrid: Story = {
  render: () => {
    const storyId = createStoryId('rtl-grid')
    const blocks = Array.from({ length: 9 }, (_, i) => ({
      id: `550e8400-e29b-41d4-a716-446655aa${String(i).padStart(4, '0')}`,
      title: {
        he_text: `בלוק ${i + 1}`,
        en_text: `Block ${i + 1}`,
      },
      prerequisites: [],
      parents: [],
    }))

    setTimeout(() => {
      const graph = document.getElementById(storyId)
      if (
        graph &&
        'loadFromJson' in graph &&
        typeof graph.loadFromJson === 'function'
      ) {
        graph.loadFromJson(JSON.stringify(blocks), 'v0.1')
      }
    }, 100)

    return html`
      <div style="padding: 16px;">
        <div
          style="padding: 16px; background: #f3e5f5; border-left: 4px solid #9c27b0; border-radius: 4px; margin-bottom: 16px;"
        >
          <h3 style="margin: 0 0 8px 0; color: #6a1b9a;">
            RTL Orientation Grid (עברית)
          </h3>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #333;">
            Right-to-left with grid wrapping for Hebrew content.
          </p>
          <p style="margin: 0; font-size: 13px; color: #666;">
            Notice how the graph flows from right to left.
          </p>
        </div>
        <div
          style="width: 100%; height: 400px; border: 1px solid #ddd; border-radius: 4px; overflow: auto;"
        >
          <blocks-graph
            id="${storyId}"
            language="he"
            show-prerequisites="true"
            orientation="rtl"
            node-width="140"
            node-height="55"
            horizontal-spacing="25"
            vertical-spacing="15"
            max-nodes-per-level="3"
          ></blocks-graph>
        </div>
      </div>
    `
  },
}

/**
 * Bottom-to-Top orientation with grid wrapping.
 * Creates an upward-growing grid layout.
 */
export const BottomToTopGrid: Story = {
  render: () => {
    const storyId = createStoryId('btt-grid')
    const blocks = createFlatBlocks(12)

    setTimeout(() => {
      const graph = document.getElementById(storyId)
      if (
        graph &&
        'loadFromJson' in graph &&
        typeof graph.loadFromJson === 'function'
      ) {
        graph.loadFromJson(JSON.stringify(blocks), 'v0.1')
      }
    }, 100)

    return html`
      <div style="padding: 16px;">
        <div
          style="padding: 16px; background: #e0f2f1; border-left: 4px solid #009688; border-radius: 4px; margin-bottom: 16px;"
        >
          <h3 style="margin: 0 0 8px 0; color: #00695c;">
            Bottom-to-Top Grid (max 4 per row)
          </h3>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #333;">
            Grid wrapping with inverted vertical direction.
          </p>
          <p style="margin: 0; font-size: 13px; color: #666;">
            Useful for timelines or growth visualizations.
          </p>
        </div>
        <div
          style="width: 100%; height: 450px; border: 1px solid #ddd; border-radius: 4px; overflow: auto;"
        >
          <blocks-graph
            id="${storyId}"
            language="en"
            show-prerequisites="true"
            orientation="btt"
            node-width="130"
            node-height="55"
            horizontal-spacing="20"
            vertical-spacing="20"
            max-nodes-per-level="4"
          ></blocks-graph>
        </div>
      </div>
    `
  },
}

/**
 * Comparison of all orientations with the same grid settings.
 */
export const AllOrientationsGrid: Story = {
  render: () => {
    const blocks = createFlatBlocks(6)
    const orientations = [
      { value: 'ttb', label: 'Top-to-Bottom' },
      { value: 'ltr', label: 'Left-to-Right' },
      { value: 'rtl', label: 'Right-to-Left' },
      { value: 'btt', label: 'Bottom-to-Top' },
    ]

    return html`
      <div style="padding: 16px;">
        <h2 style="margin: 0 0 8px 0;">Grid Layout Across All Orientations</h2>
        <p style="margin: 0 0 24px 0; color: #666;">
          Same 6 blocks with <code>max-nodes-per-level="2"</code> in all four
          orientations.
        </p>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
          ${orientations.map((orientation, index) => {
            const storyId = `all-orient-${orientation.value}-${Date.now()}-${index}`

            setTimeout(() => {
              const graph = document.getElementById(storyId)
              if (
                graph &&
                'loadFromJson' in graph &&
                typeof graph.loadFromJson === 'function'
              ) {
                graph.loadFromJson(JSON.stringify(blocks), 'v0.1')
              }
            }, 100)

            return html`
              <div
                style="border: 1px solid #ddd; border-radius: 8px; padding: 16px; background: white;"
              >
                <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #333;">
                  ${orientation.label}
                </h3>
                <div
                  style="width: 100%; height: 300px; border: 1px solid #e0e0e0; border-radius: 4px; overflow: auto;"
                >
                  <blocks-graph
                    id="${storyId}"
                    language="en"
                    show-prerequisites="true"
                    orientation="${orientation.value}"
                    node-width="120"
                    node-height="50"
                    horizontal-spacing="20"
                    vertical-spacing="20"
                    max-nodes-per-level="2"
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

// ============================================================================
// MULTI-LEVEL SCENARIOS
// ============================================================================

/**
 * Multiple levels with different node counts, each wrapping independently.
 */
export const MultipleLevelsVaried: Story = {
  render: () => {
    const storyId = createStoryId('multi-varied')

    // Root level: 1 block
    const rootBlock = {
      id: '550e8400-e29b-41d4-a716-446655bb0000',
      title: { he_text: 'שורש', en_text: 'Root' },
      prerequisites: [],
      parents: [],
    }

    // Level 1: 6 blocks (prereq on root)
    const level1 = Array.from({ length: 6 }, (_, i) => ({
      id: `550e8400-e29b-41d4-a716-446655bb1${String(i).padStart(3, '0')}`,
      title: { he_text: `L1-${i + 1}`, en_text: `L1-${i + 1}` },
      prerequisites: [rootBlock.id],
      parents: [],
    }))

    // Level 2: 9 blocks (prereq on level 1)
    const level2 = Array.from({ length: 9 }, (_, i) => ({
      id: `550e8400-e29b-41d4-a716-446655bb2${String(i).padStart(3, '0')}`,
      title: { he_text: `L2-${i + 1}`, en_text: `L2-${i + 1}` },
      prerequisites: [level1[i % 6]?.id ?? ''],
      parents: [],
    }))

    // Level 3: 4 blocks (prereq on level 2)
    const level3 = Array.from({ length: 4 }, (_, i) => ({
      id: `550e8400-e29b-41d4-a716-446655bb3${String(i).padStart(3, '0')}`,
      title: { he_text: `L3-${i + 1}`, en_text: `L3-${i + 1}` },
      prerequisites: [level2[i * 2]?.id ?? ''],
      parents: [],
    }))

    const allBlocks = [rootBlock, ...level1, ...level2, ...level3]

    setTimeout(() => {
      const graph = document.getElementById(storyId)
      if (
        graph &&
        'loadFromJson' in graph &&
        typeof graph.loadFromJson === 'function'
      ) {
        graph.loadFromJson(JSON.stringify(allBlocks), 'v0.1')
      }
    }, 100)

    return html`
      <div style="padding: 16px;">
        <div
          style="padding: 16px; background: #e8f5e9; border-left: 4px solid #4caf50; border-radius: 4px; margin-bottom: 16px;"
        >
          <h3 style="margin: 0 0 8px 0; color: #2e7d32;">
            Multiple Levels with Varied Node Counts
          </h3>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #333;">
            <strong>Layout:</strong> Level 0: 1 | Level 1: 6 | Level 2: 9 |
            Level 3: 4
          </p>
          <ul
            style="margin: 0; padding-left: 20px; font-size: 13px; color: #666;"
          >
            <li>Each level wraps independently based on maxNodesPerLevel=3</li>
            <li>Level 1 → 2 rows (3 + 3)</li>
            <li>Level 2 → 3 rows (3 + 3 + 3)</li>
            <li>Level 3 → 2 rows (3 + 1)</li>
          </ul>
        </div>
        <div
          style="width: 100%; height: 600px; border: 1px solid #ddd; border-radius: 4px; overflow: auto;"
        >
          <blocks-graph
            id="${storyId}"
            language="en"
            show-prerequisites="true"
            orientation="ttb"
            node-width="100"
            node-height="45"
            horizontal-spacing="15"
            vertical-spacing="25"
            max-nodes-per-level="3"
          ></blocks-graph>
        </div>
      </div>
    `
  },
}

/**
 * Deep hierarchy with consistent wrapping at each level.
 */
export const DeepHierarchyGrid: Story = {
  render: () => {
    const storyId = createStoryId('deep-grid')

    const levels: Array<
      Array<{
        id: string
        title: { he_text: string; en_text: string }
        prerequisites: string[]
        parents: string[]
      }>
    > = []

    // Create 5 levels, each with 4 nodes
    for (let level = 0; level < 5; level++) {
      const levelBlocks = Array.from({ length: 4 }, (_, i) => ({
        id: `550e8400-e29b-41d4-a716-446655cc${level}${String(i).padStart(3, '0')}`,
        title: {
          he_text: `L${level}-${i + 1}`,
          en_text: `L${level}-${i + 1}`,
        },
        prerequisites:
          level === 0
            ? []
            : [
                (levels[level - 1] ?? [])[i % (levels[level - 1]?.length ?? 1)]
                  ?.id ?? '',
              ],
        parents: [],
      }))
      levels.push(levelBlocks)
    }

    const allBlocks = levels.flat()

    setTimeout(() => {
      const graph = document.getElementById(storyId)
      if (
        graph &&
        'loadFromJson' in graph &&
        typeof graph.loadFromJson === 'function'
      ) {
        graph.loadFromJson(JSON.stringify(allBlocks), 'v0.1')
      }
    }, 100)

    return html`
      <div style="padding: 16px;">
        <div
          style="padding: 16px; background: #e3f2fd; border-left: 4px solid #2196f3; border-radius: 4px; margin-bottom: 16px;"
        >
          <h3 style="margin: 0 0 8px 0; color: #1565c0;">
            Deep Hierarchy with Consistent Grid
          </h3>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #333;">
            5 levels, each with 4 nodes, wrapped at max 2 per row.
          </p>
          <p style="margin: 0; font-size: 13px; color: #666;">
            Creates a consistent, readable structure for deep graphs.
          </p>
        </div>
        <div
          style="width: 100%; height: 700px; border: 1px solid #ddd; border-radius: 4px; overflow: auto;"
        >
          <blocks-graph
            id="${storyId}"
            language="en"
            show-prerequisites="true"
            orientation="ttb"
            node-width="110"
            node-height="45"
            horizontal-spacing="20"
            vertical-spacing="30"
            max-nodes-per-level="2"
          ></blocks-graph>
        </div>
      </div>
    `
  },
}

// ============================================================================
// REAL-WORLD SCENARIOS
// ============================================================================

/**
 * University course catalog with many courses per semester.
 */
export const CourseCatalog: Story = {
  render: () => {
    const storyId = createStoryId('course-catalog')

    const year1Courses = [
      'Calculus I',
      'Linear Algebra',
      'Programming I',
      'Physics I',
      'Chemistry',
      'Academic Writing',
    ].map((name, i) => ({
      id: `550e8400-e29b-41d4-a716-446655dd1${String(i).padStart(3, '0')}`,
      title: { he_text: name, en_text: name },
      prerequisites: [],
      parents: [],
    }))

    const year2Courses = [
      'Calculus II',
      'Discrete Math',
      'Programming II',
      'Data Structures',
      'Physics II',
      'Statistics',
      'Algorithms',
      'Databases',
    ].map((name, i) => ({
      id: `550e8400-e29b-41d4-a716-446655dd2${String(i).padStart(3, '0')}`,
      title: { he_text: name, en_text: name },
      prerequisites: [
        year1Courses[Math.min(i, year1Courses.length - 1)]?.id ?? '',
      ],
      parents: [],
    }))

    const year3Courses = [
      'Machine Learning',
      'Computer Networks',
      'Operating Systems',
      'Software Engineering',
      'AI Fundamentals',
    ].map((name, i) => ({
      id: `550e8400-e29b-41d4-a716-446655dd3${String(i).padStart(3, '0')}`,
      title: { he_text: name, en_text: name },
      prerequisites: [
        year2Courses[Math.min(i * 2, year2Courses.length - 1)]?.id ?? '',
      ],
      parents: [],
    }))

    const allCourses = [...year1Courses, ...year2Courses, ...year3Courses]

    setTimeout(() => {
      const graph = document.getElementById(storyId)
      if (
        graph &&
        'loadFromJson' in graph &&
        typeof graph.loadFromJson === 'function'
      ) {
        graph.loadFromJson(JSON.stringify(allCourses), 'v0.1')
      }
    }, 100)

    return html`
      <div style="padding: 16px;">
        <div
          style="padding: 16px; background: #fff8e1; border-left: 4px solid #ffc107; border-radius: 4px; margin-bottom: 16px;"
        >
          <h3 style="margin: 0 0 8px 0; color: #f57f17;">
            University Course Catalog
          </h3>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #333;">
            <strong>Real-world example:</strong> CS degree prerequisites
          </p>
          <ul
            style="margin: 0; padding-left: 20px; font-size: 13px; color: #666;"
          >
            <li>Year 1: 6 courses (foundation)</li>
            <li>Year 2: 8 courses (core requirements)</li>
            <li>Year 3: 5 courses (specialization)</li>
          </ul>
        </div>
        <div
          style="width: 100%; height: 600px; border: 1px solid #ddd; border-radius: 4px; overflow: auto;"
        >
          <blocks-graph
            id="${storyId}"
            language="en"
            show-prerequisites="true"
            orientation="ttb"
            node-width="140"
            node-height="50"
            horizontal-spacing="15"
            vertical-spacing="40"
            max-nodes-per-level="4"
          ></blocks-graph>
        </div>
      </div>
    `
  },
}

/**
 * Project milestones organized in a grid timeline.
 */
export const ProjectMilestones: Story = {
  render: () => {
    const storyId = createStoryId('milestones')

    const phases = [
      ['Requirements', 'Research', 'Planning'],
      ['Design', 'Architecture', 'Prototyping', 'UX Review'],
      ['Backend', 'Frontend', 'API', 'Database', 'Testing'],
      ['Integration', 'QA', 'Performance'],
      ['Deployment', 'Documentation'],
    ]

    let prevPhaseIds: string[] = []
    const allMilestones = phases.flatMap((phase, phaseIndex) => {
      const phaseBlocks = phase.map((name, i) => ({
        id: `550e8400-e29b-41d4-a716-446655ee${phaseIndex}${String(i).padStart(3, '0')}`,
        title: { he_text: name, en_text: name },
        prerequisites:
          phaseIndex === 0
            ? []
            : [prevPhaseIds[Math.min(i, prevPhaseIds.length - 1)] ?? ''],
        parents: [],
      }))
      prevPhaseIds = phaseBlocks.map(b => b.id)
      return phaseBlocks
    })

    setTimeout(() => {
      const graph = document.getElementById(storyId)
      if (
        graph &&
        'loadFromJson' in graph &&
        typeof graph.loadFromJson === 'function'
      ) {
        graph.loadFromJson(JSON.stringify(allMilestones), 'v0.1')
      }
    }, 100)

    return html`
      <div style="padding: 16px;">
        <div
          style="padding: 16px; background: #e0f7fa; border-left: 4px solid #00bcd4; border-radius: 4px; margin-bottom: 16px;"
        >
          <h3 style="margin: 0 0 8px 0; color: #006064;">
            Project Milestones Timeline
          </h3>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #333;">
            Software project phases displayed in LTR timeline format.
          </p>
          <p style="margin: 0; font-size: 13px; color: #666;">
            Each phase has varying milestone counts, wrapped with max 3 per
            column.
          </p>
        </div>
        <div
          style="width: 100%; height: 500px; border: 1px solid #ddd; border-radius: 4px; overflow: auto;"
        >
          <blocks-graph
            id="${storyId}"
            language="en"
            show-prerequisites="true"
            orientation="ltr"
            node-width="130"
            node-height="45"
            horizontal-spacing="30"
            vertical-spacing="15"
            max-nodes-per-level="3"
          ></blocks-graph>
        </div>
      </div>
    `
  },
}

// ============================================================================
// EDGE CASES
// ============================================================================

/**
 * Large number of nodes with aggressive wrapping.
 */
export const LargeNodeCount: Story = {
  render: () => {
    const storyId = createStoryId('large-count')
    const blocks = createFlatBlocks(30, 'Node')

    setTimeout(() => {
      const graph = document.getElementById(storyId)
      if (
        graph &&
        'loadFromJson' in graph &&
        typeof graph.loadFromJson === 'function'
      ) {
        graph.loadFromJson(JSON.stringify(blocks), 'v0.1')
      }
    }, 100)

    return html`
      <div style="padding: 16px;">
        <div
          style="padding: 16px; background: #ffebee; border-left: 4px solid #f44336; border-radius: 4px; margin-bottom: 16px;"
        >
          <h3 style="margin: 0 0 8px 0; color: #b71c1c;">
            Large Node Count (30 nodes)
          </h3>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #333;">
            <strong>Stress test:</strong> 30 nodes with max 6 per row = 5 rows.
          </p>
          <p style="margin: 0; font-size: 13px; color: #666;">
            Grid layout keeps the visualization manageable even with many nodes.
          </p>
        </div>
        <div
          style="width: 100%; height: 600px; border: 1px solid #ddd; border-radius: 4px; overflow: auto;"
        >
          <blocks-graph
            id="${storyId}"
            language="en"
            show-prerequisites="true"
            orientation="ttb"
            node-width="100"
            node-height="40"
            horizontal-spacing="10"
            vertical-spacing="15"
            max-nodes-per-level="6"
          ></blocks-graph>
        </div>
      </div>
    `
  },
}

/**
 * Exact fit - node count equals maxNodesPerLevel (no wrapping needed).
 */
export const ExactFit: Story = {
  render: () => {
    const storyId = createStoryId('exact-fit')
    const blocks = createFlatBlocks(5)

    setTimeout(() => {
      const graph = document.getElementById(storyId)
      if (
        graph &&
        'loadFromJson' in graph &&
        typeof graph.loadFromJson === 'function'
      ) {
        graph.loadFromJson(JSON.stringify(blocks), 'v0.1')
      }
    }, 100)

    return html`
      <div style="padding: 16px;">
        <div
          style="padding: 16px; background: #e8eaf6; border-left: 4px solid #3f51b5; border-radius: 4px; margin-bottom: 16px;"
        >
          <h3 style="margin: 0 0 8px 0; color: #283593;">
            Exact Fit (5 nodes, max 5)
          </h3>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #333;">
            When node count equals maxNodesPerLevel, no wrapping occurs.
          </p>
          <p style="margin: 0; font-size: 13px; color: #666;">
            All 5 nodes fit in a single row.
          </p>
        </div>
        <div
          style="width: 100%; height: 300px; border: 1px solid #ddd; border-radius: 4px; overflow: auto;"
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
            max-nodes-per-level="5"
          ></blocks-graph>
        </div>
      </div>
    `
  },
}

/**
 * One extra node beyond limit triggers wrapping.
 */
export const OneExtraNode: Story = {
  render: () => {
    const storyId = createStoryId('one-extra')
    const blocks = createFlatBlocks(6)

    setTimeout(() => {
      const graph = document.getElementById(storyId)
      if (
        graph &&
        'loadFromJson' in graph &&
        typeof graph.loadFromJson === 'function'
      ) {
        graph.loadFromJson(JSON.stringify(blocks), 'v0.1')
      }
    }, 100)

    return html`
      <div style="padding: 16px;">
        <div
          style="padding: 16px; background: #fff3e0; border-left: 4px solid #ff9800; border-radius: 4px; margin-bottom: 16px;"
        >
          <h3 style="margin: 0 0 8px 0; color: #e65100;">
            One Extra Node (6 nodes, max 5)
          </h3>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #333;">
            Just one node beyond the limit triggers wrapping.
          </p>
          <p style="margin: 0; font-size: 13px; color: #666;">
            Result: 5 nodes in row 1, 1 node in row 2.
          </p>
        </div>
        <div
          style="width: 100%; height: 350px; border: 1px solid #ddd; border-radius: 4px; overflow: auto;"
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
            max-nodes-per-level="5"
          ></blocks-graph>
        </div>
      </div>
    `
  },
}

// ============================================================================
// COMPARISON AND INTERACTIVE
// ============================================================================

/**
 * Side-by-side comparison of different maxNodesPerLevel values.
 */
export const WrapLimitComparison: Story = {
  render: () => {
    const blocks = createFlatBlocks(12)
    const configs = [
      { max: undefined, label: 'Unlimited' },
      { max: 6, label: 'Max 6' },
      { max: 4, label: 'Max 4' },
      { max: 3, label: 'Max 3' },
    ]

    return html`
      <div style="padding: 16px;">
        <h2 style="margin: 0 0 8px 0;">maxNodesPerLevel Comparison</h2>
        <p style="margin: 0 0 24px 0; color: #666;">
          Same 12 blocks with different wrapping limits.
        </p>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
          ${configs.map((config, index) => {
            const storyId = `compare-${index}-${Date.now()}-${Math.random()
              .toString(36)
              .substring(2, 11)}`

            setTimeout(() => {
              const graph = document.getElementById(storyId)
              if (
                graph &&
                'loadFromJson' in graph &&
                typeof graph.loadFromJson === 'function'
              ) {
                graph.loadFromJson(JSON.stringify(blocks), 'v0.1')
              }
            }, 100)

            return html`
              <div
                style="border: 1px solid #ddd; border-radius: 8px; padding: 16px; background: white;"
              >
                <h3 style="margin: 0 0 4px 0; font-size: 16px; color: #333;">
                  ${config.label}
                </h3>
                <p style="margin: 0 0 12px 0; font-size: 13px; color: #666;">
                  ${config.max
                    ? `${Math.ceil(12 / config.max)} rows`
                    : 'Single row'}
                </p>
                <div
                  style="width: 100%; height: 350px; border: 1px solid #e0e0e0; border-radius: 4px; overflow: auto;"
                >
                  <blocks-graph
                    id="${storyId}"
                    language="en"
                    show-prerequisites="true"
                    orientation="ttb"
                    node-width="90"
                    node-height="40"
                    horizontal-spacing="10"
                    vertical-spacing="15"
                    max-nodes-per-level="${config.max || ''}"
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
 * Usage examples and code snippets for grid layout.
 */
export const UsageExamples: Story = {
  render: () => {
    const storyId = createStoryId('usage')
    const blocks = createFlatBlocks(8)

    setTimeout(() => {
      const graph = document.getElementById(storyId)
      if (
        graph &&
        'loadFromJson' in graph &&
        typeof graph.loadFromJson === 'function'
      ) {
        graph.loadFromJson(JSON.stringify(blocks), 'v0.1')
      }
    }, 100)

    return html`
      <div style="padding: 16px;">
        <h2 style="margin: 0 0 24px 0;">Grid Layout Usage Examples</h2>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
          <div>
            <div
              style="width: 100%; height: 350px; border: 1px solid #ddd; border-radius: 4px; overflow: auto;"
            >
              <blocks-graph
                id="${storyId}"
                language="en"
                show-prerequisites="true"
                orientation="ttb"
                node-width="130"
                node-height="55"
                horizontal-spacing="20"
                vertical-spacing="20"
                max-nodes-per-level="4"
              ></blocks-graph>
            </div>
          </div>

          <div>
            <div
              style="padding: 16px; background: #f5f5f5; border-radius: 4px; margin-bottom: 16px;"
            >
              <h4 style="margin: 0 0 12px 0;">HTML</h4>
              <pre
                style="margin: 0; padding: 12px; background: white; border-radius: 4px; overflow-x: auto; font-size: 12px;"
              ><code>&lt;blocks-graph
  max-nodes-per-level="4"
  orientation="ttb"
&gt;&lt;/blocks-graph&gt;</code></pre>
            </div>

            <div
              style="padding: 16px; background: #f5f5f5; border-radius: 4px; margin-bottom: 16px;"
            >
              <h4 style="margin: 0 0 12px 0;">JavaScript</h4>
              <pre
                style="margin: 0; padding: 12px; background: white; border-radius: 4px; overflow-x: auto; font-size: 12px;"
              ><code>const graph = document.querySelector('blocks-graph');
graph.maxNodesPerLevel = 4;</code></pre>
            </div>

            <div
              style="padding: 16px; background: #f5f5f5; border-radius: 4px;"
            >
              <h4 style="margin: 0 0 12px 0;">React</h4>
              <pre
                style="margin: 0; padding: 12px; background: white; border-radius: 4px; overflow-x: auto; font-size: 12px;"
              ><code>&lt;BlocksGraphReact
  maxNodesPerLevel={4}
  orientation="ttb"
/&gt;</code></pre>
            </div>
          </div>
        </div>

        <div
          style="margin-top: 24px; padding: 16px; background: #e3f2fd; border-left: 4px solid #2196f3; border-radius: 4px;"
        >
          <h4 style="margin: 0 0 8px 0; color: #1565c0;">
            Orientation Behavior Guide
          </h4>
          <table
            style="width: 100%; border-collapse: collapse; font-size: 14px;"
          >
            <thead>
              <tr style="background: white;">
                <th
                  style="padding: 8px; text-align: left; border-bottom: 2px solid #e0e0e0;"
                >
                  Orientation
                </th>
                <th
                  style="padding: 8px; text-align: left; border-bottom: 2px solid #e0e0e0;"
                >
                  maxNodesPerLevel Controls
                </th>
                <th
                  style="padding: 8px; text-align: left; border-bottom: 2px solid #e0e0e0;"
                >
                  Wraps Into
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">
                  TTB / BTT
                </td>
                <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">
                  Columns per row
                </td>
                <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">
                  Additional rows
                </td>
              </tr>
              <tr>
                <td style="padding: 8px;">LTR / RTL</td>
                <td style="padding: 8px;">Rows per column</td>
                <td style="padding: 8px;">Additional columns</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `
  },
  parameters: {
    layout: 'fullscreen',
  },
}
