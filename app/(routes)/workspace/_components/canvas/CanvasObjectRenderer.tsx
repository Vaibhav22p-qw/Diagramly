"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import type { CanvasObject, ConnectionSide } from "./types";
import { Image as ImageIcon } from "lucide-react";

interface CanvasObjectRendererProps {
  object: CanvasObject;
  isSelected: boolean;
  isConnecting?: boolean;
  snappedSide?: ConnectionSide | null;
  onSelect: (e: React.PointerEvent) => void;
  onStartDrag: (e: React.PointerEvent) => void;
  onStartResize: (e: React.PointerEvent) => void;
  onStartConnect: (side: ConnectionSide, e: React.PointerEvent) => void;
  onHoverConnectionPoint?: (side: ConnectionSide) => void;
  onLeaveConnectionPoint?: () => void;
  onUpdateData: (newData: Record<string, any>) => void;
  onOpenCodeBox?: (id: string) => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  onDeleteObject?: (id: string) => void;
  isDrawingMode?: boolean;
}

const SIDES: { side: ConnectionSide; posClass: string }[] = [
  { side: "top", posClass: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" },
  { side: "right", posClass: "top-1/2 right-0 translate-x-1/2 -translate-y-1/2" },
  { side: "bottom", posClass: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2" },
  { side: "left", posClass: "top-1/2 left-0 -translate-x-1/2 -translate-y-1/2" },
];

export default function CanvasObjectRenderer({
  object,
  isSelected,
  isConnecting = false,
  snappedSide = null,
  onSelect,
  onStartDrag,
  onStartResize,
  onStartConnect,
  onHoverConnectionPoint,
  onLeaveConnectionPoint,
  onUpdateData,
  onOpenCodeBox,
  onContextMenu,
  onDeleteObject,
  isDrawingMode = false,
}: CanvasObjectRendererProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isHovered, setIsHovered] = useState(false);
  const [isEditingText, setIsEditingText] = useState(false);
  const [textValue, setTextValue] = useState(object.data?.text || "Text");
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (object.data?.text !== undefined) {
      setTextValue(object.data.text);
    }
  }, [object.data?.text]);

  useEffect(() => {
    if (isEditingText && textInputRef.current) {
      textInputRef.current.focus();
      textInputRef.current.select();
    }
  }, [isEditingText]);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    onSelect(e);
    if (!isEditingText) {
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      onStartDrag(e);
    }
  };

  const handleResizePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    onStartResize(e);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (object.type === "text") {
      e.stopPropagation();
      setIsEditingText(true);
    } else if (object.type === "codebox" || object.type === "header") {
      e.stopPropagation();
      onOpenCodeBox?.(object.id);
    }
  };

  const handleTextBlur = () => {
    setIsEditingText(false);
    onUpdateData({ ...object.data, text: textValue });
  };

  const handleTextKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setIsEditingText(false);
      onUpdateData({ ...object.data, text: textValue });
    }
  };

  const showConnectionPoints = isSelected || isHovered || isConnecting;

  const renderContent = () => {
    switch (object.type) {
      case "rectangle":
        return (
          <div
            className="w-full h-full rounded-xl bg-white/90 shadow-sm flex items-center justify-center p-2 text-center text-xs font-medium text-slate-700 dark:bg-slate-900/90 dark:text-slate-300 transition-colors"
            style={{
              backgroundColor: object.style?.fill,
              borderColor: object.style?.stroke,
              borderWidth: object.style?.strokeWidth ?? 2,
              borderStyle: "solid",
              borderRadius: object.style?.borderRadius ?? 10,
              opacity: object.style?.opacity ?? 1,
            }}
          >
            <span className="select-none pointer-events-none truncate max-w-full">
              {object.data?.label || ""}
            </span>
          </div>
        );

      case "circle":
        return (
          <div
            className="w-full h-full rounded-full bg-white/90 shadow-sm flex items-center justify-center p-2 text-center text-xs font-medium text-slate-700 dark:bg-slate-900/90 dark:text-slate-300 transition-colors"
            style={{
              backgroundColor: object.style?.fill,
              borderColor: object.style?.stroke,
              borderWidth: object.style?.strokeWidth ?? 2,
              borderStyle: "solid",
              opacity: object.style?.opacity ?? 1,
            }}
          >
            <span className="select-none pointer-events-none truncate max-w-full">
              {object.data?.label || ""}
            </span>
          </div>
        );

      case "text":
        return (
          <div
            onDoubleClick={handleDoubleClick}
            className="w-full h-full flex items-center justify-center p-2 text-slate-800 dark:text-slate-100"
            style={{
              fontSize: object.style?.fontSize ?? 14,
              color: object.style?.color,
              fontWeight: object.style?.fontWeight ?? "normal",
              fontStyle: object.style?.fontStyle ?? "normal",
              textDecoration: object.style?.textDecoration ?? "none",
              opacity: object.style?.opacity ?? 1,
            }}
          >
            {isEditingText ? (
              <textarea
                ref={textInputRef}
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                onBlur={handleTextBlur}
                onKeyDown={handleTextKeyDown}
                className="w-full h-full resize-none bg-white/90 p-1 text-center text-slate-900 outline-none ring-2 ring-blue-500 rounded border border-blue-300 dark:bg-slate-900 dark:text-slate-100"
              />
            ) : (
              <span className="select-none break-words text-center w-full leading-snug">
                {textValue}
              </span>
            )}
          </div>
        );

      case "image":
        return (
          <div 
            className="w-full h-full rounded-xl border-2 border-slate-300 overflow-hidden bg-slate-100 flex items-center justify-center text-slate-400 relative group/image"
            style={{ opacity: object.style?.opacity ?? 1 }}
          >
            {object.data?.imageUrl ? (
              <img src={object.data.imageUrl} className="w-full h-full object-contain pointer-events-none" alt="Uploaded" draggable={false} />
            ) : (
              <>
                <ImageIcon className="w-8 h-8 opacity-50" />
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        onUpdateData({ ...object.data, imageUrl: ev.target?.result });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </>
            )}
            {object.data?.imageUrl && (
              <button
                className="absolute top-2 right-2 bg-black/50 text-white rounded p-1 opacity-0 group-hover/image:opacity-100 transition-opacity z-10 hover:bg-black/70"
                onClick={(e) => {
                  e.stopPropagation();
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.onchange = (ev) => {
                    const file = (ev.target as HTMLInputElement).files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (evnt) => onUpdateData({ ...object.data, imageUrl: evnt.target?.result });
                      reader.readAsDataURL(file);
                    }
                  };
                  input.click();
                }}
                title="Change Image"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        );
      case "codebox": {
        const role = object.data?.role || "main";
        const lang = object.data?.language || "cpp";
        const code = object.data?.code || "";
        const isMain = role === "main";
        const isUnassigned = role === "unassigned";

        const cleanCode = code.replace(/^\n+|\n+$/g, "");
        const lines = cleanCode ? cleanCode.split("\n") : [];

        let wrapperClass = "border-slate-400 bg-slate-50/90 dark:border-slate-600 dark:bg-slate-800/40";
        let badgeClass = "bg-slate-600 text-white";
        if (isMain) {
          wrapperClass = "border-purple-400 bg-purple-50/90 dark:border-purple-800 dark:bg-purple-950/40";
          badgeClass = "bg-purple-600 text-white shadow-sm";
        } else if (!isUnassigned) {
          wrapperClass = "border-blue-400 bg-blue-50/90 dark:border-blue-800 dark:bg-blue-950/40";
          badgeClass = "bg-blue-600 text-white shadow-sm";
        }

        return (
          <div
            onDoubleClick={handleDoubleClick}
            className={`w-full h-full rounded-xl border flex flex-col justify-between p-1 shadow-sm transition-all select-none overflow-hidden ${wrapperClass}`}
          >
            {/* Header with Role and Language Badges */}
            <div className="flex items-center justify-between gap-1 mb-1">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${badgeClass}`}
              >
                {role}
              </span>
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {lang}
              </span>
            </div>

            {/* Code Preview */}
            <div className={`flex-1 overflow-hidden font-mono text-[11px] leading-[1.5] rounded-md border shadow-inner flex ${isDark ? 'bg-[#1e1e1e] border-[#2d2d2d]' : 'bg-[#fffffe] border-slate-200'}`}>
              <div className={`flex flex-col text-right select-none w-7 shrink-0 pr-2 py-1.5 border-r pointer-events-none ${isDark ? 'text-[#858585] border-[#2d2d2d] bg-[#1e1e1e]' : 'text-slate-400 border-slate-200 bg-[#fffffe]'}`}>
                {lines.length > 0 ? (
                  lines.map((_: string, i: number) => (
                    <div key={i} className="h-[1.5em] overflow-hidden">{i + 1}</div>
                  ))
                ) : (
                  <div className="h-[1.5em] overflow-hidden">1</div>
                )}
              </div>
              <div className="flex-1 py-1.5 px-2 overflow-hidden pointer-events-none">
                <div className="flex flex-col">
                  {lines.length > 0 ? (
                    lines.map((line: string, i: number) => (
                      <div key={i} className={`whitespace-pre h-[1.5em] tracking-tight ${isDark ? 'text-[#d4d4d4]' : 'text-slate-800'}`}>
                        {line || " "}
                      </div>
                    ))
                  ) : (
                    <div className={`whitespace-pre h-[1.5em] italic ${isDark ? 'text-[#6a9955]' : 'text-emerald-600'}`}>
                      // Write code here
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      }

      case "header": {
        const { language = "cpp", code = "" } = object.data || {};
        const cleanCode = code.replace(/^\n+|\n+$/g, "");
        const lines = cleanCode ? cleanCode.split("\n") : [];
        
        return (
          <div
            onDoubleClick={handleDoubleClick}
            className="w-full h-full rounded-xl border border-pink-400 bg-pink-50/90 dark:border-pink-800 dark:bg-pink-950/40 flex flex-col justify-between p-1 shadow-sm transition-all select-none overflow-hidden"
          >
            {/* Header with Badges */}
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-pink-600 text-white shadow-sm">
                HEADER
              </span>
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {language}
              </span>
            </div>

            {/* Code Preview */}
            <div className={`flex-1 overflow-hidden font-mono text-[11px] leading-[1.5] rounded-md border shadow-inner flex ${isDark ? 'bg-[#1e1e1e] border-[#2d2d2d]' : 'bg-[#fffffe] border-slate-200'}`}>
              <div className={`flex flex-col text-right select-none w-7 shrink-0 pr-2 py-1.5 border-r pointer-events-none ${isDark ? 'text-[#858585] border-[#2d2d2d] bg-[#1e1e1e]' : 'text-slate-400 border-slate-200 bg-[#fffffe]'}`}>
                {lines.length > 0 ? (
                  lines.map((_: string, i: number) => (
                    <div key={i} className="h-[1.5em] overflow-hidden">{i + 1}</div>
                  ))
                ) : (
                  <div className="h-[1.5em] overflow-hidden">1</div>
                )}
              </div>
              <div className="flex-1 py-1.5 px-2 overflow-hidden pointer-events-none">
                <div className="flex flex-col">
                  {lines.length > 0 ? (
                    lines.map((line: string, i: number) => (
                      <div key={i} className={`whitespace-pre h-[1.5em] tracking-tight ${isDark ? 'text-[#d4d4d4]' : 'text-slate-800'}`}>
                        {line || " "}
                      </div>
                    ))
                  ) : (
                    <div className={`whitespace-pre h-[1.5em] italic ${isDark ? 'text-[#6a9955]' : 'text-emerald-600'}`}>
                      // Write code here
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      }

      case "output": {
        const { state = "idle", output = "", error = "" } = object.data || {};
        
        let headerText = "OUTPUT";
        let headerColor = "text-slate-400";
        if (state === "compiling") {
          headerText = "COMPILING...";
          headerColor = "text-blue-400";
        } else if (state === "running") {
          headerText = "RUNNING...";
          headerColor = "text-yellow-400";
        } else if (state === "error") {
          headerText = "ERROR";
          headerColor = "text-red-400";
        } else if (state === "done") {
          headerText = "EXIT 0";
          headerColor = "text-green-400";
        }

        return (
          <div className={`w-full h-full rounded-md border shadow-md flex flex-col overflow-hidden font-mono text-[11px] select-none ${isDark ? 'border-[#2d2d2d] bg-[#1e1e1e]' : 'border-slate-300 bg-white'}`}>
            {/* Terminal Header */}
            <div className={`flex items-center justify-between px-2 py-1 border-b shrink-0 ${isDark ? 'bg-[#252526] border-[#2d2d2d]' : 'bg-slate-100 border-slate-200'}`}>
              <span className={`font-bold uppercase tracking-wider ${headerColor}`}>
                {headerText}
              </span>
              <div className="flex space-x-2">
                <button 
                  className={`hover:text-white ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
                  onClick={() => onUpdateData({ ...object.data, output: "", error: "", state: "idle" })}
                  title="Clear Output"
                >
                  Clear
                </button>
                <button 
                  className="text-slate-400 hover:text-red-400" 
                  onClick={() => onDeleteObject?.(object.id)}
                  title="Delete Output Node"
                >
                  Close
                </button>
              </div>
            </div>
            {/* Terminal Body */}
            <div className={`flex-1 p-2 overflow-y-auto whitespace-pre-wrap break-words leading-tight ${isDark ? 'text-[#d4d4d4]' : 'text-slate-800'}`}>
              {error ? (
                <span className={isDark ? 'text-[#f48771]' : 'text-red-600'}>{error}</span>
              ) : output ? (
                <span>{output}</span>
              ) : (
                <span className={`italic ${isDark ? 'text-[#858585]' : 'text-slate-500'}`}>Waiting for execution...</span>
              )}
            </div>
          </div>
        );
      }
      case "path": {
        const { points = [] } = object.data || {};
        const color = object.style?.stroke || object.data?.color || "#000000";
        const strokeWidth = object.style?.strokeWidth || object.data?.strokeWidth || 2;
        const opacity = object.style?.opacity ?? 1;

        if (points.length === 0) return null;
        const d = points.map((p: {x: number, y: number}, i: number) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
        return (
          <svg className="w-full h-full overflow-visible pointer-events-none" style={{ opacity }}>
            <path
              d={d}
              stroke={color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        transform: `translate(${object.x}px, ${object.y}px)`,
        width: `${object.width}px`,
        height: `${object.height}px`,
      }}
      onPointerDown={isDrawingMode ? undefined : handlePointerDown}
      onDoubleClick={isDrawingMode ? undefined : handleDoubleClick}
      onContextMenu={isDrawingMode ? undefined : onContextMenu}
      onPointerEnter={isDrawingMode ? undefined : () => setIsHovered(true)}
      onPointerLeave={isDrawingMode ? undefined : () => setIsHovered(false)}
      className={`absolute top-0 left-0 transition-[box-shadow,border-color] duration-75 ${
        isDrawingMode ? "pointer-events-none" : "cursor-move"
      } ${
        isSelected && !isDrawingMode
          ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-950 rounded-xl"
          : !isDrawingMode ? "hover:ring-1 hover:ring-slate-400/60 rounded-xl" : ""
      }`}
    >
      {renderContent()}

      {/* Four Connection Points */}
      {!isDrawingMode && showConnectionPoints &&
        SIDES.map(({ side, posClass }) => {
          const isSnapped = snappedSide === side;
          return (
            <div
              key={side}
              onPointerDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
                e.currentTarget.setPointerCapture(e.pointerId);
                onStartConnect(side, e);
              }}
              onPointerEnter={(e) => {
                e.stopPropagation();
                onHoverConnectionPoint?.(side);
              }}
              onPointerLeave={(e) => {
                e.stopPropagation();
                onLeaveConnectionPoint?.();
              }}
              className={`absolute z-20 h-3 w-3 rounded-full border-2 border-white shadow-md cursor-crosshair transition-all duration-150 ${posClass} ${
                isSnapped
                  ? "bg-blue-600 ring-4 ring-blue-400/50 scale-150"
                  : "bg-blue-500 hover:scale-125 hover:bg-blue-600"
              }`}
              title={`Connect from ${side}`}
            />
          );
        })}

      {/* Resize Handle at Bottom-Right */}
      {!isDrawingMode && isSelected && (
        <div
          onPointerDown={handleResizePointerDown}
          className="absolute -bottom-1.5 -right-1.5 h-3.5 w-3.5 rounded-sm border-2 border-white bg-blue-600 shadow-sm cursor-se-resize dark:border-slate-900 z-10"
          title="Drag to resize"
        />
      )}
    </div>
  );
}
