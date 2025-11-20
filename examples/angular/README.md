# Angular Example

This example demonstrates how to integrate the `@luminastudy/blocks-graph` Web Component into an Angular application using TypeScript and standalone components.

## Overview

This Angular example showcases:

- **Angular wrapper component** (`BlocksGraphComponent`) for clean, declarative API
- Standalone components (no NgModule required - Angular 14+)
- `@Input()` decorators for props
- `@Output()` with EventEmitter for events
- Automatic change detection
- Full TypeScript support with type safety
- Angular CLI for development and building

## Prerequisites

Before running this example, ensure you have:

- **Node.js** >= 18.0.0
- **pnpm** >= 9.0.0 (project uses pnpm workspaces)
- **Modern browser** with Web Component support

## Setup Instructions

### 1. Build the Parent Library

The Angular example imports the Web Component from the parent library. You must build the library first:

```bash
# From the project root directory
cd ../..  # Navigate to project root if you're in examples/angular/
pnpm build
```

This creates the `dist/index.js` and `dist/wrappers/angular/index.js` bundles that the example imports via the workspace dependency.

### 2. Install Dependencies

Install the Angular example dependencies:

```bash
# From examples/angular/ directory
pnpm install
```

This will install:

- Angular 19 (core, common, platform, animations)
- RxJS and Zone.js
- Angular CLI and build tools
- TypeScript and type definitions
- The parent library via workspace protocol (`workspace:*`)

### 3. Run the Development Server

Start the Angular development server:

```bash
pnpm start
```

The application will be available at: `http://localhost:4200`

The dev server features:

- 🔥 Live reload when you edit code
- 🎯 TypeScript type checking
- 📦 Optimized bundle for development
- 🐛 Source maps for debugging

### 4. Build for Production (Optional)

To create a production build:

```bash
pnpm build
```

The build artifacts will be stored in the `dist/` directory.

## What This Example Demonstrates

### Angular Wrapper Component

```typescript
<blocks-graph-angular
  [blocks]="blocks"
  language="en"
  orientation="ttb"
  [showPrerequisites]="true"
  (blockSelected)="handleBlockSelected($event)"
></blocks-graph-angular>
```

The `BlocksGraphComponent` wrapper provides a clean, Angular-native API using `@Input` and `@Output` decorators.

### Standalone Component

```typescript
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, BlocksGraphComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  // Component logic...
}
```

Using Angular's modern standalone components (no NgModule required).

### Input Properties

```typescript
blocks: BlockSchemaV01[] | null = null
language: 'en' | 'he' = 'en'
orientation: 'ttb' | 'ltr' | 'rtl' | 'btt' = 'ttb'

// In template:
<blocks-graph-angular
  [blocksV01]="blocks"
  [language]="language"
  [orientation]="orientation"
></blocks-graph-angular>
```

Component properties are bound to the wrapper using Angular's property binding syntax.

### Event Handlers with EventEmitter

```typescript
import type { BlockSelectedEvent } from '@luminastudy/blocks-graph/angular'

handleBlockSelected(event: BlockSelectedEvent) {
  console.log('Block:', event.blockId, 'Level:', event.selectionLevel)
}

// In template:
<blocks-graph-angular
  (blockSelected)="handleBlockSelected($event)"
></blocks-graph-angular>
```

Full TypeScript support for events with typed payloads using Angular's EventEmitter.

### Two-Way Data Binding with ngModel

```typescript
<select [(ngModel)]="language">
  <option value="en">English</option>
  <option value="he">Hebrew</option>
</select>
```

Using Angular's two-way data binding for interactive controls.

### Lifecycle Hooks

```typescript
async ngOnInit() {
  // Load data when component initializes
  const response = await fetch('...')
  this.blocks = await response.json()
}
```

Using Angular lifecycle hooks for data loading and initialization.

## Project Structure

