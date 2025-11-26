import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import '../index.js'

/**
 * Stories demonstrating external block behavior.
 *
 * External blocks are blocks that act as external links or references.
 * When clicked, they only fire a callback event without any internal navigation.
 * This allows the consuming application to handle the click (e.g., open an external URL).
 *
 * In the current implementation, any leaf block (a block with no children)
 * behaves this way - clicking it only dispatches the `block-selected` event
 * without modifying the internal navigation stack.
 */

const meta: Meta = {
  title: 'Features/External Blocks',
  component: 'blocks-graph',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'External blocks are blocks that trigger callbacks when clicked without causing internal navigation. ' +
          'This pattern is useful for linking to external resources, opening modals, or integrating with external systems.',
      },
    },
  },
}

export default meta
type Story = StoryObj

/**
 * Demonstrates external block click behavior.
 *
 * In this example, we have a course with external resource links.
 * Clicking on the external blocks (Wikipedia, YouTube, etc.) only fires
 * the `block-selected` event - no navigation occurs.
 *
 * Open the browser console to see the callback being triggered.
 */
export const ExternalResourceLinks: Story = {
  render: () => {
    const storyId = `external-resources-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 11)}`

    // Root block with children (internal navigation possible)
    // Children are leaf blocks acting as external links
    const blocks = [
      {
        id: '550e8400-e29b-41d4-a716-446655ee0000',
        title: {
          he_text: 'מבוא לפיזיקה',
          en_text: 'Introduction to Physics',
        },
        prerequisites: [],
        parents: [],
      },
      // These leaf blocks act as external resources
      // Clicking them only triggers callback, no internal navigation
      {
        id: '550e8400-e29b-41d4-a716-446655ee0001',
        title: {
          he_text: 'ויקיפדיה: פיזיקה',
          en_text: 'Wikipedia: Physics',
        },
        prerequisites: ['550e8400-e29b-41d4-a716-446655ee0000'],
        parents: ['550e8400-e29b-41d4-a716-446655ee0000'],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655ee0002',
        title: {
          he_text: 'יוטיוב: סרטוני פיזיקה',
          en_text: 'YouTube: Physics Videos',
        },
        prerequisites: ['550e8400-e29b-41d4-a716-446655ee0000'],
        parents: ['550e8400-e29b-41d4-a716-446655ee0000'],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655ee0003',
        title: {
          he_text: 'קורסרה: קורס פיזיקה',
          en_text: 'Coursera: Physics Course',
        },
        prerequisites: ['550e8400-e29b-41d4-a716-446655ee0000'],
        parents: ['550e8400-e29b-41d4-a716-446655ee0000'],
      },
    ]

    return html`
      <div style="padding: 16px;">
        <div
          style="padding: 16px; background: #e3f2fd; border-left: 4px solid #2196f3; border-radius: 4px; margin-bottom: 16px;"
        >
          <h3 style="margin: 0 0 8px 0; color: #1565c0;">
            External Resource Links
          </h3>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #333;">
            <strong>Scenario:</strong> A course block with external resource
            links as children
          </p>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #333;">
            <strong>Expected behavior:</strong>
          </p>
          <ul
            style="margin: 0; padding-left: 20px; font-size: 14px; color: #333;"
          >
            <li>
              <strong>Click "Introduction to Physics":</strong> Navigates into
              the block, showing its children
            </li>
            <li>
              <strong>Click any external resource:</strong> Only fires callback
              (no navigation)
            </li>
            <li><strong>Open console</strong> to see the callback events</li>
          </ul>
        </div>

        <div
          id="${storyId}-log"
          style="padding: 12px; background: #f5f5f5; border-radius: 4px; margin-bottom: 16px; font-family: monospace; font-size: 13px; min-height: 60px; max-height: 150px; overflow-y: auto;"
        >
          <div style="color: #666;">Click events will appear here...</div>
        </div>

        <div
          style="width: 100%; height: 450px; border: 1px solid #ddd; border-radius: 4px;"
        >
          <blocks-graph
            id="${storyId}"
            language="en"
            show-prerequisites="true"
            orientation="ttb"
            node-width="200"
            node-height="70"
            @block-selected="${(e: CustomEvent) => {
              const logEl = document.getElementById(`${storyId}-log`)
              if (logEl) {
                const time = new Date().toLocaleTimeString()
                const blockId = e.detail.blockId
                const navStack = e.detail.navigationStack
                const clickedBlock = blocks.find(b => b.id === blockId)
                const title = clickedBlock?.title.en_text || blockId

                // Check if this is an external block (leaf - has no children)
                const hasChildren = blocks.some(b =>
                  b.parents.includes(blockId || '')
                )
                const isExternal = !hasChildren && blockId !== null

                const entry = document.createElement('div')
                entry.style.padding = '4px 0'
                entry.style.borderBottom = '1px solid #e0e0e0'

                if (isExternal) {
                  entry.innerHTML = `
                    <span style="color: #e65100;">[${time}]</span>
                    <strong style="color: #e65100;">EXTERNAL CLICK:</strong>
                    "${title}"
                    <br/>
                    <span style="color: #666; font-size: 12px;">
                      → No navigation occurred. Handle this callback to open external URL.
                    </span>
                  `
                } else {
                  entry.innerHTML = `
                    <span style="color: #1565c0;">[${time}]</span>
                    <strong style="color: #1565c0;">NAVIGATION:</strong>
                    ${navStack.length > 0 ? `Drilled into "${title}"` : 'Returned to root'}
                  `
                }

                // Remove placeholder text
                const placeholder = logEl.querySelector(
                  'div[style*="color: #666"]'
                )
                if (
                  placeholder &&
                  placeholder.textContent?.includes('Click events')
                ) {
                  placeholder.remove()
                }

                logEl.insertBefore(entry, logEl.firstChild)
              }

              console.log('block-selected event:', e.detail)
            }}"
          ></blocks-graph>
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
 * All blocks are external (no parent relationships).
 *
 * This demonstrates a flat list of external resources where
 * clicking any block only fires the callback - no internal
 * navigation is possible since none of the blocks have children.
 */
export const AllExternalBlocks: Story = {
  render: () => {
    const storyId = `all-external-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 11)}`

    // All blocks are roots with no children - all act as external links
    const blocks = [
      {
        id: '550e8400-e29b-41d4-a716-446655ff0001',
        title: {
          he_text: 'קורס מתמטיקה - MIT',
          en_text: 'MIT Math Course',
        },
        prerequisites: [],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655ff0002',
        title: {
          he_text: 'קורס פיזיקה - סטנפורד',
          en_text: 'Stanford Physics',
        },
        prerequisites: ['550e8400-e29b-41d4-a716-446655ff0001'],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655ff0003',
        title: {
          he_text: 'קורס כימיה - הרווארד',
          en_text: 'Harvard Chemistry',
        },
        prerequisites: ['550e8400-e29b-41d4-a716-446655ff0001'],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655ff0004',
        title: {
          he_text: 'קורס ביולוגיה - ייל',
          en_text: 'Yale Biology',
        },
        prerequisites: [
          '550e8400-e29b-41d4-a716-446655ff0002',
          '550e8400-e29b-41d4-a716-446655ff0003',
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
            All External Blocks (No Navigation)
          </h3>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #333;">
            <strong>Scenario:</strong> All blocks are external resources with no
            parent relationships
          </p>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #333;">
            <strong>Key behavior:</strong>
          </p>
          <ul
            style="margin: 0; padding-left: 20px; font-size: 14px; color: #333;"
          >
            <li>
              <strong>No internal navigation possible</strong> - all blocks are
              leaves
            </li>
            <li>Every click <strong>only fires the callback</strong></li>
            <li>
              Prerequisite edges (dashed blue) show learning order, but don't
              affect click behavior
            </li>
          </ul>
        </div>

        <div
          id="${storyId}-log"
          style="padding: 12px; background: #fff8e1; border: 1px solid #ffe082; border-radius: 4px; margin-bottom: 16px; font-family: monospace; font-size: 13px;"
        >
          <strong>Last click:</strong>
          <span id="${storyId}-last">None yet</span>
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
            @block-selected="${(e: CustomEvent) => {
              const lastEl = document.getElementById(`${storyId}-last`)
              if (lastEl) {
                const clickedBlock = blocks.find(b => b.id === e.detail.blockId)
                const title = clickedBlock?.title.en_text || e.detail.blockId
                lastEl.innerHTML = `
                  <span style="color: #e65100;">"${title}"</span>
                  <span style="color: #666;"> - External click (callback only)</span>
                `
              }
              console.log('External block clicked:', e.detail)
            }}"
          ></blocks-graph>
        </div>

        <div
          style="margin-top: 16px; padding: 16px; background: #f5f5f5; border-radius: 4px;"
        >
          <h4 style="margin: 0 0 8px 0;">Handling External Block Clicks</h4>
          <pre
            style="margin: 0; padding: 12px; background: white; border-radius: 4px; overflow-x: auto; font-size: 13px;"
          ><code>// Map block IDs to external URLs
const externalUrls = {
  'mit-math': 'https://ocw.mit.edu/mathematics/',
  'stanford-physics': 'https://online.stanford.edu/physics',
  // ...
};

// Handle the block-selected event
graph.addEventListener('block-selected', (e) => {
  const blockId = e.detail.blockId;
  const url = externalUrls[blockId];

  if (url) {
    // Open external URL in new tab
    window.open(url, '_blank');
  }
});</code></pre>
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
 * Mixed internal and external blocks with custom styling.
 *
 * Demonstrates a realistic scenario where some blocks navigate
 * to internal content while others link to external resources.
 * External blocks are visually distinguished by their titles.
 */
export const MixedInternalAndExternal: Story = {
  render: () => {
    const storyId = `mixed-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 11)}`

    const blocks = [
      // Root course block (has children - internal navigation)
      {
        id: '550e8400-e29b-41d4-a716-446655aa0000',
        title: {
          he_text: 'קורס פיתוח תוכנה',
          en_text: 'Software Development Course',
        },
        prerequisites: [],
        parents: [],
      },
      // Module 1 (has children - internal navigation)
      {
        id: '550e8400-e29b-41d4-a716-446655aa0001',
        title: {
          he_text: 'מודול 1: יסודות',
          en_text: 'Module 1: Fundamentals',
        },
        prerequisites: [],
        parents: ['550e8400-e29b-41d4-a716-446655aa0000'],
      },
      // Module 2 (has children - internal navigation)
      {
        id: '550e8400-e29b-41d4-a716-446655aa0002',
        title: {
          he_text: 'מודול 2: מתקדם',
          en_text: 'Module 2: Advanced',
        },
        prerequisites: ['550e8400-e29b-41d4-a716-446655aa0001'],
        parents: ['550e8400-e29b-41d4-a716-446655aa0000'],
      },
      // Lessons under Module 1 (leaf - internal content)
      {
        id: '550e8400-e29b-41d4-a716-446655aa0010',
        title: {
          he_text: 'שיעור: משתנים',
          en_text: 'Lesson: Variables',
        },
        prerequisites: [],
        parents: ['550e8400-e29b-41d4-a716-446655aa0001'],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655aa0011',
        title: {
          he_text: 'שיעור: פונקציות',
          en_text: 'Lesson: Functions',
        },
        prerequisites: ['550e8400-e29b-41d4-a716-446655aa0010'],
        parents: ['550e8400-e29b-41d4-a716-446655aa0001'],
      },
      // External resource under Module 1 (leaf - external link)
      {
        id: '550e8400-e29b-41d4-a716-446655aa0012',
        title: {
          he_text: '🔗 MDN Web Docs',
          en_text: '🔗 MDN Web Docs',
        },
        prerequisites: ['550e8400-e29b-41d4-a716-446655aa0010'],
        parents: ['550e8400-e29b-41d4-a716-446655aa0001'],
      },
      // Lessons under Module 2 (leaf - internal content)
      {
        id: '550e8400-e29b-41d4-a716-446655aa0020',
        title: {
          he_text: 'שיעור: מחלקות',
          en_text: 'Lesson: Classes',
        },
        prerequisites: ['550e8400-e29b-41d4-a716-446655aa0011'],
        parents: ['550e8400-e29b-41d4-a716-446655aa0002'],
      },
      // External resources under Module 2 (leaf - external links)
      {
        id: '550e8400-e29b-41d4-a716-446655aa0021',
        title: {
          he_text: '🔗 GitHub Repo',
          en_text: '🔗 GitHub Repo',
        },
        prerequisites: ['550e8400-e29b-41d4-a716-446655aa0020'],
        parents: ['550e8400-e29b-41d4-a716-446655aa0002'],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655aa0022',
        title: {
          he_text: '🔗 Stack Overflow',
          en_text: '🔗 Stack Overflow',
        },
        prerequisites: ['550e8400-e29b-41d4-a716-446655aa0020'],
        parents: ['550e8400-e29b-41d4-a716-446655aa0002'],
      },
    ]

    // External block IDs and their URLs
    const externalUrls: Record<string, string> = {
      '550e8400-e29b-41d4-a716-446655aa0012':
        'https://developer.mozilla.org/en-US/',
      '550e8400-e29b-41d4-a716-446655aa0021': 'https://github.com',
      '550e8400-e29b-41d4-a716-446655aa0022': 'https://stackoverflow.com',
    }

    return html`
      <div style="padding: 16px;">
        <div
          style="padding: 16px; background: #f3e5f5; border-left: 4px solid #9c27b0; border-radius: 4px; margin-bottom: 16px;"
        >
          <h3 style="margin: 0 0 8px 0; color: #6a1b9a;">
            Mixed Internal and External Blocks
          </h3>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #333;">
            <strong>Scenario:</strong> A course with both navigable modules and
            external resource links
          </p>
          <div
            style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 12px;"
          >
            <div
              style="padding: 12px; background: white; border-radius: 4px; border: 1px solid #ce93d8;"
            >
              <strong style="color: #6a1b9a;">Internal blocks</strong>
              <p style="margin: 4px 0 0 0; font-size: 13px; color: #333;">
                Course, Module 1, Module 2, Lessons
                <br />
                → Click to navigate
              </p>
            </div>
            <div
              style="padding: 12px; background: white; border-radius: 4px; border: 1px solid #ce93d8;"
            >
              <strong style="color: #6a1b9a;">External blocks (🔗)</strong>
              <p style="margin: 4px 0 0 0; font-size: 13px; color: #333;">
                MDN, GitHub, Stack Overflow
                <br />
                → Click fires callback only
              </p>
            </div>
          </div>
        </div>

        <div
          id="${storyId}-status"
          style="padding: 12px; background: #f5f5f5; border-radius: 4px; margin-bottom: 16px; font-family: monospace; font-size: 13px;"
        >
          <strong>Status:</strong>
          <span id="${storyId}-msg">Click a block to see behavior</span>
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
            node-height="65"
            @block-selected="${(e: CustomEvent) => {
              const msgEl = document.getElementById(`${storyId}-msg`)
              if (!msgEl) return

              const blockId = e.detail.blockId
              const navStack = e.detail.navigationStack
              const clickedBlock = blocks.find(b => b.id === blockId)
              const title = clickedBlock?.title.en_text || blockId

              // Check if external
              const isExternal = blockId && blockId in externalUrls

              if (isExternal) {
                const url = externalUrls[blockId]
                msgEl.innerHTML = `
                  <span style="color: #e65100;">
                    🔗 External: "${title}" → Would open: <a href="${url}" target="_blank" style="color: #1565c0;">${url}</a>
                  </span>
                `
                // In real app, you would: window.open(url, '_blank')
              } else if (navStack.length > 0) {
                msgEl.innerHTML = `
                  <span style="color: #1565c0;">
                    📁 Navigated into: "${title}" (stack depth: ${navStack.length})
                  </span>
                `
              } else {
                msgEl.innerHTML = `
                  <span style="color: #2e7d32;">
                    🏠 Returned to root view
                  </span>
                `
              }

              console.log('block-selected:', {
                ...e.detail,
                isExternal,
                externalUrl: isExternal ? externalUrls[blockId] : null,
              })
            }}"
          ></blocks-graph>
        </div>

        <div
          style="margin-top: 16px; padding: 16px; background: #e8f5e9; border-left: 4px solid #4caf50; border-radius: 4px;"
        >
          <h4 style="margin: 0 0 8px 0; color: #2e7d32;">Try It!</h4>
          <ol
            style="margin: 0; padding-left: 20px; font-size: 14px; color: #333;"
          >
            <li>
              Click <strong>"Software Development Course"</strong> to see
              modules
            </li>
            <li>
              Click <strong>"Module 1: Fundamentals"</strong> to see lessons
            </li>
            <li>
              Click <strong>"🔗 MDN Web Docs"</strong> - notice only callback
              fires
            </li>
            <li>
              Click <strong>"Module 1"</strong> again to return to course view
            </li>
          </ol>
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
 * Demonstrates how to differentiate external block clicks in code.
 *
 * Shows the event structure and how to determine if a clicked block
 * should trigger external navigation vs internal navigation.
 */
