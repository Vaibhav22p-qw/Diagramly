"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Copy,
  MoreVertical,
  Pencil,
  Share2,
  Star,
  Trash2,
  User,
  Workflow,
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

  // Navigation Handler
  const handleOpenWorkspace = () => {
    router.push(`/workspace/${workspace.id}`);
  };

  // Action Handlers
  const handleRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Rename triggered");
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Duplicate triggered");
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Share triggered");
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Favorite toggled");
  };

  const handleTrash = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Move to trash triggered");
  };

  // Dynamic Actions List
  const actions = [
    {
      label: "Rename",
      icon: Pencil,
      onClick: handleRename,
    },
    {
      label: "Duplicate",
      icon: Copy,
      onClick: handleDuplicate,
    },
    {
      label: "Share",
      icon: Share2,
      onClick: handleShare,
    },
    {
      label: workspace.isFavorite
        ? "Remove Favorite"
        : "Add Favorite",
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
      className="group relative flex cursor-pointer flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:border-blue-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500"
    >
      {/* Top Section */}
      <div className="mb-4 flex items-start justify-between">
        <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600 transition-colors group-hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-400 dark:group-hover:bg-blue-900/50">
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
              className="-mr-2 -mt-2 h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            {actions.map((action, index) => {
              const Icon = action.icon;

              return (
                <DropdownMenuItem
                  key={index}
                  onClick={action.onClick}
                  className="cursor-pointer gap-2"
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
              Move to Trash
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-1">
        <h3 className="line-clamp-1 text-base font-semibold text-slate-800 transition-colors group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">
          {workspace.title}
        </h3>

        <div className="mt-1 flex flex-col gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Updated {workspace.updatedAt}
          </span>

          <div className="mt-1 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800/60">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
              <User className="h-3.5 w-3.5 text-slate-400" />
              {workspace.owner}
            </div>

            {/* Favorite Badge */}
            {workspace.isFavorite && (
              <div className="flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400">
                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                Favorite
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkspaceCard;