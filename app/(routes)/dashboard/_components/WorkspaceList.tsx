"use client";

import React, { useEffect, useMemo, useState } from "react";
import WorkspaceCard, { Workspace } from "./WorkspaceCard";
import EmptyState from "./EmptyState";
import { Loader2 } from "lucide-react";
function formatUpdatedTime(date: string) {
  const updated = new Date(date);
  const now = new Date();

  const diffMs = now.getTime() - updated.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) {
    return "just now";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} minute${
      diffMinutes === 1 ? "" : "s"
    } ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours} hour${
      diffHours === 1 ? "" : "s"
    } ago`;
  }

  const diffDays = Math.floor(diffHours / 24);

  if (diffDays < 7) {
    return `${diffDays} day${
      diffDays === 1 ? "" : "s"
    } ago`;
  }

  return updated.toLocaleDateString();
}
function WorkspaceList() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [sortBy, setSortBy] = useState("recent");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

 
 
  useEffect(() => {
  const fetchWorkspaces = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/workspaces", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load workspaces"
        );
      }

      const formattedWorkspaces: Workspace[] = (
        data.workspaces || []
      ).map((workspace: any) => ({
        id: workspace._id,
        title: workspace.title,
        owner: "You",
        updatedAt: formatUpdatedTime(workspace.updatedAt),
        isFavorite: workspace.isFavorite,
      }));

      setWorkspaces(formattedWorkspaces);
    } catch (error) {
      console.error("Failed to fetch workspaces:", error);
      setError("Failed to load your workspaces.");
    } finally {
      setLoading(false);
    }
  };

  fetchWorkspaces();

  const handleWorkspaceCreated = () => {
    fetchWorkspaces();
  };

  window.addEventListener(
    "workspace-created",
    handleWorkspaceCreated
  );

  return () => {
    window.removeEventListener(
      "workspace-created",
      handleWorkspaceCreated
    );
  };
}, []);

  const sortedWorkspaces = useMemo(() => {
    const sorted = [...workspaces];

    if (sortBy === "name") {
      sorted.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    }

    if (sortBy === "favorites") {
      sorted.sort(
        (a, b) =>
          Number(b.isFavorite) - Number(a.isFavorite)
      );
    }

    // API already returns newest updated first.
    // Keep original order for "recent".
    return sorted;
  }, [workspaces, sortBy]);

  return (
    <div className="flex flex-col gap-4 py-4">

      {/* HEADER */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            My Workspaces
          </h2>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage, edit, and organize your diagram projects.
          </p>
        </div>

        {!loading && workspaces.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="hidden text-xs font-medium text-slate-500 sm:inline">
              Sort by:
            </span>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              <option value="recent">
                Last Updated
              </option>

              <option value="name">
                Title (A-Z)
              </option>

              <option value="favorites">
                Favorites
              </option>
            </select>
          </div>
        )}
      </div>

      {/* DIVIDER */}
      <div className="border-b border-slate-200 dark:border-slate-800" />

      {/* LOADING */}
      {loading && (
        <div className="flex min-h-[220px] items-center justify-center">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading workspaces...
          </div>
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-8 text-center text-sm text-red-600">
          {error}
        </div>
      )}

      {/* EMPTY */}
      {!loading && !error && workspaces.length === 0 && (
        <EmptyState />
      )}

      {/* REAL WORKSPACES */}
      {!loading && !error && sortedWorkspaces.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedWorkspaces.map((workspace) => (
            <WorkspaceCard
              key={workspace.id}
              workspace={workspace}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default WorkspaceList;