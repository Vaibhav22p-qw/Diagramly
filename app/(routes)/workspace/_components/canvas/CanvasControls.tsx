"use client";

import React from "react";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { MIN_ZOOM, MAX_ZOOM } from "./types";

interface CanvasControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
}

export default function CanvasControls({
  zoom,
  onZoomIn,
  onZoomOut,
  onResetView,
}: CanvasControlsProps) {
  const percentage = Math.round(zoom * 100);
  const canZoomIn = zoom < MAX_ZOOM;
  const canZoomOut = zoom > MIN_ZOOM;

  const btnClass =
    "flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 disabled:pointer-events-none transition-colors dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100";

  return (
    <div
      onPointerDown={(e) => e.stopPropagation()}
      className="absolute bottom-4 right-4 z-30 flex items-center gap-1 rounded-xl border border-slate-200/80 bg-white/90 p-1 shadow-lg shadow-slate-200/40 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none select-none"
    >
      <button
        type="button"
        onClick={onZoomOut}
        disabled={!canZoomOut}
        className={btnClass}
        title="Zoom Out (Ctrl + Scroll Down)"
      >
        <ZoomOut className="h-3.5 w-3.5" />
      </button>

      <button
        type="button"
        onClick={onResetView}
        className="px-2 text-xs font-semibold tabular-nums text-slate-700 hover:text-blue-600 transition-colors dark:text-slate-300 dark:hover:text-blue-400"
        title="Reset Zoom to 100%"
      >
        {percentage}%
      </button>

      <button
        type="button"
        onClick={onZoomIn}
        disabled={!canZoomIn}
        className={btnClass}
        title="Zoom In (Ctrl + Scroll Up)"
      >
        <ZoomIn className="h-3.5 w-3.5" />
      </button>

      <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-0.5" />

      <button
        type="button"
        onClick={onResetView}
        className={btnClass}
        title="Center / Reset Canvas View"
      >
        <Maximize2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
