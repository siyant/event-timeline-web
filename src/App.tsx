import { RawEvents } from "@/components/RawEvents";
import { Timeline } from "@/components/Timeline";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

function App() {
  return (
    <div className="min-h-svh">
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
    </div>
  );
}

export default App;
