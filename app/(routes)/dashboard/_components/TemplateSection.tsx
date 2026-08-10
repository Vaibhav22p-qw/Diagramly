"use client";

import React from "react";
import { FilePlus2, GitFork, Network, Workflow } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

function TemplateSection() {
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
        "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
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
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    },
  ];

  const handleTemplateClick = (templateId: string) => {
    console.log("Selected Template ID:", templateId);
    // Later: router.push(`/workspace/new?template=${templateId}`)
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-1">
        {templates.map((template) => {
          const Icon = template.icon;

          return (
            <div
              key={template.id}
              role="button"
              tabIndex={0}
              onClick={() => handleTemplateClick(template.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleTemplateClick(template.id);
                }
              }}
              className="group relative flex flex-col justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <div>
                {/* Header Row: Icon & Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-50 group-hover:text-blue-600 dark:group-hover:bg-blue-950/60 dark:group-hover:text-blue-400 text-slate-600 dark:text-slate-300 transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  {template.badge && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${template.badgeColor}`}
                    >
                      {template.badge}
                    </span>
                  )}
                </div>

                {/* Template Meta */}
                <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {template.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {template.description}
                </p>
              </div>

              {/* Action Hint */}
              <div className="mt-4 pt-2 flex items-center text-xs font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Use template &rarr;
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TemplateSection;