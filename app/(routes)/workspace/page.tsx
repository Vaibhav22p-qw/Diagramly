"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import nextDynamic from "next/dynamic";
import WorkspaceHeader from "./_components/WorkspaceHeader";
import ViewSwitcher from "./_components/ViewSwitcher";
import { RoomProvider } from "@liveblocks/react";

const Compiler = nextDynamic(
  () => import("./_components/Compiler"),
  { ssr: false }
);

const Editor = nextDynamic(() => import("./_components/Editor"), {
  ssr: false,
});

const Canvas = nextDynamic(
  () => import("./_components/Canvas"),
  {
    ssr: false,
  }
);

function Workspace() {
  const [showDocument, setShowDocument] = useState(true);
const [showCompiler, setShowCompiler] = useState(false);
const [showCanvas, setShowCanvas] = useState(true);
const [isLive, setIsLive] = useState(false);
  
  const [fileName, setFileName] = useState("Untitled");

const visiblePanels = [
  showDocument,
  showCompiler,
  showCanvas,
].filter(Boolean).length;
const workspaceContent = (
  <div
    className={`h-[calc(100vh-7rem)] grid ${
      visiblePanels === 1
        ? "grid-cols-1"
        : visiblePanels === 2
        ? "grid-cols-2"
        : "grid-cols-3"
    }`}
  >
  {/* Document */}
 {showDocument && (
  <div
    id="editor-container"
    className="overflow-auto border-r"
  >
    <Editor />
  </div>
)}
  {/* Compiler */}
  {showCompiler && (
  <div className="overflow-hidden border-r">
    <Compiler/>
  </div>
)}
  {/* Canvas */}
  {showCanvas && (
  <div className="overflow-hidden">
    <Canvas/>
  </div>
)}
</div>
    );
return (
  <RoomProvider
    id="diagramly-room"
    initialPresence={{}}
  >
    <div className="h-screen overflow-hidden">
<WorkspaceHeader
  fileName={fileName}
  setFileName={setFileName}
  onSave={() => {
    console.log("Save feature coming soon");
  }}
  isLive={isLive}
  setIsLive={setIsLive}
/>
<ViewSwitcher
  showDocument={showDocument}
  setShowDocument={setShowDocument}
  showCompiler={showCompiler}
  setShowCompiler={setShowCompiler}
  showCanvas={showCanvas}
  setShowCanvas={setShowCanvas}
/>

{workspaceContent}
    
    </div>
  </RoomProvider>
);
}

export default Workspace;
