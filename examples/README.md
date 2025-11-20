# @lumina-study/blocks-graph Examples

This directory contains runnable example applications demonstrating how to integrate the `@lumina-study/blocks-graph` Web Component into different environments.

## Overview

These examples showcase the framework-agnostic nature of the Web Component library by providing fully functional demonstrations in multiple integration contexts. Each example is a complete, standalone application that you can run, modify, and learn from.

## Available Examples

### 1. [Pure HTML Example](./html/)

**Integration Type**: Vanilla JavaScript
**Complexity**: Beginner
**Best For**: Understanding Web Component basics without framework overhead

Demonstrates:

- ES module import and component registration
- Declarative HTML usage with attributes
- Imperative API for data loading (`loadFromJson` method)
- Event handling (`blocks-rendered`, `block-selected`)
- Dynamic attribute updates via JavaScript

**Quick Start**:

```bash
# From project root
pnpm build           # Build the library first
pnpm serve          # Start HTTP server
# Navigate to http://localhost:8080/examples/html/
```

[View HTML Example Documentation →](./html/README.md)

---

### 2. [React Example](./react/)

**Integration Type**: React 18 + TypeScript + Vite
**Complexity**: Intermediate
**Best For**: Understanding framework integration patterns and React best practices

Demonstrates:

- Web Component integration in React with TypeScript
- Type-safe ref access to imperative API
- useEffect hooks for data loading lifecycle
- State management and attribute synchronization
- Event listener registration with cleanup
- Modern React patterns (hooks, functional components)

**Quick Start**:

```bash
# From project root
pnpm build                    # Build the library first
cd examples/react
pnpm install                  # Install React example dependencies
pnpm dev                      # Start Vite dev server
# Navigate to http://localhost:5173
```

[View React Example Documentation →](./react/README.md)

---

## Prerequisites

Before running any examples, ensure you have the required tools installed:

### Required Software

