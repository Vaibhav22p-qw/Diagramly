"use client";

import { Home, LayoutGrid } from "lucide-react";
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
  ];

  return (
    <div className="flex flex-col gap-4 p-2">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-2 py-1">
        <Image
          src="/logo.png"
          width={42}
          height={42}
          alt="Diagramly"
          className="object-contain"
        />
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            Diagramly
          </h2>
          <p className="text-[10px] font-medium uppercase tracking-wider text-purple-600 dark:text-purple-400">
            Workspace Hub
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-b border-slate-200/60 dark:border-slate-800/60" />

      {/* Navigation Options */}
      <div className="flex flex-col gap-1">
        <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Workspaces
        </p>

        {menuItems.map((item) => {
          const isActive =
            item.path === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === item.path || pathname.startsWith(item.path + "/");

          return (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => router.push(item.path)}
              className={`w-full justify-start gap-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-purple-50 text-purple-700 hover:bg-purple-100/80 dark:bg-purple-950/50 dark:text-purple-300 dark:hover:bg-purple-900/50"
                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              <item.icon
                className={`h-4 w-4 ${
                  isActive
                    ? "text-purple-600 dark:text-purple-400"
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