# React Example

This example demonstrates how to integrate the `@luminastudy/blocks-graph` Web Component into a React application using TypeScript, following React best practices.

## Overview

This React example showcases:
- Web Component import and registration in React
- Type-safe ref access to Web Component imperative API
- useEffect hooks for data loading lifecycle
- State management for interactive controls
- Event listener registration for Web Component events
- TypeScript type definitions for custom elements
- Vite build tool with fast Hot Module Replacement (HMR)

## Prerequisites

Before running this example, ensure you have:
- **Node.js** >= 18.0.0
- **pnpm** >= 9.0.0 (project uses pnpm workspaces)
- **Modern browser** with Web Component support

## Setup Instructions

### 1. Build the Parent Library

The React example imports the Web Component from the parent library. You must build the library first:

```bash
# From the project root directory
cd ../..  # Navigate to project root if you're in examples/react/
pnpm build
```

This creates the `dist/index.js` bundle that the example imports via the workspace dependency.

### 2. Install Dependencies

Install the React example dependencies:

```bash
# From examples/react/ directory
pnpm install
```

This will install:
- React 18 and ReactDOM
- TypeScript and type definitions
- Vite and React plugin
- The parent library via workspace protocol (`workspace:*`)

### 3. Run the Development Server

Start the Vite development server:

```bash
pnpm dev
```

The application will be available at: `http://localhost:5173`

The dev server features:
- ⚡ Fast Hot Module Replacement (HMR)
- 🔥 Instant updates when you edit code
- 🎯 TypeScript type checking
- 📦 Optimized bundle for development

### 4. Build for Production (Optional)

To create a production build:

```bash
pnpm build
```

To preview the production build:

```bash
pnpm preview
```

## What This Example Demonstrates

### Web Component Import in React

```typescript
import '@luminastudy/blocks-graph';
```

Importing the library registers the `blocks-graph` custom element globally, making it available for use in JSX.

### TypeScript Type Definitions

```typescript
interface BlocksGraphElement extends HTMLElement {
  loadFromJson: (json: string, version: 'v0.1') => void;
  language: string;
  showPrerequisites: boolean;
  showParents: boolean;
}
```

Custom interface defines the Web Component's API for type-safe access via React ref.

### useRef for Imperative API Access

```typescript
const graphRef = useRef<BlocksGraphElement>(null);

// Later...
if (graphRef.current) {
  graphRef.current.loadFromJson(JSON.stringify(blocks), 'v0.1');
}
```

React ref provides access to the Web Component instance for calling imperative methods.

### useEffect for Data Loading

```typescript
useEffect(() => {
  const loadData = async () => {
    const response = await fetch('/data/blocks-sample.json');
    const blocks = await response.json();

    if (graphRef.current) {
      graphRef.current.loadFromJson(JSON.stringify(blocks), 'v0.1');
    }
  };

  loadData();
}, []); // Empty array = run once on mount
```

Data loading happens in useEffect to ensure it runs after the component renders and the ref is populated.

### State Management

```typescript
const [language, setLanguage] = useState<'en' | 'he'>('en');

// Sync state with Web Component attribute
useEffect(() => {
  if (graphRef.current) {
    graphRef.current.language = language;
  }
}, [language]);
```

React state drives UI controls and syncs with Web Component attributes.

### Event Listener Registration

```typescript
useEffect(() => {
  const graph = graphRef.current;
  if (!graph) return;

  const handleBlocksRendered = (event: Event) => {
    console.log('Blocks rendered:', (event as CustomEvent).detail);
  };

  graph.addEventListener('blocks-rendered', handleBlocksRendered);

  return () => {
    graph.removeEventListener('blocks-rendered', handleBlocksRendered);
  };
}, []);
```

Event listeners are registered in useEffect with cleanup to avoid memory leaks.

### JSX Integration

```tsx
<blocks-graph
  ref={graphRef}
  language={language}
  show-prerequisites={showPrerequisites ? 'true' : 'false'}
  show-parents={showParents ? 'true' : 'false'}
  style={{ width: '100%', height: '600px' }}
/>
```

Web Component rendered in JSX like any React component, with props and ref.

## Project Structure

```
examples/react/
├── public/
│   └── data/
│       └── blocks-sample.json    # Sample data served by Vite
├── src/
│   ├── App.tsx                   # Main React component
│   ├── App.css                   # Component styles
│   ├── main.tsx                  # Application entry point
│   └── index.css                 # Global styles
├── index.html                    # HTML template
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts                # Vite build configuration
└── README.md                     # This file
```

## Troubleshooting

### Error: "Cannot find module '@luminastudy/blocks-graph'"

**Cause**: The parent library hasn't been built or workspace dependency isn't resolved.

**Solution**:
1. Run `pnpm build` from the project root to build the library
2. Run `pnpm install` in `examples/react/` to resolve the workspace dependency
3. Verify `node_modules/@luminastudy/blocks-graph` is a symlink to the parent directory

### Error: "Failed to fetch /data/blocks-sample.json"

**Cause**: Sample data file not found in public directory.

**Solution**:
1. Verify `public/data/blocks-sample.json` exists
2. If missing, copy from `examples/data/blocks-sample.json`
3. Restart the Vite dev server

### TypeScript Error: "Property 'loadFromJson' does not exist"

**Cause**: TypeScript doesn't recognize the Web Component's API.

**Solution**: Ensure the `BlocksGraphElement` interface is defined with the correct method signatures, as shown in `src/App.tsx`.

### Vite Dev Server Won't Start

**Cause**: Port 5173 is already in use.

**Solution**:
1. Stop the process using port 5173
2. Or modify the port in `vite.config.ts`:
   ```typescript
   server: {
     port: 3000, // Use different port
   }
   ```

### Web Component Not Rendering

**Possible Causes**:
1. Library not built
2. Import failed
3. Browser doesn't support Web Components

**Solution**:
1. Check browser console for import errors
2. Verify `dist/index.js` exists in parent directory
3. Use a modern browser (Chrome 61+, Firefox 60+, Safari 11+, Edge 79+)

### HMR Not Working

**Cause**: Vite HMR connection issues.

**Solution**:
1. Restart the dev server
2. Clear browser cache
3. Check browser console for HMR errors

## Workspace Dependencies

This example uses pnpm workspace protocol:

```json
"dependencies": {
  "@luminastudy/blocks-graph": "workspace:*"
}
```

This means:
- ✅ Always uses the local development version of the library
- ✅ Changes to the library are immediately available (after rebuild)
- ✅ No need to publish the library to npm for local development
- ⚠️ Requires building the parent library before running the example

## Key React Patterns

### Why useRef?

Web Components have imperative APIs (methods like `loadFromJson`). React's useRef provides direct access to the DOM element to call these methods.

### Why Multiple useEffect Hooks?

Following React best practices, we separate concerns:
- One for data loading (runs once on mount)
- One for each state sync (runs when state changes)
- One for event listeners (runs once, with cleanup)

### Why Custom Type Interface?

TypeScript doesn't know about the custom element's API by default. Defining `BlocksGraphElement` interface provides:
- Type safety for method calls
- Autocomplete in IDE
- Compile-time error detection

## Next Steps

After exploring this example:
- Modify the sample data to test different block relationships
- Add more interactive controls (node size, spacing, etc.)
- Experiment with different React state patterns
- Try loading data from an API endpoint
- Explore the [Pure HTML Example](../html/) for comparison
- Read the [Parent Library README](../../README.md) for complete API documentation

## Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vite.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Web Components MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [Custom Elements Everywhere](https://custom-elements-everywhere.com/) - Framework compatibility

Happy coding! 🚀
