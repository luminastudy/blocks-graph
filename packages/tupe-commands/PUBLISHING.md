# Publishing Guide

This guide explains how to publish the `@luminastudy/tupe-commands` package to npm.

## Prerequisites

Before you can publish, you need to:

1. **Set up npm token**: Create an npm access token and add it to your GitHub repository secrets
   - Go to https://www.npmjs.com/settings/YOUR_USERNAME/tokens
   - Create a new "Automation" token
   - Add it to GitHub Secrets as `NPM_TOKEN`:
     - Go to your repository on GitHub
     - Settings → Secrets and variables → Actions
     - Create a new repository secret named `NPM_TOKEN`
     - Paste your npm token as the value

2. **Ensure you have publish permissions**: You need to be a maintainer of the `@luminastudy` organization on npm

## Publishing Process

### Automatic Publishing (Recommended)

The package is automatically published when you create a git tag following the pattern `tupe-v*.*.*`:

```bash
# 1. Update the version in package.json (optional - workflow will do this)
cd packages/tupe-commands
npm version patch  # or minor, or major

# 2. Create and push a git tag
git tag tupe-v0.1.0
git push origin tupe-v0.1.0
```

The GitHub Actions workflow will:
1. Extract the version from the tag
2. Update `package.json` with that version
3. Publish to npm with provenance
4. Create a GitHub release

### Manual Publishing (Workflow Dispatch)

You can also trigger a publish manually from the GitHub Actions UI:

1. Go to the "Actions" tab in your GitHub repository
2. Select "Publish Tupe Commands" workflow
3. Click "Run workflow"
4. Enter the version number (e.g., `0.1.0`)
5. Click "Run workflow"

### Local Publishing (Not Recommended)

If you need to publish locally:

```bash
cd packages/tupe-commands

# Update version
npm version patch  # or specify version: npm version 0.1.0

# Login to npm (if not already logged in)
npm login

# Publish
npm publish --access public
```

## Version Management

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** version for incompatible changes (e.g., `1.0.0` → `2.0.0`)
- **MINOR** version for new functionality (e.g., `0.1.0` → `0.2.0`)
- **PATCH** version for bug fixes (e.g., `0.1.0` → `0.1.1`)

## CI/CD Workflows

### CI Workflow

Runs on every push and PR:
- Lints code
- Runs type checking
- Runs tests
- Validates package structure
- Checks all command files are present

### Publish Workflow

Triggered by tags matching `tupe-v*.*.*`:
- Updates package version
- Publishes to npm
- Creates GitHub release

## Troubleshooting

### Publication fails with authentication error

- Verify the `NPM_TOKEN` secret is set correctly in GitHub
- Ensure the token has publish permissions
- Check the token hasn't expired

### Version already exists

- You cannot republish the same version to npm
- Increment the version number and try again

### Command files missing

- Ensure all command markdown files are present in the `commands/` directory
- The CI workflow validates this before allowing publication

## Post-Publication

After publishing:

1. Verify the package on npm: https://www.npmjs.com/package/@luminastudy/tupe-commands
2. Test installation: `npm install @luminastudy/tupe-commands`
3. Update any dependent projects
4. Announce the release if significant changes were made
