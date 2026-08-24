"use client";

import React, { useEffect, useState } from "react";
import nextDynamic from "next/dynamic";
import WorkspaceHeader from "./WorkspaceHeader";
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

interface WorkspaceResponse {
  success?: boolean;
  message?: string;
  workspace?: {
    _id?: string;
    title?: string;
  };
}

function Workspace({ workspaceId }: WorkspaceProps) {
  // -----------------------------
  // Panel visibility
  // -----------------------------
  const [showDocument, setShowDocument] = useState(true);
  const [showCompiler, setShowCompiler] = useState(false);
  const [showCanvas, setShowCanvas] = useState(true);

  // -----------------------------
  // Live collaboration
  // -----------------------------
  const [isLive, setIsLive] = useState(false);

  // -----------------------------
  // Workspace state
  // -----------------------------
  const [fileName, setFileName] = useState("Untitled");
  const [workspaceLoading, setWorkspaceLoading] = useState(true);
  const [workspaceError, setWorkspaceError] = useState<string | null>(
    null
  );

  // -----------------------------
  // Fetch workspace
  // -----------------------------
  useEffect(() => {
    let cancelled = false;

    const fetchWorkspace = async () => {
      // No workspace ID
      if (!workspaceId) {
        console.warn("Workspace ID is missing.");
        setWorkspaceError("Workspace ID is missing.");
        setWorkspaceLoading(false);
        return;
      }

      try {
        setWorkspaceLoading(true);
        setWorkspaceError(null);

        const encodedWorkspaceId =
          encodeURIComponent(workspaceId);

        const apiUrl = `/api/workspaces/${encodedWorkspaceId}`;

        console.log("Loading workspace...");
        console.log("Workspace ID:", workspaceId);
        console.log("API URL:", apiUrl);

        const response = await fetch(apiUrl, {
          method: "GET",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
        });

        let data: WorkspaceResponse = {};

        try {
          data = await response.json();
        } catch {
          throw new Error(
            `Invalid response from server (${response.status})`
          );
        }

        console.log("Workspace API status:", response.status);
        console.log("Workspace API response:", data);

        if (!response.ok) {
          throw new Error(
            data.message ||
              `Failed to load workspace (${response.status})`
          );
        }

        if (!data.success) {
          throw new Error(
            data.message || "Workspace was not found."
          );
        }

        if (!data.workspace) {
          throw new Error(
            "Workspace data was not returned by the server."
          );
        }

        if (!cancelled) {
          setFileName(data.workspace.title || "Untitled");
          setWorkspaceError(null);
        }
      } catch (error) {
        console.error(
          "Failed to load workspace:",
          error
        );

        if (!cancelled) {
          const message =
            error instanceof Error
              ? error.message
              : "Failed to load workspace.";

          setWorkspaceError(message);
        }
      } finally {
        if (!cancelled) {
          setWorkspaceLoading(false);
        }
      }
    };

    fetchWorkspace();

    return () => {
      cancelled = true;
    };
  }, [workspaceId]);

  // -----------------------------
  // Count visible panels
  // -----------------------------
  const visiblePanels = [
    showDocument,
    showCompiler,
    showCanvas,
  ].filter(Boolean).length;

  // -----------------------------
  // Grid layout
  // -----------------------------
  const gridColumns =
    visiblePanels === 1
      ? "grid-cols-1"
      : visiblePanels === 2
      ? "grid-cols-2"
      : "grid-cols-3";

  // -----------------------------
  // Workspace content
  // -----------------------------
  const workspaceContent = (
    <div
      className={`h-[calc(100vh-4rem)] grid ${gridColumns}`}
    >
      {/* Document Editor */}
      {showDocument && (
        <div
          id="editor-container"
          className="min-w-0 overflow-auto border-r"
        >
          <Editor />
        </div>
      )}

      {/* Compiler */}
      {showCompiler && (
        <div className="min-w-0 overflow-hidden border-r">
          <Compiler />
        </div>
      )}

      {/* Canvas */}
      {showCanvas && (
        <div className="min-w-0 overflow-hidden">
          <Canvas />
        </div>
      )}
    </div>
  );

  // -----------------------------
  // Loading state
  // -----------------------------
  if (workspaceLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-sm text-muted-foreground">
          Loading workspace...
        </div>
      </div>
    );
  }

  // -----------------------------
  // Workspace ID missing
  // -----------------------------
  if (!workspaceId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="rounded-lg border p-6 text-center">
          <h2 className="text-lg font-semibold">
            Workspace not found
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            No workspace ID was provided.
          </p>
        </div>
      </div>
    );
  }

  // -----------------------------
  // Workspace API error
  // -----------------------------
  if (workspaceError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="max-w-md rounded-lg border p-6 text-center">
          <h2 className="text-lg font-semibold text-red-500">
            Workspace not found
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {workspaceError}
          </p>

          <p className="mt-4 text-xs text-muted-foreground">
            Workspace ID: {workspaceId}
          </p>
        </div>
      </div>
    );
  }

  // -----------------------------
  // Main workspace
  // -----------------------------
  return (
    <RoomProvider
      id={`diagramly-workspace-${workspaceId}`}
      initialPresence={{}}
    >
      <div className="h-screen overflow-hidden">
        <WorkspaceHeader
          fileName={fileName}
          setFileName={setFileName}
          onSave={() => {
            console.log(
              "Save feature coming soon"
            );
          }}
          isLive={isLive}
          setIsLive={setIsLive}
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