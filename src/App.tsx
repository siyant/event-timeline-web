import { DndContext, type DragEndEvent } from "@dnd-kit/core";

import { RawEvents } from "@/components/RawEvents";
import { Timeline } from "@/components/Timeline";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useEventTimelineStore } from "@/lib/store";

function App() {
  const addToTimeline = useEventTimelineStore((state) => state.addToTimeline);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && over.id === "timeline-droppable") {
      const eventId = active.id as string;
      addToTimeline(eventId);
    }
  };

  return (
    <div className="min-h-svh">
      <DndContext onDragEnd={handleDragEnd}>
        <ResizablePanelGroup direction="horizontal" className="min-h-svh">
          <ResizablePanel defaultSize={33} minSize={25} maxSize={50}>
            <div className="h-screen flex flex-col overflow-auto">
              <RawEvents />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={67} minSize={50}>
            <div className="h-screen flex flex-col overflow-auto">
              <Timeline />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </DndContext>
    </div>
  );
}

export default App;
