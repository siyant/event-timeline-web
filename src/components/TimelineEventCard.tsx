import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useEventTimelineStore } from "@/lib/store";
import type { TimelineEvent } from "@/lib/types";

interface TimelineEventCardProps {
  event: TimelineEvent;
}

export function TimelineEventCard({ event }: TimelineEventCardProps) {
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
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{event.short}</CardTitle>
        <CardDescription>{event.type}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{event.description}</p>
        <div className="text-xs text-gray-500 mt-2">{event.time.toLocaleString()}</div>
        {event.user && <div className="text-sm text-gray-600 mt-1">User: {event.user}</div>}
        {event.metric && <div className="text-sm text-gray-600 mt-1">Metric: {event.metric}</div>}

        <div className="mt-2">
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
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <span className="text-sm text-gray-600">Notes: </span>
                <span className="text-sm">{event.notes || "No notes added"}</span>
              </div>
              <Button size="sm" variant="ghost" onClick={handleEditNotes}>
                Edit
              </Button>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" onClick={() => removeFromTimeline(event.id)}>
          Remove from Timeline
        </Button>
      </CardFooter>
    </Card>
  );
}
