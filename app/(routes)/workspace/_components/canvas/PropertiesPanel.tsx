import React from "react";
import { CanvasObject, Connector } from "./types";
import { Bold, Italic, Underline, Image as ImageIcon } from "lucide-react";

interface PropertiesPanelProps {
  selectedObject: CanvasObject | null;
  selectedConnector: Connector | null;
  onUpdateObject: (id: string, newData: Record<string, any>, newStyle: Record<string, any>) => void;
  onUpdateConnector: (id: string, newStyle: Record<string, any>) => void;
}

const COLORS = [
  "#ffffff", "#f8fafc", "#f1f5f9", "#e2e8f0", "#94a3b8", "#475569", "#0f172a", // Grays
  "#fee2e2", "#ef4444", "#b91c1c", // Reds
  "#fef3c7", "#f59e0b", "#b45309", // Yellows
  "#dcfce7", "#22c55e", "#15803d", // Greens
  "#dbeafe", "#3b82f6", "#1d4ed8", // Blues
  "#f3e8ff", "#a855f7", "#7e22ce", // Purples
  "transparent"
];

const STROKE_WIDTHS = [1, 2, 3, 4, 6, 8];
const FONT_SIZES = [12, 14, 16, 20, 24, 32, 48];

export default function PropertiesPanel({
  selectedObject,
  selectedConnector,
  onUpdateObject,
  onUpdateConnector,
}: PropertiesPanelProps) {
  if (!selectedObject && !selectedConnector) return null;

  const handleStyleChange = (key: string, value: any) => {
    if (selectedObject) {
      onUpdateObject(selectedObject.id, selectedObject.data || {}, {
        ...(selectedObject.style || {}),
        [key]: value,
      });
    } else if (selectedConnector) {
      onUpdateConnector(selectedConnector.id, {
        ...(selectedConnector.style || {}),
        [key]: value,
      });
    }
  };

  const handleDataChange = (key: string, value: any) => {
    if (selectedObject) {
      onUpdateObject(selectedObject.id, {
        ...(selectedObject.data || {}),
        [key]: value,
      }, selectedObject.style || {});
    }
  };

  const currentStyle = (selectedObject?.style || selectedConnector?.style || {}) as Record<string, any>;

  const renderColorPicker = (label: string, styleKey: string) => (
    <div className="flex flex-col gap-1 mb-3">
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
      <div className="flex flex-wrap gap-1">
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => handleStyleChange(styleKey, c)}
            className={`w-5 h-5 rounded border ${currentStyle[styleKey] === c ? "ring-2 ring-blue-500" : "border-slate-300 dark:border-slate-600"} ${c === "transparent" ? "bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzhhYWGMYAEYB8RmROaABADeOQ8CXl/xfgAAAABJRU5ErkJggg==')]" : ""}`}
            style={c !== "transparent" ? { backgroundColor: c } : {}}
            title={c}
          />
        ))}
      </div>
    </div>
  );

  const renderStrokeWidth = () => (
    <div className="flex flex-col gap-1 mb-3">
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Line Width</span>
      <select
        value={currentStyle.strokeWidth || 2}
        onChange={(e) => handleStyleChange("strokeWidth", Number(e.target.value))}
        className="text-xs border rounded p-1 dark:bg-slate-800 dark:border-slate-700 w-full"
      >
        {STROKE_WIDTHS.map((w) => (
          <option key={w} value={w}>{w}px</option>
        ))}
      </select>
    </div>
  );

  const renderOpacity = () => (
    <div className="flex flex-col gap-1 mb-3">
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Opacity</span>
      <input
        type="range"
        min="0.1"
        max="1"
        step="0.1"
        value={currentStyle.opacity ?? 1}
        onChange={(e) => handleStyleChange("opacity", Number(e.target.value))}
        className="w-full accent-blue-500"
      />
    </div>
  );

  return (
    <div
      onPointerDown={(e) => e.stopPropagation()}
      className="absolute top-20 right-4 w-48 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-3 z-30 select-none overflow-y-auto max-h-[80vh]"
    >
      <div className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-3 border-b pb-2 dark:border-slate-800">
        Properties
      </div>

      {selectedConnector && (
        <>
          {renderColorPicker("Stroke Color", "stroke")}
          {renderStrokeWidth()}
        </>
      )}

      {selectedObject && (
        <>
          {(selectedObject.type === "rectangle" || selectedObject.type === "circle" || selectedObject.type === "text" || selectedObject.type === "path") && (
            <>
              {selectedObject.type !== "path" && renderColorPicker(selectedObject.type === "text" ? "Text Color" : "Fill", selectedObject.type === "text" ? "color" : "fill")}
              {selectedObject.type !== "text" && renderColorPicker("Stroke Color", "stroke")}
              {selectedObject.type !== "text" && renderStrokeWidth()}
              {selectedObject.type !== "path" && renderOpacity()}
            </>
          )}

          {selectedObject.type === "text" && (
            <div className="flex flex-col gap-2 mb-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Text Formatting</span>
              <div className="flex gap-1 items-center">
                <button
                  onClick={() => handleStyleChange("fontWeight", currentStyle.fontWeight === "bold" ? "normal" : "bold")}
                  className={`p-1.5 rounded border ${currentStyle.fontWeight === "bold" ? "bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600" : "hover:bg-slate-50 dark:hover:bg-slate-800 border-transparent"}`}
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleStyleChange("fontStyle", currentStyle.fontStyle === "italic" ? "normal" : "italic")}
                  className={`p-1.5 rounded border ${currentStyle.fontStyle === "italic" ? "bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600" : "hover:bg-slate-50 dark:hover:bg-slate-800 border-transparent"}`}
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleStyleChange("textDecoration", currentStyle.textDecoration === "underline" ? "none" : "underline")}
                  className={`p-1.5 rounded border ${currentStyle.textDecoration === "underline" ? "bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600" : "hover:bg-slate-50 dark:hover:bg-slate-800 border-transparent"}`}
                >
                  <Underline className="w-3.5 h-3.5" />
                </button>
                <select
                  value={currentStyle.fontSize || 14}
                  onChange={(e) => handleStyleChange("fontSize", Number(e.target.value))}
                  className="text-xs border rounded p-1 ml-auto dark:bg-slate-800 dark:border-slate-700 w-16"
                >
                  {FONT_SIZES.map(s => <option key={s} value={s}>{s}px</option>)}
                </select>
              </div>
            </div>
          )}

          {selectedObject.type === "image" && (
            <>
              {renderOpacity()}
              <div className="flex flex-col gap-1 mb-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Replace Image</span>
                <label className="flex items-center justify-center gap-2 w-full border border-dashed border-slate-300 dark:border-slate-700 rounded p-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <ImageIcon className="w-4 h-4 text-slate-500" />
                  <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300">Upload...</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (evnt) => handleDataChange("imageUrl", evnt.target?.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
