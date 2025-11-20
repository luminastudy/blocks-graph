# Publishing Guide

This document explains how to publish new versions of `@lumina-study/blocks-graph` to npm.

## Overview

The package uses an automated CI/CD pipeline powered by GitHub Actions. Publishing is triggered by pushing git tags in the format `vX.Y.Z`.

## Prerequisites

### 1. npm Account Setup

Ensure you have:

- An npm account with publish permissions for `@lumina-study` scope
- Two-factor authentication (2FA) enabled on your npm account

### 2. GitHub Repository Setup

Required secrets in GitHub repository settings (`Settings → Secrets and variables → Actions`):

- **`NPM_TOKEN`** (Required)
  - Create an automation token on npmjs.com
  - Go to https://www.npmjs.com/settings/[username]/tokens
  - Click "Generate New Token" → "Automation"
  - Copy the token and add it to GitHub secrets as `NPM_TOKEN`

- **`CODECOV_TOKEN`** (Optional)
  - For code coverage reporting
  - Get token from https://codecov.io
  - Add to GitHub secrets as `CODECOV_TOKEN`

### 3. Local Development Setup

```bash
# Install dependencies
pnpm install

# Ensure all checks pass
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

## Publishing Process

### Method 1: Using release-it (Recommended)

The project is configured with `release-it` for automated version management.

```bash
# Dry run to see what will happen
pnpm release -- --dry-run

# Release a patch version (0.1.0 → 0.1.1)
pnpm release

# Release a minor version (0.1.0 → 0.2.0)
pnpm release -- minor

# Release a major version (0.1.0 → 1.0.0)
pnpm release -- major

# Pre-release versions
pnpm release -- --preRelease=beta  # 0.1.0 → 0.1.1-beta.0
pnpm release -- --preRelease=alpha # 0.1.0 → 0.1.1-alpha.0
```

**What `release-it` does:**

1. Runs pre-publish checks (tests, lint, build)
2. Bumps version in package.json
3. Creates git commit and tag
4. Pushes to GitHub
5. Triggers automated npm publishing via GitHub Actions

### Method 2: Manual Release

If you prefer manual control:

```bash
# 1. Update version in package.json manually
# Edit package.json: "version": "0.2.0"

# 2. Commit the version change
git add package.json
git commit -m "chore: bump version to 0.2.0"

# 3. Create and push tag
git tag v0.2.0
git push origin main
git push origin v0.2.0
```

**The tag push triggers the automated publish workflow.**

## CI/CD Pipeline

### Continuous Integration (All PRs and pushes)

When you push code or create a PR, the CI workflow runs:

1. **Code Quality Checks**
   - Spell checking
   - ESLint
   - TypeScript type checking

2. **Tests**
   - Run on Node.js 18, 20, and 22
   - Upload coverage to Codecov (Node 18 only)

3. **Build**
   - Compile TypeScript
   - Bundle with esbuild
   - Verify artifacts exist

4. **Storybook**
   - Build Storybook static site
   - Upload as artifact

### Automated Publishing (Version tags only)

When you push a tag matching `v*.*.*`, the publish workflow runs:

1. **Pre-publish Verification**
   - Verify tag format (vX.Y.Z)
   - Check version matches package.json
   - Run all quality checks
   - Run all tests
   - Build the library

2. **Publish to npm**
   - Publish with provenance (supply chain security)
   - Public access for @lumina-study scope
   - Uses `NPM_TOKEN` secret

3. **Create GitHub Release**
   - Auto-creates GitHub release from tag
   - Links to CHANGELOG.md
   - Marks pre-releases correctly

## Version Numbering

Follow [Semantic Versioning (SemVer)](https://semver.org/):

- **Patch (X.Y.Z)**: Bug fixes, documentation updates
  - Example: 0.1.0 → 0.1.1

- **Minor (X.Y.0)**: New features, backward compatible
  - Example: 0.1.1 → 0.2.0

- **Major (X.0.0)**: Breaking changes
  - Example: 0.2.0 → 1.0.0

### Pre-release Versions

Use pre-release identifiers for beta/alpha releases:

- **Beta**: `vX.Y.Z-beta.N` (e.g., v0.2.0-beta.1)
- **Alpha**: `vX.Y.Z-alpha.N` (e.g., v0.2.0-alpha.1)
- **RC**: `vX.Y.Z-rc.N` (e.g., v0.2.0-rc.1)

Pre-releases are automatically tagged as "pre-release" on GitHub and npm.

## Checklist Before Publishing

- [ ] All tests passing (`pnpm test`)
- [ ] No linting errors (`pnpm lint`)
- [ ] Types compile (`pnpm typecheck`)
- [ ] Build succeeds (`pnpm build`)
- [ ] CHANGELOG.md updated with changes
- [ ] README.md reflects any API changes
- [ ] Examples still work
- [ ] Breaking changes documented (if major version)
- [ ] Git working directory is clean

## Updating CHANGELOG.md

Before each release, update `CHANGELOG.md`:

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added

- New features

### Changed

- Changes to existing functionality

### Deprecated

- Soon-to-be removed features

### Removed

- Removed features

### Fixed

- Bug fixes

### Security

- Security fixes
```

