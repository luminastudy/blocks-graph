import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import '../../index.js'

/**
 * Sample data featuring Hebrew and English translations
 * Uses realistic educational content to demonstrate bilingual support
 */
const BILINGUAL_BLOCKS = [
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

/**
 * Sample data with longer Hebrew text to test RTL text wrapping
 */
const LONG_TEXT_BLOCKS = [
  {
    id: '550e8400-e29b-41d4-a716-446655440010',
    title: {
      he_text: 'מבוא לתכנות מונחה עצמים בשפת ג׳אווה',
      en_text: 'Introduction to Object-Oriented Programming in Java',
    },
    prerequisites: [],
    parents: [],
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440011',
    title: {
      he_text: 'מבני נתונים ואלגוריתמים מתקדמים',
      en_text: 'Advanced Data Structures and Algorithms',
    },
    prerequisites: ['550e8400-e29b-41d4-a716-446655440010'],
    parents: [],
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440012',
    title: {
      he_text: 'ארכיטקטורת תוכנה ועיצוב מערכות מורכבות',
      en_text: 'Software Architecture and Complex Systems Design',
    },
    prerequisites: ['550e8400-e29b-41d4-a716-446655440011'],
    parents: [],
  },
]

/**
 * Sample data with mixed script lengths (Hebrew tends to be more compact)
 */
const MIXED_LENGTH_BLOCKS = [
  {
    id: '550e8400-e29b-41d4-a716-446655440020',
    title: {
      he_text: 'פיזיקה',
      en_text: 'Physics',
    },
    prerequisites: [],
    parents: [],
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440021',
    title: {
      he_text: 'כימיה',
      en_text: 'Chemistry',
    },
    prerequisites: [],
    parents: [],
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440022',
    title: {
      he_text: 'ביולוגיה',
      en_text: 'Biology',
    },
    prerequisites: [],
    parents: [],
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440023',
    title: {
      he_text: 'ביוכימיה',
      en_text: 'Biochemistry',
    },
    prerequisites: [
      '550e8400-e29b-41d4-a716-446655440021',
      '550e8400-e29b-41d4-a716-446655440022',
    ],
    parents: [],
  },
]

const meta: Meta = {
  title: 'i18n/Language Support',
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
  },
  parameters: {
    docs: {
      description: {
        component:
          'The blocks-graph component provides built-in internationalization (i18n) support for Hebrew and English. ' +
          'Each block contains both Hebrew (he) and English (en) titles, and the displayed language can be switched dynamically. ' +
          'Hebrew text is displayed with proper right-to-left (RTL) text rendering within the graph nodes.',
      },
    },
  },
}

export default meta
type Story = StoryObj

/**
 * Displays the graph in English (default language).
 * All block titles are rendered using the `en_text` property from the block data.
 */
export const English: Story = {
  render: () => {
    const storyId = `i18n-en-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 11)}`

    setTimeout(() => {
      const graph = document.getElementById(storyId)
      if (
        graph &&
        'loadFromJson' in graph &&
        typeof graph.loadFromJson === 'function'
      ) {
        graph.loadFromJson(JSON.stringify(BILINGUAL_BLOCKS), 'v0.1')
      }
    }, 100)

    return html`
      <div style="padding: 16px;">
        <div
          style="padding: 12px 16px; background: #e3f2fd; border-left: 4px solid #2196f3; border-radius: 4px; margin-bottom: 16px;"
        >
          <h3 style="margin: 0 0 4px 0; font-size: 16px; color: #1565c0;">
            English Display
          </h3>
          <p style="margin: 0; font-size: 14px; color: #333;">
            Block titles are rendered using the
            <code
              style="background: #e0e0e0; padding: 2px 4px; border-radius: 2px;"
              >en_text</code
            >
            property.
          </p>
        </div>
        <div
          style="width: 100%; height: 500px; border: 1px solid #ddd; border-radius: 4px;"
        >
          <blocks-graph
            id="${storyId}"
            language="en"
            show-prerequisites="true"
            orientation="ttb"
          ></blocks-graph>
        </div>
      </div>
    `
  },
}

