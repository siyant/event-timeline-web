import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEventTimelineStore } from "@/lib/store";

export function RawEvents() {
  const events = useEventTimelineStore((state) => state.events);
  const timelineEvents = useEventTimelineStore((state) => state.timelineEvents);
  const addToTimeline = useEventTimelineStore((state) => state.addToTimeline);
  const removeFromTimeline = useEventTimelineStore((state) => state.removeFromTimeline);

  const [searchQuery, setSearchQuery] = useState("");

  const isEventInTimeline = (eventId: string) => {
    return timelineEvents.some((timelineEvent) => timelineEvent.id === eventId);
  };

  const filterEvents = () => {
    if (!searchQuery.trim()) {
      return events;
    }

    const query = searchQuery.toLowerCase();
    return events.filter((event) => {
      return (
        event.short.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        (event.user && event.user.toLowerCase().includes(query)) ||
        (event.metric && event.metric.toLowerCase().includes(query))
      );
    });
  };

  const filteredEvents = filterEvents();

  return (
    <div className="h-full p-4">
      <h1 className="text-lg font-bold mb-4 flex-shrink-0">Raw events</h1>
      <div className="mb-4 flex-shrink-0">
        <Input
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="space-y-2 overflow-y-auto flex-1">
        {filteredEvents.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <CardTitle className="text-sm">{event.short}</CardTitle>
              <CardDescription>{event.type}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{event.description}</p>
              <div className="text-xs text-gray-500 mt-2">{event.time.toLocaleString()}</div>
              {event.user && <div className="text-sm text-gray-600 mt-1">User: {event.user}</div>}
              {event.metric && <div className="text-sm text-gray-600 mt-1">Metric: {event.metric}</div>}
            </CardContent>
            <CardFooter>
              {isEventInTimeline(event.id) ? (
                <Button variant="outline" size="sm" onClick={() => removeFromTimeline(event.id)}>
                  Remove from Timeline
                </Button>
              ) : (
                <Button size="sm" onClick={() => addToTimeline(event)}>
                  Add to Timeline
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
        {filteredEvents.length === 0 && searchQuery.trim() && (
          <div className="text-center text-gray-500 py-8">
            No events found matching "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
}
