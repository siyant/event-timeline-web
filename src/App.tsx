import { useEventTimelineStore } from "@/lib/store";

function App() {
  const events = useEventTimelineStore((state) => state.events);

  return (
    <div className="flex min-h-svh flex-row">
      <div className="flex-1/3 h-full overflow-y-auto p-4">
        <h1 className="text-lg font-bold mb-4">Raw events</h1>
        <div className="space-y-2">
          {events.map((event) => (
            <div key={event.id} className="border p-3 rounded">
              <div className="font-semibold">{event.short}</div>
              <div className="text-sm text-gray-600">Type: {event.type}</div>
              <div className="text-sm">{event.description}</div>
              <div className="text-xs text-gray-500">
                {event.time.toLocaleString()}
              </div>
              {event.user && (
                <div className="text-sm text-gray-600">User: {event.user}</div>
              )}
              {event.metric && (
                <div className="text-sm text-gray-600">Metric: {event.metric}</div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex-2/3">
        <h1 className="text-lg">Timeline</h1>
      </div>
    </div>
  );
}

export default App;
