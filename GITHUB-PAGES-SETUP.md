# GitHub Pages Setup Guide

This guide explains how to enable and use the GitHub Pages deployment for the @lumina-study/blocks-graph examples.

## Overview

The project includes an automated GitHub Actions workflow that deploys interactive examples to GitHub Pages, showcasing both HTML and React integration patterns.

## Deployed Structure

Once deployed, the examples are available at:

```
https://luminastudy.github.io/blocks-graph/
├── index.html              # Landing page with navigation
├── html/                   # Pure HTML example
└── react/                  # React example (built with Vite)
```

## Enabling GitHub Pages

### Step 1: Repository Settings

1. Go to your repository on GitHub
2. Click on **Settings** (top menu)
3. Navigate to **Pages** (left sidebar under "Code and automation")

### Step 2: Configure Source

1. Under **Build and deployment** → **Source**:
   - Select **GitHub Actions**

   ![GitHub Pages Source](https://docs.github.com/assets/cb-47267/images/help/pages/publishing-source-drop-down.png)

2. That's it! The workflow is already configured.

### Step 3: Trigger Deployment

The deployment will automatically trigger on:

- **Push to main branch** when changes are made to:
  - `examples/` directory
  - `src/` directory (library code)
  - `.github/workflows/deploy-examples.yml` workflow file

You can also **manually trigger** deployment:

1. Go to **Actions** tab in your repository
2. Select **Deploy Examples to GitHub Pages** workflow
3. Click **Run workflow** → Select `main` branch → Click **Run workflow**

### Step 4: Access Your Examples

After successful deployment (takes ~2-3 minutes):

1. Go to repository **Settings** → **Pages**
2. Your site URL will be displayed at the top (e.g., `https://luminastudy.github.io/blocks-graph/`)
3. Click the URL to view your deployed examples

## Workflow Details

### What the Workflow Does

The `.github/workflows/deploy-examples.yml` workflow performs these steps:

1. **Build Library**

   ```bash
   pnpm install --frozen-lockfile
   pnpm build
   ```

2. **Build React Example**

   ```bash
   cd examples/react
   pnpm install --frozen-lockfile
   VITE_BASE_PATH=/blocks-graph/react/ pnpm build
   ```

3. **Prepare Deployment**
   - Copies landing page (`examples/index.html`)
   - Copies library build to `dist/` (for HTML example imports)
   - Copies HTML example to `html/`
   - Copies built React example to `react/`

4. **Deploy to GitHub Pages**
   - Uses official `actions/deploy-pages@v4` action
   - Deploys to `github-pages` environment

### Deployment Triggers

**Automatic deployment on push to `main`:**

- Only when `examples/`, `src/`, or workflow file changes
- Prevents unnecessary deployments

**Manual deployment:**

- Via GitHub Actions UI
- Useful for redeployment without code changes

## Development Workflow

### Local Development

Both examples work normally in local development:

**HTML Example:**

```bash
pnpm build          # Build library
pnpm serve          # Serve examples locally
# Open http://localhost:8080/examples/html/
```

**React Example:**

```bash
cd examples/react
pnpm dev            # Start dev server
# Open http://localhost:5173/
```

### Testing GitHub Pages Configuration

To test the React example with the GitHub Pages base path locally:

```bash
cd examples/react
VITE_BASE_PATH=/blocks-graph/react/ pnpm build
pnpm preview
```

## Troubleshooting

### Deployment Failed

1. Check the **Actions** tab for error details
2. Ensure GitHub Pages is enabled in repository settings
3. Verify workflow file syntax is correct

### Pages Not Updating

1. Clear browser cache
2. Check deployment status in **Actions** tab
3. Verify the correct branch is selected in Pages settings
4. Wait 1-2 minutes for CDN propagation

### 404 Errors on Deployed Site

1. **Landing page 404**: Verify `examples/index.html` exists
2. **React example 404**: Check that `VITE_BASE_PATH` is set correctly in workflow
3. **HTML example 404**: Ensure files are copied to `_deploy/html/` in workflow

### React Example Assets Not Loading

If the React example loads but assets (CSS, JS) fail:

1. Verify `VITE_BASE_PATH` environment variable in workflow
2. Check that Vite config reads `process.env.VITE_BASE_PATH`
3. Inspect browser console for asset path errors

## Monitoring Deployments

### Check Deployment Status

1. Go to **Actions** tab
2. Look for "Deploy Examples to GitHub Pages" workflow runs
3. Green checkmark = successful deployment
4. Red X = failed deployment (click for details)

### View Deployment History

1. Go to **Settings** → **Pages**
2. Click **View deployments** to see history
3. Each deployment shows:
   - Commit SHA
   - Deployment time
   - Status

## Permissions

The workflow requires these permissions (already configured):

```yaml
permissions:
  contents: read # Read repository content
  pages: write # Deploy to Pages
  id-token: write # OIDC token for deployment
```

## Custom Domain (Optional)

To use a custom domain:

1. Go to **Settings** → **Pages**
2. Under **Custom domain**, enter your domain
3. Configure DNS records as instructed by GitHub
4. Enable **Enforce HTTPS**

See [GitHub Pages custom domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site) for details.

## Disabling Deployments

To temporarily disable automatic deployments:

1. **Option 1**: Delete or rename `.github/workflows/deploy-examples.yml`
2. **Option 2**: Add this to the workflow file under `on:`:
   ```yaml
   push:
     branches:
       - disabled # Change from 'main'
   ```

## Best Practices

1. **Test Locally First**: Always test examples locally before pushing
2. **Review Actions**: Check workflow runs to catch issues early
3. **Cache Busting**: Clear cache when testing changes
4. **Monitor Usage**: GitHub Pages has usage limits (check repository settings)

## Links

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vite Base Path Configuration](https://vitejs.dev/config/shared-options.html#base)

## Support

If you encounter issues:

1. Check this documentation
2. Review workflow logs in **Actions** tab
3. Open an issue on GitHub with:
   - Error message
   - Workflow run link
   - Steps to reproduce

---

**Quick Start**: Enable GitHub Pages in repository settings, push to main, and your examples will deploy automatically! 🚀
