# Framework Wrappers

This directory contains framework-specific wrapper components for the `@lumina-study/blocks-graph` Web Component. These wrappers provide idiomatic APIs for different frameworks while maintaining the core functionality of the underlying Web Component.

## Available Wrappers

### React

**Import**: `@lumina-study/blocks-graph/react`

A React wrapper component that eliminates the need for refs and provides a clean, props-based API.

**Features**:

- ✅ No refs needed - just pass props
- ✅ Full TypeScript support with autocomplete
- ✅ React-style event handlers (`onBlocksRendered`, `onBlockSelected`)
- ✅ Automatic prop synchronization
- ✅ React 16.8+ compatible (hooks-based)

**Usage**:

```tsx
import { BlocksGraphReact } from '@lumina-study/blocks-graph/react';
import type { Block } from '@lumina-study/blocks-graph';

function App() {
  const blocks: Block[] = [...];

  return (
    <BlocksGraphReact
      blocks={blocks}
      language="en"
      orientation="ttb"
      showPrerequisites={true}
      onBlockSelected={(e) => console.log('Selected:', e.detail)}
      style={{ width: '100%', height: '600px' }}
    />
  );
}
```

**Location**: `src/wrappers/react/`
**Files**:

- `BlocksGraphReact.tsx` - Main wrapper component
- `BlocksGraphReact.test.tsx` - Unit tests
- `BlocksGraphReact.stories.tsx` - Storybook stories
- `index.ts` - Public exports
- `jsx.d.ts` - JSX type declarations

## Future Wrappers

### Vue (Planned)

A Vue 3 composition API wrapper with v-model support and reactive props.

**Planned Import**: `@lumina-study/blocks-graph/vue`

### Angular (Planned)

An Angular component wrapper with Input/Output decorators.

**Planned Import**: `@lumina-study/blocks-graph/angular`

### Svelte (Planned)

A Svelte component wrapper with reactive stores integration.

**Planned Import**: `@lumina-study/blocks-graph/svelte`

## Why Framework Wrappers?

While the Web Component works natively in all frameworks, framework-specific wrappers provide:

1. **Better Developer Experience**: Idiomatic APIs that feel natural in each framework
2. **Type Safety**: Full TypeScript support with framework-specific types
3. **Framework Integration**: Proper lifecycle management and reactivity
4. **Event Handling**: Framework-native event patterns instead of DOM events
5. **Props vs Attributes**: Framework-native prop passing instead of string attributes

## Direct Web Component Usage

You can always use the Web Component directly without wrappers:

```javascript
import '@lumina-study/blocks-graph'

// In your HTML or framework template
;<blocks-graph
  language="en"
  show-prerequisites="true"
  show-parents="true"
></blocks-graph>

// Access via JavaScript
const graph = document.querySelector('blocks-graph')
graph.loadFromJson(jsonString, 'v0.1')
```

## Contributing a Wrapper

To add a wrapper for a new framework:

1. **Create Directory**: `src/wrappers/<framework>/`
2. **Implement Wrapper**: Create the wrapper component
3. **Add Tests**: Write comprehensive unit tests
4. **Add Stories**: Create Storybook stories
5. **Update Exports**: Add to `package.json` exports
6. **Update Build**: Add to build configuration
7. **Document**: Update this README and main README
8. **Add Example**: Create example in `examples/<framework>/`

### Wrapper Requirements

Every wrapper should:

- ✅ Support all Web Component features
- ✅ Provide TypeScript types
- ✅ Handle prop synchronization
- ✅ Manage event listeners with cleanup
- ✅ Include comprehensive tests (>80% coverage)
- ✅ Include Storybook stories
- ✅ Follow framework best practices
- ✅ Document usage with examples

## Architecture

All wrappers follow this pattern:

```
Wrapper Component (React/Vue/etc.)
       ↓
Web Component (<blocks-graph>)
       ↓
Core Library (GraphEngine + GraphRenderer)
```

The wrappers are **thin layers** that:

- Translate framework concepts to Web Component API
- Manage lifecycle and cleanup
- Provide type safety
- Don't duplicate core functionality

## Testing

Each wrapper includes:

- **Unit Tests**: Component behavior and prop handling
- **Integration Tests**: Interaction with Web Component
- **Type Tests**: TypeScript compilation checks
- **E2E Tests** (if applicable): Full user workflows

Run tests:

```bash
pnpm test                    # All tests
pnpm test -- wrappers/react  # React wrapper tests only
```

## Documentation

Each wrapper includes:

- **JSDoc comments**: Inline API documentation
- **README** (in wrapper directory): Detailed usage guide
- **Storybook stories**: Interactive examples
- **TypeScript types**: Full type definitions
- **Code examples**: Common usage patterns

## License

All wrappers are licensed under MIT, same as the core library.
