import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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

  const formatTime = (date: Date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${month} ${day}, ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="relative flex">
      {/* Timeline line and circle */}
      <div className="relative flex flex-col items-center">
        {/* Timeline circle */}
        <div className="w-3 h-3 bg-gray-400 rounded-full border-2 border-white z-10" />
        {/* Timeline line */}
        {!isLast && (
          <div className="w-0.5 bg-gray-300 flex-1 mt-1" style={{ minHeight: '80px' }} />
        )}
      </div>

      {/* Event content */}
      <div className="ml-6 pb-8 flex-1">
        {/* Time and event title on same line */}
        <div className="flex items-center gap-4 mb-1">
          <div className="text-sm text-gray-500 font-mono">{formatTime(event.time)}</div>
          <div className="text-lg font-semibold">{event.short}</div>
        </div>
        
        {/* Description */}
        <div className="text-gray-700 mb-3">{event.description}</div>
        
        {/* Additional fields */}
        <div className="space-y-1 text-sm text-gray-600">
          <div className="text-xs text-gray-500 uppercase tracking-wide">{event.type}</div>
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

        {/* Remove button */}
        <div className="mt-3">
          <Button variant="outline" size="sm" onClick={() => removeFromTimeline(event.id)}>
            Remove from Timeline
          </Button>
        </div>
      </div>
    </div>
  );
}
