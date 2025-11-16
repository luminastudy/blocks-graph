# Requirements Document

## Introduction

The @luminastudy/blocks-graph library is a framework-agnostic Web Component for visualizing Lumina Study block schemas. While the README provides code snippets demonstrating usage in various frameworks, there is a need for runnable, executable examples that developers can immediately run and interact with to understand how to integrate the library into their projects.

This feature will create an `examples/` directory containing fully functional, standalone applications demonstrating the library's usage in both React and pure HTML contexts. These examples will serve as both learning resources for new users and validation that the library works correctly in different environments.

**Business Value:**

- Reduces onboarding time for new developers by providing working reference implementations
- Validates library compatibility across different integration patterns
- Serves as living documentation that stays in sync with the library's API
- Improves developer experience and adoption of the library

## Requirements

### Requirement 1: Example Directory Structure

**Objective:** As a library maintainer, I want a well-organized examples directory structure, so that developers can easily navigate and understand different integration patterns.

#### Acceptance Criteria

1. WHEN the examples directory is created THEN the Examples System SHALL create a root `examples/` folder at the project root level
2. WHEN organizing example projects THEN the Examples System SHALL create separate subdirectories for each framework integration (`examples/react/` and `examples/html/`)
3. IF an example requires multiple files THEN the Examples System SHALL organize all related files within the example's subdirectory
4. WHEN documenting examples THEN the Examples System SHALL include a root-level `examples/README.md` file that provides an overview and instructions for all examples

### Requirement 2: Pure HTML Example

**Objective:** As a developer using vanilla JavaScript, I want a runnable pure HTML example, so that I can understand how to integrate the Web Component without any framework dependencies.

#### Acceptance Criteria

1. WHEN creating the HTML example THEN the Examples System SHALL create a standalone HTML file (`examples/html/index.html`) that can be opened directly in a browser
2. WHEN the HTML example loads THEN the Example Application SHALL import the @luminastudy/blocks-graph library as an ES module
3. WHEN demonstrating basic functionality THEN the Example Application SHALL include a `<blocks-graph>` element with configured attributes (language, show-prerequisites, show-parents)
4. WHEN providing sample data THEN the Example Application SHALL load blocks data using the `loadFromJson()` method with valid v0.1 schema-compliant JSON
5. WHEN demonstrating the component THEN the Example Application SHALL display at least 3-5 interconnected blocks showing prerequisite and parent relationships
6. IF the example requires a development server THEN the Examples System SHALL include instructions for running a local server (e.g., using `pnpm serve` or `npx http-server`)
7. WHEN documenting the HTML example THEN the Examples System SHALL include inline comments explaining key integration points and API usage

### Requirement 3: React Example

**Objective:** As a React developer, I want a runnable React example application, so that I can understand how to integrate the Web Component within a React project following React best practices.

#### Acceptance Criteria

1. WHEN creating the React example THEN the Examples System SHALL create a complete React application in `examples/react/` with all necessary configuration files (package.json, tsconfig.json, vite.config.ts)
2. WHEN configuring the React example THEN the Examples System SHALL use Vite as the build tool for fast development experience
3. WHEN the React example initializes THEN the Example Application SHALL import the @luminastudy/blocks-graph library and register the Web Component
4. WHEN demonstrating React integration THEN the Example Application SHALL use a ref to access the Web Component instance for imperative API calls
5. WHEN loading data in React THEN the Example Application SHALL call the `loadFromJson()` or `loadFromUrl()` method within a useEffect hook
6. WHEN providing sample data THEN the Example Application SHALL display at least 3-5 interconnected blocks showing prerequisite and parent relationships
7. WHEN demonstrating component attributes THEN the Example Application SHALL pass HTML attributes to the `<blocks-graph>` element (language, show-prerequisites, show-parents)
8. IF TypeScript is used THEN the Examples System SHALL include proper type definitions for the Web Component element reference
9. WHEN documenting the React example THEN the Examples System SHALL include a README.md file with setup instructions, available scripts, and usage notes

### Requirement 4: Sample Data

**Objective:** As a developer exploring the examples, I want realistic and meaningful sample data, so that I can understand how the component handles real-world scenarios.

#### Acceptance Criteria

1. WHEN providing sample block data THEN the Examples System SHALL use blocks data that complies with the v0.1 schema specification (valid UUIDs, bilingual titles, prerequisites, parents)
2. WHEN designing sample data THEN the Examples System SHALL include at least one block with no prerequisites (root block)
3. WHEN designing sample data THEN the Examples System SHALL include at least one block with prerequisites to demonstrate relationship visualization
4. WHEN designing sample data THEN the Examples System SHALL include at least one block with parent relationships to demonstrate hierarchy
5. WHEN creating bilingual content THEN the Examples System SHALL provide both Hebrew (`he_text`) and English (`en_text`) titles for all blocks
6. IF examples share data THEN the Examples System SHALL reuse the same sample dataset across both HTML and React examples for consistency
7. WHEN organizing sample data THEN the Examples System SHALL consider creating a shared `examples/data/` directory for reusable JSON files

### Requirement 5: Runnable Configuration

**Objective:** As a developer, I want examples that I can immediately run without complex setup, so that I can quickly test and understand the library.

#### Acceptance Criteria

1. WHEN setting up the React example THEN the Examples System SHALL include npm/pnpm scripts for running the development server (`dev` or `start`)
2. WHEN the React example is executed THEN the Example Application SHALL start a local development server (typically on port 5173 or similar)
3. WHEN setting up the HTML example THEN the Examples System SHALL provide instructions for serving the static files via HTTP server
4. IF the HTML example uses ES modules THEN the Examples System SHALL ensure proper MIME type handling by requiring a local server
5. WHEN documenting execution THEN the Examples System SHALL include clear step-by-step instructions in each example's README for installing dependencies and running the example
6. WHEN installing dependencies THEN the React Example SHALL install the @luminastudy/blocks-graph package from the parent directory or npm registry

### Requirement 6: Documentation and Developer Experience

**Objective:** As a new user of the library, I want clear documentation accompanying the examples, so that I can understand what each example demonstrates and how to customize it.

#### Acceptance Criteria

1. WHEN creating the examples directory THEN the Examples System SHALL include a root `examples/README.md` with an overview of all available examples
2. WHEN documenting each example THEN the Examples System SHALL provide a README.md file explaining the example's purpose, setup steps, and key features demonstrated
3. WHEN writing code THEN the Examples System SHALL include inline comments explaining important integration points and API usage patterns
4. WHEN documenting prerequisites THEN the Examples System SHALL list required tools and versions (Node.js, pnpm, browsers)
5. WHEN helping developers customize examples THEN the Examples System SHALL include comments indicating where developers can modify configuration (attributes, data sources, styling)
6. IF common issues may occur THEN the Examples System SHALL include troubleshooting sections in README files addressing CORS issues, module loading, and server requirements

### Requirement 7: Example Maintainability

**Objective:** As a library maintainer, I want examples that stay synchronized with the library's API, so that they remain accurate and useful as the library evolves.

#### Acceptance Criteria

1. WHEN managing dependencies THEN the Examples System SHALL reference the @luminastudy/blocks-graph library using a workspace reference or local path to ensure examples use the current version
2. WHEN the library API changes THEN the Examples SHALL be updated to reflect the new API patterns
3. WHEN building the library THEN the Examples System SHALL ensure examples can access the built library artifacts from `dist/`
4. IF the library introduces new features THEN the Examples System SHALL consider adding demonstrations of new capabilities to existing or new examples
5. WHEN validating examples THEN the Examples System SHALL ensure all examples run successfully after library builds
