# Visual Regression Testing

This directory contains visual regression tests for the `blocks-graph` web component using [Playwright](https://playwright.dev/).

## Overview

Visual regression testing helps ensure that UI changes don't introduce unexpected visual bugs. The tests capture PNG screenshots of the component in various states and compare them against baseline images.

## Features

- **Free and local** - No paid services required
- **Commitable snapshots** - PNG files stored in git for version control
- **Multiple test scenarios** - Default state, custom dimensions, different configurations
- **Shadow DOM support** - Tests work with web component shadow DOM
- **Interaction testing** - Captures snapshots after user interactions (clicks, etc.)

## Setup

### First Time Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Install Playwright browsers:
   ```bash
   pnpm exec playwright install chromium
   ```

3. Build the component:
   ```bash
   pnpm build
   ```

## Running Tests

### Generate Initial Snapshots

The first time you run visual tests, you need to generate baseline snapshots:

```bash
pnpm test:visual:update
```

This will:
1. Start a local HTTP server for test pages
2. Launch Chromium browser
3. Capture screenshots of each test scenario
4. Save PNG files to `tests/visual/snapshots/`

### Run Visual Tests

After baselines are established, run tests to detect visual changes:

```bash
pnpm test:visual
```

Tests will fail if visual differences exceed the configured threshold.

### Update Snapshots

When intentional visual changes are made, update the baseline snapshots:

```bash
pnpm test:visual:update
```

### Debug Tests Interactively

Use Playwright's UI mode for debugging:

```bash
pnpm test:visual:ui
```

## Test Scenarios

The visual tests cover:

1. **Default State** - Component with default configuration
2. **Custom Dimensions** - Custom node width, height, and spacing
3. **Prerequisites Hidden** - Component with prerequisites relationships disabled
4. **After Click** - Component state after clicking the first block

## File Structure

```
tests/visual/
├── README.md                          # This file
├── blocks-graph.visual.spec.ts        # Visual test specs
├── test-pages/                        # Standalone HTML test pages
│   └── index.html                     # Main test page with component instances
└── snapshots/                         # Generated PNG snapshots (git-tracked)
    └── blocks-graph.visual.spec.ts/   # Snapshots for each browser
        └── blocks-graph-*.png         # Individual test snapshots
```

## Configuration

Visual testing is configured in `playwright.config.ts` at the project root:

- **Test directory**: `tests/visual/`
- **Snapshot directory**: `tests/visual/snapshots/`
- **Browsers**: Chromium (Desktop Chrome)
- **Max diff pixels**: 100 (allows minor rendering differences)
- **Server**: HTTP server on port 8080 serving test pages

## Committing Snapshots

**IMPORTANT**: Snapshot PNG files in `tests/visual/snapshots/` should be committed to git. These serve as the baseline for detecting visual regressions.

When you update snapshots:
1. Review the changes carefully
2. Commit the updated PNG files along with your code changes
3. Document why the visual changes were necessary

## CI Integration

To run visual tests in CI:

```bash
CI=true pnpm test:visual
```

The `CI` environment variable:
- Disables server reuse
- Enables retries (2 attempts)
- Fails build on `test.only` usage

## Troubleshooting

### Browser crashes

If you see "Page crashed" errors:
- Ensure Chromium is installed: `pnpm exec playwright install chromium`
- Try running with `--headed` flag for debugging
- Check system resources (memory, disk space)

### Snapshots don't match

- Review the HTML report: `pnpm exec playwright show-report`
- Check diff images in the report
- Update snapshots if changes are intentional: `pnpm test:visual:update`

### Server timeout

If the test server fails to start:
- Check if port 8080 is already in use
- Ensure `pnpm build` completed successfully
- Verify `tests/visual/test-pages/index.html` exists

## Learn More

- [Playwright Documentation](https://playwright.dev/)
- [Visual Comparisons](https://playwright.dev/docs/test-snapshots)
- [Best Practices](https://playwright.dev/docs/best-practices)
