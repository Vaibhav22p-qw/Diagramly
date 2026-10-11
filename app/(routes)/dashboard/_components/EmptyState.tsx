"use client";

import React from "react";
import { FolderPlus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

function EmptyState() {
  const handleCreate = () => {
    window.dispatchEvent(new CustomEvent("open-create-workspace"));
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200/80 bg-white/40 px-4 py-16 text-center backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-900/40">
      {/* Icon */}
      <div className="mb-4 rounded-full bg-purple-50 p-4 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
        <FolderPlus className="h-10 w-10" />
      </div>

      {/* Text */}
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
        No workspaces yet
      </h3>
      <p className="mb-6 mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        Get started by creating your first diagram workspace to collaborate, brainstorm, and bring your ideas to life.
      </p>

      {/* Action */}
      <Button
        onClick={handleCreate}
        className="gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md shadow-purple-500/20 hover:from-purple-700 hover:to-fuchsia-700"
      >
        <Plus className="h-4 w-4" />
        Create Workspace
      </Button>
    </div>
  );
}

export default EmptyState;