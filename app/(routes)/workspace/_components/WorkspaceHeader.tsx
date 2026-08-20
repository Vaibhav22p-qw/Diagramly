"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MoreVertical,
  Share2,
  Download,
} from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import OnlineUsers from "./OnlineUsers";
import ProfileMenu from "@/components/menu";
import ViewSwitcher from "./ViewSwitcher";

function WorkspaceHeader({
  onSave,
  fileName,
  setFileName,
  isLive,
  setIsLive,
  showDocument,
  setShowDocument,
  showCompiler,
  setShowCompiler,
  showCanvas,
  setShowCanvas,
}: {
  onSave: () => void;
  fileName: string;
  setFileName: React.Dispatch<React.SetStateAction<string>>;
  isLive: boolean;
  setIsLive: React.Dispatch<React.SetStateAction<boolean>>;

  showDocument: boolean;
  setShowDocument: React.Dispatch<React.SetStateAction<boolean>>;

  showCompiler: boolean;
  setShowCompiler: React.Dispatch<React.SetStateAction<boolean>>;

  showCanvas: boolean;
  setShowCanvas: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);

  const handleLiveToggle = () => {
    if (!isLive) {
      const confirmLive = window.confirm(
        "Are you sure you want to go live?"
      );

      if (!confirmLive) return;
    }

    setIsLive(!isLive);
  };

  const handleShare = () => {
    // Keep your existing share logic here later.
    alert("Share");
    setIsWorkspaceMenuOpen(false);
  };

  const handleDownload = () => {
    // Keep your existing download/save logic here later.
    onSave();
    setIsWorkspaceMenuOpen(false);
  };

  return (
    <header className="relative z-50 flex h-16 items-center justify-between gap-2 border-b border-gray-200 bg-white px-2 sm:gap-6 sm:px-6">

      {/* LEFT */}
      <div className="flex min-w-0 items-center gap-2 sm:gap-4">

        {/* LOGO */}
        <Link
          href="/dashboard"
          className="shrink-0"
        >
          <Image
            src="/diahead.gif"
            alt="Logo"
            width={40}
            height={40}
            className="cursor-pointer transition-transform duration-200 hover:scale-105"
          />
        </Link>

        {/* FILE NAME */}
        {isEditing ? (
          <div className="flex min-w-0 items-center rounded-lg bg-gray-100 px-2">
            <Input
              autoFocus
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) =>
                e.key === "Enter" && setIsEditing(false)
              }
              className="h-9 w-24 border-0 bg-transparent p-0 text-xs font-medium shadow-none focus-visible:ring-0 sm:w-48 sm:text-[15px]"
            />

            <span className="text-xs font-medium text-gray-400 sm:text-[15px]">
              .pdf
            </span>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="group flex h-9 min-w-0 max-w-[120px] items-center gap-1 rounded-lg px-1.5 transition-colors hover:bg-gray-100 sm:max-w-[220px] sm:px-2"
          >
            <span className="truncate text-xs font-medium text-gray-900 sm:text-[15px]">
              {fileName}
            </span>

            <span className="shrink-0 text-xs text-gray-400 sm:text-[15px]">
              .pdf
            </span>
          </button>
        )}
      </div>

      {/* CENTER — VIEW SWITCHER */}
      <div className="flex flex-1 justify-center px-1 sm:px-4">
        <ViewSwitcher
          showDocument={showDocument}
          setShowDocument={setShowDocument}
          showCompiler={showCompiler}
          setShowCompiler={setShowCompiler}
          showCanvas={showCanvas}
          setShowCanvas={setShowCanvas}
        />
      </div>

      {/* RIGHT */}
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-4">

        {/* ONLINE USERS */}
        {isLive && (
          <div className="hidden animate-in fade-in slide-in-from-right-4 duration-300 sm:block">
            <OnlineUsers />
          </div>
        )}

        {/* LIVE */}
        <button
          onClick={handleLiveToggle}
          className={`group flex items-center gap-1.5 rounded-full border px-2 py-1.5 transition-all duration-300 sm:gap-2.5 sm:py-1.5 sm:pl-2 sm:pr-4 ${
            isLive
              ? "border-red-200 bg-red-50 hover:bg-red-100"
              : "border-slate-200 bg-white hover:bg-slate-50"
          }`}
          title={isLive ? "Live" : "Offline"}
        >
          <div className="relative flex items-center justify-center">
            {isLive && (
              <span className="absolute h-3.5 w-3.5 animate-ping rounded-full bg-red-400 opacity-75" />
            )}

            <span
              className={`relative h-2.5 w-2.5 rounded-full transition-colors duration-300 ${
                isLive
                  ? "bg-red-500"
                  : "bg-slate-300 group-hover:bg-slate-400"
              }`}
            />
          </div>

          <span
            className={`hidden text-xs font-bold uppercase tracking-wider transition-colors sm:block ${
              isLive ? "text-red-600" : "text-slate-500"
            }`}
          >
            {isLive ? "Live" : "Offline"}
          </span>
        </button>

        {/* DESKTOP SHARE + SAVE */}
        <div className="hidden items-center gap-2 sm:flex">

          {/* SHARE */}
          <Button
            variant="outline"
            className="h-10 rounded-lg border-gray-200 bg-white px-4 text-gray-700 shadow-sm hover:bg-gray-50"
            onClick={handleShare}
          >
            <img
              src="/sh.svg"
              className="mr-2 h-4 w-4"
              alt=""
            />
            Share
          </Button>

          {/* SAVE */}
          <Button
            onClick={handleDownload}
            className="h-10 rounded-lg bg-blue-600 px-5 text-white shadow-sm hover:bg-blue-700"
          >
            <img
              src="/dow.svg"
              className="mr-2 h-4 w-4 invert"
              alt=""
            />
            Save
          </Button>

        </div>

        {/* MOBILE 3-DOT WORKSPACE MENU */}
        <div className="relative sm:hidden">

          <button
            onClick={() =>
              setIsWorkspaceMenuOpen((open) => !open)
            }
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50 active:scale-95"
            title="Workspace actions"
            aria-label="Workspace actions"
            aria-expanded={isWorkspaceMenuOpen}
          >
            <MoreVertical className="h-5 w-5" />
          </button>

          {isWorkspaceMenuOpen && (
            <div className="absolute right-0 top-11 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl">

              {/* SHARE */}
              <button
                onClick={handleShare}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <Share2 className="h-4 w-4 text-gray-500" />
                Share
              </button>

              {/* DOWNLOAD */}
              <button
                onClick={handleDownload}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <Download className="h-4 w-4 text-gray-500" />
                Download
              </button>

            </div>
          )}

        </div>

        {/* PROFILE */}
        <ProfileMenu />

      </div>
    </header>
  );
}

export default WorkspaceHeader;