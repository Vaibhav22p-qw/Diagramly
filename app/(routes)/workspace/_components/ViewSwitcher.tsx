"use client";

import type { PanelMode, WorkspacePanel } from "./Workspace";

type Props = {
  openPanels: Record<WorkspacePanel, boolean>; showDashboard: boolean; panelMode: PanelMode;
  onPanelToggle: (panel: WorkspacePanel) => void; onPanelModeChange: (mode: PanelMode) => void; onDashboard: () => void;
};
const views: { value: WorkspacePanel; label: string }[] = [
  { value: "document", label: "Document" }, { value: "compiler", label: "Compiler" }, { value: "canvas", label: "Canvas" },
];

export default function ViewSwitcher({ openPanels, showDashboard, panelMode, onPanelToggle, onPanelModeChange, onDashboard }: Props) {
  return (
    <div className="flex items-center justify-center min-w-0">
      <div className="flex items-center gap-1 rounded-full bg-gray-100 p-1 border border-gray-200 shadow-sm">
        <button type="button" aria-pressed={showDashboard} onClick={onDashboard} className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${showDashboard ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:bg-white hover:text-gray-900"}`}><span className="hidden sm:inline">Dashboard</span><span className="sm:hidden">D</span></button>
        <div className="h-5 w-px bg-gray-300" />
        {views.map(({ value, label }) => (
          <button key={value} type="button" aria-pressed={openPanels[value] && !showDashboard} onClick={() => onPanelToggle(value)} className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${openPanels[value] && !showDashboard ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:bg-white hover:text-gray-900"}`}>
            <span className="hidden sm:inline">{label}</span><span className="sm:hidden">{label.slice(0, 1)}</span>
          </button>
        ))}
      </div>
      <div className="ml-2 hidden items-center rounded-full border border-gray-200 bg-white p-0.5 text-xs sm:flex">
        <button type="button" onClick={() => onPanelModeChange("two")} className={`rounded-full px-2.5 py-1 ${panelMode === "two" ? "bg-blue-600 text-white" : "text-gray-500"}`}>2 Panels</button>
        <button type="button" onClick={() => onPanelModeChange("three")} className={`rounded-full px-2.5 py-1 ${panelMode === "three" ? "bg-blue-600 text-white" : "text-gray-500"}`}>3 Panels</button>
      </div>
    </div>
  );
}
