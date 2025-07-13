import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { generateTimelineMarkdown } from "./string-formatting";
import type { TimelineEvent } from "./types";

describe("generateTimelineMarkdown", () => {
  beforeEach(() => {
    vi.stubEnv("TZ", "UTC");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("should return empty string for empty timeline events array", () => {
    const result = generateTimelineMarkdown([]);
    expect(result).toBe("");
  });

  it("should format single timeline event without notes", () => {
    const event: TimelineEvent = {
      id: "test-id-1",
      type: "Deployment",
      short: "Deploy v1.0",
      description: "Deploy version 1.0 to production",
      time: new Date("2024-01-01T10:00:00Z"),
      user: "alice",
      notes: "",
    };

    const result = generateTimelineMarkdown([event]);
    expect(result).toBe("- 10:00:00  Deploy v1.0");
  });

  it("should format single timeline event with notes", () => {
    const event: TimelineEvent = {
      id: "test-id-2",
      type: "LogAnomoly",
      short: "Error rate increase",
      description: "Error rate increased to 5%",
      time: new Date("2024-01-01T09:30:00Z"),
      metric: "error.rate",
      notes: "Critical issue requiring immediate attention",
    };

    const result = generateTimelineMarkdown([event]);
    expect(result).toBe("- 09:30:00  Error rate increase — Critical issue requiring immediate attention");
  });

  it("should format multiple timeline events with different types and notes", () => {
    const events: TimelineEvent[] = [
      {
        id: "test-id-1",
        type: "LogAnomoly",
        short: "Error rate increase",
        description: "Error rate increased to 5%",
        time: new Date("2024-01-01T09:30:00Z"),
        metric: "error.rate",
        notes: "Root cause identified as deployment issue",
      },
      {
        id: "test-id-2",
        type: "Deployment",
        short: "Deploy v1.0",
        description: "Deploy version 1.0 to production",
        time: new Date("2024-01-01T10:00:00Z"),
        user: "alice",
        notes: "",
      },
      {
        id: "test-id-3",
        type: "MetricAnomoly",
        short: "CPU spike",
        description: "CPU usage spiked to 90%",
        time: new Date("2024-01-01T11:00:00Z"),
        metric: "cpu.usage",
        notes: "Possibly related to memory leak in new feature",
      },
    ];

    const expected = [
      "- 09:30:00  Error rate increase — Root cause identified as deployment issue",
      "- 10:00:00  Deploy v1.0",
      "- 11:00:00  CPU spike — Possibly related to memory leak in new feature",
    ].join("\n");

    const result = generateTimelineMarkdown(events);
    expect(result).toBe(expected);
  });

  it("should handle events with whitespace-only notes", () => {
    const event: TimelineEvent = {
      id: "test-id-4",
      type: "Deployment",
      short: "Deploy v2.0",
      description: "Deploy version 2.0 to production",
      time: new Date("2024-01-01T12:00:00Z"),
      user: "bob",
      notes: "   \t\n   ",
    };

    const result = generateTimelineMarkdown([event]);
    expect(result).toBe("- 12:00:00  Deploy v2.0");
  });

  it("should handle events with undefined notes", () => {
    const event: TimelineEvent = {
      id: "test-id-5",
      type: "MetricAnomoly",
      short: "Memory usage high",
      description: "Memory usage reached 95%",
      time: new Date("2024-01-01T13:00:00Z"),
      metric: "memory.usage",
    };

    const result = generateTimelineMarkdown([event]);
    expect(result).toBe("- 13:00:00  Memory usage high");
  });
});
