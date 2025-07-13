import { TimelineEventCard } from "@/components/TimelineEventCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useEventTimelineStore } from "@/lib/store";

function App() {
  const events = useEventTimelineStore((state) => state.events);
  const timelineEvents = useEventTimelineStore((state) => state.timelineEvents);
  const addToTimeline = useEventTimelineStore((state) => state.addToTimeline);
  const removeFromTimeline = useEventTimelineStore((state) => state.removeFromTimeline);
  const clearTimeline = useEventTimelineStore((state) => state.clearTimeline);

  const isEventInTimeline = (eventId: string) => {
    return timelineEvents.some((timelineEvent) => timelineEvent.id === eventId);
  };

  return (
    <div className="flex min-h-svh flex-row">
      <div className="flex-1/3 h-full overflow-y-auto p-4">
        <h1 className="text-lg font-bold mb-4">Raw events</h1>
        <div className="space-y-2">
          {events.map((event) => (
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
        </div>
      </div>
      <div className="flex-2/3 p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-bold">
            Timeline ({timelineEvents.length} event{timelineEvents.length !== 1 ? "s" : ""})
          </h1>
          {timelineEvents.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearTimeline}>
              Clear Timeline
            </Button>
          )}
        </div>
        {timelineEvents.length === 0 ? (
          <p className="text-gray-500">No events in timeline yet. Add events from the left panel.</p>
        ) : (
          <div className="space-y-3">
            {timelineEvents.map((event) => (
              <TimelineEventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