/**
 * Displays the graph in Hebrew (RTL language).
 * All block titles are rendered using the `he_text` property from the block data.
 * Note: The graph layout remains the same; only the text content changes.
 */
export const Hebrew: Story = {
  render: () => {
    const storyId = `i18n-he-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 11)}`

    setTimeout(() => {
      const graph = document.getElementById(storyId)
      if (
        graph &&
        'loadFromJson' in graph &&
        typeof graph.loadFromJson === 'function'
      ) {
        graph.loadFromJson(JSON.stringify(BILINGUAL_BLOCKS), 'v0.1')
      }
    }, 100)

    return html`
      <div style="padding: 16px;">
        <div
          style="padding: 12px 16px; background: #e8f5e9; border-left: 4px solid #4caf50; border-radius: 4px; margin-bottom: 16px;"
        >
          <h3 style="margin: 0 0 4px 0; font-size: 16px; color: #2e7d32;">
            Hebrew Display (עברית)
          </h3>
          <p style="margin: 0; font-size: 14px; color: #333;">
            Block titles are rendered using the
            <code
              style="background: #e0e0e0; padding: 2px 4px; border-radius: 2px;"
              >he_text</code
            >
            property. Hebrew text is rendered right-to-left within each node.
          </p>
        </div>
        <div
          style="width: 100%; height: 500px; border: 1px solid #ddd; border-radius: 4px;"
        >
          <blocks-graph
            id="${storyId}"
            language="he"
            show-prerequisites="true"
            orientation="ttb"
          ></blocks-graph>
        </div>
      </div>
    `
  },
}

/**
 * Side-by-side comparison of the same graph displayed in Hebrew and English.
 * This demonstrates how the component handles bilingual content with identical data.
 */
