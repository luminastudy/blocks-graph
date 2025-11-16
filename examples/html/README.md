# Pure HTML Example

This example demonstrates how to integrate the `@luminastudy/blocks-graph` Web Component into a pure HTML page using vanilla JavaScript, without any framework dependencies.

## Overview

This standalone HTML example showcases:

- ES module import of the Web Component library
- Declarative usage via HTML attributes
- Imperative API for data loading (`loadFromJson` method)
- Event handling (`blocks-rendered`, `block-selected` events)
- Dynamic attribute updates via JavaScript
- Responsive design with mobile support

## Prerequisites

Before running this example, ensure you have:

- **Node.js** >= 18.0.0
- **pnpm** >= 9.0.0
- **Modern browser** with ES module support (Chrome 61+, Firefox 60+, Safari 11+, Edge 79+)

## Setup Instructions

### 1. Build the Parent Library

The HTML example imports the Web Component from the built distribution. You must build the library first:

```bash
# From the project root directory
cd ../..  # Navigate to project root if you're in examples/html/
pnpm build
```

This creates the `dist/index.js` bundle that the example imports.

### 2. Start an HTTP Server

**Important**: Due to ES module and CORS restrictions, you cannot simply open `index.html` in your browser using the `file://` protocol. You must serve it via an HTTP server.

#### Option 1: Using pnpm (Recommended)

From the project root:

```bash
pnpm serve
```

Then navigate to: `http://localhost:8080/examples/html/`

#### Option 2: Using http-server (npx)

From the project root or examples/html directory:

```bash
npx http-server -c-1 -p 8080
```

Then navigate to: `http://localhost:8080/examples/html/` (if run from project root)
or `http://localhost:8080/` (if run from examples/html)

#### Option 3: Using Python

```bash
# Python 3
python -m http.server 8080

# Navigate to: http://localhost:8080/examples/html/
```

#### Option 4: Using VS Code Live Server Extension

1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## What This Example Demonstrates

### ES Module Import

```javascript
import '../../dist/index.js'
```

The library is imported as an ES module, which automatically registers the `blocks-graph` custom element.

### Declarative HTML Usage

```html
<blocks-graph
  id="graph"
  language="en"
  show-prerequisites="true"
  show-parents="true"
>
</blocks-graph>
```

The Web Component is configured using HTML attributes:

- `language`: Display language (`en` or `he`)
- `show-prerequisites`: Show prerequisite relationships (boolean)
- `show-parents`: Show parent relationships (boolean)

### Imperative Data Loading

```javascript
const graph = document.getElementById('graph')
const response = await fetch('../data/blocks-sample.json')
const blocks = await response.json()
graph.loadFromJson(JSON.stringify(blocks), 'v0.1')
```

Data is loaded using the `loadFromJson()` method with v0.1 schema version.

### Event Handling

```javascript
graph.addEventListener('blocks-rendered', event => {
  console.log('Rendered', event.detail.blockCount, 'blocks')
})

graph.addEventListener('block-selected', event => {
  console.log('Selected block:', event.detail.blockId)
})
```

The component emits custom events for rendering completion and user interactions.

### Dynamic Attribute Updates

```javascript
languageSelect.addEventListener('change', e => {
  graph.language = e.target.value
})
```

Component attributes can be updated dynamically via JavaScript properties.

## File Structure

```
examples/html/
├── index.html          # Standalone HTML demonstration
└── README.md          # This file
```

## Troubleshooting

### Error: "Failed to load module script"

**Cause**: Opening the HTML file using `file://` protocol instead of HTTP.

**Solution**: You must use an HTTP server (see Setup Instructions above). ES modules require a proper MIME type which `file://` doesn't provide.

### Error: "Failed to fetch"

**Cause**: Either:

1. The parent library hasn't been built (dist/index.js doesn't exist)
2. CORS issues when loading sample data

**Solution**:

1. Run `pnpm build` from the project root
2. Ensure you're using an HTTP server, not opening the file directly

### Error: "Module not found: ../../dist/index.js"

**Cause**: The parent library hasn't been built yet.

**Solution**: Run `pnpm build` from the project root directory.

### Console Warning: "Custom element 'blocks-graph' not defined"

**Cause**: The library import failed or hasn't loaded yet.

**Solution**:

1. Check browser console for import errors
2. Verify `dist/index.js` exists
3. Ensure you're using a modern browser with ES module support

### Graph Doesn't Render

**Possible Causes**:

1. Sample data file not found
2. Invalid JSON in sample data
3. Schema validation failed

**Solution**:

1. Check browser console for errors
2. Verify `examples/data/blocks-sample.json` exists
3. Ensure data complies with v0.1 schema (valid UUIDs, bilingual titles, etc.)

## Browser Compatibility

This example works in all modern browsers that support:

- ES6+ modules
- Custom Elements v1
- Shadow DOM v1
- Fetch API

**Supported Browsers**:

- Chrome 61+
- Firefox 60+
- Safari 11+
- Edge 79+ (Chromium-based)

**Not Supported**:

- Internet Explorer (all versions)
- Legacy Edge (pre-Chromium)

## Next Steps

After exploring this example, check out:

- [React Example](../react/) - Framework integration with TypeScript
- [Parent Library README](../../README.md) - Complete API documentation
- [Main Examples README](../README.md) - Overview of all examples

## Customization Ideas

Want to experiment further? Try:

- Loading data from a different source (API endpoint, local file)
- Adding custom styling to the graph container
- Implementing additional controls (node size, spacing)
- Creating your own sample data with different block relationships
- Adding animation or transitions to attribute changes

Happy coding! 🚀
