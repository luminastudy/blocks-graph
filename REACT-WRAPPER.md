# React Wrapper Implementation Summary

## Overview

This document summarizes the React wrapper implementation for `@luminastudy/blocks-graph`. The wrapper provides a clean, props-based API for React developers, eliminating the need for refs and manual event listener management.

## What Was Implemented

### 1. Core Wrapper Component

**File**: `src/wrappers/react/BlocksGraphReact.tsx`

A functional React component using hooks that wraps the `<blocks-graph>` Web Component.

**Key Features**:
- ✅ No refs needed - just pass props
- ✅ Full TypeScript support
- ✅ React-style event handlers
- ✅ Automatic prop synchronization
- ✅ Proper cleanup on unmount

**Props Supported**:
- **Data**: `blocks`, `blocksV01`, `jsonUrl`
- **Configuration**: `language`, `orientation`, `showPrerequisites`, `showParents`, node sizing, spacing
- **Events**: `onBlocksRendered`, `onBlockSelected`
- **Standard**: `className`, `style`

### 2. TypeScript Support

**Files**:
- `src/wrappers/react/index.ts` - Public exports
- `src/wrappers/react/jsx.d.ts` - JSX type declarations

**Types Exported**:
- `BlocksGraphReact` - Main component
- `BlocksGraphProps` - Component props interface
- `Block` - Internal block format
- `BlockSchemaV01` - External v0.1 schema format
- `BlockTitle` - Title interface

### 3. Unit Tests

**File**: `src/wrappers/react/BlocksGraphReact.test.tsx`

Comprehensive test suite covering:
- Component rendering
- Props application
- Event handling
- State updates
- Cleanup on unmount

**Test Coverage**:
- 15 test cases
- Props synchronization
- Event listeners
- Lifecycle management

### 4. Documentation

**Files Created**:
- `src/wrappers/README.md` - Wrappers directory overview
- `src/wrappers/react/README.md` - React wrapper detailed guide
- Updated `README.md` - Main README with React wrapper section
- Updated `examples/react/README.md` - Example documentation

**Documentation Includes**:
- Installation instructions
- Usage examples
- Full props API reference
- TypeScript usage
- Common patterns
- Benefits comparison

### 5. Example Integration

**Files Updated**:
- `examples/react/src/AppWithWrapper.tsx` - New example using wrapper
- `examples/react/src/main.tsx` - Switched to wrapper by default
- `examples/react/README.md` - Documentation for both approaches

**Example Features**:
- Data loading from API
- State management
- Interactive controls
- Event handling
- Multiple orientations

### 6. Build Configuration

**Files Updated**:
- `package.json` - Added `/react` export path, peer dependencies
- `tsconfig.json` - Added `jsx: "react-jsx"`
- `build.mjs` - Added React wrapper bundle
- Added `@types/react` and testing libraries as dev dependencies

**Build Output**:
```
dist/index.js                      305.4kb (main library)
dist/wrappers/react/index.js       308.0kb (React wrapper)
```

## Usage

### Installation

```bash
pnpm add @luminastudy/blocks-graph
```

### Basic Usage

```tsx
import { BlocksGraphReact } from '@luminastudy/blocks-graph/react';
import type { Block } from '@luminastudy/blocks-graph';

function App() {
  const blocks: Block[] = [...];

  return (
    <BlocksGraphReact
      blocks={blocks}
      language="en"
      orientation="ttb"
      onBlockSelected={(e) => console.log(e.detail)}
      style={{ width: '100%', height: '600px' }}
    />
  );
}
```

## Architecture

```
React Component (BlocksGraphReact)
         ↓
    useEffect hooks manage:
    - Block data loading
    - Prop synchronization
    - Event listeners
         ↓
Web Component (<blocks-graph>)
         ↓
Core Library (GraphEngine + GraphRenderer)
```

## Technical Details

### Prop Synchronization

The wrapper uses separate `useEffect` hooks for each prop category:

- **Data props** → Call `setBlocks()` or `loadFromJson()`
- **Config props** → Set properties on Web Component instance
- **Layout props** → Set HTML attributes
- **Event props** → Add/remove event listeners with cleanup