export const SideBySideComparison: Story = {
  render: () => {
    const hebrewId = `side-he-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 11)}`
    const englishId = `side-en-${Date.now()}-${Math.random()
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
        heGraph.loadFromJson(JSON.stringify(BILINGUAL_BLOCKS), 'v0.1')
      }

      if (
        enGraph &&
        'loadFromJson' in enGraph &&
        typeof enGraph.loadFromJson === 'function'
      ) {
        enGraph.loadFromJson(JSON.stringify(BILINGUAL_BLOCKS), 'v0.1')
      }
    }, 100)

    return html`
      <div style="padding: 16px;">
        <h2 style="margin: 0 0 8px 0;">Bilingual Side-by-Side Comparison</h2>
        <p style="margin: 0 0 24px 0; color: #666;">
          The same curriculum data displayed in both Hebrew and English. Notice
          how the graph structure remains identical while the text adapts to
          each language.
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
          ><code>&lt;!-- English --&gt;
&lt;blocks-graph language="en"&gt;&lt;/blocks-graph&gt;

&lt;!-- Hebrew --&gt;
&lt;blocks-graph language="he"&gt;&lt;/blocks-graph&gt;</code></pre>
        </div>
      </div>
    `
  },
  parameters: {
    layout: 'fullscreen',
  },
}

/**
 * Tests text wrapping behavior with longer Hebrew and English titles.
 * Hebrew text tends to be more compact, which may result in different line breaks.
 */
export const LongTextWrapping: Story = {
  render: () => {
    const hebrewId = `wrap-he-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 11)}`
    const englishId = `wrap-en-${Date.now()}-${Math.random()
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
        heGraph.loadFromJson(JSON.stringify(LONG_TEXT_BLOCKS), 'v0.1')
      }

      if (
        enGraph &&
        'loadFromJson' in enGraph &&
        typeof enGraph.loadFromJson === 'function'
      ) {
        enGraph.loadFromJson(JSON.stringify(LONG_TEXT_BLOCKS), 'v0.1')
      }
    }, 100)

    return html`
      <div style="padding: 16px;">
        <h2 style="margin: 0 0 8px 0;">Long Text Wrapping Behavior</h2>
        <p style="margin: 0 0 24px 0; color: #666;">
          Demonstrates how the component handles longer titles in both
          languages. Hebrew text is often more compact than English, resulting
          in different wrapping patterns.
        </p>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
          <div
            style="border: 1px solid #ddd; border-radius: 8px; padding: 16px; background: white;"
          >
            <h3 style="margin: 0 0 8px 0; color: #333;">Hebrew (עברית)</h3>
            <p style="margin: 0 0 12px 0; font-size: 13px; color: #666;">
              Hebrew text is typically more compact. Hover over nodes to see the
              full title.
            </p>
            <div
              style="width: 100%; height: 450px; border: 1px solid #e0e0e0; border-radius: 4px;"
            >
              <blocks-graph
                id="${hebrewId}"
                language="he"
                show-prerequisites="true"
                orientation="ttb"
                node-width="220"
                node-height="80"
              ></blocks-graph>
            </div>
          </div>

          <div
            style="border: 1px solid #ddd; border-radius: 8px; padding: 16px; background: white;"
          >
            <h3 style="margin: 0 0 8px 0; color: #333;">English</h3>
            <p style="margin: 0 0 12px 0; font-size: 13px; color: #666;">
              English text tends to be longer. Truncation with ellipsis may
              occur.
            </p>
            <div
              style="width: 100%; height: 450px; border: 1px solid #e0e0e0; border-radius: 4px;"
            >
              <blocks-graph
                id="${englishId}"
                language="en"
                show-prerequisites="true"
                orientation="ttb"
                node-width="220"
                node-height="80"
              ></blocks-graph>
            </div>
          </div>
        </div>

        <div
          style="margin-top: 24px; padding: 16px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;"
        >
          <h4 style="margin: 0 0 8px 0; color: #856404;">
            Text Wrapping Notes
          </h4>
          <ul style="margin: 0; padding-left: 20px; font-size: 14px;">
            <li>
              Text automatically wraps to multiple lines within node boundaries
            </li>
            <li>Maximum 3 lines of text are displayed by default</li>
            <li>Truncated titles show full text on hover (tooltip)</li>
            <li>
              Node dimensions can be adjusted with
              <code>node-width</code> and <code>node-height</code> attributes
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
 * Demonstrates Hebrew with RTL graph orientation.
 * Combines Hebrew language with RTL (right-to-left) graph flow for a fully localized experience.
 */
export const HebrewWithRTLOrientation: Story = {
  render: () => {
    const storyId = `he-rtl-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 11)}`

    setTimeout(() => {
      const graph = document.getElementById(storyId)
      if (
        graph &&
        'loadFromJson' in graph &&
        typeof graph.loadFromJson === 'function'
      ) {
        graph.loadFromJson(JSON.stringify(BILINGUAL_BLOCKS), 'v0.1')
      }
    }, 100)

    return html`
      <div style="padding: 16px;">
        <div
          style="padding: 16px; background: #f3e5f5; border-left: 4px solid #9c27b0; border-radius: 4px; margin-bottom: 16px;"
        >
          <h3 style="margin: 0 0 8px 0; color: #6a1b9a;">
            Hebrew with RTL Graph Orientation
          </h3>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #333;">
            For Hebrew content, combining <code>language="he"</code> with
            <code>orientation="rtl"</code> creates a fully localized experience
            where both text and graph flow right-to-left.
          </p>
          <p style="margin: 0; font-size: 14px; color: #333;">
            <strong>Configuration:</strong>
            <code
              style="background: #e0e0e0; padding: 2px 4px; border-radius: 2px; margin-left: 8px;"
              >language="he" orientation="rtl"</code
            >
          </p>
        </div>
        <div
          style="width: 100%; height: 500px; border: 1px solid #ddd; border-radius: 4px;"
        >
          <blocks-graph
            id="${storyId}"
            language="he"
            show-prerequisites="true"
            orientation="rtl"
            node-width="200"
            node-height="80"
          ></blocks-graph>
        </div>

        <div
          style="margin-top: 16px; padding: 16px; background: #f5f5f5; border-radius: 4px;"
        >
          <h4 style="margin: 0 0 8px 0;">Usage Example</h4>
          <pre
            style="margin: 0; padding: 12px; background: white; border-radius: 4px; overflow-x: auto; font-size: 13px;"
          ><code>&lt;!-- Fully localized Hebrew graph --&gt;
