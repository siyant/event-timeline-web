import { beforeEach, describe, expect, it, vi } from "vitest";

import { useEventTimelineStore } from "./store";

// Mock the events.json import before importing store
vi.mock("@/data/events.json", () => ({
  default: [
    {
      type: "Deployment",
      short: "Deploy v1.0",
      description: "Deploy version 1.0 to production",
      time: "2024-01-01T10:00:00Z",
      user: "alice",
    },
    {
      type: "MetricAnomoly",
      short: "CPU spike",
      description: "CPU usage spiked to 90%",
      time: "2024-01-01T11:00:00Z",
      metric: "cpu.usage",
    },
  ],
}));

describe("Event Timeline Store", () => {
  let store: ReturnType<typeof useEventTimelineStore.getState>;

  beforeEach(() => {
    // Reset store to initial state before each test
    useEventTimelineStore.setState({
      events: useEventTimelineStore.getState().events,
      timelineEvents: [],
      addToTimeline: useEventTimelineStore.getState().addToTimeline,
      removeFromTimeline: useEventTimelineStore.getState().removeFromTimeline,
      updateTimelineEventNotes: useEventTimelineStore.getState().updateTimelineEventNotes,
      clearTimeline: useEventTimelineStore.getState().clearTimeline,
    });
    store = useEventTimelineStore.getState();
  });

  describe("Initial State", () => {
    it("should initialize with events from JSON data", () => {
      expect(store.events).toHaveLength(2);
      expect(store.events[0].short).toBe("Deploy v1.0");
      expect(store.events[1].short).toBe("CPU spike");
    });

    it("should initialize with empty timeline", () => {
      expect(store.timelineEvents).toEqual([]);
    });

    it("should convert event times to Date objects and assign UUIDs", () => {
      expect(store.events[0].time).toBeInstanceOf(Date);
      expect(store.events[0].id).toBeDefined();
      expect(typeof store.events[0].id).toBe("string");
      expect(store.events[0].id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    });
  });

  describe("addToTimeline", () => {
    it("should add an event to the timeline", () => {
      const event = store.events[0];
      store.addToTimeline(event);

      const updatedStore = useEventTimelineStore.getState();
      expect(updatedStore.timelineEvents).toHaveLength(1);
      expect(updatedStore.timelineEvents[0].id).toBe(event.id);
      expect(updatedStore.timelineEvents[0].notes).toBe("");
    });

    it("should maintain chronological order when adding events", () => {
      // Add the later event first (event2 has time 11:00, event1 has time 10:00)
      const event1 = store.events[0]; // 10:00
      const event2 = store.events[1]; // 11:00

      // Add later event first
      store.addToTimeline(event2);
      store.addToTimeline(event1);

      const updatedStore = useEventTimelineStore.getState();
      expect(updatedStore.timelineEvents).toHaveLength(2);

      // Should be in chronological order: event1 (10:00) then event2 (11:00)
      expect(updatedStore.timelineEvents[0].id).toBe(event1.id);
      expect(updatedStore.timelineEvents[1].id).toBe(event2.id);
      expect(updatedStore.timelineEvents[0].time.getTime()).toBeLessThan(updatedStore.timelineEvents[1].time.getTime());
    });
  });

  describe("removeFromTimeline", () => {
    it("should remove a specific event from timeline", () => {
      // Add two events to timeline
      const event1 = store.events[0];
      const event2 = store.events[1];
      store.addToTimeline(event1);
      store.addToTimeline(event2);

      // Verify both were added
      expect(useEventTimelineStore.getState().timelineEvents).toHaveLength(2);

      // Remove the first event
      store.removeFromTimeline(event1.id);

      // Verify only the second event remains
      const updatedStore = useEventTimelineStore.getState();
      expect(updatedStore.timelineEvents).toHaveLength(1);
      expect(updatedStore.timelineEvents[0].id).toBe(event2.id);
    });
  });
});
