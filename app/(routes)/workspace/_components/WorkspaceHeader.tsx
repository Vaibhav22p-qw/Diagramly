"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import OnlineUsers from "./OnlineUsers";

function WorkspaceHeader({
  onSave,
  fileName,
  setFileName,
  isLive,
  setIsLive,
}: {
  onSave: () => void;
  fileName: string;
  setFileName: React.Dispatch<React.SetStateAction<string>>;
  isLive: boolean;
  setIsLive: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isEditing, setIsEditing] = useState(false);

  const handleLiveToggle = () => {
    if (!isLive) {
      const confirmLive = window.confirm("Are you sure you want to go live?");
      if (!confirmLive) return;
    }
    setIsLive(!isLive);
  };

  return (
    <header className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between gap-6">
      <div className="flex items-center gap-4 min-w-0">
        <Link href="/" className="shrink-0">
          <Image
            src="/logo-1.png"
            alt="Logo"
            width={40}
            height={40}
            className="cursor-pointer transition-transform duration-200 hover:scale-105"
          />
        </Link>

        {isEditing ? (
          <div className="flex items-center rounded-lg bg-gray-100 px-2">
            <Input
              autoFocus
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) => e.key === "Enter" && setIsEditing(false)}
              className="h-9 w-48 border-0 bg-transparent p-0 text-[15px] font-medium shadow-none focus-visible:ring-0"
            />
            <span className="text-[15px] font-medium text-gray-400">.pdf</span>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="group flex h-9 items-center gap-1 rounded-lg px-2 transition-colors hover:bg-gray-100"
          >
            <span className="max-w-[220px] truncate text-[15px] font-medium text-gray-900">
              {fileName}
            </span>
            <span className="text-[15px] text-gray-400">.pdf</span>
          </button>
        )}
      </div>

      <div className="flex-1 flex justify-center px-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-900 outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        {isLive && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <OnlineUsers />
          </div>
        )}

        <button
          onClick={handleLiveToggle}
          className={`group flex items-center gap-2.5 rounded-full border py-1.5 pl-2 pr-4 transition-all duration-300 ${
            isLive
              ? "border-red-200 bg-red-50 hover:bg-red-100"
              : "border-slate-200 bg-white hover:bg-slate-50"
          }`}
        >
          <div className="relative flex items-center justify-center">
            {isLive && (
              <span className="absolute h-3.5 w-3.5 animate-ping rounded-full bg-red-400 opacity-75" />
            )}
            <span
              className={`relative h-2.5 w-2.5 rounded-full transition-colors duration-300 ${
                isLive ? "bg-red-500" : "bg-slate-300 group-hover:bg-slate-400"
              }`}
            />
          </div>
          <span
            className={`text-xs font-bold uppercase tracking-wider transition-colors ${
              isLive ? "text-red-600" : "text-slate-500"
            }`}
          >
            {isLive ? "Live" : "Offline"}
          </span>
        </button>

        <div className="h-6 w-px bg-gray-200" />

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-10 rounded-lg border-gray-200 bg-white px-4 text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <img src="/sh.svg" className="mr-2 h-4 w-4" alt="" />
            Share
          </Button>

          <Button
            onClick={() => alert("Coming soon")}
            className="h-10 rounded-lg bg-blue-600 px-5 text-white shadow-sm hover:bg-blue-700"
          >
            <img src="/dow.svg" className="mr-2 h-4 w-4 invert" alt="" />
            Save
          </Button>
        </div>

        <Button className="h-10 w-10 p-0 rounded-full bg-transparent ring-1 ring-transparent transition-all hover:ring-gray-200">
          <img
            src="/p.png"
            alt="Profile"
            className="h-9 w-9 rounded-full object-cover"
          />
        </Button>
      </div>
    </header>
  );
}

export default WorkspaceHeader;
