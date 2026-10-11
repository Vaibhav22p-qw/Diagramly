"use client";

import Header from "../_components/Header";
import WorkspaceList from "../_components/WorkspaceList";

export default function WorkspacesPage() {
  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950">
      <div className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/70 px-4 py-3 backdrop-blur-md dark:border-slate-800/70 dark:bg-slate-950/70 sm:px-6 lg:px-8">
        <Header />
      </div>
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <WorkspaceList />
      </div>
    </div>
  );
}