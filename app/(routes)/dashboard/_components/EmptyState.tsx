"use client";

import React from "react";
import { FolderPlus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

function EmptyState() {
const handleCreate = () => {
  window.dispatchEvent(new Event("open-create-workspace"));
};

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50">
      {/* Icon */}
      <div className="p-4 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-full mb-4">
        <FolderPlus className="h-10 w-10" />
      </div>

      {/* Text */}
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
        No workspaces yet
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-2 mb-6">
        Get started by creating your first diagram workspace to collaborate, brainstorm, and share your ideas.
      </p>

      {/* Action */}
<Button
  onClick={handleCreate}
  className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-sm"
>
  <Plus className="h-4 w-4" />
  Create Workspace
</Button>
    </div>
  );
}

export default EmptyState;