# Loki Visual Testing Reference Images

This directory contains reference images for visual regression testing.

## Directory Structure

```
.loki/
├── reference/          # Reference images (committed to git)
├── current/            # Current test screenshots (gitignored)
└── difference/         # Visual diffs (gitignored)
```

## Reference Images

The `reference/` directory contains baseline screenshots that Loki compares against during testing. These images should be committed to version control.

### When to Update References

Update reference images when:

- Intentional UI changes are made
- Component styling is modified
- Layout changes are implemented
- New stories are added

### How to Update

```bash
# Review current differences
pnpm test:visual

# Update all references
pnpm test:visual:update

# Commit updated references
git add .loki/reference/
git commit -m "chore: update visual test references"
```

## File Naming Convention

Reference images follow the pattern:

```
{storyName}_{configuration}.png
```

Example:

```
blocks-graph-default_chrome-laptop.png
```

## Important Notes

- **Always commit** reference images to git
- **Review carefully** before updating references
- **Test locally** before pushing reference updates
- **Include screenshots** in PR descriptions when updating references

For detailed documentation, see [VISUAL-TESTING.md](../VISUAL-TESTING.md).
