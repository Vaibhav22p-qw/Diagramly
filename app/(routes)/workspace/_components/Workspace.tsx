"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import nextDynamic from "next/dynamic";
import WorkspaceHeader from "./WorkspaceHeader";
import { RoomProvider } from "@liveblocks/react";
import DashboardView from "@/components/dashboard/DashboardView";

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

export type WorkspacePanel = "document" | "compiler" | "canvas";
export type PanelMode = "two" | "three";

interface WorkspaceResponse {
  success?: boolean;
  message?: string;
  workspace?: {
    _id?: string;
    title?: string;
  };
}

function Workspace({ workspaceId }: WorkspaceProps) {
  // Workspace owns the only panel state. Components remain mounted when hidden.
  const [openPanels, setOpenPanels] = useState<Record<WorkspacePanel, boolean>>({ document: true, compiler: false, canvas: false });
  const [recentPanels, setRecentPanels] = useState<WorkspacePanel[]>(["document"]);
  const [panelMode, setPanelMode] = useState<PanelMode>("two");
  const [showDashboard, setShowDashboard] = useState(false);

  // -----------------------------
  // Live collaboration
  // -----------------------------
  const [isLive, setIsLive] = useState(false);

  // -----------------------------
  // Workspace state
  // -----------------------------
  const [fileName, setFileName] = useState("Untitled");
  const [documentSaveTrigger, setDocumentSaveTrigger] = useState(0);
  const documentSaveResolver = useRef<((success: boolean) => void) | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
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

  const saveDocument = useCallback(() => new Promise<boolean>((resolve) => {
    documentSaveResolver.current = resolve;
    setDocumentSaveTrigger((value) => value + 1);
  }), []);

  const handleDocumentSaveResult = useCallback((success: boolean) => {
    documentSaveResolver.current?.(success);
    documentSaveResolver.current = null;
  }, []);

  const saveOpenPanels = useCallback(async () => {
    // Document is the only panel with a persistence API today. Compiler and Canvas
    // remain mounted, preserving their state rather than resetting it on a hide.
    const success = openPanels.document ? await saveDocument() : true;
    if (!success) setSaveError("Document could not be saved. Your current workspace remains open.");
    else setSaveError(null);
    return success;
  }, [openPanels.document, saveDocument]);

  const openPanel = useCallback(async (panel: WorkspacePanel) => {
    const currentlyOpen = (Object.keys(openPanels) as WorkspacePanel[]).filter((key) => openPanels[key]);
    const limit = panelMode === "two" ? 2 : 3;
    const oldest = currentlyOpen.length >= limit ? recentPanels.find((key) => openPanels[key]) : undefined;
    if (oldest === "document" && !(await saveDocument())) {
      setSaveError("Document could not be saved. The panel change was cancelled.");
      return;
    }
    setShowDashboard(false);
    setOpenPanels((current) => {
      if (current[panel]) return current;
      const next = { ...current, [panel]: true };
      if (oldest) {
        if (oldest) next[oldest] = false;
      }
      return next;
    });
    setRecentPanels((current) => [...current.filter((key) => key !== panel), panel]);
  }, [openPanels, panelMode, recentPanels, saveDocument]);

  const handlePanelToggle = useCallback(async (panel: WorkspacePanel) => {
    if (showDashboard) { await openPanel(panel); return; }
    if (openPanels[panel]) {
      if (panel === "document" && !(await saveDocument())) { setSaveError("Document could not be saved. It remains visible."); return; }
      setOpenPanels((current) => ({ ...current, [panel]: false }));
      return;
    }
    await openPanel(panel);
  }, [openPanels, openPanel, saveDocument, showDashboard]);

  const handlePanelModeChange = useCallback(async (mode: PanelMode) => {
    if (mode === "two" && openPanels.document && (Object.values(openPanels).filter(Boolean).length > 2)) {
      const keep = recentPanels.filter((panel) => openPanels[panel]).slice(-2);
      if (!keep.includes("document") && !(await saveDocument())) { setSaveError("Document could not be saved. Panel mode was not changed."); return; }
    }
    setPanelMode(mode);
    if (mode === "two") {
      setOpenPanels((current) => {
        const keep = recentPanels.filter((panel) => current[panel]).slice(-2);
        return { document: keep.includes("document"), compiler: keep.includes("compiler"), canvas: keep.includes("canvas") };
      });
    }
  }, [openPanels, recentPanels, saveDocument]);

  const handleDashboard = useCallback(async () => {
    if (!(await saveOpenPanels())) return;
    setShowDashboard(true);
  }, [saveOpenPanels]);

  const visiblePanelCount = (Object.keys(openPanels) as WorkspacePanel[]).filter((panel) => openPanels[panel]).length;
  const gridColumns = visiblePanelCount <= 1 ? "grid-cols-1" : visiblePanelCount === 2 ? "md:grid-cols-2" : "md:grid-cols-2 xl:grid-cols-3";

  const workspaceContent = (
    <div className="h-[calc(100vh-4rem)] min-w-0 overflow-hidden">
      {showDashboard && <div className="h-full overflow-y-auto bg-slate-50 dark:bg-slate-950"><DashboardView /></div>}
      <div className={`h-full grid ${gridColumns} ${showDashboard ? "hidden" : ""}`}>
        <div id="editor-container" className={`min-w-0 overflow-auto ${openPanels.document ? "block" : "hidden"}`}><Editor workspaceId={workspaceId!} onSaveTrigger={documentSaveTrigger} onSaveComplete={handleDocumentSaveResult} /></div>
        <div className={`min-w-0 overflow-hidden ${openPanels.compiler ? "block" : "hidden"}`}><Compiler /></div>
        <div className={`min-w-0 overflow-hidden ${openPanels.canvas ? "block" : "hidden"}`}><Canvas /></div>
      </div>
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
          onSave={() => { void saveOpenPanels(); }}
          isLive={isLive}
          setIsLive={setIsLive}
          openPanels={openPanels}
          showDashboard={showDashboard}
          panelMode={panelMode}
          onPanelToggle={handlePanelToggle}
          onPanelModeChange={handlePanelModeChange}
          onDashboard={handleDashboard}
        />

        {saveError && <div role="alert" className="absolute left-1/2 top-20 z-[60] -translate-x-1/2 rounded-lg bg-red-600 px-4 py-2 text-sm text-white shadow-lg">{saveError}</div>}

        {workspaceContent}
      </div>
    </RoomProvider>
  );
}

export default Workspace;
