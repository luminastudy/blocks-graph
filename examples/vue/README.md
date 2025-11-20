# Vue Example

This example demonstrates how to integrate the `@lumina-study/blocks-graph` Web Component into a Vue 3 application using TypeScript and the Composition API.

## Overview

This Vue example showcases:

- **Vue wrapper component** (`BlocksGraphVue`) for clean, declarative API
- Composition API with `<script setup>` syntax
- Reactive state management using Vue refs
- Type-safe props and events with TypeScript
- Automatic prop synchronization with watchers
- Vite build tool with fast Hot Module Replacement (HMR)
- Vue 3's modern features and best practices

## Prerequisites

Before running this example, ensure you have:

- **Node.js** >= 18.0.0
- **pnpm** >= 9.0.0 (project uses pnpm workspaces)
- **Modern browser** with Web Component support

## Setup Instructions

### 1. Build the Parent Library

The Vue example imports the Web Component from the parent library. You must build the library first:

```bash
# From the project root directory
cd ../..  # Navigate to project root if you're in examples/vue/
pnpm build
```

This creates the `dist/index.js` and `dist/wrappers/vue/index.js` bundles that the example imports via the workspace dependency.

### 2. Install Dependencies

Install the Vue example dependencies:

```bash
# From examples/vue/ directory
pnpm install
```

This will install:

- Vue 3
- TypeScript and type definitions
- Vite and Vue plugin
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

### Vue Wrapper Component

```vue
<template>
  <BlocksGraphVue
    :blocks="blocks"
    language="en"
    orientation="ttb"
    :show-prerequisites="true"
    @block-selected="handleBlockSelected"
  />
</template>
```

The `BlocksGraphVue` wrapper provides a clean, Vue-native API without needing refs or manual DOM manipulation.

### Composition API with Script Setup

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  BlocksGraphVue,
  type BlockSchemaV01,
} from '@lumina-study/blocks-graph/vue'

const blocks = ref<BlockSchemaV01[]>([])
const language = ref<'en' | 'he'>('en')

onMounted(async () => {
  // Load data...
})
</script>
```

Using Vue 3's modern `<script setup>` syntax for cleaner, more concise component code.

### Reactive State Management

```typescript
const language = ref<'en' | 'he'>('en')
const orientation = ref<'ttb' | 'ltr' | 'rtl' | 'btt'>('ttb')

// In template:
<select v-model="language">
  <option value="en">English</option>
  <option value="he">Hebrew</option>
</select>
```

Vue's reactivity system automatically updates the graph when state changes.

### Type-Safe Event Handlers

```typescript
import type { BlockSelectedEvent } from '@lumina-study/blocks-graph/vue'

function handleBlockSelected(event: BlockSelectedEvent) {
  console.log('Block:', event.blockId, 'Level:', event.selectionLevel)
}
```

Full TypeScript support for events with typed payloads.

### Automatic Prop Synchronization

The wrapper component automatically synchronizes Vue props with the Web Component's attributes and properties - no manual watchers needed!

## Project Structure

```
examples/vue/
├── public/           # Static assets (if needed)
├── src/
│   ├── App.vue      # Main Vue component
│   ├── main.ts      # Application entry point
│   └── style.css    # Global styles
├── index.html       # HTML template
├── package.json     # Dependencies and scripts
├── tsconfig.json    # TypeScript configuration
├── vite.config.ts   # Vite build configuration
└── README.md        # This file
```

## Troubleshooting

### Error: "Cannot find module '@lumina-study/blocks-graph'"

**Cause**: The parent library hasn't been built or workspace dependency isn't resolved.

**Solution**:

1. Run `pnpm build` from the project root to build the library
2. Run `pnpm install` in `examples/vue/` to resolve the workspace dependency
3. Verify `node_modules/@lumina-study/blocks-graph` is a symlink to the parent directory

### Error: "Failed to fetch" Sample Data

**Cause**: Network issue or CORS problem.

**Solution**:

1. Check browser console for detailed error
2. Verify the fetch URL is correct
3. Check network connectivity
4. Ensure CORS headers are set if loading from different domain

### TypeScript Error: Property does not exist

**Cause**: TypeScript doesn't recognize the component's props or events.

**Solution**:

1. Ensure you're importing types from `@lumina-study/blocks-graph/vue`
2. Check that the parent library is built with type definitions
3. Restart the TypeScript server in your IDE

### Vite Dev Server Won't Start

**Cause**: Port 5173 is already in use.

**Solution**:

1. Stop the process using port 5173
2. Or modify the port in `vite.config.ts`:
   ```typescript
   export default defineConfig({
     server: {
       port: 3000, // Use different port
     },
   })
   ```

### Web Component Not Rendering

**Possible Causes**:

1. Library not built
2. Import failed
3. Browser doesn't support Web Components

**Solution**:

1. Check browser console for import errors
2. Verify `dist/wrappers/vue/index.js` exists in parent directory
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
  "@lumina-study/blocks-graph": "workspace:*"
}
```

This means:

- ✅ Always uses the local development version of the library
- ✅ Changes to the library are immediately available (after rebuild)
- ✅ No need to publish the library to npm for local development
- ⚠️ Requires building the parent library before running the example

## Key Vue Patterns

### Why Composition API?

Vue 3's Composition API provides:

- Better TypeScript support
- More flexible code organization
- Easier logic reuse
- Cleaner, more concise syntax with `<script setup>`

### Why No Refs to DOM Elements?

The `BlocksGraphVue` wrapper handles all DOM interaction internally. You just pass props and handle events - no need for template refs!

### Reactive vs Ref

- Use `ref()` for primitive values and objects
- Use `reactive()` for deeply nested objects (optional)
- The wrapper automatically tracks all changes

## Benefits of Vue Wrapper

Compared to using the Web Component directly:

- ✅ **No refs needed** - Just use props and events
- ✅ **Full TypeScript support** - Props and events are fully typed
- ✅ **Vue-style events** - Use `@event` syntax instead of `addEventListener`
- ✅ **Automatic synchronization** - Props update the component automatically
- ✅ **Cleaner code** - More Vue-idiomatic and easier to read

## Next Steps

After exploring this example:

- Modify the sample data to test different block relationships
- Add more interactive controls (node size, spacing, etc.)
- Experiment with Vue's reactive features
- Try loading data from a different API endpoint
- Explore the [React Example](../react/) for comparison
- Read the [Parent Library README](../../README.md) for complete API documentation

## Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Vue Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Vite Documentation](https://vite.dev/)
- [TypeScript with Vue](https://vuejs.org/guide/typescript/overview.html)
- [Web Components in Vue](https://vuejs.org/guide/extras/web-components.html)

Happy coding! 🚀
