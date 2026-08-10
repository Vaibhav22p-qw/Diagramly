"use client";

import {
  FileText,
  Home,
  LayoutGrid,
  Star,
  Trash2,
  Users2,
} from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";

function SideNavTopSection() {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    {
      id: 1,
      name: "Home",
      icon: Home,
      path: "/dashboard",
    },
    {
      id: 2,
      name: "My Workspaces",
      icon: LayoutGrid,
      path: "/dashboard/workspaces",
    },
    {
      id: 3,
      name: "Favorites",
      icon: Star,
      path: "/dashboard/favorites",
    },
    {
      id: 4,
      name: "Shared With Me",
      icon: Users2,
      path: "/dashboard/shared",
    },
    {
      id: 5,
      name: "Templates",
      icon: FileText,
      path: "/dashboard/templates",
    },
    {
      id: 6,
      name: "Trash",
      icon: Trash2,
      path: "/dashboard/trash",
    },
  ];

  return (
    <div className="flex flex-col gap-4 p-2">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-2 py-1">
        <Image
          src="/diahead.gif"
          width={42}
          height={42}
          alt="Diagramly"
          className="rounded-lg object-cover"
        />
        <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          Diagramly
        </h2>
      </div>

      {/* Divider */}
      <div className="border-b border-slate-200 dark:border-slate-800" />

      {/* Navigation Options */}
      <div className="flex flex-col gap-1">
        {/* Section Label */}
        <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Workspace
        </p>

        {menuItems.map((item) => {
          // Strict match for base route (/dashboard), prefix match for sub-routes
          const isActive =
            item.path === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === item.path || pathname.startsWith(item.path + "/");

          return (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => router.push(item.path)}
              className={`w-full justify-start gap-3 font-medium text-sm transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-400 dark:hover:bg-blue-900/50"
                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              <item.icon
                className={`h-4 w-4 ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-500"
                }`}
              />
              {item.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export default SideNavTopSection;