### Type Safety

- JSX type declarations allow `<blocks-graph>` in TSX
- Full TypeScript support with proper generics
- React.CSSProperties for style prop
- Custom event types for handlers

### Performance

- **Thin wrapper**: No rendering logic duplication
- **Efficient updates**: Only update when props change
- **Automatic cleanup**: Event listeners removed on unmount
- **External React**: Not bundled, peer dependency only

## Comparison: Wrapper vs Direct Web Component

### With React Wrapper ✅

```tsx
<BlocksGraphReact
  blocks={blocks}
  language="en"
  onBlockSelected={(e) => console.log(e.detail)}
/>
```

### Direct Web Component (requires refs)

```tsx
const graphRef = useRef(null);

useEffect(() => {
  if (graphRef.current) {
    graphRef.current.loadFromJson(JSON.stringify(blocks), 'v0.1');
  }
}, [blocks]);

useEffect(() => {
  if (graphRef.current) {
    graphRef.current.language = language;
  }
}, [language]);

useEffect(() => {
  const handler = (e) => console.log(e.detail);
  graphRef.current?.addEventListener('block-selected', handler);
  return () => graphRef.current?.removeEventListener('block-selected', handler);
}, []);

<blocks-graph ref={graphRef} />
```

## Files Added/Modified

### New Files (10)
1. `src/wrappers/react/BlocksGraphReact.tsx`
2. `src/wrappers/react/BlocksGraphReact.test.tsx`
3. `src/wrappers/react/index.ts`
4. `src/wrappers/react/jsx.d.ts`
5. `src/wrappers/react/README.md`
6. `src/wrappers/README.md`
7. `examples/react/src/AppWithWrapper.tsx`
8. `REACT-WRAPPER.md` (this file)

### Modified Files (7)
1. `package.json` - Exports, peer dependencies
2. `tsconfig.json` - JSX mode
3. `build.mjs` - React wrapper build
4. `README.md` - React wrapper section
5. `examples/react/src/main.tsx` - Use wrapper by default
6. `examples/react/README.md` - Document both approaches
7. `src/components/blocks-graph.ts` - Remove unused import

## Package Exports

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./react": {
      "types": "./dist/wrappers/react/index.d.ts",
      "import": "./dist/wrappers/react/index.js"
    }
  }
}
```

## Browser Support

Same as React and Web Components:
- Chrome 61+
- Firefox 60+
- Safari 11+
- Edge 79+

## Future Enhancements

### Planned Wrappers
- Vue 3 wrapper (`@luminastudy/blocks-graph/vue`)
- Angular wrapper (`@luminastudy/blocks-graph/angular`)
- Svelte wrapper (`@luminastudy/blocks-graph/svelte`)

### Potential Improvements
- React Server Components support
- Suspense integration for data loading
- React 19 features integration
- Storybook stories (currently removed due to type issues)
- E2E tests with Playwright

## Testing

Run tests:
```bash
pnpm test                              # All tests
pnpm test -- wrappers/react            # React wrapper tests only
pnpm test:ui                           # Interactive test UI
```

Build:
```bash
pnpm build                             # Full build (types + bundles)
pnpm typecheck                         # Type check only
```

## Migration Guide

For existing users who want to switch to the wrapper:

**Before**:
```tsx
import { useEffect, useRef } from 'react';
import '@luminastudy/blocks-graph';

const graphRef = useRef(null);
useEffect(() => {
  graphRef.current?.loadFromJson(json, 'v0.1');
}, []);

<blocks-graph ref={graphRef} language="en" />
```

**After**:
```tsx
import { BlocksGraphReact } from '@luminastudy/blocks-graph/react';

<BlocksGraphReact blocks={blocks} language="en" />
```

## License

MIT - Same as the core library

## Contributing

To add features to the React wrapper:
1. Update `BlocksGraphReact.tsx`
2. Add tests in `BlocksGraphReact.test.tsx`
3. Update `README.md` documentation
4. Run `pnpm build` and `pnpm test`
5. Submit PR with clear description

---

**Implementation Date**: 2025-11-11
**Author**: Claude Code
**Status**: ✅ Production Ready
