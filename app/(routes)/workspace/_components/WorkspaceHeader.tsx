"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MoreVertical,
  Share2,
  Download,
  Undo2,
  Redo2,
  Maximize,
  Minimize,
} from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import OnlineUsers from "./OnlineUsers";
import ProfileMenu from "@/components/menu";
import ViewSwitcher from "./ViewSwitcher";
import type { PanelMode, WorkspacePanel } from "./Workspace";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

function WorkspaceHeader({
  onSave,
  fileName,
  setFileName,
  isLive,
  setIsLive,
  openPanels,
  showDashboard,
  panelMode,
  onPanelToggle,
  onPanelModeChange,
  onDashboard,
  onCodeToCanvas,
}: {
  onSave: () => void;
  fileName: string;
  setFileName: React.Dispatch<React.SetStateAction<string>>;
  isLive: boolean;
  setIsLive: React.Dispatch<React.SetStateAction<boolean>>;

  openPanels: Record<WorkspacePanel, boolean>;
  showDashboard: boolean;
  panelMode: PanelMode;
  onPanelToggle: (panel: WorkspacePanel) => void;
  onPanelModeChange: (mode: PanelMode) => void;
  onDashboard: () => void;
  onCodeToCanvas?: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

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
    <header className="relative z-50 flex h-16 items-center justify-between gap-2 border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 sm:gap-6 sm:px-6">

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
          <div className="flex min-w-0 items-center rounded-lg bg-gray-100 dark:bg-slate-800 px-2">
            <Input
              autoFocus
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) =>
                e.key === "Enter" && setIsEditing(false)
              }
              className="h-9 w-24 border-0 bg-transparent p-0 text-xs font-medium shadow-none focus-visible:ring-0 text-slate-900 dark:text-slate-100 sm:w-48 sm:text-[15px]"
            />

            <span className="text-xs font-medium text-gray-400 sm:text-[15px]">
              .pdf
            </span>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="group flex h-9 min-w-0 max-w-[120px] items-center gap-1 rounded-lg px-1.5 transition-colors hover:bg-gray-100 dark:hover:bg-slate-800 sm:max-w-[220px] sm:px-2"
          >
            <span className="truncate text-xs font-medium text-gray-900 dark:text-slate-100 sm:text-[15px]">
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
          openPanels={openPanels}
          showDashboard={showDashboard}
          panelMode={panelMode}
          onPanelToggle={onPanelToggle}
          onPanelModeChange={onPanelModeChange}
          onDashboard={onDashboard}
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

          {/* CODE TO CANVAS */}
          {onCodeToCanvas && (
            <Button
              variant="outline"
              className="h-10 rounded-lg border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-900/30 dark:text-purple-300 shadow-sm hover:bg-purple-100 dark:hover:bg-purple-900/50"
              onClick={onCodeToCanvas}
            >
              Code to Canvas
            </Button>
          )}

          {/* THEME TOGGLE */}
          {mounted && (
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-lg border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-purple-600 dark:hover:text-purple-400"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          )}

          {/* FULLSCREEN */}
          <Button
            variant="outline"
            className="h-10 w-10 p-0 flex items-center justify-center rounded-lg border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 text-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>

          {/* SHARE */}
          <Button
            variant="outline"
            className="h-10 w-10 p-0 flex items-center justify-center rounded-lg border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 text-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
            onClick={handleShare}
            title="Share"
          >
            <Share2 className="h-4 w-4" />
          </Button>

          {/* SAVE */}
          <Button
            onClick={handleDownload}
            className="h-10 w-10 p-0 flex items-center justify-center rounded-lg bg-purple-500/20 text-purple-700 dark:text-purple-300 shadow-sm hover:bg-purple-500/30 border border-purple-500/30"
            title="Save"
          >
            <Download className="h-4 w-4" />
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