- **Node.js** >= 18.0.0
  - Check version: `node --version`
  - Download: [nodejs.org](https://nodejs.org/)

- **pnpm** >= 9.0.0
  - Check version: `pnpm --version`
  - Install: `npm install -g pnpm`

### Browser Requirements

All examples require a modern browser with Web Component support:

- ✅ Chrome 61+ / Edge 79+
- ✅ Firefox 60+
- ✅ Safari 11+
- ❌ Internet Explorer (not supported)

## Building the Library

**IMPORTANT**: All examples depend on the built library artifacts. You **must** build the parent library before running any example.

### Build Command

From the project root directory:

```bash
pnpm build
```

This creates the `dist/index.js` bundle that all examples import.

### When to Rebuild

Rebuild the library whenever you:

- Clone the repository for the first time
- Pull updates from the repository
- Make changes to the library source code (`src/`)
- Switch branches that modify the library

### Verifying the Build

Check that the build succeeded:

```bash
ls -la dist/
# You should see: index.js, index.d.ts, and source maps
```

## Shared Sample Data

All examples use the same sample dataset located in `examples/data/blocks-sample.json`. This ensures consistency across different integration patterns and makes it easy to compare behavior.

### Sample Data Structure

The dataset demonstrates a mathematics curriculum with:

- **5 blocks** showing educational progression
- **Bilingual titles** (English and Hebrew)
- **Prerequisite relationships** (dependency chains)
- **Parent relationships** (hierarchical structure)
- **Valid v0.1 schema** compliance

### Modifying Sample Data

Want to experiment with your own data? Edit `examples/data/blocks-sample.json` following the v0.1 schema:

```json
{
  "id": "valid-uuid-here",
  "title": {
    "he_text": "Hebrew title",
    "en_text": "English title"
  },
  "prerequisites": ["uuid-of-required-block"],
  "parents": ["uuid-of-parent-block"]
}
```

**Schema Rules**:

- `id`: Must be valid UUID format
- `title.he_text`: Required (Hebrew text)
- `title.en_text`: Required (English text)
- `prerequisites`: Array of UUIDs (can be empty)
- `parents`: Array of UUIDs (can be empty)
- All referenced UUIDs must exist in the dataset

## Common Troubleshooting

### "Module not found" or Import Errors

**Cause**: The library hasn't been built yet.

**Solution**:

```bash
cd ../..  # Navigate to project root
pnpm build
```

### CORS Errors (HTML Example)

**Cause**: Opening `index.html` directly via `file://` protocol.

**Solution**: You **must** use an HTTP server. ES modules and fetch requests require proper HTTP protocol.

Options:

```bash
# Option 1: pnpm serve (from project root)
pnpm serve

# Option 2: http-server via npx
npx http-server -c-1

# Option 3: Python
python -m http.server 8080
```

### "Failed to fetch" Sample Data

**Causes**:

1. Not using HTTP server (for HTML example)
2. Sample data file missing

**Solution**:

1. Use HTTP server (see above)
2. Verify `examples/data/blocks-sample.json` exists

### Workspace Dependency Issues (React Example)

**Cause**: pnpm workspace not resolving parent library.

**Solution**:

```bash
# From project root
pnpm install  # Reinstall all workspace dependencies

# Verify symlink exists
ls -la examples/react/node_modules/@lumina-study/blocks-graph
# Should show symlink to parent directory
```

### Web Component Not Rendering

**Possible Causes**:

1. Browser doesn't support Web Components
2. Library not imported
3. JavaScript errors

**Solution**:

1. Use a modern browser (see Browser Requirements above)
2. Check browser console for errors
3. Verify library was built successfully

### TypeScript Errors (React Example)

**Cause**: Type definitions missing or incorrect.

**Solution**:

```bash
# From examples/react/
pnpm install  # Ensure all type packages installed

# Check TypeScript compilation
pnpm build    # Should complete without errors
```

## ES Modules and Browser Compatibility

All examples use ES modules (`import`/`export` syntax). This requires:

### Modern JavaScript Features

- ES6+ module syntax
- Async/await
- Fetch API
- Custom Elements v1
- Shadow DOM v1

### Browser Support Matrix

| Browser | Minimum Version | Notes               |
| ------- | --------------- | ------------------- |
| Chrome  | 61+             | Full support        |
| Firefox | 60+             | Full support        |
| Safari  | 11+             | Full support        |
| Edge    | 79+             | Chromium-based only |
| IE      | None            | Not supported       |

### Transpilation

Examples do not include transpilation for older browsers. For production use in older browsers, you'll need to:

1. Add Babel for JavaScript transpilation
2. Add polyfills for missing APIs
3. Consider Web Component polyfills for older browsers

## Project Structure

```
examples/
├── README.md                  # This file
├── data/
│   └── blocks-sample.json    # Shared sample dataset
├── html/
│   ├── index.html            # Standalone HTML example
│   └── README.md             # HTML example documentation
└── react/
    ├── src/                  # React source files
    ├── public/               # Static assets
    ├── index.html            # HTML template
    ├── package.json          # Dependencies
    ├── tsconfig.json         # TypeScript config
    ├── vite.config.ts        # Vite config
    └── README.md             # React example documentation
```

## Learning Path

We recommend exploring the examples in this order:

1. **Start with HTML Example**
   - Understand core Web Component concepts
   - Learn the component's API and events
   - See vanilla JavaScript integration

2. **Move to React Example**
   - Learn framework integration patterns
   - Understand ref-based imperative API access
   - See TypeScript type definitions in action

3. **Experiment and Customize**
   - Modify sample data
   - Add new features
   - Integrate into your own projects

## Extending These Examples

Want to add more examples? Here's how:

### Adding a New Framework Example

1. Create a new directory: `examples/[framework]/`
2. Set up the framework's build configuration
3. Add workspace dependency to parent library
4. Implement the Web Component integration
5. Create comprehensive README
6. Update this file with new example

### Example Ideas

- **Vue 3** example with Composition API
- **Angular** example with TypeScript
- **Svelte** example with reactive stores
- **Web Components** composition (using multiple Web Components together)
- **Server-Side Rendering (SSR)** example
- **Progressive Web App (PWA)** example

## Additional Resources

### Library Documentation

- [Parent Library README](../README.md) - Complete API documentation
- [GitHub Repository](https://github.com/luminastudy/blocks-graph) - Source code and issues

### Web Components Learning

- [Web Components MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components) - Official documentation
- [Custom Elements Everywhere](https://custom-elements-everywhere.com/) - Framework compatibility tests
- [Web Components Best Practices](https://web.dev/custom-elements-best-practices/) - Google's guide

### Framework-Specific Resources

- [React + Web Components](https://react.dev/reference/react-dom/components#custom-html-elements) - Official React guide
- [Vue + Web Components](https://vuejs.org/guide/extras/web-components.html) - Official Vue guide
- [Angular Elements](https://angular.io/guide/elements) - Angular's Web Components story

## Contributing

Found an issue with an example? Have an idea for improvement?

1. Check existing issues on GitHub
2. Open a new issue with details
3. Submit a pull request with fixes/improvements

## License

MIT - Same as the parent library

---

**Need Help?**

- 📖 Read the example-specific README files
- 🐛 Check the troubleshooting sections
- 💬 Open an issue on GitHub
- 📚 Review the parent library documentation

Happy coding! 🚀
