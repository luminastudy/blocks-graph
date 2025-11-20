# BlocksGraphReact

React wrapper component for `@lumina-study/blocks-graph` Web Component.

## Installation

```bash
pnpm add @lumina-study/blocks-graph
```

The React wrapper is included in the main package.

## Peer Dependencies

- **React**: >=16.8.0 (hooks required)

## Usage

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
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      title: {
        he: 'אלגברה ליניארית',
        en: 'Linear Algebra',
      },
      prerequisites: ['550e8400-e29b-41d4-a716-446655440000'],
      parents: [],
    },
  ]

  return (
    <BlocksGraphReact
      blocks={blocks}
      language="en"
      orientation="ttb"
      showPrerequisites={true}
      showParents={true}
      onBlockSelected={e => {
        console.log('Selected block:', e.detail.blockId)
      }}
      style={{ width: '100%', height: '600px' }}
    />
  )
}
```

## Props

### Data Props

| Prop        | Type               | Description                                            |
| ----------- | ------------------ | ------------------------------------------------------ |
| `blocks`    | `Block[]`          | Array of blocks in internal format                     |
| `blocksV01` | `BlockSchemaV01[]` | Array of blocks in v0.1 schema format (auto-converted) |
| `jsonUrl`   | `string`           | URL to load blocks from                                |

**Note**: Provide only ONE of these data props. `blocks` is recommended for best performance.

### Configuration Props

| Prop                | Type                               | Default | Description                         |
| ------------------- | ---------------------------------- | ------- | ----------------------------------- |
| `language`          | `'en' \| 'he'`                     | `'en'`  | Language to display block titles    |
| `orientation`       | `'ttb' \| 'ltr' \| 'rtl' \| 'btt'` | `'ttb'` | Graph orientation direction         |
| `showPrerequisites` | `boolean`                          | `true`  | Show prerequisite relationships     |
| `showParents`       | `boolean`                          | `true`  | Show parent relationships           |
| `nodeWidth`         | `number`                           | `200`   | Width of each block node in pixels  |
| `nodeHeight`        | `number`                           | `80`    | Height of each block node in pixels |
| `horizontalSpacing` | `number`                           | `80`    | Horizontal spacing between nodes    |
| `verticalSpacing`   | `number`                           | `100`   | Vertical spacing between levels     |

### Event Props

| Prop               | Type                                                                                | Description                     |
| ------------------ | ----------------------------------------------------------------------------------- | ------------------------------- |
| `onBlocksRendered` | `(event: CustomEvent<{ blockCount: number }>) => void`                              | Called when blocks are rendered |
| `onBlockSelected`  | `(event: CustomEvent<{ blockId: string \| null; selectionLevel: number }>) => void` | Called when a block is selected |

### Standard Props

| Prop        | Type            | Description    |
| ----------- | --------------- | -------------- |
| `className` | `string`        | CSS class name |
| `style`     | `CSSProperties` | Inline styles  |

## Examples

### With State Management

```tsx
import { useState } from 'react'
import { BlocksGraphReact } from '@lumina-study/blocks-graph/react'

function App() {
  const [blocks, setBlocks] = useState([])
  const [language, setLanguage] = useState<'en' | 'he'>('en')
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null)

  return (
    <div>
      <button
        onClick={() => setLanguage(lang => (lang === 'en' ? 'he' : 'en'))}
      >
        Toggle Language
      </button>

      <BlocksGraphReact
        blocks={blocks}
        language={language}
        onBlockSelected={e => setSelectedBlock(e.detail.blockId)}
      />

      {selectedBlock && <p>Selected: {selectedBlock}</p>}
    </div>
  )
}
```

### Loading from API

```tsx
import { useEffect, useState } from 'react'
import { BlocksGraphReact } from '@lumina-study/blocks-graph/react'
import type { Block } from '@lumina-study/blocks-graph'

function App() {
  const [blocks, setBlocks] = useState<Block[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/blocks')
      .then(res => res.json())
      .then(data => {
        setBlocks(data)
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Loading...</div>
  if (!blocks) return <div>No data</div>

  return <BlocksGraphReact blocks={blocks} />
}
```

### Different Orientations

```tsx
import { useState } from 'react'
import { BlocksGraphReact } from '@lumina-study/blocks-graph/react'

function App() {
  const [orientation, setOrientation] = useState<'ttb' | 'ltr' | 'rtl' | 'btt'>(
    'ttb'
  )

  return (
    <div>
      <select
        value={orientation}
        onChange={e => setOrientation(e.target.value as any)}
      >
        <option value="ttb">Top to Bottom</option>
        <option value="ltr">Left to Right</option>
        <option value="rtl">Right to Left</option>
        <option value="btt">Bottom to Top</option>
      </select>

      <BlocksGraphReact blocks={blocks} orientation={orientation} />
    </div>
  )
}
```

### With Custom Sizing

```tsx
<BlocksGraphReact
  blocks={blocks}
  nodeWidth={250}
  nodeHeight={100}
  horizontalSpacing={100}
  verticalSpacing={120}
/>
```

### External v0.1 Schema

```tsx
import { BlocksGraphReact } from '@lumina-study/blocks-graph/react'
import type { BlockSchemaV01 } from '@lumina-study/blocks-graph'

function App() {
  const blocksV01: BlockSchemaV01[] = [
    {
      id: 'uuid',
      title: {
        he_text: 'כותרת', // Note: he_text/en_text
        en_text: 'Title',
      },
      prerequisites: [],
      parents: [],
    },
  ]

  return <BlocksGraphReact blocksV01={blocksV01} />
}
```

## TypeScript

Full TypeScript support with exported types:

```tsx
import type {
  Block,
  BlockSchemaV01,
  BlockTitle,
  BlocksGraphProps,
} from '@lumina-study/blocks-graph/react'
```

## Benefits vs Direct Web Component

**With React Wrapper** ✅:

```tsx
<BlocksGraphReact
  blocks={blocks}
  language="en"
  onBlockSelected={e => console.log(e.detail)}
/>
```

**Direct Web Component** (requires refs):

```tsx
const graphRef = useRef(null)

useEffect(() => {
  if (graphRef.current) {
    graphRef.current.loadFromJson(JSON.stringify(blocks), 'v0.1')
  }
}, [blocks])

useEffect(() => {
  if (graphRef.current) {
    graphRef.current.language = language
  }
}, [language])

useEffect(() => {
  const handler = e => console.log(e.detail)
  graphRef.current?.addEventListener('block-selected', handler)
  return () => graphRef.current?.removeEventListener('block-selected', handler)
}, [])
;<blocks-graph ref={graphRef} />
```

## Performance

The wrapper is a **thin layer** that:

- ✅ Doesn't duplicate rendering logic
- ✅ Uses React's built-in optimization (memo, useEffect dependencies)
- ✅ Cleans up event listeners automatically
- ✅ Only updates Web Component when props change

## Browser Support

Same as React and Web Components:

- Chrome 61+
- Firefox 60+
- Safari 11+
- Edge 79+

## License

MIT
