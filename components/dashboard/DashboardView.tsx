"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import TemplateSection from "@/app/(routes)/dashboard/_components/TemplateSection";
import WorkspaceList from "@/app/(routes)/dashboard/_components/WorkspaceList";

/** Dashboard content only. Shell navigation is supplied by its host page. */
export default function DashboardView() {
  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <section className="mb-8 flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="mb-1 text-sm font-medium text-blue-600 dark:text-blue-400">Your workspace</p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">Welcome back 👋</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">Create diagrams, write documentation, collaborate with your team, and manage all your projects from one place.</p>
        </div>
        <Button className="h-11 shrink-0 gap-2 bg-blue-600 px-5 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
          <Plus className="h-4 w-4" />New Workspace
        </Button>
      </section>
      <section className="mb-8"><WorkspaceList /></section>
      <section><TemplateSection /></section>
    </div>
  );
}
