import { beforeEach, describe, expect, it, vi } from "vitest";

import { useEventTimelineStore } from "./store";

// Mock the events.json import before importing store
vi.mock("@/data/events.json", () => ({
  default: [
    {
      type: "LogAnomoly",
      short: "Error rate increase",
      description: "Error rate increased to 5%",
      time: "2024-01-01T09:30:00Z",
      metric: "error.rate",
    },
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
      expect(store.events).toHaveLength(3);
      expect(store.events[0].short).toBe("Error rate increase");
      expect(store.events[1].short).toBe("Deploy v1.0");
      expect(store.events[2].short).toBe("CPU spike");
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
      // Mock events are now chronologically ordered: event1 (09:30), event2 (10:00), event3 (11:00)
      const event1 = store.events[0]; // 09:30 Error rate
      const event2 = store.events[1]; // 10:00 Deploy
      const event3 = store.events[2]; // 11:00 CPU spike

      // Add events out of chronological order to test sorting
      store.addToTimeline(event3); // 11:00 (latest)
      store.addToTimeline(event1); // 09:30 (earliest)
      store.addToTimeline(event2); // 10:00 (middle)

      const updatedStore = useEventTimelineStore.getState();
      expect(updatedStore.timelineEvents).toHaveLength(3);

      // Should be in chronological order: event1 (09:30), event2 (10:00), event3 (11:00)
      expect(updatedStore.timelineEvents[0].id).toBe(event1.id);
      expect(updatedStore.timelineEvents[1].id).toBe(event2.id);
      expect(updatedStore.timelineEvents[2].id).toBe(event3.id);

      // Verify timestamps are in ascending order
      expect(updatedStore.timelineEvents[0].time.getTime()).toBeLessThan(updatedStore.timelineEvents[1].time.getTime());
      expect(updatedStore.timelineEvents[1].time.getTime()).toBeLessThan(updatedStore.timelineEvents[2].time.getTime());
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

  describe("updateTimelineEventNotes", () => {
    it("should update notes for an existing timeline event", () => {
      // Add an event to timeline
      const event = store.events[0];
      store.addToTimeline(event);

      // Update notes
      const newNotes = "This deployment caused issues";
      store.updateTimelineEventNotes(event.id, newNotes);

      const updatedStore = useEventTimelineStore.getState();
      expect(updatedStore.timelineEvents).toHaveLength(1);
      expect(updatedStore.timelineEvents[0].notes).toBe(newNotes);
    });

    it("should not affect other timeline events when updating notes", () => {
      // Add three events to timeline
      const event1 = store.events[0]; // 09:30 Error rate
      const event2 = store.events[1]; // 10:00 Deploy
      const event3 = store.events[2]; // 11:00 CPU spike
      store.addToTimeline(event1);
      store.addToTimeline(event2);
      store.addToTimeline(event3);

      // Update notes for middle event (chronologically - the deployment)
      const newNotes = "Updated notes for deployment";
      store.updateTimelineEventNotes(event2.id, newNotes);

      const updatedStore = useEventTimelineStore.getState();
      expect(updatedStore.timelineEvents).toHaveLength(3);

      // Find events in the chronologically sorted timeline
      const errorEvent = updatedStore.timelineEvents.find((e) => e.id === event1.id);
      const deploymentEvent = updatedStore.timelineEvents.find((e) => e.id === event2.id);
      const cpuEvent = updatedStore.timelineEvents.find((e) => e.id === event3.id);

      expect(errorEvent?.notes).toBe("");
      expect(deploymentEvent?.notes).toBe(newNotes);
      expect(cpuEvent?.notes).toBe("");
    });

    it("should handle updating notes for non-existent event", () => {
      // Add an event to timeline
      const event = store.events[0];
      store.addToTimeline(event);

      // Try to update notes for non-existent event
      store.updateTimelineEventNotes("non-existent-id", "Some notes");

      // Should not affect existing events
      const updatedStore = useEventTimelineStore.getState();
      expect(updatedStore.timelineEvents).toHaveLength(1);
      expect(updatedStore.timelineEvents[0].notes).toBe("");
    });
  });

  describe("clearTimeline", () => {
    it("should clear all timeline events", () => {
      // Add events to timeline
      const event1 = store.events[0];
      const event2 = store.events[1];
      store.addToTimeline(event1);
      store.addToTimeline(event2);

      // Verify events were added
      expect(useEventTimelineStore.getState().timelineEvents).toHaveLength(2);

      // Clear timeline
      store.clearTimeline();

      // Verify timeline is empty
      expect(useEventTimelineStore.getState().timelineEvents).toEqual([]);
    });

    it("should not affect events array when clearing timeline", () => {
      // Add events to timeline
      const event1 = store.events[0];
      store.addToTimeline(event1);

      // Store original events array length
      const originalEventsLength = store.events.length;

      // Clear timeline
      store.clearTimeline();

      // Verify events array is unchanged
      const updatedStore = useEventTimelineStore.getState();
      expect(updatedStore.events).toHaveLength(originalEventsLength);
      expect(updatedStore.events[0].id).toBe(event1.id);
    });
  });
});
