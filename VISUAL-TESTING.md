# Visual Regression Testing with Loki

This project uses [Loki](https://loki.js.org/) for visual regression testing to ensure that UI changes don't introduce unintended visual bugs.

## Overview

Visual regression testing captures screenshots of UI components and compares them against baseline "reference" images. When changes are detected, the tests fail, allowing you to review and approve intentional changes or catch unintended regressions.

## How It Works

1. **Reference Images**: Baseline screenshots stored in `.loki/reference/`
2. **Current Screenshots**: Generated during test runs (`.loki/current/`)
3. **Differences**: Visual diffs highlighting changes (`.loki/difference/`)
4. **Approval**: Developers review and approve changes

## Running Visual Tests

### Prerequisites

- Docker must be installed and running (Loki uses Chrome in Docker for consistent rendering)
- Run `pnpm install` to install dependencies including Loki

### Commands

```bash
# Run visual regression tests
pnpm test:visual

# Update reference images (use when UI changes are intentional)
pnpm test:visual:update

# Approve pending changes after reviewing differences
pnpm test:visual:approve
```

## Workflow

### 1. Making UI Changes

When you modify component styles, layout, or rendering logic:

```bash
# Make your changes to the component
# Then run visual tests to see if they pass
pnpm test:visual
```

### 2. Test Fails (Visual Changes Detected)

If tests fail, Loki detected visual differences:

```bash
# Review the differences
ls .loki/difference/

# If changes are intentional, update reference images
pnpm test:visual:update

# If changes are unintended, fix the code and re-run tests
```

### 3. Approving Changes

After reviewing and confirming changes are correct:

```bash
# Approve the changes
pnpm test:visual:approve

# Commit the updated reference images
git add .loki/reference/
git commit -m "chore: update visual test references"
```

## CI/CD Integration

Visual regression tests run automatically in CI on every push and pull request:

- **Job**: `visual-testing` in `.github/workflows/ci.yml`
- **When**: After Storybook builds successfully
- **Blocks**: Publishing to npm if tests fail
- **Artifacts**: On failure, differences are uploaded for review

### Viewing CI Failures

If visual tests fail in CI:

1. Go to the GitHub Actions run
2. Download the `loki-differences` artifact
3. Review the difference images
4. Update locally and push new references if intentional

## Configuration

Visual tests are configured in `package.json`:

```json
{
  "loki": {
    "configurations": {
      "chrome.laptop": {
        "target": "chrome.docker",
        "width": 1366,
        "height": 768
      }
    },
    "chromeSelector": "blocks-graph, .sb-show-main",
    "diffingEngine": "pixelmatch"
  }
}
```

### Configuration Options

- **target**: `chrome.docker` - Uses headless Chrome in Docker for consistency
- **width/height**: Viewport dimensions for screenshots
- **chromeSelector**: CSS selector to capture (targets our web component and Storybook main area)
- **diffingEngine**: `pixelmatch` - Pixel-by-pixel comparison algorithm

## Storybook Integration

Loki automatically captures all Storybook stories:

1. Discovers stories from Storybook build
2. Captures each story variant
3. Compares against reference images
4. Reports differences

### Testing Specific Stories

To test only specific stories:

```bash
# Test stories matching a pattern
pnpm loki test --storiesFilter="blocks-graph*"

# Update specific story references
pnpm loki update --storiesFilter="blocks-graph--default"
```

## Best Practices

### 1. Commit Reference Images

Always commit `.loki/reference/` to version control:

```bash
git add .loki/reference/
git commit -m "chore: add visual test references"
```

### 2. Review Changes Carefully

Before approving visual changes:

- Compare current vs reference side-by-side
- Ensure changes match your intent
- Check for unexpected regressions in other components

### 3. Small, Focused Changes

- Make one visual change at a time
- Update references incrementally
- Easier to review and debug

### 4. Update References in PRs

When UI changes are part of a PR:

- Include updated reference images in the same commit
- Note visual changes in PR description
- Add screenshots to PR for reviewers

### 5. Don't Ignore Failures

If visual tests fail:

- Investigate the cause
- Don't blindly update references
- May indicate unintended side effects

## Troubleshooting

### Docker Not Running

```text
Error: Docker is not running
```

**Solution**: Start Docker Desktop or Docker daemon

### Reference Images Missing

```text
Error: No reference images found
```

**Solution**: Generate initial references:

```bash
pnpm test:visual:update
git add .loki/reference/
git commit -m "chore: add initial visual test references"
```

### Tests Pass Locally but Fail in CI

**Causes**:

- Different rendering between local and CI
- Font rendering differences
- Timing issues

**Solution**:

- Use `chrome.docker` target consistently (already configured)
- Commit reference images generated in CI
- Add delays if components have animations

### Large Diffs for Small Changes

**Causes**:

- Anti-aliasing differences
- Font rendering variations
- Timestamp or dynamic content

**Solution**:

- Review Storybook stories for dynamic content
- Mock timestamps and random data
- Adjust `pixelmatch` threshold if needed

## Advanced Configuration

### Multiple Viewport Sizes

Add more configurations to test responsive designs:

```json
{
  "loki": {
    "configurations": {
      "chrome.laptop": {
        "target": "chrome.docker",
        "width": 1366,
        "height": 768
      },
      "chrome.tablet": {
        "target": "chrome.docker",
        "width": 768,
        "height": 1024
      },
      "chrome.mobile": {
        "target": "chrome.docker",
        "width": 375,
        "height": 667,
        "deviceScaleFactor": 2,
        "mobile": true
      }
    }
  }
}
```

### Custom Diffing Threshold

Adjust sensitivity in `package.json`:

```json
{
  "loki": {
    "diffingEngine": "pixelmatch",
    "configurations": {
      "chrome.laptop": {
        "target": "chrome.docker",
        "width": 1366,
        "height": 768,
        "threshold": 0.1
      }
    }
  }
}
```

## Resources

- [Loki Documentation](https://loki.js.org/)
- [Storybook Documentation](https://storybook.js.org/)
- [Visual Regression Testing Guide](https://storybook.js.org/docs/react/writing-tests/visual-testing)

## Maintenance

### Regular Updates

- Update Loki: `pnpm update loki`
- Regenerate references after major UI refactors
- Review and clean up old reference images

### Storage Considerations

Reference images are binary files that increase repository size:

- Keep stories focused and minimal
- Don't test every possible variation
- Consider external storage for very large projects (not needed yet)