export const ExternalBlockEventHandling: Story = {
  render: () => {
    const storyId = `event-handling-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 11)}`

    const blocks = [
      {
        id: '550e8400-e29b-41d4-a716-446655bb0000',
        title: {
          he_text: 'קורס ראשי',
          en_text: 'Main Course',
        },
        prerequisites: [],
        parents: [],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655bb0001',
        title: {
          he_text: 'יחידה פנימית',
          en_text: 'Internal Unit',
        },
        prerequisites: [],
        parents: ['550e8400-e29b-41d4-a716-446655bb0000'],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655bb0002',
        title: {
          he_text: 'שיעור פנימי',
          en_text: 'Internal Lesson',
        },
        prerequisites: [],
        parents: ['550e8400-e29b-41d4-a716-446655bb0001'],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655bb0003',
        title: {
          he_text: 'קישור חיצוני',
          en_text: 'External Link',
        },
        prerequisites: ['550e8400-e29b-41d4-a716-446655bb0002'],
        parents: ['550e8400-e29b-41d4-a716-446655bb0001'],
      },
    ]

    return html`
      <div style="padding: 16px;">
        <div
          style="padding: 16px; background: #e8eaf6; border-left: 4px solid #3f51b5; border-radius: 4px; margin-bottom: 16px;"
        >
          <h3 style="margin: 0 0 8px 0; color: #283593;">
            Event Handling for External Blocks
          </h3>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #333;">
            The <code>block-selected</code> event provides all information
            needed to determine if the click should trigger external behavior.
          </p>
        </div>

        <div
          style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;"
        >
          <div
            style="padding: 12px; background: #f5f5f5; border-radius: 4px; font-family: monospace; font-size: 12px; max-height: 200px; overflow-y: auto;"
          >
            <strong style="font-family: sans-serif;">Event Detail:</strong>
            <pre
              id="${storyId}-event"
              style="margin: 8px 0 0 0; white-space: pre-wrap;"
            >
Click a block to see event data...</pre
            >
          </div>
          <div
            style="padding: 12px; background: #f5f5f5; border-radius: 4px; font-family: monospace; font-size: 12px; max-height: 200px; overflow-y: auto;"
          >
            <strong style="font-family: sans-serif;">Analysis:</strong>
            <div
              id="${storyId}-analysis"
              style="margin: 8px 0 0 0; font-family: sans-serif; font-size: 13px;"
            >
              Click a block to see analysis...
            </div>
          </div>
        </div>

        <div
          style="width: 100%; height: 350px; border: 1px solid #ddd; border-radius: 4px;"
        >
          <blocks-graph
            id="${storyId}"
            language="en"
            show-prerequisites="true"
            orientation="ttb"
            node-width="180"
            node-height="70"
            @block-selected="${(e: CustomEvent) => {
              const eventEl = document.getElementById(`${storyId}-event`)
              const analysisEl = document.getElementById(`${storyId}-analysis`)
              if (!eventEl || !analysisEl) return

              // Show raw event data
              eventEl.textContent = JSON.stringify(e.detail, null, 2)

              // Analyze the event
              const blockId = e.detail.blockId
              const navStack = e.detail.navigationStack
              const clickedBlock = blocks.find(b => b.id === blockId)

              // Determine if this is an external block (no children)
              const hasChildren =
                blockId && blocks.some(b => b.parents.includes(blockId))

              let analysis = ''
              if (blockId === null) {
                analysis = `
                  <p style="color: #2e7d32;"><strong>✓ Root view</strong></p>
                  <p>Navigation stack is empty - showing root blocks.</p>
                `
              } else if (hasChildren) {
                analysis = `
                  <p style="color: #1565c0;"><strong>→ Internal navigation</strong></p>
                  <p>Block "${clickedBlock?.title.en_text}" has children.</p>
                  <p>The library handled navigation automatically.</p>
                `
              } else {
                analysis = `
                  <p style="color: #e65100;"><strong>🔗 External block click</strong></p>
                  <p>Block "${clickedBlock?.title.en_text}" is a leaf (no children).</p>
                  <p><strong>The library did NOT navigate.</strong></p>
                  <p>Handle this in your callback to open external URL.</p>
                `
              }

              analysisEl.innerHTML = analysis
            }}"
          ></blocks-graph>
        </div>

        <div
          style="margin-top: 16px; padding: 16px; background: #f5f5f5; border-radius: 4px;"
        >
          <h4 style="margin: 0 0 8px 0;">Complete Event Handler Example</h4>
          <pre
            style="margin: 0; padding: 12px; background: white; border-radius: 4px; overflow-x: auto; font-size: 13px;"
          ><code>const graph = document.querySelector('blocks-graph');

// Track which blocks are "external" (customize based on your data)
const externalBlockUrls = new Map([
  ['block-id-1', 'https://example.com/resource1'],
  ['block-id-2', 'https://example.com/resource2'],
]);

graph.addEventListener('block-selected', (event) => {
  const { blockId, navigationStack, selectionLevel } = event.detail;

  // Check if this block is marked as external
  if (externalBlockUrls.has(blockId)) {
    // External block - open URL, don't navigate
    const url = externalBlockUrls.get(blockId);
    window.open(url, '_blank');
    return;
  }

  // Internal block - navigation was handled by the library
  // You can update your app's state here if needed
  console.log('Navigated to:', blockId);
  console.log('Navigation depth:', navigationStack.length);
});</code></pre>
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
