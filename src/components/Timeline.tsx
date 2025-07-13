import { useState } from "react";

import { TimelineEventCard } from "@/components/TimelineEventCard";
import { Button } from "@/components/ui/button";
import { useEventTimelineStore } from "@/lib/store";
import { generateTimelineMarkdown } from "@/lib/string-formatting";

export function Timeline() {
  const timelineEvents = useEventTimelineStore((state) => state.timelineEvents);
  const clearTimeline = useEventTimelineStore((state) => state.clearTimeline);

  const [isCopied, setIsCopied] = useState(false);

  const copyMarkdownToClipboard = async () => {
    const markdown = generateTimelineMarkdown(timelineEvents);
    try {
      await navigator.clipboard.writeText(markdown);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  return (
    <div className="h-full p-4">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-lg font-bold">
          Timeline ({timelineEvents.length} event{timelineEvents.length !== 1 ? "s" : ""})
        </h1>
        {timelineEvents.length > 0 && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={copyMarkdownToClipboard}>
              {isCopied ? "Copied" : "Copy Markdown"}
            </Button>
            <Button variant="outline" size="sm" onClick={clearTimeline}>
              Clear Timeline
            </Button>
          </div>
        )}
      </div>
      <div className="max-w-3xl mx-auto">
        {timelineEvents.length === 0 ? (
          <p className="text-gray-500">No events in timeline yet. Add events from the left panel.</p>
        ) : (
          <div>
            {timelineEvents.map((event, index) => (
              <TimelineEventCard key={event.id} event={event} isLast={index === timelineEvents.length - 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