Commit the changelog update before running `pnpm release`.

## Troubleshooting

### "Version mismatch" error in publish workflow

**Cause**: Tag version doesn't match package.json version.

**Solution**:

```bash
# Check package.json version
cat package.json | grep version

# Check tag
git describe --tags

# Delete local and remote tag if needed
git tag -d v0.1.0
git push origin :refs/tags/v0.1.0

# Re-tag with correct version
git tag v0.1.0
git push origin v0.1.0
```

### "npm ERR! 403 Forbidden" during publish

**Cause**: Invalid or expired `NPM_TOKEN`, or insufficient permissions.

**Solution**:

1. Create new automation token on npmjs.com
2. Update `NPM_TOKEN` in GitHub secrets
3. Ensure token has publish permission for `@lumina-study` scope
4. Retry the workflow

### CI failing with "frozen lockfile" error

**Cause**: package-lock.json or pnpm-lock.yaml is out of sync.

**Solution**:

```bash
# Delete lock file and node_modules
rm -rf node_modules pnpm-lock.yaml

# Reinstall
pnpm install

# Commit updated lock file
git add pnpm-lock.yaml
git commit -m "chore: update lock file"
```

### Build artifacts missing

**Cause**: Build failed silently or files not included.

**Solution**:

```bash
# Clean build
rm -rf dist

# Rebuild
pnpm build

# Verify artifacts
ls -la dist/
# Should see: index.js, index.d.ts, index.js.map
```

### Tests failing in CI but passing locally

**Cause**: Environment differences, missing dependencies, or timing issues.

**Solution**:

1. Check Node.js version matches CI (18, 20, or 22)
2. Clear local cache: `pnpm store prune`
3. Fresh install: `rm -rf node_modules && pnpm install`
4. Check for hardcoded paths or environment-specific code

## Manual Publish (Emergency)

If automation fails and you need to publish urgently:

```bash
# Ensure you're on the correct commit
git status

# Ensure everything is built
pnpm build

# Login to npm (one-time)
npm login

# Publish manually
pnpm publish --access public

# Create tag after successful publish
git tag v0.1.0
git push origin v0.1.0
```

**Note**: Manual publishing skips provenance. Prefer automated workflow when possible.

## Post-Publish Verification

After publishing, verify:

1. **npm Registry**

   ```bash
   # Check package is live
   npm view @lumina-study/blocks-graph

   # Check specific version
   npm view @lumina-study/blocks-graph@0.1.0
   ```

2. **GitHub Release**
   - Visit https://github.com/luminastudy/blocks-graph/releases
   - Verify release is created
   - Check release notes

3. **Installation Test**

   ```bash
   # In a test directory
   mkdir test-install && cd test-install
   npm init -y
   npm install @lumina-study/blocks-graph

   # Verify it works
   node -e "import('@lumina-study/blocks-graph').then(m => console.log(m))"
   ```

4. **Documentation**
   - Check npm package page: https://www.npmjs.com/package/@lumina-study/blocks-graph
   - Verify README renders correctly
   - Check version badge is updated

## Unpublishing / Deprecating

### Unpublish a version (within 72 hours)

```bash
npm unpublish @lumina-study/blocks-graph@0.1.0
```

**Warning**: Only works within 72 hours of publishing. Use sparingly.

### Deprecate a version

```bash
npm deprecate @lumina-study/blocks-graph@0.1.0 "This version has critical bugs. Upgrade to 0.1.1"
```

## Security

### npm Provenance

The publish workflow uses `--provenance` flag for:

- Cryptographic proof of package origin
- Links package to source code commit
- Verifiable build process
- Enhanced supply chain security

View provenance on npm package page under "Provenance" tab.

### Best Practices

1. **Never commit npm tokens** to git
2. **Use automation tokens** (not personal tokens) in CI/CD
3. **Enable 2FA** on npm account
4. **Rotate tokens regularly** (every 6-12 months)
5. **Review dependencies** for vulnerabilities before publishing
6. **Sign git tags** for additional verification

## Getting Help

- **CI/CD Issues**: Check GitHub Actions logs
- **npm Issues**: Visit https://status.npmjs.org
- **Questions**: Open an issue on GitHub

## Related Documentation

- [Contributing Guide](./CONTRIBUTING.md) (if exists)
- [CHANGELOG.md](./CHANGELOG.md)
- [README.md](./README.md)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [npm Publishing Documentation](https://docs.npmjs.com/cli/v10/commands/npm-publish)
