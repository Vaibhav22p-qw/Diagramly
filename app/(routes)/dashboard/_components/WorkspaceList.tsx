"use client";

import React, { useState } from "react";
import WorkspaceCard, { Workspace } from "./WorkspaceCard";
import EmptyState from "./EmptyState";


// Mock workspaces data for presentation
const INITIAL_WORKSPACES: Workspace[] = [
  {
    id: "1",
    title: "Software Architecture",
    owner: "You",
    updatedAt: "2 hours ago",
    favorite: true,
  },
  {
    id: "2",
    title: "DBMS Project",
    owner: "You",
    updatedAt: "Yesterday",
    favorite: false,
  },
  {
    id: "3",
    title: "Frontend System Design",
    owner: "You",
    updatedAt: "3 days ago",
    favorite: true,
  },
];

function WorkspaceList() {
  // Static variable used until API connection
  const workspaces = INITIAL_WORKSPACES;
  const [sortBy, setSortBy] = useState("recent");

  return (
    <div className="flex flex-col gap-4 py-4">
      {/* List Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            My Workspaces
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage, edit, and organize your diagram projects.
          </p>
        </div>

        {/* Sort Controls */}
        {workspaces.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              Sort by:
            </span>
            <select
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value)}
  className="h-8 px-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
>
  <option value="recent">Last Updated</option>
  <option value="name">Title (A-Z)</option>
  <option value="favorites">Favorites</option>
</select>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-b border-slate-200 dark:border-slate-800" />

      {/* Workspaces Grid or Empty State */}
      {workspaces.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workspaces.map((workspace) => (
            <WorkspaceCard key={workspace.id} workspace={workspace} />
          ))}
        </div>
      )}
    </div>
  );
}

export default WorkspaceList;