"use client";

import { useOthers, useSelf } from "@liveblocks/react";

export default function OnlineUsersPill() {
  const others = useOthers();
  const self = useSelf();

  const total = (self ? 1 : 0) + others.length;
  if (total === 0) return null;

  return (
    <div className="group relative inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-1 shadow-sm cursor-default select-none transition-colors hover:border-zinc-700">
      {/* Status dot */}
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

      {/* Count */}
      <span className="font-mono text-xs font-medium leading-none text-zinc-300 tabular-nums">
        {total}
      </span>

      {/* Hover card */}
      <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 opacity-0 scale-95 transition-all duration-100 ease-out group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto">
        {/* Caret */}
        <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-l border-t border-zinc-800 bg-zinc-900" />

        <div className="min-w-[140px] rounded-lg border border-zinc-800 bg-zinc-900 py-1.5 shadow-lg">
          <div className="px-3 pb-1 text-[10px] font-medium uppercase tracking-wide text-zinc-500">
            {total} online
          </div>
          <ul className="mt-1">
{self && (
  <li className="flex items-center gap-2 px-3 py-1">
    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
    <span className="truncate text-xs text-zinc-300">
      You ({self.info?.name ?? "Anonymous"})
    </span>
  </li>
)}
            {others.map((o) => (
              <li key={o.connectionId} className="flex items-center gap-2 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="truncate text-xs text-zinc-300">
                  {o.info?.name ?? "Anonymous"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}