&lt;blocks-graph
  language="he"
  orientation="rtl"
&gt;&lt;/blocks-graph&gt;</code></pre>
        </div>
      </div>
    `
  },
}

/**
 * Demonstrates short, single-word titles in both languages.
 * Shows how the component handles minimal text content.
 */
export const ShortTitles: Story = {
  render: () => {
    const hebrewId = `short-he-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 11)}`
    const englishId = `short-en-${Date.now()}-${Math.random()
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
        heGraph.loadFromJson(JSON.stringify(MIXED_LENGTH_BLOCKS), 'v0.1')
      }

      if (
        enGraph &&
        'loadFromJson' in enGraph &&
        typeof enGraph.loadFromJson === 'function'
      ) {
        enGraph.loadFromJson(JSON.stringify(MIXED_LENGTH_BLOCKS), 'v0.1')
      }
    }, 100)

    return html`
      <div style="padding: 16px;">
        <h2 style="margin: 0 0 8px 0;">Short Single-Word Titles</h2>
        <p style="margin: 0 0 24px 0; color: #666;">
          Demonstrates centering behavior for short, single-word titles in both
          languages.
        </p>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
          <div
            style="border: 1px solid #ddd; border-radius: 8px; padding: 16px; background: white;"
          >
            <h3 style="margin: 0 0 12px 0; color: #333;">Hebrew (עברית)</h3>
            <div
              style="width: 100%; height: 400px; border: 1px solid #e0e0e0; border-radius: 4px;"
            >
              <blocks-graph
                id="${hebrewId}"
                language="he"
                show-prerequisites="true"
                orientation="ttb"
                node-width="150"
                node-height="60"
              ></blocks-graph>
            </div>
          </div>

          <div
            style="border: 1px solid #ddd; border-radius: 8px; padding: 16px; background: white;"
          >
            <h3 style="margin: 0 0 12px 0; color: #333;">English</h3>
            <div
              style="width: 100%; height: 400px; border: 1px solid #e0e0e0; border-radius: 4px;"
            >
              <blocks-graph
                id="${englishId}"
                language="en"
                show-prerequisites="true"
                orientation="ttb"
                node-width="150"
                node-height="60"
              ></blocks-graph>
            </div>
          </div>
        </div>
      </div>
    `
  },
  parameters: {
    layout: 'fullscreen',
  },
}

/**
 * Interactive language switcher demonstration.
 * Shows how to dynamically change the language at runtime.
 */
