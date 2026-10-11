"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import TemplateSection from "@/app/(routes)/dashboard/_components/TemplateSection";
import WorkspaceList from "@/app/(routes)/dashboard/_components/WorkspaceList";

/** Dashboard content only. Shell navigation is supplied by its host page. */
export default function DashboardView() {
  const handleCreateWorkspace = () => {
    window.dispatchEvent(new CustomEvent("open-create-workspace"));
  };

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <section className="mb-8 flex flex-col gap-5 rounded-2xl border border-purple-200/50 bg-gradient-to-r from-purple-500/10 via-fuchsia-500/5 to-white/60 p-6 shadow-sm backdrop-blur-md dark:border-purple-800/40 dark:from-purple-950/30 dark:via-fuchsia-950/20 dark:to-slate-900/40 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="mb-1 text-sm font-semibold tracking-wide text-purple-600 dark:text-purple-400">
            Workspace Hub
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Welcome back 👋
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Create diagrams, write documentation, collaborate with your team, and manage all your projects from one place.
          </p>
        </div>
        <Button
          onClick={handleCreateWorkspace}
          className="h-11 shrink-0 gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 px-5 text-sm font-medium text-white shadow-md shadow-purple-500/20 hover:from-purple-700 hover:to-fuchsia-700"
        >
          <Plus className="h-4 w-4" />
          New Workspace
        </Button>
      </section>
      <section className="mb-8">
        <WorkspaceList />
      </section>
      <section>
        <TemplateSection />
      </section>
    </div>
  );
}
