import { useDraggable } from "@dnd-kit/core";
import { X } from "lucide-react";
import { useState } from "react";

import { EventTypeTag } from "@/components/EventTypeTag";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatEventDateTime } from "@/lib/string-formatting";
import { useEventTimelineStore } from "@/lib/store";
import type { Event, EventType } from "@/lib/types";

function EventCard({ event, isDraggable }: { event: Event; isDraggable: boolean }) {
  const timelineEvents = useEventTimelineStore((state) => state.timelineEvents);
  const addToTimeline = useEventTimelineStore((state) => state.addToTimeline);
  const removeFromTimeline = useEventTimelineStore((state) => state.removeFromTimeline);

  const isEventInTimeline = (eventId: string) => {
    return timelineEvents.some((timelineEvent) => timelineEvent.id === eventId);
  };

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: event.id,
    disabled: !isDraggable,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`gap-2 py-4 ${isDraggable ? "cursor-grab active:cursor-grabbing" : ""} ${isDragging ? "opacity-50 z-50" : ""}`}
      {...(isDraggable ? { ...listeners, ...attributes } : {})}
    >
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <EventTypeTag type={event.type} />
            <div className="text-xs text-gray-500">{formatEventDateTime(event.time)}</div>
          </div>
          {isEventInTimeline(event.id) ? (
            <Button variant="outline" size="sm" onClick={() => removeFromTimeline(event.id)}>
              Remove
            </Button>
          ) : (
            <Button size="sm" onClick={() => addToTimeline(event.id)}>
              Add
            </Button>
          )}
        </div>
        <CardTitle className="text-sm">{event.short}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm mb-2">{event.description}</p>
        {event.user && <div className="text-sm text-gray-600">User: {event.user}</div>}
        {event.metric && <div className="text-sm text-gray-600">Metric: {event.metric}</div>}
      </CardContent>
    </Card>
  );
}

export function RawEvents() {
  const events = useEventTimelineStore((state) => state.events);
  const timelineEvents = useEventTimelineStore((state) => state.timelineEvents);

  const [searchQuery, setSearchQuery] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState<EventType | "all">("all");

  const filterEvents = () => {
    let filtered = events;

    // Apply text search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((event) => {
        return (
          event.short.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          (event.user && event.user.toLowerCase().includes(query)) ||
          (event.metric && event.metric.toLowerCase().includes(query))
        );
      });
    }

    // Apply event type filter
    if (eventTypeFilter !== "all") {
      filtered = filtered.filter((event) => event.type === eventTypeFilter);
    }

    return filtered;
  };

  const filteredEvents = filterEvents();

  return (
    <div className="h-full p-4">
      <h1 className="text-lg font-bold mb-4 flex-shrink-0">Raw events</h1>
      <p className="text-sm text-gray-600 mb-4 flex-shrink-0">Drag events to the timeline or use the Add button</p>
      <div className="mb-4 flex-shrink-0 space-y-2">
        <div className="relative">
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-8"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="relative">
          <Select value={eventTypeFilter} onValueChange={(value) => setEventTypeFilter(value as EventType | "all")}>
            <SelectTrigger className="w-full pr-8">
              <SelectValue placeholder="Filter by event type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All event types</SelectItem>
              <SelectItem value="Deployment">Deployment</SelectItem>
              <SelectItem value="MetricAnomoly">MetricAnomoly</SelectItem>
              <SelectItem value="LogAnomoly">LogAnomoly</SelectItem>
            </SelectContent>
          </Select>
          {eventTypeFilter !== "all" && (
            <button
              onClick={() => setEventTypeFilter("all")}
              className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer bg-background z-10"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      <div className="space-y-2 overflow-y-auto flex-1">
        {filteredEvents.map((event) => {
          const inTimeline = timelineEvents.some((timelineEvent) => timelineEvent.id === event.id);
          return <EventCard key={event.id} event={event} isDraggable={!inTimeline} />;
        })}
        {filteredEvents.length === 0 && searchQuery.trim() && (
          <div className="text-center text-gray-500 py-8">No events found matching "{searchQuery}"</div>
        )}
      </div>
    </div>
  );
}
