# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A standalone CMS editor built with React, TypeScript, Redux Toolkit, and Vite. Features visual component editing with drag-and-drop for building responsive web pages.

## Development Commands

```bash
# Install dependencies
yarn install

# Start development server (runs on port 3001)
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview

# Type checking
yarn type-check

# Linting
yarn lint
yarn lint:fix

# Code formatting
yarn format
yarn format:check
```

## Tech Stack

- **React 17** + **TypeScript** - UI framework with type safety
- **Vite** - Fast build tool
- **Redux Toolkit** - State management with Immer
- **Styled Components** - CSS-in-JS
- **@dnd-kit** - Drag-and-drop
- **@cyberbiz-corp/pitaya-ui** - UI component library

## Architecture

### State Management
- Store: `src/store/index.ts`
- Slice: `src/store/cmsEditorSlice.ts` - Component tree, selection, viewport state
- Selectors: `src/store/selectors.ts`

### Component System
- Components: `src/components/components/`
- Factory: `ComponentFactory` pattern for registration/instantiation
- Types: text, button, input, image, video, checkbox, select, link, container

### Path Aliases
Use `@src/*` for imports (configured in `tsconfig.json` and `vite.config.ts`)

## Git Configuration

- **Main branch**: `main`
- **Commit conventions**: Follow Conventional Commits format (feat:, fix:, docs:, refactor:, etc.)