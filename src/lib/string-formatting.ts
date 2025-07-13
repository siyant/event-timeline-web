import type { TimelineEvent } from "./types";

export function formatEventDateTime(date: Date): string {
  const dateString = date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
  });
  const timeString = date.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return `${dateString}, ${timeString}`;
}

export function generateTimelineMarkdown(timelineEvents: TimelineEvent[]): string {
  return timelineEvents
    .map((event) => {
      const timeString = event.time.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      const notesText = event.notes && event.notes.trim() ? ` — ${event.notes}` : "";
      return `- ${timeString}  ${event.short}${notesText}`;
    })
    .join("\n");
}
