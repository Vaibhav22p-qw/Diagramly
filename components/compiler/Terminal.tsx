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
    <div className="flex flex-col h-full w-full bg-black text-white border-t border-[#333]">
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