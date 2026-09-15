"use client";

import React from "react";
import {
  Square,
  Circle as CircleIcon,
  Type,
  Image as ImageIcon,
  Copy,
  Trash2,
  MousePointer,
  Pen,
} from "lucide-react";
import type { CanvasObjectType } from "./types";

interface CanvasToolbarProps {
  onAddObject: (type: CanvasObjectType) => void;
  onDuplicateSelected: () => void;
  onDeleteSelected: () => void;
  hasSelection: boolean;
  canDuplicate?: boolean;
  activeTool?: "select" | "pen";
  onSetTool?: (tool: "select" | "pen") => void;
  penColor?: string;
  penWidth?: number;
  onSetPenColor?: (c: string) => void;
  onSetPenWidth?: (w: number) => void;
}

export default function CanvasToolbar({
  onAddObject,
  onDuplicateSelected,
  onDeleteSelected,
  hasSelection,
  canDuplicate = true,
  activeTool = "select",
  onSetTool,
  penColor = "#ef4444",
  penWidth = 4,
  onSetPenColor,
  onSetPenWidth,
}: CanvasToolbarProps) {
  const toolBtn =
    "flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100";

  return (
    <div
      onPointerDown={(e) => e.stopPropagation()}
      className="absolute top-1/2 right-4 -translate-y-1/2 z-30 flex flex-col items-center gap-2 rounded-xl border border-slate-200/80 bg-white/90 p-2 shadow-lg shadow-slate-200/40 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none select-none"
    >
      {/* Selection Mode Indicator */}
      <button
        type="button"
        onClick={() => onSetTool?.("select")}
        className={`flex items-center justify-center p-2 rounded-lg transition-colors ${
          activeTool === "select"
            ? "bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-slate-100"
            : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
        }`}
        title="Select Tool"
      >
        <MousePointer className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={() => onSetTool?.("pen")}
        className={`flex items-center justify-center p-2 rounded-lg transition-colors ${
          activeTool === "pen"
            ? "bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-slate-100"
            : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
        }`}
        title="Pen Tool"
      >
        <Pen className="h-4 w-4" />
      </button>

      {activeTool === "pen" && (
        <div className="flex flex-col items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          <input
            type="color"
            value={penColor}
            onChange={(e) => onSetPenColor?.(e.target.value)}
            className="w-5 h-5 rounded cursor-pointer border-none bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch]:rounded"
            title="Pen Color"
          />
          {[2, 4, 8].map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => onSetPenWidth?.(w)}
              className={`w-6 h-6 flex items-center justify-center rounded text-[10px] font-bold ${
                penWidth === w ? "bg-white shadow dark:bg-slate-600 text-slate-900 dark:text-slate-100" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      )}

      <div className="w-full h-px bg-slate-200 dark:bg-slate-800" />

      {/* Creation Tools */}
      <button
        type="button"
        onClick={() => onAddObject("rectangle")}
        className="flex items-center justify-center p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors dark:text-slate-300 dark:hover:bg-slate-800"
        title="Add Rectangle"
      >
        <Square className="h-4 w-4 text-blue-500" />
      </button>

      <button
        type="button"
        onClick={() => onAddObject("circle")}
        className="flex items-center justify-center p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors dark:text-slate-300 dark:hover:bg-slate-800"
        title="Add Circle"
      >
        <CircleIcon className="h-4 w-4 text-indigo-500" />
      </button>

      <button
        type="button"
        onClick={() => onAddObject("text")}
        className="flex items-center justify-center p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors dark:text-slate-300 dark:hover:bg-slate-800"
        title="Add Text"
      >
        <Type className="h-4 w-4 text-emerald-500" />
      </button>

       <button
         type="button"
         onClick={() => onAddObject("codebox")}
         className="flex items-center justify-center p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors dark:text-slate-300 dark:hover:bg-slate-800"
         title="Add CodeBox"
       >
         <code className="h-4 w-4 text-purple-500 font-bold block">{"{}"}</code>
       </button>

       <button
         type="button"
         onClick={() => onAddObject("output")}
         className="flex items-center justify-center p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors dark:text-slate-300 dark:hover:bg-slate-800"
         title="Add Output Terminal"
       >
         <code className="h-4 w-4 text-green-500 font-bold block">{">_"}</code>
       </button>

      <button
        type="button"
        onClick={() => onAddObject("image")}
        className="flex items-center justify-center p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors dark:text-slate-300 dark:hover:bg-slate-800"
        title="Add Image"
      >
        <ImageIcon className="h-4 w-4 text-amber-500" />
      </button>

      {/* Selected Object Operations */}
      {hasSelection && (
        <>
          <div className="w-full h-px bg-slate-200 dark:bg-slate-800" />

          {canDuplicate && (
            <button
              type="button"
              onClick={onDuplicateSelected}
              className="flex items-center justify-center p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors dark:text-slate-300 dark:hover:bg-slate-800"
              title="Duplicate Selected (Ctrl+D)"
            >
              <Copy className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            </button>
          )}

          <button
            type="button"
            onClick={onDeleteSelected}
            className="flex items-center justify-center p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors dark:text-red-400 dark:hover:bg-red-950/40"
            title="Delete Selected (Delete / Backspace)"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  );
}
