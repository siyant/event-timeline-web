import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";

import eventsData from "@/data/events.json";
import type { Event, RawEvent, TimelineEvent } from "@/lib/types";

const convertRawEventsToEvents = (rawEvents: RawEvent[]): Event[] => {
  return rawEvents.map((rawEvent) => ({
    ...rawEvent,
    id: uuidv4(),
    time: new Date(rawEvent.time),
  }));
};

interface EventTimelineState {
  events: Event[];
  timelineEvents: TimelineEvent[];
  addToTimeline: (event: Event) => void;
  removeFromTimeline: (eventId: string) => void;
  updateTimelineEventNotes: (eventId: string, notes: string) => void;
  clearTimeline: () => void;
}

export const useEventTimelineStore = create<EventTimelineState>()((set) => ({
  events: convertRawEventsToEvents(eventsData as RawEvent[]),
  timelineEvents: [],

  addToTimeline: (event: Event) =>
    set((state) => {
      const timelineEvent: TimelineEvent = {
        ...event,
        notes: "",
      };

      const updatedTimeline = [...state.timelineEvents, timelineEvent].sort(
        (a, b) => a.time.getTime() - b.time.getTime(),
      );

      return { timelineEvents: updatedTimeline };
    }),

  removeFromTimeline: (eventId: string) =>
    set((state) => ({
      timelineEvents: state.timelineEvents.filter((event) => event.id !== eventId),
    })),

  updateTimelineEventNotes: (eventId, notes) =>
    set((state) => ({
      timelineEvents: state.timelineEvents.map((event) => (event.id === eventId ? { ...event, notes } : event)),
    })),

  clearTimeline: () => set({ timelineEvents: [] }),
}));
