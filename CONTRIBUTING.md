# Contributing to @luminastudy/blocks-graph

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Getting Started

1. **Fork the repository** and clone it locally
2. **Install dependencies**: `pnpm install`
3. **Create a branch** for your changes: `git checkout -b feature/your-feature-name`

## Development Workflow

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 10.21.0

### Setup

```bash
# Install dependencies
pnpm install

# Build the project
pnpm build

# Run tests
pnpm test

# Run tests in watch mode with UI
pnpm test:ui
```

### Development Commands

- `pnpm build` - Build the library (types + bundle)
- `pnpm build:types` - Generate TypeScript declarations
- `pnpm build:bundle` - Create production bundle
- `pnpm serve` - Serve examples locally
- `pnpm test` - Run tests
- `pnpm test:ui` - Run tests with UI
- `pnpm test:coverage` - Run tests with coverage
- `pnpm lint` - Check code quality
- `pnpm lint:fix` - Fix linting issues
- `pnpm format` - Format code
- `pnpm format:check` - Check formatting
- `pnpm spell` - Check spelling
- `pnpm typecheck` - Type check without building
- `pnpm storybook` - Start Storybook dev server
- `pnpm build-storybook` - Build Storybook for production

## Making Changes

### Code Style

This project uses:

- **TypeScript** with strict mode
- **ESLint** with `eslint-config-agent` for linting
- **Prettier** for code formatting
- **cspell** for spell checking

The codebase follows these conventions:

- ES modules (use `.js` extensions in imports)
- Strict TypeScript types
- Descriptive variable and function names
- Comprehensive JSDoc comments for public APIs
- Web Components standards (custom elements, shadow DOM)

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer]
```

**Types**:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD changes
- `build`: Build system changes

**Examples**:

```
feat(graph): add pan and zoom interaction
fix(viewport): handle edge case in coordinate transformation
docs(readme): update installation instructions
test(renderer): add tests for edge rendering
```

### Testing

- Write tests for all new features and bug fixes
- Ensure all tests pass: `pnpm test`
- Maintain or improve code coverage
- Tests should be in `.spec.ts` files next to their corresponding logic files
- Use descriptive test names that explain what is being tested

Example test structure:

```typescript
import { describe, it, expect } from 'vitest'
import { yourFunction } from './your-module.js'

describe('yourFunction', () => {
  it('should handle normal case', () => {
    expect(yourFunction('input')).toBe('expected')
  })

  it('should handle edge case', () => {
    expect(yourFunction(null)).toBe(null)
  })
})
```

### Git Hooks

This project uses Husky for git hooks:

- **Pre-commit**: Runs lint-staged (lints, formats, and spell-checks staged files)
- **Commit-msg**: Validates commit message format using commitlint (enforces conventional commits)
- **Pre-push**: Runs full validation (lint, format, spell check, tests)

These hooks ensure code quality and consistent commit messages before commits and pushes.

**Important**: Commit messages must follow the conventional commits format or they will be rejected. See the "Commit Messages" section above for details.

**Example validation**:

```bash
# ✅ Valid commits:
git commit -m "feat(graph): add node selection"
git commit -m "fix(rendering): correct SVG viewBox calculation"
git commit -m "docs(api): document BlocksGraph component"

# ❌ Invalid commits:
git commit -m "Add feature"  # Missing type/scope
git commit -m "FEAT: something"  # Wrong format
git commit -m "random stuff"  # No conventional format
```

## Submitting Changes

### Pull Request Process

1. **Update your fork** with the latest changes from main:

   ```bash
   git checkout main
   git pull upstream main
   ```

2. **Rebase your branch** (if needed):

   ```bash
   git checkout your-branch
   git rebase main
   ```

3. **Run all checks locally**:

   ```bash
   pnpm lint
   pnpm format:check
   pnpm spell
   pnpm test
   pnpm build
   ```

4. **Push your changes**:

   ```bash
   git push origin your-branch
   ```

5. **Open a Pull Request** on GitHub with:
   - Clear title describing the change
   - Description of what changed and why
   - Reference to any related issues
   - Screenshots or recordings (for visual changes)

### Pull Request Guidelines

- Keep PRs focused on a single feature or fix
- Write clear, descriptive PR titles and descriptions
- Link related issues using "Fixes #123" or "Closes #123"
- Ensure CI passes (tests, linting, formatting)
- Respond to review feedback promptly
- Keep commits clean and well-organized
- Update documentation if you're changing behavior

## Reporting Issues

### Bug Reports

When reporting bugs, please include:

- **Description**: Clear description of the bug
- **Steps to reproduce**: Detailed steps to reproduce the issue
- **Expected behavior**: What you expected to happen
- **Actual behavior**: What actually happened
- **Environment**: Browser, Node.js version, OS, package version
- **Error messages**: Full error messages or stack traces
- **Code samples**: Minimal reproduction if possible

### Feature Requests

When requesting features, please include:

- **Use case**: Why is this feature needed?
- **Proposed solution**: How should it work?
- **Alternatives**: What alternatives have you considered?
- **Examples**: Examples of similar features elsewhere

## Project Structure

```
blocks-graph/
├── src/                    # Source code
│   ├── components/        # Web Components
│   ├── viewport/          # Viewport and interaction logic
│   ├── wrappers/          # Framework wrappers (React, etc.)
│   └── index.ts           # Main entry point
├── examples/              # Example applications
│   ├── html/             # Pure HTML example
│   └── react/            # React example
├── dist/                  # Build output
├── .storybook/           # Storybook configuration
└── tests/                # Test files
```

## Questions?

- Check existing issues and discussions
- Read the documentation in README.md
- Open a new issue with the "question" label

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and beginners
- Focus on constructive feedback
- Assume good intentions

## License

By contributing, you agree that your contributions will be licensed under the MIT License (see LICENSE file).

---

Thank you for contributing! 🎉
