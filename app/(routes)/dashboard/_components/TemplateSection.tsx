"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FilePlus2, GitFork, Loader2, Network, Workflow } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

function TemplateSection() {
  const router = useRouter();
  const [loadingTemplate, setLoadingTemplate] = useState<string | null>(null);

  const templates: Template[] = [
    {
      id: "blank",
      name: "Blank Canvas",
      description: "Start from scratch with a fresh, empty canvas.",
      icon: FilePlus2,
    },
    {
      id: "flowchart",
      name: "Flowchart",
      description: "Map out processes, decisions, and system workflows.",
      icon: Workflow,
      badge: "Popular",
      badgeColor:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    },
    {
      id: "uml",
      name: "UML Diagram",
      description: "Design class diagrams, sequence flows, and architecture.",
      icon: GitFork,
    },
    {
      id: "mindmap",
      name: "Mind Map",
      description: "Brainstorm ideas and organize thoughts visually.",
      icon: Network,
      badge: "New",
      badgeColor:
        "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-300",
    },
  ];

  const handleTemplateClick = async (templateId: string, templateName: string) => {
    try {
      setLoadingTemplate(templateId);
      const res = await fetch("/api/workspaces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: `${templateName} Project`,
          template: templateId,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || "Failed to create workspace from template");
        return;
      }

      window.dispatchEvent(
        new CustomEvent("workspace-created", {
          detail: data.workspace,
        })
      );

      router.push(`/dashboard/workspaces/${data.workspace._id}`);
    } catch (err) {
      console.error("Failed to initialize template:", err);
      alert("Failed to create workspace.");
    } finally {
      setLoadingTemplate(null);
    }
  };

  return (
    <div className="flex flex-col gap-3 py-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Start with a Template
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select a pre-built structure or begin with a clean state.
          </p>
        </div>
      </div>

      {/* Template Cards Grid */}
      <div className="mt-1 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {templates.map((template) => {
          const Icon = template.icon;
          const isLoading = loadingTemplate === template.id;

          return (
            <div
              key={template.id}
              role="button"
              tabIndex={0}
              onClick={() => handleTemplateClick(template.id, template.name)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleTemplateClick(template.id, template.name);
                }
              }}
              className="group relative flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white/80 p-4 backdrop-blur-sm transition-all duration-200 hover:border-purple-500/60 hover:shadow-lg hover:shadow-purple-500/5 focus:outline-none focus:ring-2 focus:ring-purple-500/40 dark:border-slate-800/80 dark:bg-slate-900/80 dark:hover:border-purple-500/60"
            >
              <div>
                {/* Header Row: Icon & Badge */}
                <div className="mb-3 flex items-center justify-between">
                  <div className="rounded-lg bg-slate-100 p-2.5 text-slate-600 transition-colors group-hover:bg-purple-50 group-hover:text-purple-600 dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-purple-950/60 dark:group-hover:text-purple-400">
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  {template.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${template.badgeColor}`}
                    >
                      {template.badge}
                    </span>
                  )}
                </div>

                {/* Template Meta */}
                <h3 className="text-sm font-semibold text-slate-800 transition-colors group-hover:text-purple-600 dark:text-slate-100 dark:group-hover:text-purple-400">
                  {template.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                  {template.description}
                </p>
              </div>

              {/* Action Hint */}
              <div className="mt-4 flex items-center pt-2 text-xs font-medium text-purple-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-purple-400">
                {isLoading ? "Creating workspace..." : "Use template →"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TemplateSection;