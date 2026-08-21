"use client";

import React, { useEffect, useRef, useState } from "react";

export type TerminalEntry = {
  type: "output" | "error" | "system" | "input";
  text: string;
};

interface TerminalProps {
  entries: TerminalEntry[];
  input: string;
  onInputChange: (value: string) => void;
  onSubmitInput?: () => void;
  exitCode?: number | null;
  isRunning?: boolean;
}
export default function Terminal({
  entries,
  input,
  onInputChange,
  onSubmitInput,
  exitCode = null,
  isRunning = false,
}: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);

  const [isMaximized, setIsMaximized] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop =
        terminalRef.current.scrollHeight;
    }
  }, [entries, isRunning]);

  const handleClear = () => {
    // Parent will handle clearing history later.
    window.dispatchEvent(
      new CustomEvent("diagramly-terminal-clear")
    );
  };

  return (
    <div
      className={`flex flex-col w-full bg-black text-white border-t border-slate-00 ${
        isMaximized
          ? "fixed inset-0 z-50"
          : "h-full"
      }`}
    >
      {/* Terminal Toolbar */}
      <div className="h-9 shrink-0 flex items-center justify-between bg-white border-b border-[#000] px-2">
        <div className="flex items-center gap-1">
          {/* Terminal control */}
          <button
            type="button"
            title="Terminal"
            className="px-2 py-1 text-xs text-black hover:bg-[#2b2b2b] rounded"
          >
            Terminal
          </button>

          {/* Clear */}
          <button
            type="button"
            onClick={handleClear}
            title="Clear terminal"
            className="px-2 py-1 text-xs text-black hover:text-white hover:bg-[#2b2b2b] rounded"
          >
            Clear
          </button>
          {/* Settings */}
          <button
            type="button"
            onClick={() =>
              setShowSettings((prev) => !prev)
            }
            title="Terminal settings"
            className="px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-[#2b2b2b] rounded"
          >
            ⚙
          </button>
        </div>

        {/* Input indicator */}
        <div className="flex items-center gap-2 text-[11px]">
          <span
            className={`h-2 w-2 rounded-full ${
              isRunning
                ? "bg-yellow-400 animate-pulse"
                : "bg-emerald-500"
            }`}
          />

          <span className="text-gray-400">
            {isRunning ? "Running" : "Input"}
          </span>
        </div>
      </div>

      {/* Settings */}
      {showSettings && (
        <div className="absolute right-2 mt-9 z-20 w-48 rounded-lg border border-[#333] bg-[#1b1b1b] p-3 shadow-xl">
          <div className="text-xs font-medium text-gray-200 mb-2">
            Terminal Settings
          </div>

          <div className="text-[11px] text-gray-500">
            Comming soon....
          </div>
        </div>
      )}

      {/* Terminal Output */}
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto px-4 py-3 font-mono text-[13px] leading-6"
      >
        {isRunning && (
  <div className="flex items-center gap-2 mt-1">
    <span className="text-green-500">
      &gt;
    </span>

    <input
      autoFocus
      value={input}
      onChange={(e) =>
        onInputChange(e.target.value)
      }
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onSubmitInput?.();
        }
      }}
      className="flex-1 bg-transparent outline-none border-none text-gray-200 font-mono text-[13px] p-0"
      placeholder=""
    />
  </div>
)}
        {entries.length === 0 && !isRunning && (
          <div className="text-gray-600">
            Diagramly terminal
          </div>
        )}

        {entries.map((entry, index) => (
          <div
            key={`${index}-${entry.type}`}
            className={`whitespace-pre-wrap break-words ${
              entry.type === "error"
                ? "text-red-400"
                : entry.type === "system"
                ? "text-green-400"
                : entry.type === "input"
                ? "text-blue-400"
                : "text-gray-200"
            }`}
          >
            {entry.text}
          </div>
        ))}

        {isRunning && (
          <div className="text-yellow-400">
            Running program...
          </div>
        )}

        {exitCode !== null && !isRunning && (
          <div className="mt-2 text-green-400">
            Program code {exitCode}
          </div>
        )}
      </div>


    </div>
  );
}