```
examples/angular/
├── src/
│   ├── app/
│   │   ├── app.component.ts     # Main component (TypeScript)
│   │   ├── app.component.html   # Component template
│   │   └── app.component.css    # Component styles
│   ├── index.html               # HTML entry point
│   ├── main.ts                  # Application bootstrap
│   └── styles.css               # Global styles
├── angular.json                 # Angular CLI configuration
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── tsconfig.app.json            # App-specific TypeScript config
└── README.md                    # This file
```

## Troubleshooting

### Error: "Cannot find module '@luminastudy/blocks-graph'"

**Cause**: The parent library hasn't been built or workspace dependency isn't resolved.

**Solution**:

1. Run `pnpm build` from the project root to build the library
2. Run `pnpm install` in `examples/angular/` to resolve the workspace dependency
3. Verify `node_modules/@luminastudy/blocks-graph` is a symlink to the parent directory

### Error: "Failed to fetch" Sample Data

**Cause**: Network issue or CORS problem.

**Solution**:

1. Check browser console for detailed error
2. Verify the fetch URL is correct
3. Check network connectivity
4. Ensure CORS headers are set if loading from different domain

### TypeScript Error: Property does not exist

**Cause**: TypeScript doesn't recognize the component's inputs or outputs.

**Solution**:

1. Ensure you're importing types from `@luminastudy/blocks-graph/angular`
2. Check that the parent library is built with type definitions
3. Restart the Angular language service or IDE

### Angular Dev Server Won't Start

**Cause**: Port 4200 is already in use.

**Solution**:

1. Stop the process using port 4200
2. Or start with a different port:
   ```bash
   ng serve --port 3000
   ```

### Web Component Not Rendering

**Possible Causes**:

1. Library not built
2. Import failed
3. Browser doesn't support Web Components

**Solution**:

1. Check browser console for import errors
2. Verify `dist/wrappers/angular/index.js` exists in parent directory
3. Use a modern browser (Chrome 61+, Firefox 60+, Safari 11+, Edge 79+)

### Build Errors

**Cause**: TypeScript or Angular compilation errors.

**Solution**:

1. Run `ng build` to see detailed error messages
2. Check that all imports are correct
3. Verify TypeScript version compatibility
4. Clear `node_modules` and reinstall: `rm -rf node_modules && pnpm install`

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

## Key Angular Patterns

### Why Standalone Components?

Angular 14+ introduced standalone components which:

- Eliminate the need for NgModule
- Simplify component architecture
- Make imports more explicit
- Reduce boilerplate code

### Why @Input/@Output?

Angular's decorator-based approach:

- Provides clear component API
- Enables two-way data binding
- Works seamlessly with change detection
- Offers excellent TypeScript support

### Component-Based Architecture

Angular's component model:

- Separates concerns (template, logic, styles)
- Enables reusability
- Facilitates testing
- Follows web component philosophy

## Benefits of Angular Wrapper

Compared to using the Web Component directly:

- ✅ **No ViewChild needed** - Just use @Input/@Output
- ✅ **Full TypeScript support** - All props and events are typed
- ✅ **Angular-style events** - Use (event) syntax instead of addEventListener
- ✅ **Automatic change detection** - Props update the component automatically
- ✅ **Cleaner code** - More Angular-idiomatic and easier to read

## Next Steps

After exploring this example:

- Modify the sample data to test different block relationships
- Add more interactive controls (node size, spacing, etc.)
- Experiment with Angular forms and validation
- Try loading data from an Angular service
- Explore the [React Example](../react/) or [Vue Example](../vue/) for comparison
- Read the [Parent Library README](../../README.md) for complete API documentation

## Resources

- [Angular Documentation](https://angular.io/)
- [Angular CLI](https://angular.io/cli)
- [Standalone Components](https://angular.io/guide/standalone-components)
- [TypeScript with Angular](https://angular.io/guide/typescript-configuration)
- [Angular Elements](https://angular.io/guide/elements) - Angular's Web Components story

Happy coding! 🚀
