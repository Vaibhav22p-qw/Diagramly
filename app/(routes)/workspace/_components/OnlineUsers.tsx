"use client";

import { useOthers, useSelf } from "@liveblocks/react";
import React from "react";

export default function OnlineUsers() {
  const others = useOthers();
  const self = useSelf();

  const total = (self ? 1 : 0) + others.length;
  if (total === 0) return null;

  const allUsers = [
    ...(self ? [{ ...self, isSelf: true }] : []),
    ...others.map((o) => ({ ...o, isSelf: false })),
  ];

  const displayUsers = allUsers.slice(0, 3);
  const extraUsersCount = Math.max(0, allUsers.length - 3);

  const getAvatarColor = (identifier: string) => {
    const colors = [
      "bg-indigo-500", "bg-emerald-500", "bg-cyan-500",
      "bg-violet-500", "bg-rose-500", "bg-amber-500",
    ];
    const index = String(identifier).split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  const getInitials = (name: string) => {
    return (name || "Anonymous").substring(0, 1).toUpperCase();
  };

  return (
    <div className="group relative flex items-center">
      <div className="flex cursor-default items-center gap-2 rounded-full border border-slate-200/60 bg-white/60 p-1 pr-3 shadow-sm backdrop-blur-md transition-all duration-300 hover:bg-white hover:shadow">
        
        <div className="flex -space-x-2 pl-1">
          {displayUsers.map((user, i) => {
            const name = user.info?.name ?? "Anonymous";
            const color = getAvatarColor(user.connectionId?.toString() || name);
            
            return (
              <div
                key={user.connectionId || `user-${i}`}
                className={`relative flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white shadow-sm ring-1 ring-black/5 ${color}`}
              >
                {getInitials(name)}
              </div>
            );
          })}
          
          {extraUsersCount > 0 && (
            <div className="relative flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-[10px] font-bold text-slate-600 shadow-sm ring-1 ring-black/5">
              +{extraUsersCount}
            </div>
          )}
        </div>

        <div className="ml-1 flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600">
            {total}
          </span>
        </div>
      </div>

      <div className="pointer-events-none absolute right-0 top-full z-50 mt-2 w-56 origin-top-right scale-95 opacity-0 drop-shadow-xl transition-all duration-200 ease-out group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100">
        
        <div className="absolute -top-1.5 right-6 h-3 w-3 rotate-45 rounded-tl-sm border-l border-t border-slate-200/80 bg-white" />

        <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white/95 backdrop-blur-xl">
          <div className="border-b border-slate-100 bg-slate-50/50 px-4 py-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Currently Online ({total})
            </span>
          </div>
          
          <ul className="max-h-60 overflow-y-auto p-1.5">
            {allUsers.map((user, i) => {
              const name = user.info?.name ?? "Anonymous";
              const color = getAvatarColor(user.connectionId?.toString() || name);

              return (
                <li
                  key={user.connectionId || `dropdown-${i}`}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-slate-50"
                >
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white shadow-inner ${color}`}>
                    {getInitials(name)}
                  </div>
                  
                  <span className="truncate text-sm font-medium text-slate-700">
                    {name}
                    {user.isSelf && (
                      <span className="ml-1.5 text-xs font-normal text-slate-400">
                        (You)
                      </span>
                    )}
                  </span>
                  
                  <div className="ml-auto flex h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
