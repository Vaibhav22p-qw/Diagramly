"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { CodeBoxData } from "./canvas/types";
import { LANGUAGES } from "@/lib/compiler/languages";
import CanvasToolbar from "./canvas/CanvasToolbar";
import CanvasControls from "./canvas/CanvasControls";
import CanvasObjectRenderer from "./canvas/CanvasObjectRenderer";
import { CanvasObject, CanvasObjectType, Connector, Viewport, ConnectionSide, ConnectingState, MIN_ZOOM, MAX_ZOOM, MIN_OBJECT_SIZE, generateObjectId, screenToWorld, worldToScreen, getConnectionPointCoordinates, CANVAS_WIDTH, CANVAS_HEIGHT, HeaderData, PathData } from "./canvas/types";
import ConnectorRenderer from "./canvas/ConnectorRenderer";
import CodeBoxModal from "./canvas/CodeBoxModal";
import PropertiesPanel from "./canvas/PropertiesPanel";
import { runExecutionGraph } from "./canvas/execution/graphRunner";


export default function Canvas({ workspaceId, onSaveTrigger, onSaveComplete }: { workspaceId?: string; onSaveTrigger?: number; onSaveComplete?: (success: boolean) => void } = {}) {
  const containerRef = useRef<HTMLDivElement>(null);

  // -----------------------------
  // Canonical Canvas State
  // -----------------------------
  const [objects, setObjects] = useState<CanvasObject[]>([]);
  const [viewport, setViewport] = useState<Viewport>({ x: 0, y: 0, zoom: 1 });

  // CodeBox modal state
  const [codeBoxModal, setCodeBoxModal] = useState<{ objectId: string; open: boolean } | null>(null);

  // Add CodeBox creation
  const handleAddCodeBox = useCallback(() => {
    const container = containerRef.current;
    const rect = container?.getBoundingClientRect();
    const centerX = rect ? rect.width / 2 : 300;
    const centerY = rect ? rect.height / 2 : 200;
    const worldPos = screenToWorld(centerX, centerY, viewport);
    const width = 300;
    const height = 200;
    const data: CodeBoxData = {
      role: "unassigned",
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
    setSelectedId(newObject.id);
    setSelectedConnectorId(null);
    setCodeBoxModal({ objectId: newObject.id, open: true });
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
    setSelectedId(newObject.id);
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



  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedConnectorId, setSelectedConnectorId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; objectId: string | null } | null>(null);

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

  const draggingRef = useRef<{
    id: string;
    clientX: number;
    clientY: number;
    objX: number;
    objY: number;
  } | null>(null);

  const resizingRef = useRef<{
    id: string;
    clientX: number;
    clientY: number;
    startWidth: number;
    startHeight: number;
  } | null>(null);

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
    const minX = Math.min(0, containerWidth - CANVAS_WIDTH * vp.zoom);
    const maxX = Math.max(0, containerWidth - CANVAS_WIDTH * vp.zoom);
    const minY = Math.min(0, containerHeight - CANVAS_HEIGHT * vp.zoom);
    const maxY = Math.max(0, containerHeight - CANVAS_HEIGHT * vp.zoom);
    
    return {
      ...vp,
      x: Math.min(maxX, Math.max(minX, vp.x)),
      y: Math.min(maxY, Math.max(minY, vp.y)),
    };
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
      if (type === "codebox") {
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
        data = { label: "Rectangle" };
        style = { fill: "#ffffff", stroke: "#64748b", borderRadius: 12 };
      } else if (type === "circle") {
        width = 120;
        height = 120;
        data = { label: "Circle" };
        style = { fill: "#ffffff", stroke: "#6366f1" };
      } else if (type === "text") {
        width = 160;
        height = 50;
        data = { text: "Double-click to edit text" };
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
      setSelectedId(newObject.id);
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
    if (selectedId) {
      updateObjects((prev) => prev.filter((obj) => obj.id !== selectedId));
      updateConnectors((prev) =>
        prev.filter(
          (c) => c.sourceObjectId !== selectedId && c.targetObjectId !== selectedId
        )
      );
      setSelectedId(null);
    }
  }, [selectedId, selectedConnectorId]);

  const handleDuplicateSelected = useCallback(() => {
    if (!selectedId) return;
    const target = objects.find((obj) => obj.id === selectedId);
    if (!target) return;

    // Step 17: Duplicate object without inheriting connections
    const duplicate: CanvasObject = {
      ...target,
      id: generateObjectId(target.type),
      x: target.x + 24,
      y: target.y + 24,
      data: target.data ? JSON.parse(JSON.stringify(target.data)) : undefined,
      style: target.style ? { ...target.style } : undefined,
    };

    updateObjects((prev) => [...prev, duplicate]);
    setSelectedId(duplicate.id);
    setSelectedConnectorId(null);
  }, [objects, selectedId]);

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
        if (selectedId || selectedConnectorId) {
          e.preventDefault();
          handleDeleteSelected();
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d") {
        if (selectedId) {
          e.preventDefault();
          handleDuplicateSelected();
        }
      }

      if (e.key === "Escape") {
        setSelectedId(null);
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
  }, [selectedId, selectedConnectorId, handleDeleteSelected, handleDuplicateSelected]);

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
    if (e.button === 0 || e.button === 1) {
      e.currentTarget.setPointerCapture(e.pointerId);
      setIsPanning(true);
      panStartRef.current = {
        clientX: e.clientX,
        clientY: e.clientY,
        vpX: viewport.x,
        vpY: viewport.y,
      };
      // Clear selection if clicking empty canvas
      setSelectedId(null);
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

      // Check proximity snapping (within 24px)
      let snappedTarget: { targetObjectId: string; targetSide: ConnectionSide; coords: { x: number; y: number } } | null = null;
      const SNAP_DISTANCE = 24 / viewport.zoom;

      for (const obj of objects) {
        if (obj.id === connectingRef.current.sourceObjectId) continue;
        const sides: ConnectionSide[] = ["top", "right", "bottom", "left"];
        for (const side of sides) {
          const pt = getConnectionPointCoordinates(obj, side);
          const dist = Math.hypot(pt.x - worldPos.x, pt.y - worldPos.y);
          if (dist < SNAP_DISTANCE) {
            snappedTarget = { targetObjectId: obj.id, targetSide: side, coords: pt };
            break;
          }
        }
        if (snappedTarget) break;
      }

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
      const { id, clientX, clientY, objX, objY } = draggingRef.current;
      const deltaX = (e.clientX - clientX) / viewport.zoom;
      const deltaY = (e.clientY - clientY) / viewport.zoom;

      updateObjects((prev) =>
        prev.map((obj) => {
          if (obj.id !== id) return obj;
          const newX = Math.round(objX + deltaX);
          const newY = Math.round(objY + deltaY);
          return {
            ...obj,
            x: Math.max(0, Math.min(newX, CANVAS_WIDTH - obj.width)),
            y: Math.max(0, Math.min(newY, CANVAS_HEIGHT - obj.height)),
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
            width: Math.min(newWidth, CANVAS_WIDTH - obj.x),
            height: Math.min(newHeight, CANVAS_HEIGHT - obj.y),
          };
        })
      );
      return;
    }
  };

  const handleCanvasPointerUp = (e: React.PointerEvent) => {
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
      const { sourceObjectId, sourceSide, hoveredTarget } = connectingRef.current;
      if (hoveredTarget && hoveredTarget.targetObjectId !== sourceObjectId) {
        const sourceObj = objects.find((o) => o.id === sourceObjectId);
        const targetObj = objects.find((o) => o.id === hoveredTarget.targetObjectId);

        if (sourceObj && targetObj) {
          const isSourceCodeBox = sourceObj.type === "codebox";
          const isTargetCodeBox = targetObj.type === "codebox";

          if (isSourceCodeBox && isTargetCodeBox) {
            const sourceRole = sourceObj.data?.role;
            const targetRole = targetObj.data?.role;

            // Semantic Connector Rule:
            // SOURCE: Main CodeBox, TARGET: Function CodeBox
            if (sourceRole === "main" && targetRole === "function") {
              const alreadyExists = connectors.some(
                (c) =>
                  c.type === "main-function" &&
                  c.sourceObjectId === sourceObjectId &&
                  c.targetObjectId === hoveredTarget.targetObjectId
              );
              if (!alreadyExists) {
                const newConn: Connector = {
                  id: generateObjectId("conn"),
                  sourceObjectId,
                  targetObjectId: hoveredTarget.targetObjectId,
                  sourceSide,
                  targetSide: hoveredTarget.targetSide,
                  type: "main-function",
                };
                updateConnectors((prev) => [...prev, newConn]);
                setSelectedConnectorId(newConn.id);
                setSelectedId(null);
              }
            } else {
              // Reject invalid semantic relationship (Main->Main, Function->Main, Function->Function, self-reference)
              // Do not create an invalid semantic connector
            }
          } else if (targetObj.type === "output") {
            const isSourceMain = sourceObj.type === "codebox" && sourceObj.data?.role === "main";
            if (isSourceMain && sourceSide === "bottom" && hoveredTarget.targetSide === "top") {
              const alreadyExists = connectors.some(
                (c) => c.type === "main-output" && c.sourceObjectId === sourceObjectId && c.targetObjectId === hoveredTarget.targetObjectId
              );
              if (!alreadyExists) {
                const newConn: Connector = {
                  id: generateObjectId("conn"),
                  sourceObjectId,
                  targetObjectId: hoveredTarget.targetObjectId,
                  sourceSide,
                  targetSide: hoveredTarget.targetSide,
                  type: "main-output",
                };
                updateConnectors((prev) => [...prev, newConn]);
                setSelectedConnectorId(newConn.id);
                setSelectedId(null);
              }
            } else {
              // Reject invalid Output connection
            }
          } else {
            // Normal connector between arbitrary objects / shapes
            const newConn: Connector = {
              id: generateObjectId("conn"),
              sourceObjectId,
              targetObjectId: hoveredTarget.targetObjectId,
              sourceSide,
              targetSide: hoveredTarget.targetSide,
              type: "normal",
            };
            updateConnectors((prev) => [...prev, newConn]);
            setSelectedConnectorId(newConn.id);
            setSelectedId(null);
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
    const target = objects.find((o) => o.id === id);
    if (!target) return;
    draggingRef.current = {
      id,
      clientX: e.clientX,
      clientY: e.clientY,
      objX: target.x,
      objY: target.y,
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
      className={`relative h-full w-full overflow-hidden bg-slate-50 dark:bg-slate-900 ${canvasCursor} select-none touch-none`}
    >

      {/* Floating Canvas Toolbar */}
      <CanvasToolbar
        onAddObject={handleAddObject}
        onDuplicateSelected={handleDuplicateSelected}
        onDeleteSelected={handleDeleteSelected}
        hasSelection={Boolean(selectedId || selectedConnectorId)}
        canDuplicate={Boolean(selectedId && !selectedConnectorId)}
        activeTool={activeTool}
        onSetTool={(t) => { setActiveTool(t); setSelectedId(null); setSelectedConnectorId(null); }}
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
      <PropertiesPanel
        selectedObject={objects.find(o => o.id === selectedId) || null}
        selectedConnector={connectors.find(c => c.id === selectedConnectorId) || null}
        onUpdateObject={handleUpdateObject}
        onUpdateConnector={handleUpdateConnectorStyle}
      />

      {/* World Coordinate Transform Layer (For Objects) */}
      <div
        style={{
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
          transformOrigin: "0 0",
        }}
        className="absolute top-0 left-0 h-0 w-0 pointer-events-auto"
      >
        {/* Finite Canvas Boundary */}
        <div 
          className="absolute top-0 left-0 bg-white dark:bg-slate-950 shadow-md ring-1 ring-slate-200 dark:ring-slate-800 pointer-events-none"
          style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
        />
        
        {/* Step 9 Layering: Canvas Objects Layer (rendered behind connectors now) */}
        <div className="relative z-0">
          {objects.map((obj) => (
            <CanvasObjectRenderer
              key={obj.id}
              object={obj}
              isSelected={selectedId === obj.id}
              isConnecting={Boolean(connectingState)}
              snappedSide={
                connectingState?.hoveredTarget?.targetObjectId === obj.id
                  ? connectingState.hoveredTarget.targetSide
                  : undefined
              }
              onSelect={() => {
                setSelectedId(obj.id);
                setSelectedConnectorId(null);
              }}
              onStartDrag={(e) => handleStartDrag(obj.id, e)}
              onStartResize={(e) => handleStartResize(obj.id, e)}
              onStartConnect={(side, e) => handleStartConnect(obj.id, side, e)}
              
              onHoverConnectionPoint={(side) => handleHoverConnectionPoint(obj.id, side)}
              onLeaveConnectionPoint={handleLeaveConnectionPoint}
              onUpdateData={(newData) => handleUpdateObjectData(obj.id, newData)}
              onOpenCodeBox={handleOpenCodeBox}
              isDrawingMode={activeTool === 'pen'}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedId(obj.id);
                setSelectedConnectorId(null);
                const rect = containerRef.current?.getBoundingClientRect();
                setContextMenu({ x: e.clientX - (rect?.left || 0), y: e.clientY - (rect?.top || 0), objectId: obj.id });
              }}
              onDeleteObject={(id) => {
                updateObjects(prev => prev.filter(o => o.id !== id));
                updateConnectors(prev => prev.filter(c => c.sourceObjectId !== id && c.targetObjectId !== id));
                if (selectedId === id) setSelectedId(null);
              }}
            />
          ))}
        </div>

        {/* Connectors SVG Layer (Inside world transform, overlaying objects) */}
        <svg className="absolute top-0 left-0 overflow-visible pointer-events-none z-10" style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}>
          <defs>
            <marker id="arrowhead" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#64748b" />
            </marker>
            <marker id="arrowhead-selected" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#2563eb" />
            </marker>
            <marker id="arrowhead-semantic" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#8b5cf6" />
            </marker>
            <marker id="arrowhead-semantic-selected" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#7c3aed" />
            </marker>
            <marker id="arrowhead-output" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#22c55e" />
            </marker>
            <marker id="arrowhead-output-selected" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#16a34a" />
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
                  setSelectedId(null);
                }}
              />
            );
          })}

          {/* Drag-to-Connect Preview Line */}
          {connectingState && (() => {
            const sourceObj = objects.find((o) => o.id === connectingState.sourceObjectId);
            if (!sourceObj) return null;
            const sourcePoint = getConnectionPointCoordinates(sourceObj, connectingState.sourceSide);
            const targetPoint = connectingState.currentWorldPos;

            return (
              <g>
                <line
                  x1={sourcePoint?.x || 0}
                  y1={sourcePoint?.y || 0}
                  x2={targetPoint?.x || 0}
                  y2={targetPoint?.y || 0}
                  stroke="#3b82f6"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  markerEnd="url(#arrowhead-selected)"
                  className="pointer-events-none"
                />
                <circle
                  cx={sourcePoint?.x || 0}
                  cy={sourcePoint?.y || 0}
                  r={3.5}
                  fill="#3b82f6"
                  className="pointer-events-none"
                />
              </g>
            );
          })()}
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

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="absolute z-50 min-w-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-lg overflow-hidden py-1 text-sm text-slate-700 dark:text-slate-300"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {contextMenu.objectId ? (
            <>
              <button className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => { handleDuplicateSelected(); setContextMenu(null); }}>Duplicate</button>
              <button className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => {
                if (contextMenu.objectId) {
                  updateObjects(prev => {
                    const idx = prev.findIndex(o => o.id === contextMenu.objectId);
                    if (idx < prev.length - 1) {
                      const next = [...prev];
                      const obj = next.splice(idx, 1)[0];
                      next.splice(idx + 1, 0, obj);
                      return next;
                    }
                    return prev;
                  });
                }
                setContextMenu(null);
              }}>Bring Forward</button>
              <button className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => {
                if (contextMenu.objectId) {
                  updateObjects(prev => {
                    const idx = prev.findIndex(o => o.id === contextMenu.objectId);
                    if (idx > 0) {
                      const next = [...prev];
                      const obj = next.splice(idx, 1)[0];
                      next.splice(idx - 1, 0, obj);
                      return next;
                    }
                    return prev;
                  });
                }
                setContextMenu(null);
              }}>Send Backward</button>
              <button className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-red-600 dark:text-red-400" onClick={() => { handleDeleteSelected(); setContextMenu(null); }}>Delete</button>
            </>
          ) : (
            <>
              <div className="px-4 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Add Object</div>
              <button className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => { handleAddObject("rectangle"); setContextMenu(null); }}>Rectangle</button>
              <button className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => { handleAddObject("circle"); setContextMenu(null); }}>Circle</button>
              <button className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => { handleAddObject("text"); setContextMenu(null); }}>Text</button>
              <button className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => { handleAddObject("codebox"); setContextMenu(null); }}>CodeBox</button>
              <button className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => { handleAddObject("output"); setContextMenu(null); }}>Output</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
