# @lumina-study/blocks-graph

[![npm version](https://img.shields.io/npm/v/@lumina-study/blocks-graph.svg)](https://www.npmjs.com/package/@lumina-study/blocks-graph)
[![CI](https://github.com/luminastudy/blocks-graph/workflows/CI/badge.svg)](https://github.com/luminastudy/blocks-graph/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/luminastudy/blocks-graph/branch/main/graph/badge.svg)](https://codecov.io/gh/luminastudy/blocks-graph)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Framework-agnostic Web Component for visualizing Lumina Study block schemas.

## Features

- **Framework-agnostic**: Built as a native Web Component, works with any framework or vanilla JavaScript
- **Schema versioning**: Built-in adaptors for different schema versions (currently supports v0.1)
- **Bilingual support**: Displays content in Hebrew and English
- **Relationship visualization**: Shows both prerequisite and parent relationships between blocks
- **Customizable**: Configure layout, styling, and behavior through attributes and API
- **TypeScript**: Full TypeScript support with type definitions

## Live Examples

🚀 **[View Interactive Examples](https://luminastudy.github.io/blocks-graph/)**

Explore live demonstrations showcasing both HTML and React integration patterns:

- **[HTML Example](https://luminastudy.github.io/blocks-graph/html/)** - Pure Web Component with vanilla JavaScript
- **[React Example](https://luminastudy.github.io/blocks-graph/react/)** - React integration with hooks and TypeScript

See [`GITHUB-PAGES-SETUP.md`](./GITHUB-PAGES-SETUP.md) for deployment details.

## Installation

```bash
pnpm add @lumina-study/blocks-graph
```

## Usage

### HTML (Direct)

```html
<!DOCTYPE html>
<html>
  <head>
    <script type="module">
      import '@lumina-study/blocks-graph'
    </script>
  </head>
  <body>
    <blocks-graph id="graph" language="en" show-prerequisites="true">
    </blocks-graph>

    <script type="module">
      const graph = document.getElementById('graph')

      // Load from JSON
      const blocks = [
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
      ]

      graph.loadFromJson(JSON.stringify(blocks), 'v0.1')
    </script>
  </body>
</html>
```

### JavaScript/TypeScript

```typescript
import { BlocksGraph } from '@lumina-study/blocks-graph'

// The element is automatically registered
const graph = document.querySelector('blocks-graph')

// Load from URL
await graph.loadFromUrl('https://example.com/blocks.json', 'v0.1')

// Or load from JSON string
graph.loadFromJson(jsonString, 'v0.1')

// Or set blocks directly (using internal format)
import { schemaV01Adaptor } from '@lumina-study/blocks-graph'
const blocks = schemaV01Adaptor.adaptFromJson(jsonString)
graph.setBlocks(blocks)
```

### React (Recommended: Using Wrapper Component)

```tsx
import { BlocksGraphReact } from '@lumina-study/blocks-graph/react'
import type { Block } from '@lumina-study/blocks-graph'

function App() {
  const blocks: Block[] = [
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      title: {
        he: 'מבוא למתמטיקה',
        en: 'Introduction to Mathematics',
      },
      prerequisites: [],
      parents: [],
    },
  ]

  return (
    <BlocksGraphReact
      blocks={blocks}
      language="en"
      orientation="ttb"
      showPrerequisites={true}
      onBlockSelected={e => console.log('Selected:', e.detail)}
      style={{ width: '100%', height: '600px' }}
    />
  )
}
```

**Benefits of the React wrapper:**

- ✅ No refs needed - just pass props
- ✅ Full TypeScript support with autocomplete
- ✅ React-style event handlers
- ✅ Automatic prop synchronization

<details>
<summary>Alternative: Direct Web Component Usage</summary>

You can also use the Web Component directly with refs:

```tsx
import { useEffect, useRef } from 'react'
import '@lumina-study/blocks-graph'

function App() {
  const graphRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (graphRef.current) {
      const graph = graphRef.current as any
      graph.loadFromUrl('https://example.com/blocks.json', 'v0.1')
    }
  }, [])

  return (
    <blocks-graph
      ref={graphRef}
      language="en"
      show-prerequisites="true"
      style={{ width: '100%', height: '600px' }}
    />
  )
}
```

</details>

### Vue (Recommended: Using Wrapper Component)

```vue
<template>
  <BlocksGraphVue
    :blocks="blocks"
    language="en"
    orientation="ttb"
    :show-prerequisites="true"
    @block-selected="handleBlockSelected"
    style="width: 100%; height: 600px"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { BlocksGraphVue } from '@lumina-study/blocks-graph/vue'
import type { Block, BlockSelectedEvent } from '@lumina-study/blocks-graph/vue'

const blocks = ref<Block[]>([
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    title: {
      he: 'מבוא למתמטיקה',
      en: 'Introduction to Mathematics',
    },
    prerequisites: [],
    parents: [],
  },
])

function handleBlockSelected(event: BlockSelectedEvent) {
  console.log('Selected:', event.blockId)
}
</script>
```

**Benefits of the Vue wrapper:**

- ✅ No refs needed - just use props
- ✅ Full TypeScript support with autocomplete
- ✅ Vue-style events with typed payloads
- ✅ Automatic prop synchronization

<details>
<summary>Alternative: Direct Web Component Usage</summary>

You can also use the Web Component directly with refs:

```vue
<template>
  <blocks-graph ref="graph" language="en" show-prerequisites="true" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import '@lumina-study/blocks-graph'

const graph = ref(null)

onMounted(async () => {
  await graph.value.loadFromUrl('https://example.com/blocks.json', 'v0.1')
})
</script>
```

</details>

### Angular (Recommended: Using Wrapper Component)

```typescript
import { Component } from '@angular/core'
import { BlocksGraphComponent } from '@lumina-study/blocks-graph/angular'
import type {
  Block,
  BlockSelectedEvent,
} from '@lumina-study/blocks-graph/angular'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BlocksGraphComponent],
  template: `
    <blocks-graph-angular
      [blocks]="blocks"
      language="en"
      orientation="ttb"
      [showPrerequisites]="true"
      (blockSelected)="handleBlockSelected($event)"
      style="width: 100%; height: 600px"
    ></blocks-graph-angular>
  `,
})
export class AppComponent {
  blocks: Block[] = [
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      title: {
        he: 'מבוא למתמטיקה',
        en: 'Introduction to Mathematics',
      },
      prerequisites: [],
      parents: [],
    },
  ]

  handleBlockSelected(event: BlockSelectedEvent) {
    console.log('Selected:', event.blockId)
  }
}
```

**Benefits of the Angular wrapper:**

- ✅ No ViewChild needed - just use @Input/@Output
- ✅ Full TypeScript support with autocomplete
- ✅ Angular-style events with EventEmitter
- ✅ Automatic change detection

<details>
<summary>Alternative: Direct Web Component Usage</summary>

You can also use the Web Component directly with CUSTOM_ELEMENTS_SCHEMA:

```typescript
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ViewChild,
  ElementRef,
} from '@angular/core'
import '@lumina-study/blocks-graph'
import type { BlocksGraph } from '@lumina-study/blocks-graph'

@Component({
  selector: 'app-root',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <blocks-graph #graph language="en" show-prerequisites="true"></blocks-graph>
  `,
})
export class AppComponent {
  @ViewChild('graph') graph?: ElementRef<BlocksGraph>

  ngAfterViewInit() {
    this.graph?.nativeElement.loadFromUrl(
      'https://example.com/blocks.json',
      'v0.1'
    )
  }
}
```

</details>

## React Component Props

The `BlocksGraphReact` wrapper component accepts the following props:

### Data Props

| Prop            | Type                          | Description                                                                                    |
| --------------- | ----------------------------- | ---------------------------------------------------------------------------------------------- |
| `blocks`        | `Block[] \| BlockSchemaV01[]` | Array of blocks in internal format or v0.1 schema format (auto-detects and converts if needed) |
| `jsonUrl`       | `string`                      | URL to load blocks from                                                                        |
| `schemaVersion` | `'v0.1' \| 'internal'`        | Optional: Explicitly specify schema version (defaults to auto-detect)                          |

### Configuration Props

| Prop                    | Type                                 | Default    | Description                         |
| ----------------------- | ------------------------------------ | ---------- | ----------------------------------- |
| `language`              | `'en' \| 'he'`                       | `'en'`     | Language to display block titles    |
| `orientation`           | `'ttb' \| 'ltr' \| 'rtl' \| 'btt'`   | `'ttb'`    | Graph orientation direction         |
| `showPrerequisites`     | `boolean`                            | `true`     | Show prerequisite relationships     |
| `nodeWidth`             | `number`                             | `200`      | Width of each block node in pixels  |
| `nodeHeight`            | `number`                             | `80`       | Height of each block node in pixels |
| `horizontalSpacing`     | `number`                             | `80`       | Horizontal spacing between nodes    |
| `verticalSpacing`       | `number`                             | `100`      | Vertical spacing between levels     |
| `prerequisiteLineStyle` | `'straight' \| 'dashed' \| 'dotted'` | `'dashed'` | Line style for prerequisite edges   |

### Event Props

| Prop               | Type                                                                                                           | Description                     |
| ------------------ | -------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| `onBlocksRendered` | `(event: CustomEvent<{ blockCount: number }>) => void`                                                         | Called when blocks are rendered |
| `onBlockSelected`  | `(event: CustomEvent<{ blockId: string \| null; selectionLevel: number; navigationStack: string[] }>) => void` | Called when a block is selected |

### Standard Props

| Prop        | Type            | Description    |
| ----------- | --------------- | -------------- |
| `className` | `string`        | CSS class name |
| `style`     | `CSSProperties` | Inline styles  |

## Web Component Attributes

| Attribute                 | Type                                 | Default    | Description                                                                                                   |
| ------------------------- | ------------------------------------ | ---------- | ------------------------------------------------------------------------------------------------------------- |
| `language`                | `'en' \| 'he'`                       | `'en'`     | Language to display block titles                                                                              |
| `show-prerequisites`      | `boolean`                            | `true`     | Show prerequisite relationships                                                                               |
| `node-width`              | `number`                             | `200`      | Width of each block node in pixels                                                                            |
| `node-height`             | `number`                             | `80`       | Height of each block node in pixels                                                                           |
| `horizontal-spacing`      | `number`                             | `80`       | Horizontal spacing between nodes                                                                              |
| `vertical-spacing`        | `number`                             | `100`      | Vertical spacing between levels                                                                               |
| `orientation`             | `'ttb' \| 'ltr' \| 'rtl' \| 'btt'`   | `'ttb'`    | Graph orientation: `ttb` (top-to-bottom), `ltr` (left-to-right), `rtl` (right-to-left), `btt` (bottom-to-top) |
| `prerequisite-line-style` | `'straight' \| 'dashed' \| 'dotted'` | `'dashed'` | Line style for prerequisite edges                                                                             |

### Graph Orientation

The `orientation` attribute controls how the graph flows and how blocks are arranged:

- **`ttb` (top-to-bottom)**: Traditional hierarchical layout with root blocks at the top. Levels progress downward along the y-axis.
- **`ltr` (left-to-right)**: Horizontal flow with root blocks on the left. Levels progress rightward along the x-axis. Ideal for timelines or process flows.
- **`rtl` (right-to-left)**: Horizontal flow with root blocks on the right. Levels progress leftward along the x-axis. Useful for RTL language contexts.
- **`btt` (bottom-to-top)**: Inverted hierarchical layout with root blocks at the bottom. Levels progress upward along the y-axis.

**HTML Example:**

```html
<blocks-graph orientation="ltr" language="en"></blocks-graph>
```

**JavaScript Example:**

```javascript
const graph = document.querySelector('blocks-graph')
graph.orientation = 'rtl' // Dynamically change orientation
```

#### Spacing Behavior with Orientation

The `horizontal-spacing` and `vertical-spacing` attributes adapt based on orientation:

| Orientation | Level Spacing (between hierarchy levels) | Sibling Spacing (between blocks at same level) |
| ----------- | ---------------------------------------- | ---------------------------------------------- |
| `ttb`       | `vertical-spacing`                       | `horizontal-spacing`                           |
| `btt`       | `vertical-spacing`                       | `horizontal-spacing`                           |
| `ltr`       | `horizontal-spacing`                     | `vertical-spacing`                             |
| `rtl`       | `horizontal-spacing`                     | `vertical-spacing`                             |

**Example with custom spacing:**

```html
<!-- For TTB: 80px between siblings horizontally, 120px between levels vertically -->
<blocks-graph orientation="ttb" horizontal-spacing="80" vertical-spacing="120">
</blocks-graph>

<!-- For LTR: 80px between levels horizontally, 120px between siblings vertically -->
<blocks-graph orientation="ltr" horizontal-spacing="80" vertical-spacing="120">
</blocks-graph>
```

### Prerequisite Line Styles

The `prerequisite-line-style` attribute controls the visual appearance of prerequisite relationship edges. Three styles are available:

- **`straight`**: Solid line with no pattern
- **`dashed`**: Line with 8px dashes and 4px gaps
- **`dotted`**: Line with 2px dots and 3px gaps

**Default Value:** `dashed`

**HTML Example:**

```html
<blocks-graph prerequisite-line-style="dotted" language="en"> </blocks-graph>
```

**JavaScript Example:**

```javascript
const graph = document.querySelector('blocks-graph')
graph.prerequisiteLineStyle = 'straight'
```

**React Example:**

```tsx
<BlocksGraphReact blocks={blocks} prerequisiteLineStyle="straight" />
```

## API Methods

### `setBlocks(blocks: Block[]): void`

Set blocks data directly using the internal block format.

### `loadFromJson(json: string, schemaVersion?: 'v0.1'): void`

Load blocks from a JSON string with the specified schema version.

### `loadFromUrl(url: string, schemaVersion?: 'v0.1'): Promise<void>`

Load blocks from a URL with the specified schema version.

## Block Interaction

The graph implements a **hierarchical breadcrumb navigation model** for exploring deep block structures with unlimited drill-down depth:

### Navigation Behavior

**Root View** (Default):

- Displays only root blocks (blocks with no parents)
- If there's a single root with children, automatically drills down to show its children
- Provides a high-level overview of the top-level structure

**Drill-Down Navigation**:

- Maintains a navigation stack tracking your path through the hierarchy
- Each click on a block with children drills down one level deeper
- The selected block is highlighted with a blue border
- Other root blocks are dimmed for context

**Going Back Up**:

- Click the currently highlighted block to go up one level in the hierarchy
- Supports multi-level navigation (e.g., A → B → C → D → C → B → A)
- Never loses your place in the navigation stack

### Click Interaction

1. **Click a block with children** → Drill down (push to navigation stack)
2. **Click the highlighted block** → Go up one level (pop from navigation stack)
3. **Click a leaf block** (no children) → Fires event only, no navigation change

This hierarchical navigation model allows users to explore arbitrarily deep graph structures while maintaining clear context of their current position.

### Example

```javascript
const graph = document.querySelector('blocks-graph')

// Listen for block selection - now includes navigationStack
graph.addEventListener('block-selected', event => {
  const { blockId, selectionLevel, navigationStack } = event.detail

  if (navigationStack.length === 0) {
    console.log('Root view - showing all root blocks')
  } else {
    console.log(`Navigation path: ${navigationStack.join(' → ')}`)
    console.log(`Current block: ${blockId}`)
    console.log(`Depth: ${navigationStack.length} levels deep`)
  }
})

// Example navigation sequence:
// Initial: navigationStack = [] (shows root or auto-drilled children)
// Click B: navigationStack = ['B'] (shows B + B's children)
// Click C: navigationStack = ['B', 'C'] (shows C + C's children)
// Click D: navigationStack = ['B', 'C', 'D'] (shows D + D's children)
// Click D again: navigationStack = ['B', 'C'] (back to C + C's children)
// Click C again: navigationStack = ['B'] (back to B + B's children)
// Click B again: navigationStack = [] (back to root view)
```

## Events

### `blocks-rendered`

Fired when the graph has been successfully rendered.

```javascript
graph.addEventListener('blocks-rendered', event => {
  console.log(`Rendered ${event.detail.blockCount} blocks`)
})
```

## Schema Versions

This package uses [`@lumina-study/block-schema`](https://www.npmjs.com/package/@lumina-study/block-schema) for JSON Schema validation.

### v0.1

The v0.1 schema expects blocks in the following format (validated using JSON Schema draft-07):

```typescript
{
  "id": "uuid-string",              // Required: UUID format
  "title": {
    "he_text": "Hebrew title",      // Required
    "en_text": "English title"      // Required
  },
  "prerequisites": ["uuid-1"],      // Required: Array of prerequisite block IDs (can be empty)
  "parents": ["uuid-2"]             // Required: Array of parent block IDs (can be empty)
}
```

**Note**: IDs must be valid UUIDs. Additional properties are allowed and will be preserved.

## Advanced Usage

### Using the Core API

For more control, you can use the underlying engine and renderer directly:

```typescript
import {
  GraphEngine,
  GraphRenderer,
  schemaV01Adaptor,
} from '@lumina-study/blocks-graph'

// Adapt schema data
const blocks = schemaV01Adaptor.adaptFromJson(jsonString)

// Create engine with custom layout config
const engine = new GraphEngine({
  nodeWidth: 250,
  nodeHeight: 100,
  horizontalSpacing: 100,
  verticalSpacing: 120,
  orientation: 'ltr', // Optional: 'ttb' (default), 'ltr', 'rtl', or 'btt'
})

// Process blocks
const { graph, positioned } = engine.process(blocks)

// Create renderer with custom config
const renderer = new GraphRenderer({
  language: 'he',
  blockStyle: {
    fill: '#f0f0f0',
    stroke: '#333',
    strokeWidth: 2,
    cornerRadius: 10,
  },
})

// Render to SVG
const svg = renderer.render(graph, positioned)
document.body.appendChild(svg)
```

## Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Run tests with UI
pnpm test:ui

# Run visual regression tests
pnpm test:visual

# Build
pnpm build

# Lint
pnpm lint

# Type check
pnpm typecheck

# Serve example
pnpm serve
```

### Visual Regression Testing

This project uses [Loki](https://loki.js.org/) for visual regression testing. See [VISUAL-TESTING.md](./VISUAL-TESTING.md) for detailed documentation on:

- Running visual tests
- Updating reference images
- Approving visual changes
- CI/CD integration
- Troubleshooting

**Quick commands**:

```bash
pnpm test:visual              # Run visual tests
pnpm test:visual:update       # Update reference images
pnpm test:visual:approve      # Approve pending changes
```

## Dependencies

- **Runtime**:
  - `@lumina-study/block-schema` - JSON Schema definitions for block validation
  - `ajv` - JSON Schema validator
  - `ajv-formats` - Format validation for AJV (UUID support)

## License

MIT
