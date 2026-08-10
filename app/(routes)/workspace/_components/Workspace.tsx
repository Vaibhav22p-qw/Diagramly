"use client";

import React, { useEffect, useState } from "react";
import nextDynamic from "next/dynamic";
import WorkspaceHeader from "./WorkspaceHeader";
import ViewSwitcher from "./ViewSwitcher";
import { RoomProvider } from "@liveblocks/react";

const Compiler = nextDynamic(() => import("./Compiler"), {
  ssr: false,
});

const Editor = nextDynamic(() => import("./Editor"), {
  ssr: false,
});

const Canvas = nextDynamic(() => import("./Canvas"), {
  ssr: false,
});

interface WorkspaceProps {
  workspaceId?: string;
}

function Workspace({ workspaceId }: WorkspaceProps) {
  const [showDocument, setShowDocument] = useState(true);
  const [showCompiler, setShowCompiler] = useState(false);
  const [showCanvas, setShowCanvas] = useState(true);
  const [isLive, setIsLive] = useState(false);

  const [fileName, setFileName] = useState("Untitled");
  const [workspaceLoading, setWorkspaceLoading] = useState(true);

  useEffect(() => {
    if (!workspaceId) {
      setWorkspaceLoading(false);
      return;
    }

    const fetchWorkspace = async () => {
      try {
        const response = await fetch(
          `/api/workspaces/${workspaceId}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to load workspace"
          );
        }

        setFileName(data.workspace.title || "Untitled");
      } catch (error) {
        console.error("Failed to load workspace:", error);
      } finally {
        setWorkspaceLoading(false);
      }
    };

    fetchWorkspace();
  }, [workspaceId]);

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
          <Compiler />
        </div>
      )}

      {/* Canvas */}
      {showCanvas && (
        <div className="overflow-hidden">
          <Canvas />
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