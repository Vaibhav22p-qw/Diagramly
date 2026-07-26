"use client";

import React from "react";
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
  favorite: boolean;
}

interface WorkspaceCardProps {
  workspace: Workspace;
}

function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  // Navigation Handler
  const handleOpenWorkspace = () => {
    console.log(`Navigated to /workspace/${workspace.id}`);
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
    { label: "Rename", icon: Pencil, onClick: handleRename },
    { label: "Duplicate", icon: Copy, onClick: handleDuplicate },
    { label: "Share", icon: Share2, onClick: handleShare },
    {
      label: workspace.favorite ? "Remove Favorite" : "Add Favorite",
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
      className="group relative flex flex-col justify-between p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
    >
      {/* Top Section: Icon & Context Menu */}
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
          <Workflow className="h-6 w-6" />
        </div>

        {/* Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 -mr-2 -mt-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            
            {/* Map through dynamic actions */}
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <DropdownMenuItem
                  key={index}
                  onClick={action.onClick}
                  className="gap-2 cursor-pointer"
                >
                  <Icon className="h-4 w-4 text-slate-500" /> {action.label}
                </DropdownMenuItem>
              );
            })}

            <DropdownMenuSeparator />
            
            {/* Trash Action (Kept separate for red styling) */}
            <DropdownMenuItem
              onClick={handleTrash}
              className="gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50"
            >
              <Trash2 className="h-4 w-4" /> Move to Trash
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main Content: Title & Details */}
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-base text-slate-800 dark:text-slate-100 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {workspace.title}
        </h3>

        <div className="flex flex-col gap-2 mt-1">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Updated {workspace.updatedAt}
          </span>
          
          <div className="flex items-center justify-between mt-1 pt-3 border-t border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
              <User className="h-3.5 w-3.5 text-slate-400" />
              {workspace.owner}
            </div>
            
            {/* Conditional Favorite Badge */}
            {workspace.favorite && (
              <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-0.5 rounded-full">
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