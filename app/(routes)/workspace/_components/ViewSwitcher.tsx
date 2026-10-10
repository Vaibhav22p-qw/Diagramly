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
      <div className="flex items-center gap-1 rounded-full bg-white dark:bg-slate-900 p-1 border border-purple-200 dark:border-purple-800 shadow-sm">
        <button type="button" aria-pressed={showDashboard} onClick={onDashboard} className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${showDashboard ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 shadow-sm" : "text-slate-600 dark:text-slate-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-300"}`}><span className="hidden sm:inline">Dashboard</span><span className="sm:hidden">D</span></button>
        <div className="h-5 w-px bg-purple-100 dark:bg-purple-900/30" />
        {views.map(({ value, label }) => {
          const isPressed = openPanels[value] && !showDashboard;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={isPressed}
              onClick={() => onPanelToggle(value)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                isPressed
                  ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-300"
              }`}
            >
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{label.slice(0, 1)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
