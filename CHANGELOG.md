# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- CI/CD pipeline with GitHub Actions
- Automated npm publishing on version tags
- Comprehensive publishing documentation
- Code quality checks in CI (lint, typecheck, spell check)
- Multi-version Node.js testing (18, 20, 22)
- Codecov integration for test coverage
- npm provenance for supply chain security

### Changed
- Updated package.json with publishConfig for public access
- Removed non-existent React wrapper from exports
- Added author, bugs, and homepage fields to package.json

## [0.1.0] - Initial Release

### Added
- Framework-agnostic Web Component for visualizing block graphs
- Support for schema v0.1 with JSON validation
- Bilingual support (Hebrew and English)
- Prerequisite and parent relationship visualization
- Configurable graph orientation (TTB, LTR, RTL, BTT)
- Interactive block selection with 3-state toggle
- Customizable layout (node dimensions, spacing)
- Customizable rendering (colors, fonts, edge styles)
- TypeScript type definitions
- Comprehensive test suite with Vitest
- Storybook for component documentation
- HTML and React example applications
- ESLint configuration with strict rules
- Build pipeline with esbuild
- Spell checking with cspell

### Core Components
- `BlocksGraph` Web Component with Shadow DOM
- `GraphEngine` for graph building and layout
- `GraphRenderer` for SVG rendering
- `HorizontalRelationships` for efficient lookups
- Schema adaptors for version compatibility
- Custom error classes for better error handling

### Features
- Automatic graph layout with level-based positioning
- Orientation-aware edge rendering
- Text wrapping with truncation support
- Empty state and error state handling
- Block click event handling
- Dimming of unrelated blocks during selection
- Root single node optimization
- Sub-block visibility control

[Unreleased]: https://github.com/luminastudy/blocks-graph/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/luminastudy/blocks-graph/releases/tag/v0.1.0