export const DynamicLanguageSwitching: Story = {
  render: () => {
    const storyId = `dynamic-lang-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 11)}`

    setTimeout(() => {
      const graph = document.getElementById(storyId)
      if (
        graph &&
        'loadFromJson' in graph &&
        typeof graph.loadFromJson === 'function'
      ) {
        graph.loadFromJson(JSON.stringify(BILINGUAL_BLOCKS), 'v0.1')
      }
    }, 100)

    return html`
      <div style="padding: 16px;">
        <h2 style="margin: 0 0 8px 0;">Dynamic Language Switching</h2>
        <p style="margin: 0 0 16px 0; color: #666;">
          Click the buttons below to switch the display language at runtime. The
          graph re-renders with the new language without reloading data.
        </p>

        <div style="margin-bottom: 16px; display: flex; gap: 8px;">
          <button
            onclick="document.getElementById('${storyId}').setAttribute('language', 'en')"
            style="padding: 8px 16px; font-size: 14px; cursor: pointer; background: #2196f3; color: white; border: none; border-radius: 4px;"
          >
            English
          </button>
          <button
            onclick="document.getElementById('${storyId}').setAttribute('language', 'he')"
            style="padding: 8px 16px; font-size: 14px; cursor: pointer; background: #4caf50; color: white; border: none; border-radius: 4px;"
          >
            Hebrew (עברית)
          </button>
        </div>

        <div
          style="width: 100%; height: 500px; border: 1px solid #ddd; border-radius: 4px;"
        >
          <blocks-graph
            id="${storyId}"
            language="en"
            show-prerequisites="true"
            orientation="ttb"
          ></blocks-graph>
        </div>

        <div
          style="margin-top: 16px; padding: 16px; background: #f5f5f5; border-radius: 4px;"
        >
          <h4 style="margin: 0 0 8px 0;">Implementation</h4>
          <pre
            style="margin: 0; padding: 12px; background: white; border-radius: 4px; overflow-x: auto; font-size: 13px;"
          ><code>// JavaScript - Set language attribute
const graph = document.querySelector('blocks-graph');
graph.setAttribute('language', 'he');

// Or use the property directly
graph.language = 'en';

// React
&lt;BlocksGraphReact language={currentLang} /&gt;

// Vue
&lt;BlocksGraphVue :language="currentLang" /&gt;</code></pre>
        </div>
      </div>
    `
  },
}

/**
 * Compares all four orientations with Hebrew language.
 * Demonstrates how Hebrew content renders across different graph layouts.
 */
export const HebrewAllOrientations: Story = {
  render: () => {
    const orientations = [
      { value: 'ttb', label: 'מלמעלה למטה (TTB)', direction: 'Top to Bottom' },
      { value: 'btt', label: 'מלמטה למעלה (BTT)', direction: 'Bottom to Top' },
      { value: 'ltr', label: 'משמאל לימין (LTR)', direction: 'Left to Right' },
      { value: 'rtl', label: 'מימין לשמאל (RTL)', direction: 'Right to Left' },
    ]

    return html`
      <div style="padding: 16px;">
        <h2 style="margin: 0 0 8px 0;">Hebrew with All Orientations</h2>
        <p style="margin: 0 0 24px 0; color: #666;">
          Hebrew text displayed across all four graph orientation options. The
          RTL orientation (bottom-right) is the most natural for Hebrew content.
        </p>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
          ${orientations.map((orientation, index) => {
            const storyId = `he-orient-${
              orientation.value
            }-${Date.now()}-${index}`

            setTimeout(() => {
              const graph = document.getElementById(storyId)
              if (
                graph &&
                'loadFromJson' in graph &&
                typeof graph.loadFromJson === 'function'
              ) {
                graph.loadFromJson(JSON.stringify(MIXED_LENGTH_BLOCKS), 'v0.1')
              }
            }, 100)

            return html`
              <div
                style="border: 1px solid #ddd; border-radius: 8px; padding: 16px; background: white;"
              >
                <div style="margin-bottom: 12px;">
                  <h3
                    style="margin: 0 0 4px 0; color: #333; font-size: 16px; direction: rtl;"
                  >
                    ${orientation.label}
                  </h3>
                  <p style="margin: 0; font-size: 13px; color: #666;">
                    ${orientation.direction}
                  </p>
                </div>
                <div
                  style="width: 100%; height: 350px; border: 1px solid #e0e0e0; border-radius: 4px;"
                >
                  <blocks-graph
                    id="${storyId}"
                    language="he"
                    show-prerequisites="true"
                    orientation="${orientation.value}"
                    node-width="130"
                    node-height="55"
                    horizontal-spacing="40"
                    vertical-spacing="50"
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
