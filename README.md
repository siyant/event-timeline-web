# Event Timeline Web

A lightweight UI that lets engineers view and search a log of raw events, drag relevant ones to the timeline, and annotate timeline events with notes.

## Getting started

```bash
# Clone the repository
git clone https://github.com/siyant/event-timeline-web
cd event-timeline-web

# Install dependencies
npm install

# Build and run the app
npm start  # app will run at http://localhost:4173

# Or, start the development server
npm run dev  # app will run at http://localhost:5173
```

## Tech stack

- React with TypeScript
- Vite for dev server and bundling
- Tailwindcss for styling
- Shadcn/ui components
- Vitest for running unit tests
- Zustand for state management
- dnd-kit for drag-and-drop functionality
- biome for automatic code formatting

## Core features

- Display event stream with search and filter
- Drag and drop events from event stream into timeline
- Timeline view of events with vertical timeline visuals
- Annotate timeline events with notes
- Timeline is persisted to localstorage
- Copy timeline events as a markdown list

## Architecture

The entry point of the app is at `App.tsx`, which contains the layout for the 2 main sections- `RawEvents` and `Timeline`.

**State management**

The core app state is stored in `lib/store.ts`, using `zustand` to store the state and persist it to localstorage. The store handles initial loading of events from `data/events.json`, adding converting dates to Date objects and adding a uuid to each event as an id that we use in the rest of the app.

The store primarily stores a list of all Event objects, as well as a list of selected TimelineEvent objects (which extend Event and add a notes field).

**Testing**

The core logic of the app is in the store, which is well-covered with unit tests at `lib/store.test.ts`. Helper functions for generating timeline markdown are also tested with unit tests at `lib/string-formatting.test.ts`.

## Process

I used claude code but supervised it very closely, getting it to work on 1 or 2 tasks at a time. I got it to summarize the requirements and worked with it to come up with a general implementation plan, both recorded in the `docs` folder.

I managed to get the initial MVP functionality (display events, add to/remove from timeline, add notes, copy markdown) pretty quickly. Then proceeded to work on unit tests for the store, and UI improvements. Unfortunately, I spent a bit too long on some parts of the UI (eg. search and filter for the raw events, improving the display of the event cards, timeline), and did not prioritize the drag and drop and dynamic time gap visualization. I managed to implement drag and drop with dnd-kit library, but it has some problems, more elaboration below.

## Improvements if I had more time

- Drag and drop functionality is buggy- while dragging, the card goes below the other parts of the UI (to try out using [Drag Overlay](https://docs.dndkit.com/api-documentation/draggable/drag-overlay) to fix it). The dragging also made the "Add" button not work anymore.
- Timeline- did not have time to implement the visual representation of gaps between events. To do this, I would also need to make the events display more compactly in the timeline, and expand/hover to show more details (like user and metric). I was thinking that a simple implementation would be in `Timeline.tsx`, I can calculate the time gaps between each event, and have some kind of helper function to calculate how much additional padding to have between the events. eg.
  - within 1min -> no additional padding
  - 1-10min -> 20px padding
  - 10min-1h -> (20px + gap/2) so 10min would be 25px and 1h would be 50px
  - etc for larger time gaps
- Keyboard navigation and shortcuts (eg. saving notes with cmd+enter)
- Validating the input data (events data) and handling errors (eg. invalid date, missing fields)
