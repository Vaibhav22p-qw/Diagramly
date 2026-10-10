"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Settings, Minus, Plus, Bold, Copy, ArrowUpToLine, ArrowDownToLine, Trash2 } from "lucide-react";
import { CodeBoxData } from "./canvas/types";
import { LANGUAGES } from "@/lib/compiler/languages";
import CanvasToolbar from "./canvas/CanvasToolbar";
import CanvasControls from "./canvas/CanvasControls";
import CanvasObjectRenderer from "./canvas/CanvasObjectRenderer";
import { CanvasObject, CanvasObjectType, Connector, Viewport, ConnectionSide, ConnectingState, MIN_ZOOM, MAX_ZOOM, MIN_OBJECT_SIZE, generateObjectId, screenToWorld, worldToScreen, getConnectionPointCoordinates, HeaderData, PathData } from "./canvas/types";
import ConnectorRenderer from "./canvas/ConnectorRenderer";
import CodeBoxModal from "./canvas/CodeBoxModal";
import PropertiesPanel from "./canvas/PropertiesPanel";
import { runExecutionGraph } from "./canvas/execution/graphRunner";
import { runCode } from "@/lib/compiler/run";



function findConnectionTarget(
  worldPos: { x: number; y: number },
  sourceObjectId: string,
  objectList: CanvasObject[],
  zoom: number
): { targetObjectId: string; targetSide: ConnectionSide; coords: { x: number; y: number } } | null {
  const sides: ConnectionSide[] = ["top", "right", "bottom", "left"];
  const SNAP_DISTANCE = 36 / Math.max(0.1, zoom);

  // 1. First priority: Check exact proximity to any connection handle point
  let bestPointTarget: { targetObjectId: string; targetSide: ConnectionSide; coords: { x: number; y: number }; dist: number } | null = null;
  for (const obj of objectList) {
    if (obj.id === sourceObjectId) continue;
    for (const side of sides) {
      const pt = getConnectionPointCoordinates(obj, side);
      const dist = Math.hypot(pt.x - worldPos.x, pt.y - worldPos.y);
      if (dist < SNAP_DISTANCE && (!bestPointTarget || dist < bestPointTarget.dist)) {
        bestPointTarget = { targetObjectId: obj.id, targetSide: side, coords: pt, dist };
      }
    }
  }

  if (bestPointTarget) {
    return {
      targetObjectId: bestPointTarget.targetObjectId,
      targetSide: bestPointTarget.targetSide,
      coords: bestPointTarget.coords,
    };
  }

  // 2. Second priority: Check if pointer is anywhere inside or close to an object's boundary
  const PADDING = 24 / Math.max(0.1, zoom);
  let bestObjectTarget: { targetObjectId: string; targetSide: ConnectionSide; coords: { x: number; y: number }; dist: number } | null = null;

  for (const obj of objectList) {
    if (obj.id === sourceObjectId) continue;
    const isInsideOrNear =
      worldPos.x >= obj.x - PADDING &&
      worldPos.x <= obj.x + obj.width + PADDING &&
      worldPos.y >= obj.y - PADDING &&
      worldPos.y <= obj.y + obj.height + PADDING;

    if (isInsideOrNear) {
      // Find the closest side of this object
      for (const side of sides) {
        const pt = getConnectionPointCoordinates(obj, side);
        const dist = Math.hypot(pt.x - worldPos.x, pt.y - worldPos.y);
        if (!bestObjectTarget || dist < bestObjectTarget.dist) {
          bestObjectTarget = { targetObjectId: obj.id, targetSide: side, coords: pt, dist };
        }
      }
    }
  }

  if (bestObjectTarget) {
    return {
      targetObjectId: bestObjectTarget.targetObjectId,
      targetSide: bestObjectTarget.targetSide,
      coords: bestObjectTarget.coords,
    };
  }

  return null;
}

