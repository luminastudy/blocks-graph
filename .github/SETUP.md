# CI/CD Setup Guide

This guide explains how to configure the CI/CD pipeline for automated testing and npm publishing.

## Prerequisites

- Admin access to the GitHub repository
- npm account with publish permissions for `@luminastudy` scope
- npm organization membership (for scoped packages)

## Step-by-Step Setup

### 1. Configure npm Access

#### Create npm Automation Token

1. Log in to [npmjs.com](https://www.npmjs.com)
2. Go to your profile → **Access Tokens**
3. Click **Generate New Token** → **Automation**
4. Name it: `GitHub Actions - blocks-graph`
5. Copy the token (you won't see it again!)

#### Add Token to GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `NPM_TOKEN`
5. Value: Paste the npm automation token
6. Click **Add secret**

### 2. Configure Codecov (Optional)

For code coverage reporting:

1. Visit [codecov.io](https://codecov.io)
2. Sign in with your GitHub account
3. Find your repository in the list
4. Copy the repository upload token
5. Add to GitHub Secrets as `CODECOV_TOKEN`

### 3. Verify Workflows

Check that the workflow files are present:

```bash
.github/workflows/
├── ci.yml          # Runs on all PRs and pushes
├── publish.yml     # Runs on version tags
└── release.yml     # Manual release creation
```

### 4. Test CI Pipeline

1. Create a new branch:

   ```bash
   git checkout -b test-ci
   ```

2. Make a small change (e.g., update README)

3. Push the branch:

   ```bash
   git push origin test-ci
   ```

4. Create a Pull Request

5. Watch the CI workflow run:
   - Go to **Actions** tab in GitHub
   - You should see "CI" workflow running
   - Verify all jobs pass (Quality, Tests, Build, Storybook)

### 5. Test Publishing (Dry Run)

Before publishing for real, test locally:

```bash
# Ensure all checks pass
pnpm typecheck
pnpm lint
pnpm test
pnpm build

# Check what will be published
npm pack --dry-run

# Verify package contents
npm pack
tar -tzf luminastudy-blocks-graph-*.tgz
rm luminastudy-blocks-graph-*.tgz
```

### 6. First Release

When ready to publish your first version:

#### Option A: Using release-it (Recommended)

```bash
# Dry run first
pnpm release -- --dry-run

# Create release
pnpm release
```

This will:

1. Run all quality checks
2. Update version in package.json
3. Create git tag
4. Push to GitHub
5. Trigger automated npm publish

#### Option B: Manual workflow

```bash
# Go to GitHub Actions
# Click "Create Release" workflow
# Click "Run workflow"
# Enter version (e.g., 0.1.0)
# Click "Run workflow"
```

#### Option C: Manual git tag

```bash
# Update package.json version manually to 0.1.0
# Commit the change
git add package.json
git commit -m "chore: bump version to 0.1.0"

# Create and push tag
git tag v0.1.0
git push origin main
git push origin v0.1.0
```

### 7. Verify Publication

After the publish workflow completes:

1. **Check GitHub Actions**
   - Go to **Actions** tab
   - Find "Publish to npm" workflow
   - Verify it completed successfully

2. **Check npm Registry**

   ```bash
   npm view @luminastudy/blocks-graph
   ```

3. **Test Installation**

   ```bash
   mkdir test-install && cd test-install
   npm init -y
   npm install @luminastudy/blocks-graph
   ls node_modules/@luminastudy/blocks-graph
   ```

4. **Check GitHub Release**
   - Go to **Releases** page
   - Verify release was created

## Workflow Details

### CI Workflow (ci.yml)

**Triggers:**

- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

**Jobs:**

1. **Quality Checks** - Spell check, lint, type check
2. **Tests** - Run on Node 18, 20, 22
3. **Build** - Verify library builds successfully
4. **Storybook** - Build Storybook static site

### Publish Workflow (publish.yml)

**Triggers:**

- Push tags matching `v*.*.*` (e.g., v0.1.0, v1.2.3)

**Steps:**

1. Verify tag format
2. Run all quality checks
3. Run all tests
4. Build library
5. Verify package version matches tag
6. Publish to npm with provenance
7. Create GitHub release

**Security:**

- Uses npm provenance for supply chain security
- Requires `NPM_TOKEN` secret
- OIDC token authentication

### Release Workflow (release.yml)

**Triggers:**

- Manual dispatch from GitHub Actions UI

**Purpose:**

- Simplifies version bumping
- Creates proper git tags
- Triggers publish workflow

**Usage:**

1. Go to Actions → Create Release
2. Click "Run workflow"
3. Enter version number (e.g., 0.2.0)
4. Select if it's a pre-release
5. Click "Run workflow"

## Troubleshooting

### Workflow fails with "npm ERR! 403 Forbidden"

**Problem:** Invalid or expired NPM_TOKEN

**Solution:**

1. Create new automation token on npmjs.com
2. Update `NPM_TOKEN` in GitHub secrets
3. Re-run the workflow

### "Version mismatch" error

**Problem:** Git tag doesn't match package.json version

**Solution:**

```bash
# Delete incorrect tag
git tag -d v0.1.0
git push origin :refs/tags/v0.1.0

# Fix package.json version
# Create correct tag
git tag v0.1.0
git push origin v0.1.0
```

### Tests pass locally but fail in CI

**Problem:** Environment differences

**Solution:**

1. Check Node.js version (CI uses 18, 20, 22)
2. Check for hardcoded paths
3. Verify all dependencies are in package.json
4. Check for timing-dependent tests

### Package size too large

**Problem:** npm package includes unnecessary files

**Solution:**

1. Check `.npmignore` is comprehensive
2. Verify `files` field in package.json
3. Run `npm pack --dry-run` to see what's included
4. Add patterns to `.npmignore` as needed

## Security Best Practices

1. **Never commit tokens** to git
2. **Use automation tokens** (not personal tokens)
3. **Enable 2FA** on npm account
4. **Rotate tokens** every 6-12 months
5. **Use branch protection** on main branch
6. **Require status checks** before merging
7. **Review dependency updates** carefully

## Maintenance

### Regular Tasks

- **Monthly**: Review dependency updates
- **Quarterly**: Rotate npm token
- **Per release**: Update CHANGELOG.md
- **After major changes**: Review CI workflow

### Monitoring

- Watch GitHub Actions for failures
- Monitor npm download stats
- Check Codecov for coverage trends
- Review security advisories

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [npm Publishing Guide](https://docs.npmjs.com/cli/v10/commands/npm-publish)
- [npm Provenance](https://docs.npmjs.com/generating-provenance-statements)
- [Codecov Documentation](https://docs.codecov.com/)

## Support

If you encounter issues:

1. Check GitHub Actions logs for details
2. Review this setup guide
3. Check [PUBLISHING.md](../PUBLISHING.md) for publishing help
4. Open an issue on GitHub
