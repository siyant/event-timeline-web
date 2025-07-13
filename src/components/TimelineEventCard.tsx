import { useState } from "react";

import { EventTypeTag } from "@/components/EventTypeTag";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatEventDateTime } from "@/lib/string-formatting";
import { useEventTimelineStore } from "@/lib/store";
import type { TimelineEvent } from "@/lib/types";

interface TimelineEventCardProps {
  event: TimelineEvent;
  isLast?: boolean;
}

export function TimelineEventCard({ event, isLast = false }: TimelineEventCardProps) {
  const removeFromTimeline = useEventTimelineStore((state) => state.removeFromTimeline);
  const updateTimelineEventNotes = useEventTimelineStore((state) => state.updateTimelineEventNotes);

  const [isEditing, setIsEditing] = useState(false);
  const [tempNotes, setTempNotes] = useState("");

  const handleEditNotes = () => {
    setIsEditing(true);
    setTempNotes(event.notes || "");
  };

  const handleSaveNotes = () => {
    updateTimelineEventNotes(event.id, tempNotes);
    setIsEditing(false);
    setTempNotes("");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setTempNotes("");
  };


  return (
    <div className="relative flex">
      {/* Timeline line and circle */}
      <div className="relative flex flex-col items-center">
        {/* Timeline circle */}
        <div className="w-3 h-3 bg-gray-400 rounded-full border-2 border-white z-10" />
        {/* Timeline line */}
        {!isLast && <div className="w-0.5 bg-gray-300 flex-1 mt-1" style={{ minHeight: "80px" }} />}
      </div>

      {/* Event content */}
      <div className="ml-6 pb-8 flex-1 mt-[-8px]">
        {/* First line: Tag, date, and Remove button */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <EventTypeTag type={event.type} />
            <div className="text-xs text-gray-500">{formatEventDateTime(event.time)}</div>
          </div>
          <Button variant="outline" size="sm" onClick={() => removeFromTimeline(event.id)}>
            Remove
          </Button>
        </div>

        {/* Event title */}
        <div className="font-semibold mb-2">{event.short}</div>

        {/* Description */}
        <div className="text-gray-700 mb-3">{event.description}</div>

        {/* Additional fields */}
        <div className="space-y-1 text-sm text-gray-600">
          {event.user && <div>User: {event.user}</div>}
          {event.metric && <div>Metric: {event.metric}</div>}
        </div>

        {/* Notes section */}
        <div className="mt-3">
          {isEditing ? (
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Notes:</label>
              <Textarea
                value={tempNotes}
                onChange={(e) => setTempNotes(e.target.value)}
                placeholder="Add your notes here..."
                className="min-h-[80px]"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveNotes}>
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-start justify-between mb-1">
                <span className="text-sm text-gray-600">Notes:</span>
                <Button size="sm" variant="ghost" onClick={handleEditNotes}>
                  Edit
                </Button>
              </div>
              <div className="text-sm">{event.notes || "No notes added"}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
