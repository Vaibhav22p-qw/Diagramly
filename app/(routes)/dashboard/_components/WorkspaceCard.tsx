"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Copy,
  MoreVertical,
  Pencil,
  Share2,
  Star,
  Trash2,
  User,
  Workflow,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export interface Workspace {
  id: string;
  title: string;
  owner: string;
  updatedAt: string;
  isFavorite: boolean;
}

interface WorkspaceCardProps {
  workspace: Workspace;
}

function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const router = useRouter();
  const [isRenaming, setIsRenaming] = useState(false);
  const [titleInput, setTitleInput] = useState(workspace.title);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  // Open workspace
  const handleOpenWorkspace = () => {
    if (isRenaming) return;
    router.push(`/dashboard/workspaces/${workspace.id}`);
  };

  // Rename
  const handleStartRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRenaming(true);
  };

  const handleSaveRename = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const trimmed = titleInput.trim();
    if (!trimmed || trimmed === workspace.title) {
      setIsRenaming(false);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`/api/workspaces/${workspace.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: trimmed }),
      });
      if (res.ok) {
        setIsRenaming(false);
        window.dispatchEvent(new CustomEvent("workspace-created"));
      }
    } catch (err) {
      console.error("Failed to rename workspace:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTitleInput(workspace.title);
    setIsRenaming(false);
  };

  // Duplicate
  const handleDuplicate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setLoading(true);
      const res = await fetch("/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${workspace.title} (Copy)`,
          template: "blank",
        }),
      });
      if (res.ok) {
        window.dispatchEvent(new CustomEvent("workspace-created"));
      }
    } catch (err) {
      console.error("Failed to duplicate workspace:", err);
    } finally {
      setLoading(false);
    }
  };

  // Share
  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const url = `${window.location.origin}/dashboard/workspaces/${workspace.id}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  // Favorite
  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/workspaces/${workspace.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite: !workspace.isFavorite }),
      });
      if (res.ok) {
        window.dispatchEvent(new CustomEvent("workspace-created"));
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  // Delete / Trash
  const handleTrash = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Delete workspace "${workspace.title}"?`)) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/workspaces/${workspace.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        window.dispatchEvent(new CustomEvent("workspace-created"));
      }
    } catch (err) {
      console.error("Failed to delete workspace:", err);
    } finally {
      setLoading(false);
    }
  };

  const actions = [
    {
      label: "Rename",
      icon: Pencil,
      onClick: handleStartRename,
    },
    {
      label: "Duplicate",
      icon: Copy,
      onClick: handleDuplicate,
    },
    {
      label: copied ? "Copied!" : "Share Link",
      icon: Share2,
      onClick: handleShare,
    },
    {
      label: workspace.isFavorite ? "Remove Favorite" : "Add Favorite",
      icon: Star,
      onClick: handleFavorite,
    },
  ];

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Open workspace ${workspace.title}`}
      onClick={handleOpenWorkspace}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleOpenWorkspace();
        }
      }}
      className={`group relative flex cursor-pointer flex-col justify-between rounded-xl border border-slate-200/80 bg-white/80 p-5 backdrop-blur-sm transition-all duration-200 hover:border-purple-500/60 hover:shadow-lg hover:shadow-purple-500/5 focus:outline-none focus:ring-2 focus:ring-purple-500/40 dark:border-slate-800/80 dark:bg-slate-900/80 dark:hover:border-purple-500/60 ${
        loading ? "opacity-60 pointer-events-none" : ""
      }`}
    >
      {/* Top Section */}
      <div className="mb-4 flex items-start justify-between">
        <div className="rounded-lg bg-purple-50 p-2.5 text-purple-600 transition-colors group-hover:bg-purple-100 group-hover:text-purple-700 dark:bg-purple-950/50 dark:text-purple-400 dark:group-hover:bg-purple-900/50">
          <Workflow className="h-6 w-6" />
        </div>

        {/* Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              className="-mr-2 -mt-2 h-8 w-8 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48 border border-slate-200/80 bg-white/95 dark:border-slate-800/80 dark:bg-slate-900/95 backdrop-blur-md">
            {actions.map((action, index) => {
              const Icon = action.icon;

              return (
                <DropdownMenuItem
                  key={index}
                  onClick={action.onClick}
                  className="cursor-pointer gap-2 focus:bg-purple-50 focus:text-purple-700 dark:focus:bg-purple-950/50 dark:focus:text-purple-300"
                >
                  <Icon className="h-4 w-4 text-slate-500" />
                  {action.label}
                </DropdownMenuItem>
              );
            })}

            <DropdownMenuSeparator />

            {/* Trash */}
            <DropdownMenuItem
              onClick={handleTrash}
              className="cursor-pointer gap-2 text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950/50"
            >
              <Trash2 className="h-4 w-4" />
              Delete Workspace
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-1">
        {isRenaming ? (
          <form
            onSubmit={handleSaveRename}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5"
          >
            <input
              type="text"
              value={titleInput}
              autoFocus
              onChange={(e) => setTitleInput(e.target.value)}
              className="h-8 w-full rounded-md border border-purple-400 bg-white px-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-purple-500/40 dark:border-purple-600 dark:bg-slate-800 dark:text-slate-100"
            />
            <button
              type="submit"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-purple-600 text-white hover:bg-purple-700"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleCancelRename}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400"
            >
              <X className="h-4 w-4" />
            </button>
          </form>
        ) : (
          <h3 className="line-clamp-1 text-base font-semibold text-slate-800 transition-colors group-hover:text-purple-600 dark:text-slate-100 dark:group-hover:text-purple-400">
            {workspace.title}
          </h3>
        )}

        <div className="mt-1 flex flex-col gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Updated {workspace.updatedAt}
          </span>

          <div className="mt-1 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800/60">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
              <User className="h-3.5 w-3.5 text-slate-400" />
              {workspace.owner}
            </div>

            <div className="flex items-center gap-2">
              {copied && (
                <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-medium text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                  Link copied!
                </span>
              )}

              {/* Favorite Badge */}
              {workspace.isFavorite && (
                <div className="flex items-center gap-1 rounded-full bg-fuchsia-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-fuchsia-600 dark:bg-fuchsia-950/40 dark:text-fuchsia-400">
                  <Star className="h-3 w-3 fill-fuchsia-500 text-fuchsia-500" />
                  Favorite
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkspaceCard;