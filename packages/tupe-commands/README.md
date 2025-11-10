# @luminastudy/tupe-commands

Enhanced Claude Code commands for deep thinking and task execution.

## Installation

```bash
npm install @luminastudy/tupe-commands
```

## Commands

This package provides the following custom Claude Code commands:

### `/tupe:ultrathink`

Deep thinking mode - continue current task with enhanced analysis. This command activates a state of deep, methodical analysis and continuation, helping Claude to:

- Analyze the current context thoroughly
- Continue with the current task using enhanced reasoning
- Apply deep thinking to problem-solving
- Be proactive in identifying and addressing potential issues

### `/tupe:implement-and-validate`

End-to-end implementation and validation of specification tasks.

### `/tupe:validate-feature`

Comprehensive feature validation with testing and bug analysis.

### `/tupe:lib-opportunities`

Analyze codebase for custom functions that could be replaced with npm packages to minimize custom logic.

### `/tupe:lint`

Fix all ESLint errors systematically using eslint-config-agent, ensuring tests and builds pass after each fix.

### `/tupe:commit-push`

Stage, commit and push only relevant changes from the latest task.

## Usage

After installing, these commands will be available in your Claude Code environment. To use them:

1. Install the package in your project
2. Configure Claude Code to recognize these commands
3. Use them with the `/tupe:` prefix (e.g., `/tupe:ultrathink`)

## License

MIT