export default function Canvas({ workspaceId, onSaveTrigger, onSaveComplete, incomingCode }: { workspaceId?: string; onSaveTrigger?: number; onSaveComplete?: (success: boolean) => void; incomingCode?: {code: string, language: string, triggerId: number} } = {}) {
  const containerRef = useRef<HTMLDivElement>(null);

  // -----------------------------
  // Canonical Canvas State
  // -----------------------------
  const [objects, setObjects] = useState<CanvasObject[]>([]);
  const [viewport, setViewport] = useState<Viewport>({ x: 0, y: 0, zoom: 1 });

  // Handle incoming code to canvas
  useEffect(() => {
    if (incomingCode && incomingCode.code) {
      const container = containerRef.current;
      const rect = container?.getBoundingClientRect();
      const centerX = rect ? rect.width / 2 : 300;
      const centerY = rect ? rect.height / 2 : 200;
      const worldPos = screenToWorld(centerX, centerY, viewport);
      const width = 300;
      const height = 200;
      const data: CodeBoxData = {
        role: "unassigned",
        language: incomingCode.language || "cpp",
        code: incomingCode.code,
        output: "",
        outputVisible: false,
      };
      const newObject: CanvasObject = {
        id: generateObjectId("codebox"),
        type: "codebox",
        x: Math.round(worldPos.x - width / 2),
        y: Math.round(worldPos.y - height / 2),
        width,
        height,
        data,
      };
      updateObjects((prev) => [...prev, newObject]);
      setSelectedIds([newObject.id]);
      setSelectedConnectorId(null);
    }
  }, [incomingCode?.triggerId]);

  // CodeBox modal state
  const [codeBoxModal, setCodeBoxModal] = useState<{ objectId: string; open: boolean } | null>(null);

  // Add CodeBox creation
  const handleAddCodeBox = useCallback((role: "unassigned" | "main" | "function" = "unassigned") => {
    const container = containerRef.current;
    const rect = container?.getBoundingClientRect();
    const centerX = rect ? rect.width / 2 : 300;
    const centerY = rect ? rect.height / 2 : 200;
    const worldPos = screenToWorld(centerX, centerY, viewport);
    const width = 300;
    const height = 200;
    const data: CodeBoxData = {
      role,
      language: "cpp",
      code: LANGUAGES["cpp"].defaultCode,
      output: "",
      outputVisible: false,
    };
    const newObject: CanvasObject = {
      id: generateObjectId("codebox"),
      type: "codebox",
      x: Math.round(worldPos.x - width / 2),
      y: Math.round(worldPos.y - height / 2),
      width,
      height,
      data,
    };
    updateObjects((prev) => [...prev, newObject]);
    setSelectedIds([newObject.id]);
    setSelectedConnectorId(null);
    if (role === "unassigned") setCodeBoxModal({ objectId: newObject.id, open: true });
  }, [viewport]);

  // Add Header creation
  const handleAddHeader = useCallback(() => {
    const container = containerRef.current;
    const rect = container?.getBoundingClientRect();
    const centerX = rect ? rect.width / 2 : 300;
    const centerY = rect ? rect.height / 2 : 200;
    const worldPos = screenToWorld(centerX, centerY, viewport);
    const width = 250;
    const height = 150;
    const data: HeaderData = {
      language: "cpp",
      code: "#include <iostream>\n#include <vector>\n#include <string>\n",
    };
    const newObject: CanvasObject = {
      id: generateObjectId("header"),
      type: "header",
      x: Math.round(worldPos.x - width / 2),
      y: Math.round(worldPos.y - height / 2),
      width,
      height,
      data,
    };
    updateObjects((prev) => [...prev, newObject]);
    setSelectedIds([newObject.id]);
    setSelectedConnectorId(null);
    setCodeBoxModal({ objectId: newObject.id, open: true });
  }, [viewport]);

  const handleOpenCodeBox = useCallback((id: string) => {
    setCodeBoxModal({ objectId: id, open: true });
  }, []);



  const handleCloseCodeBox = useCallback(() => {
    setCodeBoxModal(null);
  }, []);

  const handleSaveCodeBox = useCallback((id: string, updatedData: CodeBoxData) => {
    updateObjects((prev) =>
      prev.map((obj) => {
        if (obj.id === id) {
          // Morph to Header if role was explicitly chosen as header
          if ((updatedData.role as any) === "header") {
             const headerData: HeaderData = {
               language: updatedData.language,
               code: updatedData.code,
             };
             return { ...obj, type: "header", data: headerData };
          }
          return { ...obj, data: { ...updatedData } };
        }
        return obj;
      })
    );
    // Role change cleanup: prevent invalid executable relationships from being retained
    updateConnectors((prev) =>
      prev.filter((conn) => {
        if (conn.type !== "main-function") return true;
        if (conn.sourceObjectId === id && updatedData.role !== "main") return false;
        if (conn.targetObjectId === id && updatedData.role !== "function") return false;
        return true;
      })
    );
    setCodeBoxModal(null);
  }, []);

  const [connectors, setConnectors] = useState<Connector[]>([]);



  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectionBox, setSelectionBox] = useState<{ startX: number; startY: number; endX: number; endY: number } | null>(null);
  const [selectedConnectorId, setSelectedConnectorId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; objectId: string | null } | null>(null);
  const [showProperties, setShowProperties] = useState(false);

  // Tools & Path Drawing
  const [activeTool, setActiveTool] = useState<"select" | "pen">("select");
  const [currentPath, setCurrentPath] = useState<{ id: string; points: {x: number; y: number}[]; color: string; strokeWidth: number } | null>(null);

  // Persistence State
  const [status, setStatus] = useState<"loading" | "saved" | "saving" | "unsaved" | "error">("loading");

  const saveCanvas = useCallback(async () => {
    if (!workspaceId) return false;
    setStatus("saving");
    try {
      const response = await fetch(`/api/workspaces/${encodeURIComponent(workspaceId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ canvas: { objects, connectors, viewport } }),
      });
      if (!response.ok) throw new Error();
      setStatus("saved");
      return true;
    } catch {
      setStatus("error");
      return false;
    }
  }, [workspaceId, objects, connectors, viewport]);

  useEffect(() => {
    if (onSaveTrigger) {
      void saveCanvas().then(success => onSaveComplete?.(success));
    }
  }, [onSaveTrigger, saveCanvas, onSaveComplete]);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!workspaceId) {
        setStatus("saved");
        return;
      }
      try {
        const response = await fetch(`/api/workspaces/${encodeURIComponent(workspaceId)}`, { cache: "no-store" });
        const result = await response.json();
        if (!alive) return;
        const canvasData = result.workspace?.canvas;
        if (canvasData) {
          if (canvasData.objects) updateObjects(canvasData.objects);
          if (canvasData.connectors) updateConnectors(canvasData.connectors);
          if (canvasData.viewport) updateViewport(canvasData.viewport);
        }
        setStatus("saved");
      } catch {
        if (alive) setStatus("error");
      }
    })();
    return () => { alive = false; };
  }, [workspaceId]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (status === "unsaved") void saveCanvas();
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [status, saveCanvas]);

  const markUnsaved = useCallback(() => {
    setStatus((prev) => (prev !== "loading" ? "unsaved" : prev));
  }, []);

  // Update object wrapper to mark unsaved
  const updateObjects = useCallback((fn: React.SetStateAction<CanvasObject[]>) => {
    setObjects(fn);
    markUnsaved();
  }, [markUnsaved]);

  const updateConnectors = useCallback((fn: React.SetStateAction<Connector[]>) => {
    setConnectors(fn);
    markUnsaved();
  }, [markUnsaved]);

  const updateViewport = useCallback((fn: React.SetStateAction<Viewport>) => {
    setViewport(fn);
    markUnsaved();
  }, [markUnsaved]);

  const handleRunCodeBoxCanvas = useCallback(async (id: string, e: React.PointerEvent) => {
    e.stopPropagation();
    
    // Optimistic update to set isRunning
    updateObjects(prev => prev.map(o => o.id === id ? { ...o, data: { ...o.data, isRunning: true } } : o));
    
    let currentObjects = objects;
    
    // We need to wait a tick for the state to settle or we can just find the object from current state
    const obj = currentObjects.find(o => o.id === id);
    if (!obj) return;
    
    try {
      let outputText = "";
      if (obj.data?.role === "main") {
        const result = await runExecutionGraph(currentObjects, connectors, id);
        outputText = result.output || result.error || "";
        
        // Also update connected output node if it exists
        const outputConn = connectors.find(c => c.type === "main-output" && c.sourceObjectId === id);
        if (outputConn) {
          updateObjects(prev => prev.map(o => o.id === outputConn.targetObjectId ? { ...o, data: { ...o.data, output: outputText, state: result.error ? "error" : "done" } } : o));
        }
      } else {
        const result = await runCode(obj.data?.language as keyof typeof LANGUAGES, obj.data?.code || "");
        outputText = result.output || result.error || "";
      }
      
      updateObjects(prev => prev.map(o => o.id === id ? { ...o, data: { ...o.data, isRunning: false, output: outputText, outputVisible: true } } : o));
    } catch (err: any) {
      updateObjects(prev => prev.map(o => o.id === id ? { ...o, data: { ...o.data, isRunning: false, output: err.message || "Error running code", outputVisible: true } } : o));
    }
  }, [objects, connectors]);

  

  const handleRunGraphForCodeBox = useCallback(
    async (currentData: CodeBoxData): Promise<{ output?: string; error?: string }> => {
      if (!codeBoxModal) return { error: "No CodeBox selected." };
      const mainId = codeBoxModal.objectId;

      // Update current code in objects state so runner has latest unsaved edits
      const updatedObjects = objects.map((obj) =>
        obj.id === mainId ? { ...obj, data: { ...currentData } } : obj
      );

      const result = await runExecutionGraph(updatedObjects, connectors, mainId);

      // Save execution output on the Output node instead of Main CodeBox
      const outputText = result.output || result.error || "";
      const isError = !!result.error;
      const state = isError ? "error" : "done";
      
      const outputConn = connectors.find(c => c.type === "main-output" && c.sourceObjectId === mainId);
      if (outputConn) {
        updateObjects((prev) =>
          prev.map((obj) =>
            obj.id === outputConn.targetObjectId
              ? {
                  ...obj,
                  data: {
                    ...obj.data,
                    output: outputText,
                    error: isError ? outputText : undefined,
                    state,
                  },
                }
              : obj
          )
        );
      } else {
        // Spawn Output node
        const mainObj = updatedObjects.find(o => o.id === mainId);
        if (mainObj) {
          const outId = generateObjectId("output");
          const outObj: CanvasObject = {
            id: outId,
            type: "output",
            x: mainObj.x,
            y: mainObj.y + mainObj.height + 40,
            width: 300,
            height: 200,
            data: { state, output: outputText, error: isError ? outputText : undefined }
          };
          updateObjects(prev => [...prev, outObj]);
          updateConnectors(prev => [...prev, {
            id: generateObjectId("conn"),
            sourceObjectId: mainId,
            targetObjectId: outId,
            sourceSide: "bottom",
            targetSide: "top",
            type: "main-output"
          }]);
        }
      }

      return { output: result.output, error: result.error };
    },
    [codeBoxModal, objects, connectors, updateObjects, updateConnectors]
  );

  // -----------------------------
  // Drag-to-Connect State
  // -----------------------------
  const [connectingState, setConnectingState] = useState<ConnectingState | null>(null);
  const connectingRef = useRef<ConnectingState | null>(null);

  // -----------------------------
  // Pointer Interaction State
  // -----------------------------
  const [isPanning, setIsPanning] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const panStartRef = useRef<{ clientX: number; clientY: number; vpX: number; vpY: number } | null>(null);

  const draggingRef = useRef<{ clientX: number; clientY: number; objects: { id: string; startX: number; startY: number }[]; } | null>(null);

  const resizingRef = useRef<{
    id: string;
    clientX: number;
    clientY: number;
    startWidth: number;
    startHeight: number;
  } | null>(null);

  // -----------------------------
  // Undo/Redo History
  // -----------------------------
  const historyRef = useRef<{ objects: CanvasObject[], connectors: Connector[] }[]>([]);
  const historyIndexRef = useRef(-1);
  const isUndoRedoAction = useRef(false);

  useEffect(() => {
    if (isUndoRedoAction.current) {
      isUndoRedoAction.current = false;
      return;
    }
    const timer = setTimeout(() => {
      const h = historyRef.current.slice(0, historyIndexRef.current + 1);
      const last = h[h.length - 1];
      if (last && JSON.stringify(last.objects) === JSON.stringify(objects) && JSON.stringify(last.connectors) === JSON.stringify(connectors)) return;
      historyRef.current = [...h, { objects, connectors }];
      historyIndexRef.current = historyRef.current.length - 1;
    }, 400);
    return () => clearTimeout(timer);
  }, [objects, connectors]);

  useEffect(() => {
    const handleUndo = () => {
      if (historyIndexRef.current > 0) {
        historyIndexRef.current--;
        const state = historyRef.current[historyIndexRef.current];
        isUndoRedoAction.current = true;
        setObjects(state.objects);
        setConnectors(state.connectors);
        setStatus("unsaved");
      }
    };
    const handleRedo = () => {
      if (historyIndexRef.current < historyRef.current.length - 1) {
        historyIndexRef.current++;
        const state = historyRef.current[historyIndexRef.current];
        isUndoRedoAction.current = true;
        setObjects(state.objects);
        setConnectors(state.connectors);
        setStatus("unsaved");
      }
    };
    document.addEventListener("diagramly-canvas-undo", handleUndo);
    document.addEventListener("diagramly-canvas-redo", handleRedo);
    return () => {
      document.removeEventListener("diagramly-canvas-undo", handleUndo);
      document.removeEventListener("diagramly-canvas-redo", handleRedo);
    };
  }, []);

  // -----------------------------
  // Viewport Zoom Actions
  // -----------------------------
  const zoomAtPoint = useCallback((factor: number, screenX: number, screenY: number) => {
    updateViewport((prev) => {
      const newZoom = Math.min(Math.max(prev.zoom * factor, MIN_ZOOM), MAX_ZOOM);
      const worldX = (screenX - prev.x) / prev.zoom;
      const worldY = (screenY - prev.y) / prev.zoom;
      return {
        zoom: newZoom,
        x: screenX - worldX * newZoom,
        y: screenY - worldY * newZoom,
      };
    });
  }, []);

  const handleZoomIn = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    zoomAtPoint(1.2, rect.width / 2, rect.height / 2);
  }, [zoomAtPoint]);

  const handleZoomOut = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    zoomAtPoint(0.8, rect.width / 2, rect.height / 2);
  }, [zoomAtPoint]);

  const handleResetView = useCallback(() => {
    updateViewport({ x: 0, y: 0, zoom: 1 });
  }, []);

  // -----------------------------
  // Wheel Zoom Listener
  // -----------------------------
  const clampViewport = useCallback((vp: Viewport, containerWidth: number, containerHeight: number) => {
    return vp;
  }, []);

  // -----------------------------
  // Pan and Zoom (Mouse Wheel)
  // -----------------------------
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      const { clientWidth, clientHeight } = container;

      if (e.ctrlKey || e.metaKey) {
        // Pinch-to-zoom or Ctrl+Wheel zoom
        const factor = e.deltaY < 0 ? 1.08 : 0.92;
        const rect = container.getBoundingClientRect();
        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;
        updateViewport((prev) => {
          const newZoom = Math.min(Math.max(prev.zoom * factor, MIN_ZOOM), MAX_ZOOM);
          const worldX = (screenX - prev.x) / prev.zoom;
          const worldY = (screenY - prev.y) / prev.zoom;
          const newVp = {
            zoom: newZoom,
            x: screenX - worldX * newZoom,
            y: screenY - worldY * newZoom,
          };
          return clampViewport(newVp, clientWidth, clientHeight);
        });
      } else {
        // Panning
        updateViewport((prev) => clampViewport({
          ...prev,
          x: prev.x - e.deltaX,
          y: prev.y - e.deltaY,
        }, clientWidth, clientHeight));
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [clampViewport]);

  // -----------------------------
  // Object Manipulation Actions
  // -----------------------------
  const handleAddObject = useCallback(
    (type: CanvasObjectType) => {
      if (type === "codebox") { handleAddCodeBox(); return; } if (type === "codebox-main") { handleAddCodeBox("main"); return; } if (type === "codebox-function") { handleAddCodeBox("function"); return; } if (false) {
        handleAddCodeBox();
        return;
      }
      if (type === "header") {
        handleAddHeader();
        return;
      }
      const container = containerRef.current;
      const rect = container?.getBoundingClientRect();
      const centerX = rect ? rect.width / 2 : 300;
      const centerY = rect ? rect.height / 2 : 200;

      const worldPos = screenToWorld(centerX, centerY, viewport);

      let width = 160;
      let height = 100;
      let data: Record<string, any> = {};
      let style: Record<string, any> = { fill: "#ffffff", stroke: "#94a3b8" };

      if (type === "rectangle") {
        width = 160;
        height = 100;
        data = { label: "" };
        style = { fill: "#ffffff", stroke: "#64748b", borderRadius: 12 };
      } else if (type === "circle") {
        width = 120;
        height = 120;
        data = { label: "" };
        style = { fill: "#ffffff", stroke: "#6366f1" };
      } else if (type === "text") {
        width = 160;
        height = 50;
        data = { text: "" };
        style = { color: "#1e293b", fontSize: 14 };
      } else if (type === "image") {
        width = 180;
        height = 130;
        data = { src: "", alt: "Image placeholder" };
      } else if (type === "output") {
        width = 300;
        height = 200;
        data = { state: "idle", output: "" };
        style = {};
      }

      const newObject: CanvasObject = {
        id: generateObjectId(type),
        type,
        x: Math.round(worldPos.x - width / 2),
        y: Math.round(worldPos.y - height / 2),
        width,
        height,
        data,
        style,
      };

      updateObjects((prev) => [...prev, newObject]);
      setSelectedIds([newObject.id]);
      setSelectedConnectorId(null);
    },
    [viewport]
  );

  const handleDeleteSelected = useCallback(() => {
    // 1. Delete selected connector
    if (selectedConnectorId) {
      updateConnectors((prev) => prev.filter((c) => c.id !== selectedConnectorId));
      setSelectedConnectorId(null);
      return;
    }

    // 2. Delete selected object and dependent connectors (Step 18)
    if (selectedIds.length > 0) {
      updateObjects((prev) => prev.filter((obj) => !selectedIds.includes(obj.id)));
      updateConnectors((prev) =>
        prev.filter(
          (c) => !selectedIds.includes(c.sourceObjectId) && !selectedIds.includes(c.targetObjectId)
        )
      );
      setSelectedIds([]); setShowProperties(false);
    }
  }, [selectedIds, selectedConnectorId]);

  const handleDuplicateSelected = useCallback(() => {
    if (selectedIds.length === 0) return;
    const targets = objects.filter((obj) => selectedIds.includes(obj.id));
    if (targets.length === 0) return;
    const duplicates = targets.map((target) => ({
      ...target,
      id: generateObjectId(target.type),
      x: target.x + 24,
      y: target.y + 24,
      data: target.data ? JSON.parse(JSON.stringify(target.data)) : undefined,
      style: target.style ? { ...target.style } : undefined,
    }));
    updateObjects((prev) => [...prev, ...duplicates]);
    setSelectedIds(duplicates.map(d => d.id));
    setSelectedConnectorId(null);
  }, [objects, selectedIds]);

  const handleUpdateObjectData = useCallback((id: string, newData: Record<string, any>) => {
    updateObjects((prev) =>
      prev.map((obj) => (obj.id === id ? { ...obj, data: newData } : obj))
    );
  }, []);

  const handleUpdateObject = useCallback((id: string, newData: Record<string, any>, newStyle: Record<string, any>) => {
    updateObjects((prev) =>
      prev.map((obj) => (obj.id === id ? { ...obj, data: newData, style: newStyle } : obj))
    );
  }, []);

  const handleUpdateConnectorStyle = useCallback((id: string, newStyle: Record<string, any>) => {
    updateConnectors((prev) =>
      prev.map((conn) => (conn.id === id ? { ...conn, style: newStyle } : conn))
    );
  }, []);

  // -----------------------------
  // Drag-to-Connect Handlers (Step 5, 6, 7, 8)
  // -----------------------------
  const handleStartConnect = useCallback(
    (sourceObjectId: string, sourceSide: ConnectionSide, e: React.PointerEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;
      const worldPos = screenToWorld(screenX, screenY, viewport);

      const state: ConnectingState = {
        sourceObjectId,
        sourceSide,
        currentWorldPos: worldPos,
      };
      setConnectingState(state);
      connectingRef.current = state;
    },
    [viewport]
  );

  const handleHoverConnectionPoint = useCallback(
    (targetObjectId: string, targetSide: ConnectionSide) => {
      if (!connectingRef.current) return;
      // Step 7: Prevent self-connections
      if (targetObjectId === connectingRef.current.sourceObjectId) return;

      const targetObj = objects.find((o) => o.id === targetObjectId);
      if (!targetObj) return;

      const snapped = getConnectionPointCoordinates(targetObj, targetSide);
      const updated: ConnectingState = {
        ...connectingRef.current,
        currentWorldPos: snapped,
        hoveredTarget: { targetObjectId, targetSide },
      };
      setConnectingState(updated);
      connectingRef.current = updated;
    },
    [objects]
  );

  const handleLeaveConnectionPoint = useCallback(() => {
    if (!connectingRef.current) return;
    const updated: ConnectingState = {
      ...connectingRef.current,
      hoveredTarget: undefined,
    };
    setConnectingState(updated);
    connectingRef.current = updated;
  }, []);

  // -----------------------------
  // Keyboard Shortcuts (Delete, Duplicate, Spacebar)
  // -----------------------------
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isTyping =
        activeEl?.tagName === "INPUT" ||
        activeEl?.tagName === "TEXTAREA" ||
        (activeEl as HTMLElement)?.isContentEditable;

      if (e.code === "Space" && !isTyping) {
        setIsSpacePressed(true);
      }

      if (isTyping) return;

      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedIds.length > 0 || selectedConnectorId) {
          e.preventDefault();
          handleDeleteSelected();
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d") {
        if (selectedIds.length > 0) {
          e.preventDefault();
          handleDuplicateSelected();
        }
      }

      if (e.key === "Escape") {
        setSelectedIds([]); setShowProperties(false);
        setSelectedConnectorId(null);
        setConnectingState(null);
        connectingRef.current = null;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setIsSpacePressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [selectedIds, selectedConnectorId, handleDeleteSelected, handleDuplicateSelected]);

  const [penColor, setPenColor] = useState<string>("#ef4444");
  const [penWidth, setPenWidth] = useState<number>(4);

  // -----------------------------
  // Canvas Background Pointer Handlers
  // -----------------------------
  const handleCanvasPointerDown = (e: React.PointerEvent) => {
    setContextMenu(null);
    // Only initiate pan or draw if clicking the canvas background/container itself
    if (e.target !== e.currentTarget) return;

    if (activeTool === "pen" && e.button === 0) {
      e.currentTarget.setPointerCapture(e.pointerId);
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const worldPos = screenToWorld(e.clientX - rect.left, e.clientY - rect.top, viewport);
      setCurrentPath({ id: generateObjectId("path"), points: [worldPos], color: penColor, strokeWidth: penWidth });
      return;
    }

    // If left click on background or middle click, initiate pan
    if (e.button === 0 && !isSpacePressed && activeTool === "select") {
      e.currentTarget.setPointerCapture(e.pointerId);
      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        const worldPos = screenToWorld(e.clientX - rect.left, e.clientY - rect.top, viewport);
        setSelectionBox({
          startX: worldPos.x,
          startY: worldPos.y,
          endX: worldPos.x,
          endY: worldPos.y,
        });
        setSelectedIds([]); setShowProperties(false);
        setSelectedConnectorId(null);
      }
      return;
    }

    if (e.button === 1 || (e.button === 0 && isSpacePressed)) {
      e.currentTarget.setPointerCapture(e.pointerId);
      setIsPanning(true);
      panStartRef.current = {
        clientX: e.clientX,
        clientY: e.clientY,
        vpX: viewport.x,
        vpY: viewport.y,
      };
      setSelectedIds([]); setShowProperties(false);
      setSelectedConnectorId(null);
    }
  };
  const handleCanvasPointerMove = (e: React.PointerEvent) => {
    // 0. Drawing Path
    if (currentPath && activeTool === "pen") {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const worldPos = screenToWorld(e.clientX - rect.left, e.clientY - rect.top, viewport);
      setCurrentPath((prev) => prev ? { ...prev, points: [...prev.points, worldPos] } : null);
      return;
    }

        // 1. Drag-to-connect active preview tracking & snapping (Step 5 & 8)
    if (connectingRef.current) {
      const rect = containerRef.current!.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;
      const worldPos = screenToWorld(screenX, screenY, viewport);

      const snappedTarget = findConnectionTarget(
        worldPos,
        connectingRef.current.sourceObjectId,
        objects,
        viewport.zoom
      );

      const updated: ConnectingState = {
        ...connectingRef.current,
        currentWorldPos: snappedTarget ? snappedTarget.coords : worldPos,
        hoveredTarget: snappedTarget
          ? { targetObjectId: snappedTarget.targetObjectId, targetSide: snappedTarget.targetSide }
          : undefined,
      };
      setConnectingState(updated);
      connectingRef.current = updated;
      return;
    }

    // 2. Panning canvas
    if (selectionBox) {
      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        const worldPos = screenToWorld(e.clientX - rect.left, e.clientY - rect.top, viewport);
        setSelectionBox((prev) => prev ? { ...prev, endX: worldPos.x, endY: worldPos.y } : null);
      }
      return;
    }

    if (isPanning && panStartRef.current) {
      const dx = e.clientX - panStartRef.current.clientX;
      const dy = e.clientY - panStartRef.current.clientY;
      const container = containerRef.current!;
      updateViewport((prev) => clampViewport({
        ...prev,
        x: panStartRef.current!.vpX + dx,
        y: panStartRef.current!.vpY + dy,
      }, container.clientWidth, container.clientHeight));
      return;
    }

    // 3. Dragging object
    if (draggingRef.current) {
      const { clientX, clientY, objects: dragTargets } = draggingRef.current;
      const deltaX = (e.clientX - clientX) / viewport.zoom;
      const deltaY = (e.clientY - clientY) / viewport.zoom;

      updateObjects((prev) =>
        prev.map((obj) => {
          const target = dragTargets.find((t) => t.id === obj.id);
          if (!target) return obj;
          const newX = Math.round(target.startX + deltaX);
          const newY = Math.round(target.startY + deltaY);
          return {
            ...obj,
            x: newX,
            y: newY,
          };
        })
      );
      return;
    }

    // 4. Resizing object
    if (resizingRef.current) {
      const { id, clientX, clientY, startWidth, startHeight } = resizingRef.current;
      const deltaWidth = (e.clientX - clientX) / viewport.zoom;
      const deltaHeight = (e.clientY - clientY) / viewport.zoom;

      updateObjects((prev) =>
        prev.map((obj) => {
          if (obj.id !== id) return obj;
          const newWidth = Math.max(MIN_OBJECT_SIZE, Math.round(startWidth + deltaWidth));
          const newHeight = Math.max(MIN_OBJECT_SIZE, Math.round(startHeight + deltaHeight));
          return {
            ...obj,
            width: newWidth,
            height: newHeight,
          };
        })
      );
      return;
    }
  };

  const handleCanvasPointerUp = (e: React.PointerEvent) => {
    if (selectionBox) {
      e.currentTarget.releasePointerCapture(e.pointerId);
      const minX = Math.min(selectionBox.startX, selectionBox.endX);
      const maxX = Math.max(selectionBox.startX, selectionBox.endX);
      const minY = Math.min(selectionBox.startY, selectionBox.endY);
      const maxY = Math.max(selectionBox.startY, selectionBox.endY);
      
      const newSelectedIds = objects.filter(obj => {
        const objMinX = obj.x;
        const objMaxX = obj.x + obj.width;
        const objMinY = obj.y;
        const objMaxY = obj.y + obj.height;
        return (
          objMinX < maxX &&
          objMaxX > minX &&
          objMinY < maxY &&
          objMaxY > minY
        );
      }).map(obj => obj.id);

      setSelectedIds(newSelectedIds);
      setSelectionBox(null);
      return;
    }

    // Finish drawing
    if (currentPath && activeTool === "pen") {
      e.currentTarget.releasePointerCapture(e.pointerId);
      if (currentPath.points.length > 1) {
        // Calculate bounding box for the path
        const xs = currentPath.points.map(p => p.x);
        const ys = currentPath.points.map(p => p.y);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);
        const width = Math.max(maxX - minX, 10); // Prevent 0-width
        const height = Math.max(maxY - minY, 10);
        
        // Normalize points relative to bounding box
        const normalizedPoints = currentPath.points.map(p => ({
          x: p.x - minX,
          y: p.y - minY
        }));

        const newPathObj: CanvasObject = {
          id: currentPath.id,
          type: "path",
          x: minX,
          y: minY,
          width,
          height,
          data: {
            points: normalizedPoints,
            color: currentPath.color,
            strokeWidth: currentPath.strokeWidth,
          }
        };
        updateObjects((prev) => [...prev, newPathObj]);
      }
      setCurrentPath(null);
      return;
    }

        // Complete connection if active
    if (connectingRef.current) {
      const { sourceObjectId, sourceSide } = connectingRef.current;
      const rect = containerRef.current?.getBoundingClientRect();
      const screenX = rect ? e.clientX - rect.left : 0;
      const screenY = rect ? e.clientY - rect.top : 0;
      const worldPos = screenToWorld(screenX, screenY, viewport);

      const target =
        connectingRef.current.hoveredTarget ||
        findConnectionTarget(worldPos, sourceObjectId, objects, viewport.zoom);

      if (target && target.targetObjectId !== sourceObjectId) {
        const sourceObj = objects.find((o) => o.id === sourceObjectId);
        const targetObj = objects.find((o) => o.id === target.targetObjectId);

        if (sourceObj && targetObj) {
          const isSourceCodeBox = sourceObj.type === "codebox";
          const isTargetCodeBox = targetObj.type === "codebox";
          const sourceRole = sourceObj.data?.role;
          const targetRole = targetObj.data?.role;

          let connType: "main-function" | "main-output" | "normal" = "normal";

          if (isSourceCodeBox && isTargetCodeBox && sourceRole === "main" && targetRole === "function") {
            connType = "main-function";
          } else if (
            targetObj.type === "output" &&
            isSourceCodeBox &&
            sourceRole === "main" &&
            sourceSide === "bottom" &&
            target.targetSide === "top"
          ) {
            connType = "main-output";
          } else {
            connType = "normal";
          }

          const existingConn = connectors.find(
            (c) =>
              c.sourceObjectId === sourceObjectId &&
              c.targetObjectId === target.targetObjectId &&
              c.sourceSide === sourceSide &&
              c.targetSide === target.targetSide
          );

          if (!existingConn) {
            const newConn: Connector = {
              id: generateObjectId("conn"),
              sourceObjectId,
              targetObjectId: target.targetObjectId,
              sourceSide,
              targetSide: target.targetSide,
              type: connType,
            };
            updateConnectors((prev) => [...prev, newConn]);
            setSelectedConnectorId(newConn.id);
            setSelectedIds([]);
            setShowProperties(false);
          } else {
            setSelectedConnectorId(existingConn.id);
            setSelectedIds([]);
            setShowProperties(false);
          }
        }
      }
      setConnectingState(null);
      connectingRef.current = null;
    }

    setIsPanning(false);
    panStartRef.current = null;
    draggingRef.current = null;
    resizingRef.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture wasn't held
    }
  };

  // -----------------------------
  // Object Pointer Handlers
  // -----------------------------
  const handleStartDrag = (id: string, e: React.PointerEvent) => {
    let targets = objects.filter((o) => selectedIds.includes(o.id));
    if (!targets.some(t => t.id === id)) {
      const target = objects.find(o => o.id === id);
      if (target) {
        targets = [target];
        setSelectedIds([id]);
      }
    }
    if (targets.length === 0) return;
    draggingRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      objects: targets.map(t => ({ id: t.id, startX: t.x, startY: t.y }))
    };
  };

  const handleStartResize = (id: string, e: React.PointerEvent) => {
    const target = objects.find((o) => o.id === id);
    if (!target) return;
    resizingRef.current = {
      id,
      clientX: e.clientX,
      clientY: e.clientY,
      startWidth: target.width,
      startHeight: target.height,
    };
  };

  // Cursor calculation
  const canvasCursor = isPanning
    ? "cursor-grabbing"
    : isSpacePressed
    ? "cursor-grab"
    : connectingState
    ? "cursor-crosshair"
    : "cursor-default";



  return (
    <div
      ref={containerRef}
      onPointerDown={handleCanvasPointerDown}
      onPointerMove={handleCanvasPointerMove}
      onPointerUp={handleCanvasPointerUp}
      onContextMenu={(e) => {
        e.preventDefault();
        if (e.target === e.currentTarget) {
          const rect = e.currentTarget.getBoundingClientRect();
          setContextMenu({ x: e.clientX - rect.left, y: e.clientY - rect.top, objectId: null });
        }
      }}
      className={`relative h-full w-full overflow-hidden bg-white dark:bg-slate-900 ${canvasCursor} select-none touch-none`}
    >

      {/* Floating Canvas Toolbar */}
      <CanvasToolbar
        onAddObject={handleAddObject}
        onDuplicateSelected={handleDuplicateSelected}
        onDeleteSelected={handleDeleteSelected}
        hasSelection={Boolean(selectedIds.length > 0 || selectedConnectorId)}
        canDuplicate={Boolean(selectedIds.length > 0 && !selectedConnectorId)}
        activeTool={activeTool}
        onSetTool={(t) => { setActiveTool(t); setSelectedIds([]); setShowProperties(false); setSelectedConnectorId(null); }}
        penColor={penColor}
        penWidth={penWidth}
        onSetPenColor={setPenColor}
        onSetPenWidth={setPenWidth}
      />

      {/* Floating Viewport Controls */}
      <CanvasControls
        zoom={viewport.zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetView={handleResetView}
      />

      {/* Floating Properties Panel */}
      {showProperties && (
        <PropertiesPanel
          selectedObject={objects.find(o => selectedIds.includes(o.id)) || null}
          selectedConnector={connectors.find(c => c.id === selectedConnectorId) || null}
          onUpdateObject={handleUpdateObject}
          onUpdateConnector={handleUpdateConnectorStyle}
          onClose={() => {
            setShowProperties(false);
          }}
        />
      )}

            {/* World Coordinate Transform Layer (For Objects) */}
      <div
        style={{
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
          transformOrigin: "0 0",
        }}
        className="absolute top-0 left-0 w-full h-full pointer-events-auto"
      >
        
        {/* Step 9 Layering: Canvas Objects Layer (rendered behind connectors now) */}
        <div className="relative z-0">
          {objects.map((obj) => (
            <CanvasObjectRenderer
              key={obj.id}
              object={obj}
              isSelected={selectedIds.includes(obj.id)}
              isConnecting={Boolean(connectingState)}
              snappedSide={
                connectingState?.hoveredTarget?.targetObjectId === obj.id
                  ? connectingState.hoveredTarget.targetSide
                  : undefined
              }
              onSelect={() => {
                if (!selectedIds.includes(obj.id)) {
                  setSelectedIds([obj.id]);
                  setSelectedConnectorId(null);
                }
              }}
              onStartDrag={(e) => handleStartDrag(obj.id, e)}
              onStartResize={(e) => handleStartResize(obj.id, e)}
              onStartConnect={(side, e) => handleStartConnect(obj.id, side, e)}
              
              onHoverConnectionPoint={(side) => handleHoverConnectionPoint(obj.id, side)}
              onLeaveConnectionPoint={handleLeaveConnectionPoint}
              onUpdateData={(newData) => handleUpdateObjectData(obj.id, newData)}
              onOpenCodeBox={handleOpenCodeBox}
              onRunCodeBox={handleRunCodeBoxCanvas}
              isDrawingMode={activeTool === 'pen'}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedIds([obj.id]);
                setSelectedConnectorId(null);
                const rect = containerRef.current?.getBoundingClientRect();
                setContextMenu({ x: e.clientX - (rect?.left || 0), y: e.clientY - (rect?.top || 0), objectId: obj.id });
              }}
              onDeleteObject={(id) => {
                updateObjects(prev => prev.filter(o => o.id !== id));
                updateConnectors(prev => prev.filter(c => c.sourceObjectId !== id && c.targetObjectId !== id));
                if (selectedIds.includes(id)) setSelectedIds([]); setShowProperties(false);
              }}
            />
          ))}
        </div>

        {/* Connectors SVG Layer (Inside world transform, overlaying objects with Neon glow) */}
        <svg
          style={{ width: "100%", height: "100%", overflow: "visible" }}
          className="absolute top-0 left-0 overflow-visible pointer-events-none z-20"
        >
          <defs>
            <marker id="arrowhead" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
              <path d="M 1 2 L 10 6 L 1 10 z" fill="#a855f7" />
            </marker>
            <marker id="arrowhead-selected" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="9" markerHeight="9" orient="auto-start-reverse">
              <path d="M 1 2 L 10 6 L 1 10 z" fill="#38bdf8" />
            </marker>
            <marker id="arrowhead-semantic" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
              <path d="M 1 2 L 10 6 L 1 10 z" fill="#c084fc" />
            </marker>
            <marker id="arrowhead-semantic-selected" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="9" markerHeight="9" orient="auto-start-reverse">
              <path d="M 1 2 L 10 6 L 1 10 z" fill="#e879f9" />
            </marker>
            <marker id="arrowhead-output" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
              <path d="M 1 2 L 10 6 L 1 10 z" fill="#4ade80" />
            </marker>
            <marker id="arrowhead-output-selected" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="9" markerHeight="9" orient="auto-start-reverse">
              <path d="M 1 2 L 10 6 L 1 10 z" fill="#22c55e" />
            </marker>
          </defs>

          {/* Render Normal Connectors */}
          {connectors.map((connector) => {
            const sourceObj = objects.find((o) => o.id === connector.sourceObjectId);
            const targetObj = objects.find((o) => o.id === connector.targetObjectId);
            if (!sourceObj || !targetObj) return null;

            const sourcePoint = getConnectionPointCoordinates(sourceObj, connector.sourceSide);
            const targetPoint = getConnectionPointCoordinates(targetObj, connector.targetSide);

            return (
              <ConnectorRenderer
                key={connector.id}
                connector={connector}
                sourcePoint={sourcePoint}
                targetPoint={targetPoint}
                isSelected={selectedConnectorId === connector.id}
                onSelect={(e) => {
                  setSelectedConnectorId(connector.id);
                  setSelectedIds([]); setShowProperties(false);
                }}
              />
            );
          })}

          {/* Drag-to-Connect Neon Preview Line */}
          {connectingState && (() => {
            const sourceObj = objects.find((o) => o.id === connectingState.sourceObjectId);
            if (!sourceObj) return null;
            const sourcePoint = getConnectionPointCoordinates(sourceObj, connectingState.sourceSide);
            const targetPoint = connectingState.currentWorldPos;

            return (
              <g>
                {/* Neon blur glow under preview */}
                <line
                  x1={sourcePoint?.x || 0}
                  y1={sourcePoint?.y || 0}
                  x2={targetPoint?.x || 0}
                  y2={targetPoint?.y || 0}
                  stroke="#c084fc"
                  strokeWidth={6}
                  strokeLinecap="round"
                  className="pointer-events-none opacity-40 blur-[2px]"
                />
                <line
                  x1={sourcePoint?.x || 0}
                  y1={sourcePoint?.y || 0}
                  x2={targetPoint?.x || 0}
                  y2={targetPoint?.y || 0}
                  stroke="#a855f7"
                  strokeWidth={2.75}
                  strokeDasharray="6 4"
                  strokeLinecap="round"
                  markerEnd="url(#arrowhead)"
                  className="pointer-events-none"
                />
                <circle
                  cx={sourcePoint?.x || 0}
                  cy={sourcePoint?.y || 0}
                  r={4.5}
                  fill="#a855f7"
                  className="pointer-events-none"
                />
              </g>
            );
          })()}
          {/* Multi-selection Box */}
          {selectionBox && (
            <rect
              x={Math.min(selectionBox.startX, selectionBox.endX)}
              y={Math.min(selectionBox.startY, selectionBox.endY)}
              width={Math.abs(selectionBox.endX - selectionBox.startX)}
              height={Math.abs(selectionBox.endY - selectionBox.startY)}
              fill="rgba(168, 85, 247, 0.2)"
              stroke="#a855f7"
              strokeWidth={1 / viewport.zoom}
              className="pointer-events-none"
            />
          )}
          
          {/* Active Drawing Path */}
          {currentPath && currentPath.points.length > 0 && (
            <path
              d={currentPath.points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")}
              fill="none"
              stroke={currentPath.color}
              strokeWidth={currentPath.strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
      </div>

      {/* CodeBox / Header Modal */}
      {codeBoxModal && (() => {
        const targetObj = objects.find((o) => o.id === codeBoxModal.objectId);
        if (!targetObj || (targetObj.type !== "codebox" && targetObj.type !== "header")) return null;
        return (
          <CodeBoxModal
            open={codeBoxModal.open}
            codeBox={targetObj.data as CodeBoxData}
            isHeader={targetObj.type === "header"}
            onClose={handleCloseCodeBox}
            onSave={(data) => handleSaveCodeBox(codeBoxModal.objectId, data)} 
            onRunGraph={targetObj.type === "codebox" ? handleRunGraphForCodeBox : undefined}
          />
        );
      })()}

            {/* Context Menu (For Canvas Background Only) */}
      {contextMenu && !contextMenu.objectId && (
        <div
          className="absolute z-50 min-w-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-lg overflow-hidden py-1 text-sm text-slate-700 dark:text-slate-300"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div className="px-4 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Add Object</div>
          <button className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => { handleAddObject("rectangle"); setContextMenu(null); }}>Rectangle</button>
          <button className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => { handleAddObject("circle"); setContextMenu(null); }}>Circle</button>
          <button className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => { handleAddObject("text"); setContextMenu(null); }}>Text</button>
          <button className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => { handleAddObject("codebox"); setContextMenu(null); }}>CodeBox</button>
          <button className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => { handleAddObject("codebox-main"); setContextMenu(null); }}>Main Code</button>
          <button className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => { handleAddObject("codebox-function"); setContextMenu(null); }}>Function Code</button>
          <button className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => { handleAddObject("output"); setContextMenu(null); }}>Output</button>
          <button className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => { handleAddObject("header"); setContextMenu(null); }}>Header</button>
        </div>
      )}

      {/* Floating Object Toolbar (Canva Style) */}
      {selectedIds.length === 1 && (() => {
        const obj = objects.find(o => o.id === selectedIds[0]);
        if (!obj) return null;
        const screenPos = worldToScreen(obj.x, obj.y, viewport);
        const currentSize = obj.style?.fontSize ?? (obj.type === 'codebox' ? 11 : (obj.type === 'text' ? 14 : 12));
        const isBold = obj.style?.fontWeight === 'bold';
        
        return (
          <div
            className="absolute z-40 flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-full px-3 py-1.5 transition-all"
            style={{ 
              top: Math.max(10, screenPos.y - 60), 
              left: Math.max(10, screenPos.x),
              transform: 'translateX(0)' 
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300 transition-colors" title="Properties" onClick={() => setShowProperties(true)}>
              <Settings className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />
            <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300 transition-colors" title="Decrease Text Size" onClick={() => handleUpdateObject(obj.id, obj.data || {}, { ...(obj.style || {}), fontSize: Math.max(6, currentSize - 2) })}>
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-xs font-medium w-6 text-center text-slate-600 dark:text-slate-300">{currentSize}</span>
            <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300 transition-colors" title="Increase Text Size" onClick={() => handleUpdateObject(obj.id, obj.data || {}, { ...(obj.style || {}), fontSize: currentSize + 2 })}>
              <Plus className="w-4 h-4" />
            </button>
            <button className={`p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors ${isBold ? "text-blue-600 bg-blue-50 dark:bg-blue-900/30" : "text-slate-600 dark:text-slate-300"}`} title="Toggle Bold" onClick={() => handleUpdateObject(obj.id, obj.data || {}, { ...(obj.style || {}), fontWeight: isBold ? 'normal' : 'bold' })}>
              <Bold className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />
            <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300 transition-colors" title="Duplicate" onClick={() => handleDuplicateSelected()}>
              <Copy className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300 transition-colors" title="Bring Forward" onClick={() => {
                updateObjects(prev => {
                  const idx = prev.findIndex(o => o.id === obj.id);
                  if (idx < prev.length - 1) {
                    const next = [...prev];
                    const o = next.splice(idx, 1)[0];
                    next.splice(idx + 1, 0, o);
                    return next;
                  }
                  return prev;
                });
            }}>
              <ArrowUpToLine className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300 transition-colors" title="Send Backward" onClick={() => {
                updateObjects(prev => {
                  const idx = prev.findIndex(o => o.id === obj.id);
                  if (idx > 0) {
                    const next = [...prev];
                    const o = next.splice(idx, 1)[0];
                    next.splice(idx - 1, 0, o);
                    return next;
                  }
                  return prev;
                });
            }}>
              <ArrowDownToLine className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />
            <button className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full text-red-600 dark:text-red-400 transition-colors" title="Delete" onClick={() => handleDeleteSelected()}>
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      })()}
    </div>
  );
}














