# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Event Timeline is a React + TypeScript web application for managing and analyzing system events during incident response. Users can curate raw event streams, build chronological timelines, annotate events, and export documentation.

**IMPORTANT**: Before starting any task, always read `docs/product_requirements.md` and `docs/implementation_plan.md` to understand the project requirements, technical specifications, and current implementation status.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production (runs TypeScript check + Vite build)
- `npm run lint` - Run ESLint linting
- `npm run format` - Auto-format code with Biome
- `npm run format:check` - Check code formatting with Biome
- `npm run preview` - Preview production build

## Architecture

### State Management
- Uses Zustand store (`src/lib/store.ts`) for global state
- Events loaded from `src/data/events.json` and converted to typed objects with UUIDs
- Timeline state manages selected events with notes annotations
- Store methods: `addToTimeline`, `removeFromTimeline`, `updateTimelineEventNotes`, `clearTimeline`

### Type System
- Core types in `src/lib/types.ts`: `RawEvent`, `Event`, `TimelineEvent`
- Events have `id`, `type`, `short`, `description`, `time`, optional `user`/`metric`
- Timeline events extend base events with optional `notes` field

### UI Structure
- Two-panel layout: Raw events list (left) + Timeline (right)
- Uses shadcn/ui components with Tailwind CSS styling
- `TimelineEventCard` component handles individual timeline event display with inline note editing
- Responsive design targeting 1024-1440px viewports

### Current Implementation Status
Phase 1 complete: Basic event selection, timeline construction, annotation functionality, and Markdown export. Next phases involve drag-and-drop, timeline visualization enhancements, and search/filtering.

## Key Files
- `src/App.tsx` - Main application component with two-panel layout
- `src/lib/store.ts` - Zustand state management
- `src/lib/types.ts` - TypeScript type definitions
- `src/components/TimelineEventCard.tsx` - Timeline event display with note editing
- `src/data/events.json` - Sample event data